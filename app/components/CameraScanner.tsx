"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import EyeDebugPanel from "./EyeDebugPanel";
import { drawEyes } from "../lib/drawEyes";
import { getCameraStream } from "../lib/getCameraStream";
import {
  getFaceLandmarker,
  releaseFaceLandmarker,
} from "../lib/faceLandmarker";
import {
  measureBothEyes,
  type FaceEyeMeasurements,
} from "../lib/eyeMeasurements";
import { observeVideoCanvasSync } from "../lib/observeVideoCanvasSync";
import { syncCanvasToVideo } from "../lib/syncCanvasToVideo";

const MEDIA_CLASS =
  "absolute inset-0 h-full w-full -scale-x-100 object-cover";

const DEBUG_UPDATE_MS = 200;

export default function CameraScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [eyeMeasurements, setEyeMeasurements] =
    useState<FaceEyeMeasurements | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  useEffect(() => {
    if (!isScanning) {
      releaseFaceLandmarker();
      setIsModelReady(false);
      setEyeMeasurements(null);
    }
  }, [isScanning]);

  useEffect(() => {
    if (!isScanning) {
      return;
    }

    let cancelled = false;
    let animationId = 0;
    let lastVideoTime = -1;
    let lastDebugUpdate = 0;
    let stopSync: (() => void) | undefined;
    let detectTimestamp = 0;

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

      const [{ DrawingUtils }, landmarker] = await Promise.all([
        import("@mediapipe/tasks-vision"),
        getFaceLandmarker(),
      ]);

      if (cancelled) {
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not get canvas context.");
      }

      const drawingUtils = new DrawingUtils(ctx);

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

        detectTimestamp = Math.max(detectTimestamp + 1, video.currentTime * 1000);

        const results = landmarker.detectForVideo(video, detectTimestamp);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const landmarks = results.faceLandmarks[0];
        if (landmarks) {
          drawEyes(drawingUtils, landmarks);

          const measurements = measureBothEyes(
            landmarks,
            video.videoWidth,
            video.videoHeight,
          );

          const now = performance.now();
          if (now - lastDebugUpdate >= DEBUG_UPDATE_MS) {
            lastDebugUpdate = now;
            setEyeMeasurements(measurements);
          }
        }

        if (!cancelled) {
          setIsModelReady(true);
        }
      };

      render();
    }

    runLandmarker().catch((err) => {
      if (!cancelled) {
        const message =
          err instanceof Error ? err.message : "Face detection failed to start.";
        setError(message);
        setIsScanning(false);
        stopCamera();
      }
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(animationId);
      stopSync?.();
    };
  }, [isScanning, stopCamera]);

  async function startScan() {
    setError(null);
    setIsModelReady(false);
    setEyeMeasurements(null);

    try {
      const stream = await getCameraStream();

      streamRef.current = stream;

      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        await video.play();
      }

      setIsScanning(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not access the camera.";
      setError(message);
    }
  }

  return (
    <div className="fixed inset-0 bg-black">
      <div
        className={`absolute inset-0 overflow-hidden ${isScanning ? "block" : "hidden"}`}
      >
        <video
          ref={videoRef}
          className={MEDIA_CLASS}
          playsInline
          muted
          autoPlay
        />
        <canvas
          ref={canvasRef}
          className={`${MEDIA_CLASS} pointer-events-none`}
          aria-hidden
        />
      </div>

      {isScanning && <EyeDebugPanel measurements={eyeMeasurements} />}

      {isScanning && !isModelReady && (
        <p className="pointer-events-none absolute inset-x-0 bottom-8 z-10 text-center text-sm text-white/80">
          Loading face model…
        </p>
      )}

      {!isScanning && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
          {error && (
            <p className="max-w-sm text-center text-sm text-red-400">{error}</p>
          )}
          <button
            type="button"
            onClick={startScan}
            className="min-h-14 min-w-[200px] rounded-full bg-white px-8 py-4 text-lg font-semibold text-black shadow-lg active:scale-[0.98]"
          >
            Start scan
          </button>
        </div>
      )}
    </div>
  );
}
