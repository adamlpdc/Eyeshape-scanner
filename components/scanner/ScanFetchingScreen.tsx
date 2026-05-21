import { APP_COPY } from "@/constants/copy";

export default function ScanFetchingScreen() {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black px-6">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-emerald-400" />
      <p className="mt-6 text-center text-lg font-medium text-white">
        {APP_COPY.fetchingResults}
      </p>
    </div>
  );
}
