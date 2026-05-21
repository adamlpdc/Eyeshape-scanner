/** Match canvas bitmap size to the video frame so landmark coords line up with object-cover. */
export function syncCanvasToVideo(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
): boolean {
  const { videoWidth, videoHeight } = video;
  if (videoWidth === 0 || videoHeight === 0) {
    return false;
  }

  if (canvas.width !== videoWidth || canvas.height !== videoHeight) {
    canvas.width = videoWidth;
    canvas.height = videoHeight;
  }

  return true;
}
