export async function getCameraStream(): Promise<MediaStream> {
  const constraints: MediaStreamConstraints = {
    audio: false,
    video: { facingMode: { ideal: "user" } },
  };

  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch {
    return await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
  }
}
