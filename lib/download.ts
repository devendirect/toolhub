import { track, toolSlugFromPath } from "./analytics";

export function downloadUrl(url: string, filename: string): void {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  // Nom standard GA4 (remplit les rapports natifs) ; downloadBlob passe aussi par ici
  track("file_download", {
    tool_slug: toolSlugFromPath(),
    file_name: filename,
    file_extension: filename.split(".").pop() ?? "",
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  downloadUrl(url, filename);
  URL.revokeObjectURL(url);
}
