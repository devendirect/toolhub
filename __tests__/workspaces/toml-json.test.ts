import { describe, it, expect } from "vitest";
import { convertTomlJson } from "@/components/workspaces/TomlJson";

describe("convertTomlJson", () => {
  it("TOML → JSON : table et types simples", () => {
    const r = convertTomlJson('[server]\nport = 8080\nhost = "a"', "toml→json");
    expect(r.error).toBeNull();
    expect(JSON.parse(r.output)).toEqual({ server: { port: 8080, host: "a" } });
  });

  it("TOML → JSON : inf est signalé (devient null en JSON)", () => {
    const r = convertTomlJson("x = inf", "toml→json");
    expect(r.warnings).toEqual([{ kind: "nonFinite", path: "x" }]);
  });

  it("JSON → TOML : un null est signalé au lieu de disparaître en silence", () => {
    const r = convertTomlJson('{"a": 1, "b": {"c": null}}', "json→toml");
    expect(r.warnings).toEqual([{ kind: "nullDropped", path: "b.c" }]);
    expect(r.output).toContain("a = 1");
  });

  it("JSON → TOML : null dans un tableau = erreur explicite", () => {
    expect(convertTomlJson('{"a": [1, null]}', "json→toml").error).toEqual({ code: "nullInArray" });
  });

  it("JSON → TOML : un tableau en racine est refusé clairement", () => {
    expect(convertTomlJson("[1, 2]", "json→toml").error).toEqual({ code: "topLevelNotObject" });
  });

  it("un entier trop grand pour JavaScript est refusé, pas arrondi", () => {
    expect(convertTomlJson("n = 9007199254740993", "toml→json").error?.code).toBe("parse");
  });
});
