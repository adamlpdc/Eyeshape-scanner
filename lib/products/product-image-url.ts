/** Pack shots live in `public/products/` as `{SKU}.jpg`. */
export const PRODUCT_IMAGE_EXTENSION = ".jpg" as const;

export function getProductImageUrl(sku: string): string {
  return `/products/${encodeURIComponent(sku)}${PRODUCT_IMAGE_EXTENSION}`;
}
