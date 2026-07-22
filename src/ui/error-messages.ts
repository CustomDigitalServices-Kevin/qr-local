// Bridge a builder's stable BuildErrorCode to its localized message key. The
// template-literal return type is verified against MessageKey at compile time:
// if a code lacks its `error.<code>` translation, this stops compiling.

import type { BuildErrorCode } from "../lib";
import type { MessageKey } from "../i18n/messages";

export function errorMessageKey(code: BuildErrorCode): MessageKey {
  return `error.${code}`;
}
