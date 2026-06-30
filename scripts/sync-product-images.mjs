import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = process.argv[2];
const productsDir = path.join(__dirname, "..", "public", "products");

if (!sourceDir) {
  console.error(
    "Usage: node scripts/sync-product-images.mjs /path/to/source/folder",
  );
  console.error("Copies files named {SKU}.jpg into public/products/.");
  process.exit(1);
}

if (!existsSync(sourceDir)) {
  console.error(`Source folder not found: ${sourceDir}`);
  process.exit(1);
}

mkdirSync(productsDir, { recursive: true });

const catalogSource = readFileSync(
  path.join(__dirname, "..", "constants", "boots-product-catalog.ts"),
  "utf8",
);
const catalogSkus = new Set(
  [...catalogSource.matchAll(/sku: '([^']+)'/g)].map((match) =>
    match[1].toUpperCase(),
  ),
);

const sourceFiles = readdirSync(sourceDir).filter((file) =>
  /\.(jpe?g|png|webp)$/i.test(file),
);

let copied = 0;
let skipped = 0;

for (const file of sourceFiles) {
  const sku = file.replace(/\.(jpe?g|png|webp)$/i, "").toUpperCase();
  if (!catalogSkus.has(sku)) {
    skipped += 1;
    continue;
  }

  const dest = path.join(productsDir, `${sku}.jpg`);
  copyFileSync(path.join(sourceDir, file), dest);
  copied += 1;
  console.log(`Copied ${file} -> public/products/${sku}.jpg`);
}

console.log(`\nCopied ${copied} image(s), skipped ${skipped} non-catalog file(s).`);
