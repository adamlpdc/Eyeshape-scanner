import { BOOTS_PRODUCT_CATALOG } from "@/constants/boots-product-catalog";
import type { BootsCatalogProduct } from "@/constants/boots-product-catalog";
import { getProductImageUrl } from "@/lib/products/product-image-url";
import type { EyeShape } from "@/types/classification";
import type { ProductRecommendation } from "@/types/lash-recommendations";

const SHAPE_SLOT_COUNT = 2;
const ALL_SLOT_COUNT = 1;
const MAX_PRODUCTS = SHAPE_SLOT_COUNT + ALL_SLOT_COUNT;

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function sampleUnique<T>(items: readonly T[], count: number): T[] {
  if (count <= 0 || items.length === 0) {
    return [];
  }
  return shuffle(items).slice(0, Math.min(count, items.length));
}

function toRecommendation(product: BootsCatalogProduct): ProductRecommendation {
  return {
    id: product.sku,
    sku: product.sku,
    name: product.name,
    imageUrl: getProductImageUrl(product.sku),
    tryOnUrl: product.tryOnUrl,
    productUrl: product.bootsUrl,
  };
}

/**
 * Picks up to 3 Boots catalog products for a scan result:
 * 2 random from the eye-shape pool (topped up from "All" if needed), then 1 random from "All" last.
 */
export function pickProductRecommendations(
  eyeShape: EyeShape,
): ProductRecommendation[] {
  const usedSkus = new Set<string>();
  const allPool = BOOTS_PRODUCT_CATALOG.filter((p) => p.isAll);
  const shapePool = BOOTS_PRODUCT_CATALOG.filter(
    (p) => !p.isAll && p.eyeShapes.includes(eyeShape),
  );

  const shapePicks = sampleUnique(shapePool, SHAPE_SLOT_COUNT);
  for (const product of shapePicks) {
    usedSkus.add(product.sku);
  }

  if (shapePicks.length < SHAPE_SLOT_COUNT) {
    const fallbackPool = allPool.filter((p) => !usedSkus.has(p.sku));
    const needed = SHAPE_SLOT_COUNT - shapePicks.length;
    const fallback = sampleUnique(fallbackPool, needed);
    shapePicks.push(...fallback);
    for (const product of fallback) {
      usedSkus.add(product.sku);
    }
  }

  const allSlotPool = allPool.filter((p) => !usedSkus.has(p.sku));
  let allPick = sampleUnique(allSlotPool, ALL_SLOT_COUNT);

  if (allPick.length < ALL_SLOT_COUNT) {
    const remainderPool = BOOTS_PRODUCT_CATALOG.filter((p) => !usedSkus.has(p.sku));
    allPick = sampleUnique(remainderPool, ALL_SLOT_COUNT);
  }

  const ordered = [...shapePicks, ...allPick].slice(0, MAX_PRODUCTS);
  return ordered.map(toRecommendation);
}
