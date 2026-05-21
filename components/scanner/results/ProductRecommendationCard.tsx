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
  const hasImage = Boolean(product.imageUrl?.trim());
  const hasProductUrl = Boolean(product.productUrl?.trim());
  const accent = EYLURE_BRAND.accent;

  const handleBuyClick = () => {
    onProductClick?.(product);
  };

  return (
    <article className="rounded-2xl border border-[#e8c4cc]/80 bg-white p-3">
      <div
        className="flex aspect-[4/3] items-center justify-center rounded-xl"
        style={{ backgroundColor: `${EYLURE_BRAND.resultsPink}40` }}
      >
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt=""
            className="h-full w-full rounded-xl object-cover"
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
        <p className="mt-0.5 text-sm leading-snug text-[#5c4a62]">
          {product.tagline}
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        <button
          type="button"
          className="w-full rounded-xl py-3.5 text-center text-sm font-bold text-white transition active:scale-[0.98]"
          style={{ backgroundColor: accent }}
        >
          {RECOMMENDATION_COPY.virtualTryOn}
        </button>

        {hasProductUrl ? (
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
        ) : (
          <button
            type="button"
            onClick={handleBuyClick}
            className="w-full rounded-xl border-2 py-3.5 text-center text-sm font-bold transition active:scale-[0.98]"
            style={{ borderColor: accent, color: accent }}
          >
            {RECOMMENDATION_COPY.buyAtBoots}
          </button>
        )}
      </div>
    </article>
  );
}
