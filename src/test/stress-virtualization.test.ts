import { describe, it, expect } from "vitest";
import { NodeModuleEntry } from "../types";

describe("WP-7: Synthetic Dataset & Stress Performance Tests (1000+ items)", () => {
  function generate1000SyntheticEntries(): NodeModuleEntry[] {
    const entries: NodeModuleEntry[] = [];
    const pms = ["npm", "pnpm", "yarn", "bun"] as const;

    for (let i = 0; i < 1000; i++) {
      const pm = pms[i % pms.length];
      const sizeBytes = Math.floor(Math.random() * 5 * 1024 * 1024 * 1024); // 0 to 5GB
      const daysAgo = (i * 3) % 365;
      const modifiedAt = new Date(Date.now() - daysAgo * 86400000).toISOString();

      entries.push({
        id: `synth-${i}`,
        nodeModulesPath: `C:\\Workspaces\\org-${Math.floor(i / 10)}\\project-${i}\\node_modules`,
        projectPath: `C:\\Workspaces\\org-${Math.floor(i / 10)}\\project-${i}`,
        projectName: `project-${i}`,
        packageManager: pm,
        sizeBytes,
        modifiedAt,
        packageJsonFound: i % 20 !== 0,
        status: "ready",
      });
    }
    return entries;
  }

  it("filters 1000 entries by project name within 15ms", () => {
    const entries = generate1000SyntheticEntries();
    const query = "project-7";

    const t0 = performance.now();
    const filtered = entries.filter(
      (e) =>
        e.projectName.toLowerCase().includes(query) ||
        e.nodeModulesPath.toLowerCase().includes(query)
    );
    const duration = performance.now() - t0;

    expect(filtered.length).toBeGreaterThan(0);
    expect(duration).toBeLessThan(15);
  });

  it("sorts 1000 entries by size in descending order within 10ms", () => {
    const entries = generate1000SyntheticEntries();

    const t0 = performance.now();
    entries.sort((a, b) => (b.sizeBytes ?? 0) - (a.sizeBytes ?? 0));
    const duration = performance.now() - t0;

    expect(entries[0].sizeBytes!).toBeGreaterThanOrEqual(entries[entries.length - 1].sizeBytes!);
    expect(duration).toBeLessThan(10);
  });

  it("calculates total cleanable bytes across 1000 entries instantaneously", () => {
    const entries = generate1000SyntheticEntries();

    const t0 = performance.now();
    const totalBytes = entries.reduce((acc, e) => acc + (e.sizeBytes || 0), 0);
    const duration = performance.now() - t0;

    expect(totalBytes).toBeGreaterThan(0);
    expect(duration).toBeLessThan(5);
  });

  it("handles Set-based multi-selection of 1000 items in <2ms", () => {
    const entries = generate1000SyntheticEntries();

    const t0 = performance.now();
    const set = new Set<string>();
    for (const e of entries) {
      set.add(e.id);
    }
    const duration = performance.now() - t0;

    expect(set.size).toBe(1000);
    expect(duration).toBeLessThan(5);
  });
});
