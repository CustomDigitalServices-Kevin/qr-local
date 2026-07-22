import { describe, expect, it } from "vitest";
import type { PayloadInput } from "../lib";
import {
  loadHistory,
  addHistoryEntry,
  removeHistoryEntry,
  clearHistory,
  historyLabel,
  type HistoryEntry,
} from "./history";

/** Minimal in-memory Storage for deterministic, isolated tests. */
function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => {
      map.clear();
    },
    getItem: (key) => map.get(key) ?? null,
    key: (index) => Array.from(map.keys())[index] ?? null,
    removeItem: (key) => {
      map.delete(key);
    },
    setItem: (key, value) => {
      map.set(key, value);
    },
  };
}

const urlInput: PayloadInput = { type: "url", url: "https://a.example" };

describe("history persistence", () => {
  it("adds and reloads an entry", () => {
    const store = memoryStorage();
    addHistoryEntry({ type: "url", input: urlInput, payload: "https://a.example" }, store, 1000);
    const entries = loadHistory(store);
    expect(entries).toHaveLength(1);
    expect(entries[0]?.payload).toBe("https://a.example");
    expect(entries[0]?.createdAt).toBe(1000);
  });

  it("de-duplicates identical type+payload, keeping the newest", () => {
    const store = memoryStorage();
    addHistoryEntry({ type: "url", input: urlInput, payload: "https://a.example" }, store, 1);
    const after = addHistoryEntry(
      { type: "url", input: urlInput, payload: "https://a.example" },
      store,
      2,
    );
    expect(after).toHaveLength(1);
    expect(after[0]?.createdAt).toBe(2);
  });

  it("caps the history at 20 entries, newest first", () => {
    const store = memoryStorage();
    for (let i = 0; i < 25; i += 1) {
      addHistoryEntry(
        { type: "text", input: { type: "text", text: `t${String(i)}` }, payload: `t${String(i)}` },
        store,
        i,
      );
    }
    const entries = loadHistory(store);
    expect(entries).toHaveLength(20);
    expect(entries[0]?.payload).toBe("t24");
  });

  it("removes a single entry by id", () => {
    const store = memoryStorage();
    const added = addHistoryEntry(
      { type: "url", input: urlInput, payload: "https://a.example" },
      store,
      1,
    );
    const [first] = added;
    expect(first).toBeDefined();
    const after = removeHistoryEntry(first?.id ?? "no-id", store);
    expect(after).toHaveLength(0);
  });

  it("clears the whole history", () => {
    const store = memoryStorage();
    addHistoryEntry({ type: "url", input: urlInput, payload: "https://a.example" }, store, 1);
    clearHistory(store);
    expect(loadHistory(store)).toHaveLength(0);
  });

  it("returns an empty list on malformed stored JSON", () => {
    const store = memoryStorage();
    store.setItem("qr-local:history", "{not json");
    expect(loadHistory(store)).toEqual([]);
  });

  it("drops entries that fail the shape guard", () => {
    const store = memoryStorage();
    store.setItem("qr-local:history", JSON.stringify([{ id: "x" }, 42, null]));
    expect(loadHistory(store)).toEqual([]);
  });
});

describe("historyLabel", () => {
  it("collapses whitespace and truncates long payloads", () => {
    const entry: HistoryEntry = {
      id: "1",
      type: "text",
      input: { type: "text", text: "x" },
      payload: `line1\n   line2 ${"y".repeat(100)}`,
      createdAt: 0,
    };
    const label = historyLabel(entry);
    expect(label.includes("\n")).toBe(false);
    expect(label.endsWith("…")).toBe(true);
    expect(label.length).toBeLessThanOrEqual(48);
  });
});
