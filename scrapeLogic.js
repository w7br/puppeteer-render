const puppeteer = require("puppeteer");
require("dotenv").config();

const targetURL = "https://www.bing.com/search?q=previs%C3%A3o+do+tempo+birigui";
const divSelector = "body";

const scrapeLogic = async (res) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.setExtraHTTPHeaders({
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
    
    await page.goto(targetURL, { waitUntil: "networkidle0", timeout: 30000 });

    await page.waitForSelector(divSelector);

    const elementHandle = await page.$(divSelector);
    const rect = await elementHandle.boundingBox();
    const screenshotBuffer = await elementHandle.screenshot({
      clip: {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      },
    });

    // Encerrar o navegador após a captura do screenshot
    await browser.close();
    console.log(">>> >>> >> page << <<< <<<", page)

    // Enviar o screenshot como resposta
    res.setHeader("Content-Type", "image/png");
    res.status(200).send(screenshotBuffer);
  } catch (error) {
    console.error("Erro durante a captura de screenshot:", error);
    res.status(500).end();
  }
};

module.exports = { scrapeLogic };
