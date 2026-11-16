import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "screenshots", "final");
const base = "http://localhost:5173";
const VIEW = { width: 390, height: 844 };

async function shot(page, name) {
  const dest = path.join(outDir, name);
  await page.screenshot({ path: dest, type: "png" });
  console.log("wrote", name);
}

async function clickTab(page, label) {
  await page.getByRole("tab", { name: label, exact: true }).click();
  await page.waitForTimeout(200);
}

async function scrollScreen(page, y) {
  await page.locator(".screen-scroll").first().evaluate((el, top) => {
    el.scrollTop = top === "end" ? el.scrollHeight : top;
  }, y);
  await page.waitForTimeout(200);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEW,
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  // 01 Home
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await shot(page, "final-01-home.png");

  // 02 Event top
  await page.goto(`${base}/event`, { waitUntil: "networkidle" });
  await shot(page, "final-02-event.png");

  // 02b Event scrolled
  await scrollScreen(page, "end");
  await shot(page, "final-02b-event-detail.png");

  // 03 Checkout
  await page.goto(`${base}/checkout`, { waitUntil: "networkidle" });
  await shot(page, "final-03-checkout.png");

  // 04 Comm login
  await page.goto(`${base}/comm-login`, { waitUntil: "networkidle" });
  await shot(page, "final-04-comm-login.png");

  // 05 Comm center (enter code)
  await page.getByRole("textbox", { name: "Code" }).fill("123123");
  await page.getByRole("button", { name: "Enter" }).click();
  await page.waitForURL(/\/comm$/, { timeout: 8000 });
  await page.waitForTimeout(300);
  await shot(page, "final-05-comm-center.png");

  // 06 Host login
  await page.goto(`${base}/host-login`, { waitUntil: "networkidle" });
  await shot(page, "final-06-host-login.png");

  // 07 Host signup
  await page.goto(`${base}/host-signup`, { waitUntil: "networkidle" });
  await shot(page, "final-07-host-signup.png");

  // 08 Host dashboard
  await page.goto(`${base}/host`, { waitUntil: "networkidle" });
  await shot(page, "final-08-host-dashboard.png");

  // 09 Events upcoming
  await page.goto(`${base}/events`, { waitUntil: "networkidle" });
  await shot(page, "final-09-events-upcoming.png");

  // 09b-d Past events scroll set
  await clickTab(page, "Past");
  await page.waitForTimeout(250);
  await scrollScreen(page, 0);
  await shot(page, "final-09b-events-past.png");
  await page.locator(".screen-scroll").first().evaluate((el) => {
    el.scrollTop = Math.floor(el.scrollHeight * 0.45);
  });
  await page.waitForTimeout(200);
  await shot(page, "final-09c-events-past-mid.png");
  await scrollScreen(page, "end");
  await shot(page, "final-09d-events-past-bottom.png");

  // 10 Finance
  await page.goto(`${base}/finance`, { waitUntil: "networkidle" });
  await shot(page, "final-10-finance.png");

  // 11 Comms upcoming
  await page.goto(`${base}/comms`, { waitUntil: "networkidle" });
  await shot(page, "final-11-comms.png");

  // 11b Comms past
  await clickTab(page, "Past");
  await page.waitForTimeout(250);
  await shot(page, "final-11b-comms-past.png");

  // 12 Afterparty thread
  await page.goto(`${base}/comms/afterparty`, { waitUntil: "networkidle" });
  await shot(page, "final-12-comms-afterparty.png");

  // 13 New comm
  await page.goto(`${base}/comms/afterparty/new`, { waitUntil: "networkidle" });
  await shot(page, "final-13-comms-new.png");

  // 14 Empty thread (event with no messages)
  await page.goto(`${base}/comms/memoirs`, { waitUntil: "networkidle" });
  await shot(page, "final-14-comms-empty.png");

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
