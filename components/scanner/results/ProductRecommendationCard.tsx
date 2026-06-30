"use client";

import { useEffect, useState } from "react";
import { EYLURE_BRAND } from "@/constants/brand";
import { RECOMMENDATION_COPY } from "@/constants/lash-recommendation-engine";
import type { ProductRecommendation } from "@/types/lash-recommendations";

interface ProductRecommendationCardProps {
  product: ProductRecommendation;
  onProductClick?: (product: ProductRecommendation) => void;
}

export default function ProductRecommendationCard({
  product,
  onProductClick,
}: ProductRecommendationCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = product.imageUrl?.trim();
  const showImage = Boolean(imageUrl) && !imageFailed;
  const hasTryOnUrl = Boolean(product.tryOnUrl?.trim());
  const hasBootsUrl = Boolean(product.productUrl?.trim());
  const accent = EYLURE_BRAND.accent;

  useEffect(() => {
    setImageFailed(false);
  }, [product.sku, imageUrl]);

  const handleBuyClick = () => {
    onProductClick?.(product);
  };

  return (
    <article className="flex gap-3 rounded-2xl border border-[#e8c4cc]/80 bg-white p-3">
      <div
        className="flex h-[7.5rem] w-[7.5rem] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#fff8fa] p-2"
        style={{ border: `1px solid ${EYLURE_BRAND.resultsPink}25` }}
      >
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-contain"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="px-1 text-center text-[10px] leading-snug text-[#5c4a62]/60">
            {RECOMMENDATION_COPY.productPlaceholder}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          {product.badge && (
            <span
              className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
              style={{ backgroundColor: `${accent}26`, color: accent }}
            >
              {product.badge}
            </span>
          )}
          <p className="mt-1 text-[15px] font-semibold leading-snug text-[#2f2435]">
            {product.name}
          </p>
          {product.tagline && (
            <p className="mt-0.5 text-xs leading-snug text-[#5c4a62]">
              {product.tagline}
            </p>
          )}
        </div>

        {(hasTryOnUrl || hasBootsUrl) && (
          <div
            className={`mt-3 grid gap-2 ${hasTryOnUrl && hasBootsUrl ? "grid-cols-2" : "grid-cols-1"}`}
          >
            {hasTryOnUrl && (
              <a
                href={product.tryOnUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onProductClick?.(product)}
                className="block rounded-lg py-2.5 text-center text-xs font-bold text-white transition active:scale-[0.98]"
                style={{ backgroundColor: accent }}
              >
                {RECOMMENDATION_COPY.virtualTryOn}
              </a>
            )}

            {hasBootsUrl && (
              <a
                href={product.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleBuyClick}
                className="block rounded-lg border-2 py-2 text-center text-xs font-bold leading-tight transition active:scale-[0.98]"
                style={{ borderColor: accent, color: accent }}
              >
                {RECOMMENDATION_COPY.buyAtBoots}
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
