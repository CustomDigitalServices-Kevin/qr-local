import { err, ok, type BuildResult } from "./payload";

export interface TextInput {
  /** Free-form text to encode verbatim. */
  readonly text: string;
}

/**
 * Free text payload: encoded verbatim. Leading/trailing whitespace is
 * preserved except that an all-whitespace value is rejected as empty.
 */
export function buildText(input: TextInput): BuildResult {
  if (input.text.trim().length === 0) {
    return err("text.empty", "Text is required");
  }
  return ok(input.text);
}
