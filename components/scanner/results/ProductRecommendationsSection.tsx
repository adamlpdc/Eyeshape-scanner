"use client";

import { useMemo, useState } from "react";
import { EYLURE_BRAND } from "@/constants/brand";
import { RECOMMENDATION_COPY } from "@/constants/lash-recommendation-engine";
import {
  buildTabbedProductRecommendations,
  type LashProductCategory,
} from "@/lib/recommendations/pick-product-recommendations";
import type { EyeShape } from "@/types/classification";
import type { ProductRecommendation } from "@/types/lash-recommendations";
import ProductRecommendationCard from "./ProductRecommendationCard";

interface ProductRecommendationsSectionProps {
  eyeShape: EyeShape;
  onProductClick?: (product: ProductRecommendation) => void;
}

const TABS: { id: LashProductCategory; label: string }[] = [
  { id: "strip", label: RECOMMENDATION_COPY.stripLashes },
  { id: "clusters", label: RECOMMENDATION_COPY.clusters },
];

export default function ProductRecommendationsSection({
  eyeShape,
  onProductClick,
}: ProductRecommendationsSectionProps) {
  const recommendations = useMemo(
    () => buildTabbedProductRecommendations(eyeShape),
    [eyeShape],
  );
  const [activeTab, setActiveTab] =
    useState<LashProductCategory>("strip");
  const [showAllByTab, setShowAllByTab] = useState<
    Record<LashProductCategory, boolean>
  >({
    strip: false,
    clusters: false,
  });

  const activeRecommendations = recommendations[activeTab];
  const visibleProducts = showAllByTab[activeTab]
    ? [
        ...activeRecommendations.initial,
        ...activeRecommendations.remaining,
      ]
    : activeRecommendations.initial;
  const canLoadMore =
    !showAllByTab[activeTab] && activeRecommendations.remaining.length > 0;
  const accent = EYLURE_BRAND.accent;

  const handleTabChange = (tab: LashProductCategory) => {
    setActiveTab(tab);
  };

  const handleLoadMore = () => {
    setShowAllByTab((current) => ({ ...current, [activeTab]: true }));
  };

  return (
    <article className="rounded-2xl bg-[#fff8fa] p-5 shadow-md">
      <h2 className="text-sm font-bold text-[#2f2435]">
        {RECOMMENDATION_COPY.recommendedProducts}
      </h2>

      <div
        className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-white p-1"
        role="tablist"
        aria-label={RECOMMENDATION_COPY.productTabsLabel}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleTabChange(tab.id)}
              className={`rounded-lg px-3 py-2.5 text-sm font-bold transition active:scale-[0.98] ${
                isActive ? "text-white shadow-sm" : "text-[#2f2435]"
              }`}
              style={isActive ? { backgroundColor: accent } : undefined}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {visibleProducts.length > 0 ? (
        <ul className="mt-3 space-y-3" role="tabpanel">
          {visibleProducts.map((product) => (
            <li key={product.id}>
              <ProductRecommendationCard
                product={product}
                onProductClick={onProductClick}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm leading-relaxed text-[#5c4a62]">
          {RECOMMENDATION_COPY.noProductsInCategory}
        </p>
      )}

      {canLoadMore && (
        <button
          type="button"
          onClick={handleLoadMore}
          className="mt-3 w-full rounded-lg border-2 py-2.5 text-sm font-bold transition active:scale-[0.98]"
          style={{ borderColor: accent, color: accent }}
        >
          {RECOMMENDATION_COPY.loadMore}
        </button>
      )}
    </article>
  );
}
