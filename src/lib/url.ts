import { err, ok, type BuildResult } from "./payload";

export interface UrlInput {
  /** The URL / URI to encode, exactly as the scanner should receive it. */
  readonly url: string;
}

/**
 * URL payload: the raw string, trimmed. No scheme is injected — the value is
 * encoded verbatim per spec ("string brute"). Only emptiness is rejected.
 */
export function buildUrl(input: UrlInput): BuildResult {
  const url = input.url.trim();
  if (url.length === 0) {
    return err("url.empty", "URL is required");
  }
  return ok(url);
}
