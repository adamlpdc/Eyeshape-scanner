import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, devices } from "playwright";

const SCREENS = [
  "idle",
  "error",
  "aligning",
  "countdown",
  "scanning",
  "unlock",
  "results",
];

const FETCHING_STEPS = [
  { step: 0, progress: 25 },
  { step: 1, progress: 50 },
  { step: 2, progress: 75 },
  { step: 3, progress: 100 },
];

const BASE_URL = process.env.SCREENSHOT_BASE_URL ?? "http://localhost:3000";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "screenshots");

async function waitForServer(url, attempts = 30) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`Dev server not reachable at ${url}`);
}

await waitForServer(BASE_URL);
await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL ?? "chrome",
});
const context = await browser.newContext({
  ...devices["iPhone 14 Pro"],
  locale: "en-GB",
});
const page = await context.newPage();

async function captureScreen(page, fileName, url, { fullPage = false } = {}) {
  await page.goto(url, { waitUntil: "load", timeout: 60000 });
  await page.waitForSelector("body", { state: "attached" });
  await page.waitForTimeout(1200);
  await page.addStyleTag({
    content:
      "nextjs-portal, [data-nextjs-toast], #__next-build-watcher { display: none !important; }",
  });
  await page.screenshot({
    path: path.join(OUT_DIR, fileName),
    type: "jpeg",
    quality: 92,
    fullPage,
  });
  console.log(`Saved ${fileName}`);
}

let screenNumber = 1;
for (const screen of SCREENS) {
  if (screen === "unlock") {
    for (const { step, progress } of FETCHING_STEPS) {
      const fileName = `${String(screenNumber).padStart(2, "0")}-fetching-${progress}.jpg`;
      await captureScreen(
        page,
        fileName,
        `${BASE_URL}/preview?screen=fetching&step=${step}`,
      );
      screenNumber += 1;
    }
  }

  const fileName = `${String(screenNumber).padStart(2, "0")}-${screen}.jpg`;
  await captureScreen(
    page,
    fileName,
    `${BASE_URL}/preview?screen=${screen}`,
    { fullPage: screen === "results" },
  );
  screenNumber += 1;
}

await browser.close();
console.log(`\nScreenshots written to ${OUT_DIR}`);
