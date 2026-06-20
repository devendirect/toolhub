const FFMPEG_CORE_VERSION = "0.12.6";
const CORE_BASE = `https://unpkg.com/@ffmpeg/core@${FFMPEG_CORE_VERSION}/dist/umd`;

export async function loadFFmpeg(onProgress: (pct: number) => void) {
  const { FFmpeg } = await import("@ffmpeg/ffmpeg");
  const { toBlobURL } = await import("@ffmpeg/util");
  const ffmpeg = new FFmpeg();
  ffmpeg.on("progress", ({ progress }) => onProgress(Math.round(progress * 100)));
  await ffmpeg.load({
    coreURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.js`,   "text/javascript"),
    wasmURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.wasm`, "application/wasm"),
  });
  return ffmpeg;
}
