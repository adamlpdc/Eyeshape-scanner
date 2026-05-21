import { syncCanvasToVideo } from "./sync-canvas-to-video";

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
