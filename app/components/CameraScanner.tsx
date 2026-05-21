"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getCameraStream } from "../lib/getCameraStream";
import {
  getFaceLandmarker,
  releaseFaceLandmarker,
} from "../lib/faceLandmarker";
import { syncCanvasToVideo } from "../lib/syncCanvasToVideo";

export default function CameraScanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
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
    }
  }, [isScanning]);

  useEffect(() => {
    if (!isScanning) {
      return;
    }

    let cancelled = false;
    let animationId = 0;
    let lastVideoTime = -1;

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

      syncCanvasToVideo(video, canvas);

      const [{ FaceLandmarker, DrawingUtils }, landmarker] = await Promise.all([
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

        const results = landmarker.detectForVideo(
          video,
          performance.now(),
        );

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const landmarks of results.faceLandmarks) {
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_CONTOURS,
            { color: "#4ade80", lineWidth: 1 },
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
            { color: "#38bdf8", lineWidth: 1 },
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
            { color: "#38bdf8", lineWidth: 1 },
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
            { color: "#fbbf24", lineWidth: 1 },
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
            { color: "#fbbf24", lineWidth: 1 },
          );
          drawingUtils.drawLandmarks(landmarks, {
            color: "#86efac",
            lineWidth: 0.5,
            radius: 1,
          });
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
    };
  }, [isScanning]);

  async function startScan() {
    setError(null);
    setIsModelReady(false);

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
    <div ref={containerRef} className="fixed inset-0 bg-black">
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full -scale-x-100 object-cover ${
          isScanning ? "block" : "hidden"
        }`}
        playsInline
        muted
        autoPlay
      />

      <canvas
        ref={canvasRef}
        className={`pointer-events-none absolute inset-0 h-full w-full -scale-x-100 object-cover ${
          isScanning ? "block" : "hidden"
        }`}
        aria-hidden
      />

      {isScanning && !isModelReady && (
        <p className="pointer-events-none absolute inset-x-0 bottom-8 text-center text-sm text-white/80">
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
