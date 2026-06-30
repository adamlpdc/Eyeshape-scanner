import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultCsv = path.join(
  __dirname,
  "..",
  "data",
  "boots-product-catalog.csv",
);
const csvPath = process.argv[2] ?? defaultCsv;
const outPath = path.join(
  __dirname,
  "..",
  "constants",
  "boots-product-catalog.ts",
);

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && char === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (!inQuotes && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }
      row.push(field);
      if (row.some((cell) => cell.trim() !== "")) {
        rows.push(row);
      }
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function isUrl(value) {
  const trimmed = value?.trim() ?? "";
  return trimmed.startsWith("http://") || trimmed.startsWith("https://");
}

function cleanBootsUrl(value) {
  if (!isUrl(value)) {
    return undefined;
  }
  const url = new URL(value.trim());
  return `${url.protocol}//${url.host}${url.pathname}`;
}

function parseShapes(cell) {
  const raw = cell?.trim().toLowerCase() ?? "";
  if (!raw || raw === "all") {
    return { isAll: true, eyeShapes: [] };
  }

  const aliases = { downturnd: "downturned", downturn: "downturned" };
  const eyeShapes = [];
  for (const part of raw.split(/[,;/]+/)) {
    const key = part.trim().replace(/\s+/g, "");
    const shape = aliases[key] ?? key;
    if (
      ["hooded", "almond", "round", "monolid", "upturned", "downturned"].includes(
        shape,
      ) &&
      !eyeShapes.includes(shape)
    ) {
      eyeShapes.push(shape);
    }
  }

  return { isAll: false, eyeShapes };
}

function esc(value) {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

const csvText = readFileSync(csvPath, "utf8").replace(/^\uFEFF/, "");
const rows = parseCsv(csvText);
const [, ...dataRows] = rows;

const products = [];
for (const row of dataRows) {
  if (row.length < 7) {
    continue;
  }

  const [retailer, sku, , name, shapesRaw, tryOn, bootsUrlRaw] = row;
  if (retailer.trim().toLowerCase() !== "boots") {
    continue;
  }

  const cleanedSku = sku.trim();
  const bootsUrl = cleanBootsUrl(bootsUrlRaw);
  if (!cleanedSku || !bootsUrl) {
    continue;
  }

  const { isAll, eyeShapes } = parseShapes(shapesRaw);
  products.push({
    sku: cleanedSku,
    name: name.trim(),
    isAll,
    eyeShapes,
    tryOnUrl: isUrl(tryOn) ? tryOn.trim() : undefined,
    bootsUrl,
  });
}

products.sort((a, b) => a.sku.localeCompare(b.sku));

const lines = [
  "/**",
  " * Boots eye shape scanner product catalog.",
  " * Source: data/boots-product-catalog.csv (Boots retailer rows only).",
  " * Regenerate: npm run catalog:generate",
  " * Pack shots: public/products/{SKU}.jpg",
  " */",
  "",
  'import type { EyeShape } from "@/types/classification";',
  "",
  "export interface BootsCatalogProduct {",
  "  sku: string;",
  "  name: string;",
  "  isAll: boolean;",
  "  eyeShapes: EyeShape[];",
  "  tryOnUrl?: string;",
  "  bootsUrl?: string;",
  "}",
  "",
  "export const BOOTS_PRODUCT_CATALOG: BootsCatalogProduct[] = [",
];

for (const product of products) {
  const shapes = product.eyeShapes.map((shape) => `'${shape}'`).join(", ");
  lines.push("  {");
  lines.push(`    sku: '${esc(product.sku)}',`);
  lines.push(`    name: '${esc(product.name)}',`);
  lines.push(`    isAll: ${String(product.isAll)},`);
  lines.push(`    eyeShapes: [${shapes}],`);
  lines.push(
    `    tryOnUrl: ${product.tryOnUrl ? `'${esc(product.tryOnUrl)}'` : "undefined"},`,
  );
  lines.push(`    bootsUrl: '${esc(product.bootsUrl)}',`);
  lines.push("  },");
}

lines.push("];");
lines.push("");

writeFileSync(outPath, lines.join("\n"));
console.log(`Wrote ${products.length} Boots products to ${outPath}`);
