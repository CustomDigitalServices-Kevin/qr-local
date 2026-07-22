import { describe, expect, it } from "vitest";
import { parseBatchInput } from "./batch";

describe("parseBatchInput", () => {
  it("returns one row per non-empty trimmed line", () => {
    const rows = parseBatchInput("a\n b \n\nc\n");
    expect(rows.map((r) => r.value)).toEqual(["a", "b", "c"]);
  });

  it("numbers rows sequentially, zero-padded to the count width", () => {
    const raw = Array.from({ length: 12 }, (_, i) => `v${String(i)}`).join("\n");
    const rows = parseBatchInput(raw);
    expect(rows[0]?.name).toBe("qr-01");
    expect(rows[11]?.name).toBe("qr-12");
  });

  it("does not split values that contain commas", () => {
    const rows = parseBatchInput("https://a.example/x,y,z");
    expect(rows).toHaveLength(1);
    expect(rows[0]?.value).toBe("https://a.example/x,y,z");
  });

  it("handles CRLF line endings", () => {
    const rows = parseBatchInput("one\r\ntwo\r\n");
    expect(rows.map((r) => r.value)).toEqual(["one", "two"]);
  });

  it("returns an empty list for blank input", () => {
    expect(parseBatchInput("   \n  \n")).toEqual([]);
  });
});
