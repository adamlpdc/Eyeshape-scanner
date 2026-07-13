import { BOOTS_PRODUCT_CATALOG } from "@/constants/boots-product-catalog";
import type { BootsCatalogProduct } from "@/constants/boots-product-catalog";
import { getProductImageUrl } from "@/lib/products/product-image-url";
import type { EyeShape } from "@/types/classification";
import type { ProductRecommendation } from "@/types/lash-recommendations";

export type LashProductCategory = "strip" | "clusters";

export interface CategoryRecommendations {
  initial: ProductRecommendation[];
  remaining: ProductRecommendation[];
}

export interface TabbedProductRecommendations {
  strip: CategoryRecommendations;
  clusters: CategoryRecommendations;
}

const SHAPE_SLOT_COUNT = 2;
const ALL_SLOT_COUNT = 1;
const MAX_INITIAL_PRODUCTS = SHAPE_SLOT_COUNT + ALL_SLOT_COUNT;

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

export function isClusterProduct(name: string): boolean {
  return name.toLowerCase().includes("cluster");
}

/** Products tagged for the scanned eye shape or marked as “All”. */
export function getEligibleCatalogProducts(
  eyeShape: EyeShape,
): BootsCatalogProduct[] {
  return BOOTS_PRODUCT_CATALOG.filter(
    (product) => product.isAll || product.eyeShapes.includes(eyeShape),
  );
}

export function filterProductsByCategory(
  products: readonly BootsCatalogProduct[],
  category: LashProductCategory,
): BootsCatalogProduct[] {
  return products.filter((product) =>
    category === "clusters"
      ? isClusterProduct(product.name)
      : !isClusterProduct(product.name),
  );
}

/**
 * Picks up to 3 products from a pool:
 * 2 random shape-matched, topped up from “All” if needed, then 1 random “All” last.
 */
export function pickInitialCatalogProducts(
  pool: readonly BootsCatalogProduct[],
  eyeShape: EyeShape,
): BootsCatalogProduct[] {
  const usedSkus = new Set<string>();
  const allPool = pool.filter((product) => product.isAll);
  const shapePool = pool.filter(
    (product) => !product.isAll && product.eyeShapes.includes(eyeShape),
  );

  const shapePicks = sampleUnique(shapePool, SHAPE_SLOT_COUNT);
  for (const product of shapePicks) {
    usedSkus.add(product.sku);
  }

  if (shapePicks.length < SHAPE_SLOT_COUNT) {
    const fallbackPool = allPool.filter((product) => !usedSkus.has(product.sku));
    const needed = SHAPE_SLOT_COUNT - shapePicks.length;
    const fallback = sampleUnique(fallbackPool, needed);
    shapePicks.push(...fallback);
    for (const product of fallback) {
      usedSkus.add(product.sku);
    }
  }

  const allSlotPool = allPool.filter((product) => !usedSkus.has(product.sku));
  let allPick = sampleUnique(allSlotPool, ALL_SLOT_COUNT);

  if (allPick.length < ALL_SLOT_COUNT) {
    const remainderPool = pool.filter((product) => !usedSkus.has(product.sku));
    allPick = sampleUnique(remainderPool, ALL_SLOT_COUNT);
  }

  return [...shapePicks, ...allPick].slice(0, MAX_INITIAL_PRODUCTS);
}

export function buildCategoryRecommendations(
  eyeShape: EyeShape,
  category: LashProductCategory,
): CategoryRecommendations {
  const pool = filterProductsByCategory(
    getEligibleCatalogProducts(eyeShape),
    category,
  );
  const initialProducts = pickInitialCatalogProducts(pool, eyeShape);
  const initialSkus = new Set(initialProducts.map((product) => product.sku));
  const remainingProducts = pool.filter(
    (product) => !initialSkus.has(product.sku),
  );

  return {
    initial: initialProducts.map(toRecommendation),
    remaining: remainingProducts.map(toRecommendation),
  };
}

export function buildTabbedProductRecommendations(
  eyeShape: EyeShape,
): TabbedProductRecommendations {
  return {
    strip: buildCategoryRecommendations(eyeShape, "strip"),
    clusters: buildCategoryRecommendations(eyeShape, "clusters"),
  };
}

/** @deprecated Use `buildTabbedProductRecommendations` for results UI. */
export function pickProductRecommendations(
  eyeShape: EyeShape,
): ProductRecommendation[] {
  return buildCategoryRecommendations(eyeShape, "strip").initial;
}
