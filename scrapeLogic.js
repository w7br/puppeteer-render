const puppeteer = require("puppeteer");
require("dotenv").config();

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
    await page.setExtraHTTPHeaders({
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });

    await page.goto(URL_TO_CAPTURE, { waitUntil: 'networkidle0' });

    if (await page.$('#bnp_btn_accept > a') !== null) {
      await page.waitForSelector('#bnp_btn_accept > a');
      await page.waitForTimeout(1000);
      await page.click('#bnp_btn_accept > a', { delay: 1500 });
    }

    const elemento = await page.$(DIV_SELECTOR);
    const elementoExistente = elemento !== null;

    console.log(">> >>> >>>> EXECUTING API <<<< <<< << ... ");

    if (elementoExistente) {
      await page.waitForSelector(DIV_SELECTOR);
      const element = await page.$(DIV_SELECTOR);
      const screenshotBuffer = await element.screenshot({ encoding: 'binary' });
      return screenshotBuffer;
    }

    console.log(">> >>> >>>> ELEMENT NOT FOUND <<<< <<< << ...");
    return null;

  } catch (error) {
    console.error("Error:", error);
    return null;
  } finally {
    // Close the page only if it was successfully opened
    if (_page) {
      await _page.close();
      _page = null;
    }
    // Close the browser after capturing the screenshot or in case of an error
    if (_browser) {
      await _browser.close();
      _browser = null;
    }
  }
};

module.exports = { scrapeLogic };
