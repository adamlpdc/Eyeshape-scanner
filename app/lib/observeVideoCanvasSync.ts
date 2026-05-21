import { syncCanvasToVideo } from "./syncCanvasToVideo";

/** Keep canvas bitmap dimensions tied to the video frame across resize/rotation. */
export function observeVideoCanvasSync(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
): () => void {
  const sync = () => {
    syncCanvasToVideo(video, canvas);
  };

  video.addEventListener("loadedmetadata", sync);
  video.addEventListener("resize", sync);

  const observer = new ResizeObserver(sync);
  observer.observe(video);

  sync();

  return () => {
    video.removeEventListener("loadedmetadata", sync);
    video.removeEventListener("resize", sync);
    observer.disconnect();
  };
}
