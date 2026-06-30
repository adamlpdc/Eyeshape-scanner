import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.join(
  __dirname,
  "..",
  "constants",
  "boots-product-catalog.ts",
);

const catalogSource = readFileSync(catalogPath, "utf8");
const products = [...catalogSource.matchAll(/sku: '([^']+)'[\s\S]*?bootsUrl: '([^']+)'/g)].map(
  (match) => ({ sku: match[1], url: match[2] }),
);

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function checkLink({ sku, url }) {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(20_000),
    });

    if (response.status >= 200 && response.status < 400) {
      return { sku, url, ok: true, status: response.status, finalUrl: response.url };
    }

    return {
      sku,
      url,
      ok: false,
      status: response.status,
      finalUrl: response.url,
      error: `HTTP ${response.status}`,
    };
  } catch (error) {
    return {
      sku,
      url,
      ok: false,
      status: null,
      finalUrl: url,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

console.log(`Checking ${products.length} Boots product links...\n`);

const results = [];
for (const product of products) {
  const result = await checkLink(product);
  results.push(result);
  const mark = result.ok ? "OK" : "FAIL";
  console.log(`${mark}  ${result.sku}  (${result.status ?? "error"})`);
}

const failed = results.filter((result) => !result.ok);

console.log(`\nLive: ${results.length - failed.length}/${results.length}`);

if (failed.length > 0) {
  console.log("\nProblem links:");
  for (const result of failed) {
    console.log(`  ${result.sku}: ${result.error}`);
    console.log(`    ${result.url}`);
    if (result.finalUrl !== result.url) {
      console.log(`    -> ${result.finalUrl}`);
    }
  }
  process.exitCode = 1;
}
