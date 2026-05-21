import { cpSync, existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "node_modules/@mediapipe/tasks-vision/wasm");
const dest = join(root, "public/mediapipe/wasm");

if (!existsSync(src)) {
  console.warn("MediaPipe wasm not found; run npm install first.");
  process.exit(0);
}

mkdirSync(join(root, "public/mediapipe"), { recursive: true });
cpSync(src, dest, { recursive: true });
