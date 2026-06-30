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
    <article className="rounded-2xl border border-[#e8c4cc]/80 bg-white p-3">
      <div
        className="flex h-44 items-center justify-center overflow-hidden rounded-xl bg-white p-4"
        style={{ border: `1px solid ${EYLURE_BRAND.resultsPink}30` }}
      >
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="px-3 text-center text-xs text-[#5c4a62]/60">
            {RECOMMENDATION_COPY.productPlaceholder}
          </span>
        )}
      </div>

      <div className="mt-3">
        {product.badge && (
          <span
            className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
            style={{ backgroundColor: `${accent}26`, color: accent }}
          >
            {product.badge}
          </span>
        )}
        <p className="mt-1 font-semibold text-[#2f2435]">{product.name}</p>
        {product.tagline && (
          <p className="mt-0.5 text-sm leading-snug text-[#5c4a62]">
            {product.tagline}
          </p>
        )}
      </div>

      {(hasTryOnUrl || hasBootsUrl) && (
        <div className="mt-4 flex flex-col gap-2.5">
          {hasTryOnUrl && (
            <a
              href={product.tryOnUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onProductClick?.(product)}
              className="block w-full rounded-xl py-3.5 text-center text-sm font-bold text-white transition active:scale-[0.98]"
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
              className="block w-full rounded-xl border-2 py-3.5 text-center text-sm font-bold transition active:scale-[0.98]"
              style={{ borderColor: accent, color: accent }}
            >
              {RECOMMENDATION_COPY.buyAtBoots}
            </a>
          )}
        </div>
      )}
    </article>
  );
}
