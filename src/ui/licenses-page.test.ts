import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { RUNTIME_LICENSES } from "./LicensesPage";

// Locks the third-party licenses table against package.json "dependencies":
// every runtime dependency must be credited on the Licenses page. Adding a
// runtime dependency without listing it here fails this test. Resolved from
// the Vitest working directory (project root) rather than import.meta.url,
// which the happy-dom environment exposes as a non-file URL.
const packageJsonPath = resolve(process.cwd(), "package.json");
const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
  dependencies: Record<string, string>;
};

describe("runtime licenses table", () => {
  it("credits every runtime dependency from package.json", () => {
    const covered = new Set(RUNTIME_LICENSES.flatMap((entry) => entry.covers));
    const dependencies = Object.keys(pkg.dependencies);
    const missing = dependencies.filter((dep) => !covered.has(dep));
    expect(missing).toEqual([]);
  });

  it("does not credit packages that are not runtime dependencies", () => {
    const dependencies = new Set(Object.keys(pkg.dependencies));
    const covered = RUNTIME_LICENSES.flatMap((entry) => entry.covers);
    const extraneous = covered.filter((name) => !dependencies.has(name));
    expect(extraneous).toEqual([]);
  });
});
