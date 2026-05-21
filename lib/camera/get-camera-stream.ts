import { CameraAccessError, mapCameraError } from "./camera-errors";

export async function getCameraStream(): Promise<MediaStream> {
  const constraints: MediaStreamConstraints = {
    audio: false,
    video: { facingMode: { ideal: "user" } },
  };

  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    const code = mapCameraError(error);

    if (code === "camera_denied") {
      throw new CameraAccessError(code, error);
    }

    try {
      return await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });
    } catch (fallbackError) {
      throw new CameraAccessError(mapCameraError(fallbackError), fallbackError);
    }
  }
}
