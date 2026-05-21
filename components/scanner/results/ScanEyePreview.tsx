import { EYLURE_BRAND } from "@/constants/brand";
import { RECOMMENDATION_COPY } from "@/constants/lash-recommendation-engine";

interface ScanEyePreviewProps {
  imageUrl: string;
}

export default function ScanEyePreview({ imageUrl }: ScanEyePreviewProps) {
  return (
    <div
      className="overflow-hidden rounded-2xl p-2.5 shadow-md"
      style={{
        backgroundColor: EYLURE_BRAND.resultsPink,
        border: `1px solid ${EYLURE_BRAND.pinkDark}`,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={RECOMMENDATION_COPY.scanPreviewAlt}
        className="aspect-[5.56/1] w-full rounded-xl object-cover object-[center_40%]"
      />
    </div>
  );
}
