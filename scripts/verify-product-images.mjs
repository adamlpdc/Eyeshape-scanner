import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsDir = path.join(__dirname, "..", "public", "products");
const catalogPath = path.join(
  __dirname,
  "..",
  "constants",
  "boots-product-catalog.ts",
);

const catalogSource = readFileSync(catalogPath, "utf8");
const catalog = [...catalogSource.matchAll(/sku: '([^']+)'/g)].map(
  (match) => match[1],
);

const imageFiles = new Set(
  existsSync(productsDir)
    ? readdirSync(productsDir)
        .filter((file) => /\.(jpe?g|png|webp)$/i.test(file))
        .map((file) => file.replace(/\.(jpe?g|png|webp)$/i, "").toUpperCase())
    : [],
);

const missing = catalog.filter((sku) => !imageFiles.has(sku.toUpperCase()));
const present = catalog.filter((sku) => imageFiles.has(sku.toUpperCase()));

console.log(`Catalog: ${catalog.length} Boots SKUs`);
console.log(`Images in public/products: ${imageFiles.size}`);
console.log(`Matched: ${present.length}`);
console.log(`Missing: ${missing.length}`);

if (missing.length > 0) {
  console.log("\nMissing images (add as public/products/{SKU}.jpg):");
  for (const sku of missing) {
    console.log(`  - ${sku}.jpg`);
  }
}

if (imageFiles.size > present.length) {
  const catalogSkus = new Set(catalog.map((sku) => sku.toUpperCase()));
  const extras = [...imageFiles].filter((sku) => !catalogSkus.has(sku));
  if (extras.length > 0) {
    console.log("\nExtra images not in catalog:");
    for (const sku of extras) {
      console.log(`  - ${sku}`);
    }
  }
}

process.exitCode = missing.length > 0 ? 1 : 0;
