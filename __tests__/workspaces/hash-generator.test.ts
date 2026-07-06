import { describe, it, expect } from "vitest";
import { hashBuffer } from "@/components/workspaces/HashGenerator";

function bufferOf(str: string): ArrayBuffer {
  return new TextEncoder().encode(str).buffer as ArrayBuffer;
}

// Vecteurs de test publics (NIST / RFC 1321) pour l'entrée "abc"
const KNOWN = {
  "MD5":     "900150983cd24fb0d6963f7d28e17f72",
  "SHA-1":   "a9993e364706816aba3e25717850c26c9cd0d89d",
  "SHA-256": "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
  "SHA-512": "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f",
} as const;

describe("hashBuffer", () => {
  it("produit les 4 empreintes attendues pour 'abc' (vecteurs connus)", async () => {
    const results = await hashBuffer(bufferOf("abc"));
    const byAlgo = Object.fromEntries(results.map((r) => [r.algo, r.value]));
    for (const [algo, expected] of Object.entries(KNOWN)) {
      expect(byAlgo[algo], algo).toBe(expected);
    }
  });

  it("entrée vide : MD5 et SHA-256 de la chaîne vide", async () => {
    const results = await hashBuffer(bufferOf(""));
    const byAlgo = Object.fromEntries(results.map((r) => [r.algo, r.value]));
    expect(byAlgo["MD5"]).toBe("d41d8cd98f00b204e9800998ecf8427e");
    expect(byAlgo["SHA-256"]).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
  });

  it("les empreintes sont en hexadécimal minuscule", async () => {
    const results = await hashBuffer(bufferOf("utilisio"));
    for (const r of results) {
      expect(r.value, r.algo).toMatch(/^[0-9a-f]+$/);
    }
  });
});
