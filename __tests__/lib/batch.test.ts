import { describe, it, expect } from "vitest";
import { uniqueName, runSequential, type ItemStatus } from "@/lib/batch";

describe("uniqueName", () => {
  it("garde le premier nom, suffixe les suivants", () => {
    const used = new Set<string>();
    expect(uniqueName("IMG_0001.jpg", used)).toBe("IMG_0001.jpg");
    expect(uniqueName("IMG_0001.jpg", used)).toBe("IMG_0001-2.jpg");
    expect(uniqueName("IMG_0001.jpg", used)).toBe("IMG_0001-3.jpg");
  });

  it("ignore la casse, comme les systèmes de fichiers de Windows et macOS", () => {
    const used = new Set<string>();
    uniqueName("photo.jpg", used);
    expect(uniqueName("PHOTO.jpg", used)).toBe("PHOTO-2.jpg");
  });

  it("gère un nom sans extension", () => {
    const used = new Set<string>();
    uniqueName("scan", used);
    expect(uniqueName("scan", used)).toBe("scan-2");
  });
});

describe("runSequential", () => {
  it("traite dans l'ordre, une erreur n'arrête pas le lot", async () => {
    const log: string[] = [];
    const statuses: Record<number, ItemStatus> = {};
    const ok = await runSequential(
      ["a", "b", "c"],
      async (x) => { log.push(x); if (x === "b") throw new Error("illisible"); },
      (i, s) => { statuses[i] = s; },
    );
    expect(log).toEqual(["a", "b", "c"]);
    expect(ok).toBe(2);
    expect(statuses).toEqual({ 0: "done", 1: "error", 2: "done" });
  });

  it("s'arrête entre deux éléments quand on annule", async () => {
    let cancelled = false;
    const seen: string[] = [];
    const ok = await runSequential(
      ["a", "b", "c"],
      async (x) => { seen.push(x); cancelled = true; },
      () => {},
      () => cancelled,
    );
    expect(seen).toEqual(["a"]);
    expect(ok).toBe(1);
  });
});
