import { describe, expect, it } from "vitest";
import { initialStyleState } from "./style-state";
import { quietMargin, buildQrOptions } from "./qr-render";

describe("quietMargin", () => {
  it("is zero for non-positive or invalid sizes", () => {
    expect(quietMargin(0)).toBe(0);
    expect(quietMargin(-10)).toBe(0);
    expect(quietMargin(Number.NaN)).toBe(0);
  });

  it("yields four modules' worth of border at the reference module count", () => {
    // size / 33 * 4, rounded — 264px gives exactly 32px.
    expect(quietMargin(264)).toBe(32);
  });

  it("scales with size", () => {
    expect(quietMargin(1024)).toBeGreaterThan(quietMargin(512));
  });
});

describe("buildQrOptions", () => {
  it("encodes the payload with the requested size, margin and draw type", () => {
    const options = buildQrOptions("hello", initialStyleState(), 280, "svg");
    expect(options.data).toBe("hello");
    expect(options.type).toBe("svg");
    expect(options.width).toBe(280);
    expect(options.margin).toBe(quietMargin(280));
    expect(options.qrOptions?.errorCorrectionLevel).toBe("M");
    expect(options.image).toBeUndefined();
  });

  it("omits the gradient unless enabled", () => {
    const off = buildQrOptions("x", initialStyleState(), 280, "canvas");
    expect(off.dotsOptions?.gradient).toBeUndefined();

    const on = buildQrOptions(
      "x",
      { ...initialStyleState(), gradientEnabled: true, gradientColor: "#ff6b00" },
      280,
      "canvas",
    );
    expect(on.dotsOptions?.gradient?.colorStops).toHaveLength(2);
  });

  it("forces ECC H and clamps the logo size when a logo is present", () => {
    const options = buildQrOptions(
      "x",
      { ...initialStyleState(), logoDataUrl: "data:image/png;base64,AAAA", logoSize: 0.5 },
      512,
      "canvas",
    );
    expect(options.qrOptions?.errorCorrectionLevel).toBe("H");
    expect(options.image).toBe("data:image/png;base64,AAAA");
    expect(options.imageOptions?.imageSize).toBe(0.3);
    expect(options.imageOptions?.hideBackgroundDots).toBe(true);
  });
});
