import { describe, it, expect } from "vitest";
import { isHeicFile, isImageFile } from "@/lib/heic";

describe("isHeicFile", () => {
  it("reconnaît le type MIME HEIC/HEIF", () => {
    expect(isHeicFile({ name: "a", type: "image/heic" })).toBe(true);
    expect(isHeicFile({ name: "a", type: "image/heif-sequence" })).toBe(true);
  });

  it("reconnaît l'extension quand le type est vide (Windows, Chrome)", () => {
    expect(isHeicFile({ name: "IMG_0042.HEIC", type: "" })).toBe(true);
    expect(isHeicFile({ name: "photo.heif", type: "" })).toBe(true);
  });

  it("ne confond pas les autres images", () => {
    expect(isHeicFile({ name: "photo.jpg", type: "image/jpeg" })).toBe(false);
    expect(isHeicFile({ name: "heic.png", type: "image/png" })).toBe(false);
  });
});

describe("isImageFile", () => {
  it("accepte un HEIC sans type, refuse un PDF", () => {
    expect(isImageFile({ name: "IMG_0042.heic", type: "" })).toBe(true);
    expect(isImageFile({ name: "doc.pdf", type: "application/pdf" })).toBe(false);
  });
});
