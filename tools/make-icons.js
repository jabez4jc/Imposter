// Renders icons/icon.svg and icons/icon-maskable.svg to the PNG sizes the web app manifest needs.
// Usage: node tools/make-icons.js   (requires Playwright with Chromium)
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const dir = path.join(__dirname, "..", "icons");
const jobs = [
  ["icon.svg", "icon-192.png", 192], ["icon.svg", "icon-512.png", 512],
  ["icon-maskable.svg", "maskable-192.png", 192], ["icon-maskable.svg", "maskable-512.png", 512],
  ["icon.svg", "apple-touch-icon.png", 180], ["icon.svg", "favicon-32.png", 32]
];
(async () => {
  const browser = await chromium.launch();
  for (const [src, out, size] of jobs) {
    const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
    const svg = fs.readFileSync(path.join(dir, src), "utf8").replace(/width="512" height="512"/, `width="${size}" height="${size}"`);
    await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
    await page.screenshot({ path: path.join(dir, out), clip: { x: 0, y: 0, width: size, height: size } });
    await page.close();
    console.log("wrote icons/" + out);
  }
  await browser.close();
})();
