/** One stage of the post-scan “Lash match in the making” screen (25% increments). */
export interface FetchingStep {
  progress: 25 | 50 | 75 | 100;
  step: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  status: string;
}

export const FETCHING_COPY = {
  title: "Lash match in the making",
  intro:
    "We're analysing your eye shape to match you with lashes that fit flawlessly.",
  steps: [
    {
      progress: 25,
      step: 1,
      title: "Facial recognition",
      description:
        "Capturing the shape and position of your eyes for the perfect lash fit.",
      status: "Preparing your results…",
    },
    {
      progress: 50,
      step: 2,
      title: "Eye shape analysis",
      description:
        "Measuring your lid shape and proportions to classify your eye shape.",
      status: "Analysing your eye shape…",
    },
    {
      progress: 75,
      step: 3,
      title: "Lash matching",
      description:
        "Pairing your eye shape with lash styles and lengths that complement you.",
      status: "Finding your perfect lash match…",
    },
    {
      progress: 100,
      step: 4,
      title: "Finalising results",
      description:
        "Putting the finishing touches on your personalised recommendations.",
      status: "Almost ready…",
    },
  ] satisfies FetchingStep[],
} as const;

/** Time on each 25% stage — keep in sync with `use-scan-session` timeout. */
export const FETCHING_STEP_MS = 1600;

export const FETCHING_DURATION_MS =
  FETCHING_COPY.steps.length * FETCHING_STEP_MS;
