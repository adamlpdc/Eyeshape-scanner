"use client";

import { useCallback, useState } from "react";

export function useDebugMode() {
  const [showDebug, setShowDebug] = useState(false);

  const toggleDebug = useCallback(() => {
    setShowDebug((value) => !value);
  }, []);

  return { showDebug, setShowDebug, toggleDebug };
}
