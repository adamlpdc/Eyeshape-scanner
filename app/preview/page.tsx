import ScannerScreenPreview from "@/components/scanner/ScannerScreenPreview";

interface PreviewPageProps {
  searchParams: Promise<{ screen?: string; step?: string }>;
}

/** Renders a single scanner screen for QA and marketing screenshots. Not linked from the app. */
export default async function PreviewPage({ searchParams }: PreviewPageProps) {
  const { screen = "idle", step } = await searchParams;
  const fetchingStep =
    step !== undefined && step !== "" ? Number.parseInt(step, 10) : undefined;

  return (
    <ScannerScreenPreview
      screen={screen}
      fetchingStep={Number.isNaN(fetchingStep) ? undefined : fetchingStep}
    />
  );
}
