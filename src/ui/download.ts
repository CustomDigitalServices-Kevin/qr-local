// Trigger a browser download for an in-memory Blob. Isolated so components can
// stay pure and this single DOM side effect is easy to stub in tests.

/**
 * Save `blob` to the user's device under `filename` by clicking a transient
 * object-URL anchor. The URL is revoked on the next tick to free memory.
 */
export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Defer revocation so the download has a chance to start in every browser.
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);
}
