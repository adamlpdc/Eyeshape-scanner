export function captureVideoPreview(video: HTMLVideoElement): string | null {
  const { videoWidth, videoHeight } = video;

  if (videoWidth === 0 || videoHeight === 0) {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = videoWidth;
  canvas.height = videoHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return null;
  }

  ctx.translate(videoWidth, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

  try {
    return canvas.toDataURL("image/jpeg", 0.88);
  } catch {
    return null;
  }
}
