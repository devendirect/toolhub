import { describe, it, expect } from "vitest";
import { encodeB64, decodeB64 } from "@/components/workspaces/Base64Tool";

describe("encodeB64 / decodeB64", () => {
  it("encode de l'ASCII simple", () => {
    expect(encodeB64("hello")).toBe("aGVsbG8=");
  });

  it("décode de l'ASCII simple", () => {
    expect(decodeB64("aGVsbG8=")).toBe("hello");
  });

  it("roundtrip unicode (accents + emoji)", () => {
    const input = "héllo wörld 🚀 — été";
    expect(decodeB64(encodeB64(input))).toBe(input);
  });

  it("chaîne vide", () => {
    expect(encodeB64("")).toBe("");
    expect(decodeB64("")).toBe("");
  });

  it("le décodage tolère les espaces autour", () => {
    expect(decodeB64("  aGVsbG8=\n")).toBe("hello");
  });

  it("base64 invalide lève une erreur (signalée à l'utilisateur, pas silencieuse)", () => {
    expect(() => decodeB64("!!!invalid!!!")).toThrow();
  });
});
