import { describe, it, expect } from "vitest";
import { targetSize } from "@/components/workspaces/ImageConverter";

describe("targetSize", () => {
  it("réduit en gardant les proportions", () => {
    expect(targetSize(4000, 3000, 1280)).toEqual({ w: 1280, h: 960 });
  });

  it("n'agrandit jamais une image plus petite que la cible", () => {
    expect(targetSize(640, 480, 1920)).toEqual({ w: 640, h: 480 });
  });

  it("0 = taille d'origine", () => {
    expect(targetSize(4000, 3000, 0)).toEqual({ w: 4000, h: 3000 });
  });
});
