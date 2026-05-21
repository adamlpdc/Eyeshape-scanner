"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import {
  SCAN_DURATION_MS,
  SCAN_ERRORS,
  PROGRESS_UPDATE_MS,
} from "@/constants/scan";
import { SCAN_QUALITY_CONFIG } from "@/constants/scan-quality";
import { CameraAccessError } from "@/lib/camera/camera-errors";
import { getCameraStream } from "@/lib/camera/get-camera-stream";
import { classifyEyeShape } from "@/lib/classification/classify-eye-shape";
import { averageFaceEyeMeasurements } from "@/lib/measurements/average-measurements";
import { measureBothEyes } from "@/lib/measurements/measure-eye";
import {
  getFaceLandmarker,
  releaseFaceLandmarker,
} from "@/lib/mediapipe/face-landmarker";
import { observeVideoCanvasSync } from "@/lib/mediapipe/observe-video-canvas-sync";
import { syncCanvasToVideo } from "@/lib/mediapipe/sync-canvas-to-video";
import {
  assessScanReadiness,
  resetReadinessTracking,
} from "@/lib/scan/assess-readiness";
import {
  trackEyeShapeDetected,
  trackScanCompleted,
  trackScanStarted,
} from "@/lib/analytics";
import { captureEyePreview } from "@/lib/scan/capture-eye-preview";
import { createScanError } from "@/lib/scan/scan-error";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import type { EyeShapeClassification } from "@/types/classification";
import type { FaceEyeMeasurements } from "@/types/eye";
import type { ScanReadiness } from "@/types/scan-quality";
import type { ScanError, ScanPhase } from "@/types/scan";

import { FETCHING_DURATION_MS } from "@/constants/fetching";

const INITIAL_READINESS: ScanReadiness = {
  faceDetected: false,
  alignment: 0,
  distance: 0,
  lighting: 0,
  stillness: 0,
  overall: 0,
  primaryIssue: "no_face",
  suggestions: [],
  canStartCapture: false,
};

function clearCaptureRefs(
  samplesRef: RefObject<FaceEyeMeasurements[]>,
  captureStartRef: RefObject<number | null>,
  isModelReadyRef: RefObject<boolean>,
  readinessScoresRef: RefObject<number[]>,
) {
  samplesRef.current = [];
  captureStartRef.current = null;
  isModelReadyRef.current = false;
  readinessScoresRef.current = [];
}

export function useScanSession() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const samplesRef = useRef<FaceEyeMeasurements[]>([]);
  const captureStartRef = useRef<number | null>(null);
  const isModelReadyRef = useRef(false);
  const readinessScoresRef = useRef<number[]>([]);
  const stableReadyFramesRef = useRef(0);
  const lastReadinessRef = useRef<ScanReadiness>(INITIAL_READINESS);
  const lastLandmarksRef = useRef<NormalizedLandmark[] | null>(null);

  const [phase, setPhase] = useState<ScanPhase>("idle");
  const [isModelReady, setIsModelReady] = useState(false);
  const [readiness, setReadiness] = useState<ScanReadiness>(INITIAL_READINESS);
  const [countdown, setCountdown] = useState(0);
  const [scanSessionConfidence, setScanSessionConfidence] = useState(0);
  const [averagedResults, setAveragedResults] =
    useState<FaceEyeMeasurements | null>(null);
  const [classification, setClassification] =
    useState<EyeShapeClassification | null>(null);
  const [capturedFrameCount, setCapturedFrameCount] = useState(0);
  const [error, setError] = useState<ScanError | null>(null);
  const [capturedEmail, setCapturedEmail] = useState<string | null>(null);
  const [scanPreviewImage, setScanPreviewImage] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const goToIdle = useCallback(
    (nextError: ScanError | null = null) => {
      stopCamera();
      releaseFaceLandmarker();
      resetReadinessTracking();
      clearCaptureRefs(
        samplesRef,
        captureStartRef,
        isModelReadyRef,
        readinessScoresRef,
      );
      setPhase("idle");
      setIsModelReady(false);
      setCountdown(0);
      setReadiness(INITIAL_READINESS);
      setScanSessionConfidence(0);
      setAveragedResults(null);
      setClassification(null);
      setCapturedFrameCount(0);
      setCapturedEmail(null);
      setScanPreviewImage(null);
      lastLandmarksRef.current = null;
      stableReadyFramesRef.current = 0;
      setError(nextError);
    },
    [stopCamera],
  );

  const resetScan = useCallback(() => {
    goToIdle(null);
  }, [goToIdle]);

  const phaseRef = useRef<ScanPhase>(phase);
  phaseRef.current = phase;

  const startCountdown = () => {
    stableReadyFramesRef.current = 0;
    phaseRef.current = "countdown";
    setCountdown(3);
    setPhase("countdown");
  };

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  useEffect(() => {
    if (phase !== "countdown" || countdown <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (countdown <= 1) {
        samplesRef.current = [];
        readinessScoresRef.current = [];
        captureStartRef.current = performance.now();
        phaseRef.current = "scanning";
        setPhase("scanning");
        return;
      }

      setCountdown(countdown - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [phase, countdown]);

  useEffect(() => {
    if (phase !== "aligning" && phase !== "countdown" && phase !== "scanning") {
      releaseFaceLandmarker();
      setIsModelReady(false);
      setCountdown(0);
      setReadiness(INITIAL_READINESS);
      clearCaptureRefs(
        samplesRef,
        captureStartRef,
        isModelReadyRef,
        readinessScoresRef,
      );
    }
  }, [phase]);

  const isCameraActive =
    phase === "aligning" || phase === "countdown" || phase === "scanning";

  useEffect(() => {
    if (!isCameraActive) {
      return;
    }

    let cancelled = false;
    let animationId = 0;
    let lastVideoTime = -1;
    let lastUiUpdate = 0;
    let stopSync: (() => void) | undefined;
    let detectTimestamp = 0;

    const goToFetching = (samples: FaceEyeMeasurements[], scores: number[]) => {
      const sessionConfidence =
        scores.length > 0
          ? scores.reduce((sum, value) => sum + value, 0) / scores.length
          : 0;

      if (sessionConfidence < SCAN_QUALITY_CONFIG.minScanSessionConfidence) {
        goToIdle(
          createScanError(
            "low_quality",
            undefined,
            lastReadinessRef.current.suggestions,
          ),
        );
        return;
      }

      const averaged = averageFaceEyeMeasurements(samples);
      const nextClassification = classifyEyeShape(averaged);

      setAveragedResults(averaged);
      setClassification(nextClassification);
      setCapturedFrameCount(samples.length);
      setScanSessionConfidence(sessionConfidence);
      setError(null);
      trackEyeShapeDetected(nextClassification);
      setPhase("fetching");

      window.setTimeout(() => {
        trackScanCompleted({
          frameCount: samples.length,
          sessionConfidence,
          eyeShape: nextClassification.primary,
        });
        setPhase("unlock");
      }, FETCHING_DURATION_MS);
    };

    const finishScanning = () => {
      if (cancelled) {
        return;
      }

      cancelled = true;
      cancelAnimationFrame(animationId);
      stopSync?.();

      const video = videoRef.current;
      const landmarks = lastLandmarksRef.current;
      if (video && landmarks) {
        setScanPreviewImage(captureEyePreview(video, landmarks));
      }

      stopCamera();

      const samples = samplesRef.current;
      const scores = readinessScoresRef.current;

      if (samples.length === 0) {
        goToIdle(createScanError("no_face"));
        return;
      }

      goToFetching(samples, scores);
    };

    async function runLandmarker() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) {
        return;
      }

      await new Promise<void>((resolve) => {
        if (video.videoWidth > 0) {
          resolve();
          return;
        }
        video.addEventListener("loadeddata", () => resolve(), { once: true });
      });

      if (cancelled) {
        return;
      }

      stopSync = observeVideoCanvasSync(video, canvas);

      const landmarker = await getFaceLandmarker();

      if (cancelled) {
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not get canvas context.");
      }

      const render = () => {
        if (cancelled) {
          return;
        }

        animationId = requestAnimationFrame(render);

        if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
          return;
        }

        if (!syncCanvasToVideo(video, canvas)) {
          return;
        }

        if (video.currentTime === lastVideoTime) {
          return;
        }
        lastVideoTime = video.currentTime;

        detectTimestamp = Math.max(
          detectTimestamp + 1,
          video.currentTime * 1000,
        );

        const results = landmarker.detectForVideo(video, detectTimestamp);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const landmarks = results.faceLandmarks[0];
        const now = performance.now();
        const currentReadiness = assessScanReadiness(landmarks, video);

        lastReadinessRef.current = currentReadiness;

        if (
          landmarks &&
          (phaseRef.current === "scanning" || phaseRef.current === "countdown")
        ) {
          lastLandmarksRef.current = landmarks;
        }

        if (landmarks && !isModelReadyRef.current) {
          isModelReadyRef.current = true;
        }

        if (phaseRef.current === "aligning") {
          if (
            currentReadiness.overall >=
            SCAN_QUALITY_CONFIG.minHoldStillConfidence
          ) {
            stableReadyFramesRef.current += 1;
          } else {
            stableReadyFramesRef.current = 0;
          }

          if (
            stableReadyFramesRef.current >=
            SCAN_QUALITY_CONFIG.stableFramesRequired
          ) {
            startCountdown();
          }
        }

        if (
          phaseRef.current === "countdown" &&
          currentReadiness.overall <
            SCAN_QUALITY_CONFIG.minHoldStillConfidence * 0.9
        ) {
          phaseRef.current = "aligning";
          captureStartRef.current = null;
          stableReadyFramesRef.current = 0;
          setCountdown(0);
          setPhase("aligning");
        }

        if (phaseRef.current === "scanning" && captureStartRef.current !== null) {
          if (landmarks) {
            samplesRef.current.push(
              measureBothEyes(landmarks, video.videoWidth, video.videoHeight),
            );
            readinessScoresRef.current.push(currentReadiness.overall);
          }

          const elapsed = now - captureStartRef.current;
          if (elapsed >= SCAN_DURATION_MS) {
            finishScanning();
            return;
          }
        }

        if (now - lastUiUpdate >= PROGRESS_UPDATE_MS) {
          lastUiUpdate = now;
          if (phaseRef.current === "aligning") {
            setReadiness(currentReadiness);
          }
          if (isModelReadyRef.current) {
            setIsModelReady(true);
          }
        }
      };

      render();
    }

    runLandmarker().catch(() => {
      if (!cancelled) {
        goToIdle(createScanError("landmarker_failed"));
      }
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(animationId);
      stopSync?.();
    };
  }, [isCameraActive, goToIdle, stopCamera]);

  const startScan = useCallback(async () => {
    setError(null);
    setIsModelReady(false);
    setCountdown(0);
    setReadiness(INITIAL_READINESS);
    setScanSessionConfidence(0);
    setAveragedResults(null);
    setClassification(null);
    setCapturedFrameCount(0);
    setScanPreviewImage(null);
    lastLandmarksRef.current = null;
    resetReadinessTracking();
    clearCaptureRefs(
      samplesRef,
      captureStartRef,
      isModelReadyRef,
      readinessScoresRef,
    );
    stableReadyFramesRef.current = 0;

    try {
      const stream = await getCameraStream();

      streamRef.current = stream;

      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        await video.play();
      }

      setPhase("aligning");
      trackScanStarted();
    } catch (err) {
      if (err instanceof CameraAccessError) {
        goToIdle(createScanError(err.code));
        return;
      }

      goToIdle(
        createScanError(
          "unknown",
          err instanceof Error ? err.message : SCAN_ERRORS.cameraFailed,
        ),
      );
    }
  }, [goToIdle]);

  const retry = useCallback(() => {
    void startScan();
  }, [startScan]);

  const completeUnlock = useCallback((email: string) => {
    setCapturedEmail(email);
    setPhase("results");
  }, []);

  return {
    videoRef,
    canvasRef,
    phase,
    isModelReady,
    readiness,
    countdown,
    scanSessionConfidence,
    averagedResults,
    classification,
    capturedFrameCount,
    error,
    capturedEmail,
    scanPreviewImage,
    showCamera: isCameraActive,
    startScan,
    resetScan,
    retry,
    completeUnlock,
  };
}
