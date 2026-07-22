// Local, device-only generation history persisted in localStorage. Nothing
// leaves the browser. All storage access is guarded (private-mode quota errors,
// disabled storage, malformed JSON) so a failure degrades to an empty history
// instead of crashing the app. The Storage is injectable for tests.

import type { PayloadInput } from "../lib";
import type { QrType } from "../qr/types";

const STORAGE_KEY = "qr-local:history";
const MAX_ENTRIES = 20;

export interface HistoryEntry {
  readonly id: string;
  readonly type: QrType;
  /** The exact form input that produced the payload, for one-click restore. */
  readonly input: PayloadInput;
  /** The encoded payload string (what the QR contained). */
  readonly payload: string;
  /** Creation timestamp, epoch ms. */
  readonly createdAt: number;
}

function safeStorage(explicit?: Storage): Storage | null {
  if (explicit) return explicit;
  try {
    if (typeof localStorage === "undefined") return null;
    return localStorage;
  } catch {
    // Accessing localStorage can throw in sandboxed / privacy contexts.
    return null;
  }
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== "object" || value === null) return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === "string" &&
    typeof entry.type === "string" &&
    typeof entry.payload === "string" &&
    typeof entry.createdAt === "number" &&
    typeof entry.input === "object" &&
    entry.input !== null
  );
}

/** Read the stored history, newest first. Returns [] on any failure. */
export function loadHistory(storage?: Storage): HistoryEntry[] {
  const store = safeStorage(storage);
  if (store === null) return [];
  try {
    const raw = store.getItem(STORAGE_KEY);
    if (raw === null) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isHistoryEntry);
  } catch {
    return [];
  }
}

function persist(entries: readonly HistoryEntry[], storage?: Storage): void {
  const store = safeStorage(storage);
  if (store === null) return;
  try {
    store.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Quota or serialization failure: history is best-effort, so swallow.
  }
}

function newId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${String(Date.now())}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Prepend a new entry, drop an older duplicate of the same type+payload, cap at
 * {@link MAX_ENTRIES}, persist, and return the updated list. `now` is injectable
 * for deterministic tests.
 */
export function addHistoryEntry(
  input: { type: QrType; input: PayloadInput; payload: string },
  storage?: Storage,
  now: number = Date.now(),
): HistoryEntry[] {
  const existing = loadHistory(storage).filter(
    (entry) => !(entry.type === input.type && entry.payload === input.payload),
  );
  const entry: HistoryEntry = {
    id: newId(),
    type: input.type,
    input: input.input,
    payload: input.payload,
    createdAt: now,
  };
  const next = [entry, ...existing].slice(0, MAX_ENTRIES);
  persist(next, storage);
  return next;
}

/** Remove one entry by id, persist, and return the updated list. */
export function removeHistoryEntry(id: string, storage?: Storage): HistoryEntry[] {
  const next = loadHistory(storage).filter((entry) => entry.id !== id);
  persist(next, storage);
  return next;
}

/** Clear the whole history. */
export function clearHistory(storage?: Storage): void {
  const store = safeStorage(storage);
  if (store === null) return;
  try {
    store.removeItem(STORAGE_KEY);
  } catch {
    // Ignore: nothing else to do if removal fails.
  }
}

/** A compact, single-line label for an entry (payload preview, capped). */
export function historyLabel(entry: HistoryEntry): string {
  const oneLine = entry.payload.replace(/\s+/g, " ").trim();
  return oneLine.length > 48 ? `${oneLine.slice(0, 47)}…` : oneLine;
}
