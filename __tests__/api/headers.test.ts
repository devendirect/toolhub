import { describe, it, expect } from "vitest";
import { computeGrade } from "@/app/api/headers/route";
import type { HeaderCheck } from "@/app/api/headers/route";

const check = (name: string, status: HeaderCheck["status"]): HeaderCheck => ({
  name, value: null, status, note: "",
});

const CRITICAL_NAMES = [
  "Content-Security-Policy",
  "Strict-Transport-Security",
  "X-Content-Type-Options",
  "X-Frame-Options",
];

const NON_CRITICAL = ["Referrer-Policy", "Permissions-Policy"];

describe("computeGrade", () => {
  it("A — tous les headers critiques présents", () => {
    const checks = CRITICAL_NAMES.map((n) => check(n, "present"));
    expect(computeGrade(checks)).toBe("A");
  });

  it("A — warn sur les non-critiques ne pénalise pas", () => {
    const checks = [
      ...CRITICAL_NAMES.map((n) => check(n, "present")),
      ...NON_CRITICAL.map((n) => check(n, "warn")),
    ];
    expect(computeGrade(checks)).toBe("A");
  });

  it("B — 1 header critique manquant", () => {
    const checks = [
      check("Content-Security-Policy", "missing"),
      ...CRITICAL_NAMES.slice(1).map((n) => check(n, "present")),
    ];
    expect(computeGrade(checks)).toBe("B");
  });

  it("C — 2 headers critiques manquants", () => {
    const checks = [
      check("Content-Security-Policy", "missing"),
      check("Strict-Transport-Security", "missing"),
      check("X-Content-Type-Options", "present"),
      check("X-Frame-Options", "present"),
    ];
    expect(computeGrade(checks)).toBe("C");
  });

  it("D — 3 headers critiques manquants", () => {
    const checks = [
      check("Content-Security-Policy", "missing"),
      check("Strict-Transport-Security", "missing"),
      check("X-Content-Type-Options", "missing"),
      check("X-Frame-Options", "present"),
    ];
    expect(computeGrade(checks)).toBe("D");
  });

  it("F — 4 headers critiques manquants", () => {
    const checks = CRITICAL_NAMES.map((n) => check(n, "missing"));
    expect(computeGrade(checks)).toBe("F");
  });

  it("warn sur un header critique ne compte pas comme missing", () => {
    const checks = [
      check("Content-Security-Policy", "warn"),
      ...CRITICAL_NAMES.slice(1).map((n) => check(n, "present")),
    ];
    expect(computeGrade(checks)).toBe("A");
  });
});
