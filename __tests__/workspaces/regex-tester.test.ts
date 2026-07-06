import { describe, it, expect } from "vitest";
import { analyze } from "@/components/workspaces/RegexTester";

describe("analyze (regex tester)", () => {
  it("trouve les correspondances avec index", () => {
    const { matches, error } = analyze("aaa bbb aaa", "aaa", "g");
    expect(error).toBeNull();
    expect(matches).toHaveLength(2);
    expect(matches[0]).toMatchObject({ value: "aaa", index: 0 });
    expect(matches[1]).toMatchObject({ value: "aaa", index: 8 });
  });

  it("capture les groupes", () => {
    const { matches } = analyze("date: 12-34", "(\\d+)-(\\d+)", "g");
    expect(matches[0]?.groups).toEqual(["12", "34"]);
  });

  it("ajoute le flag g automatiquement", () => {
    const { matches } = analyze("ABC abc", "abc", "i");
    expect(matches).toHaveLength(2);
  });

  it("pattern invalide → erreur retournée, pas d'exception", () => {
    const { matches, error } = analyze("text", "(", "g");
    expect(error).toBeTruthy();
    expect(matches).toEqual([]);
  });

  it("pattern vide → texte intact en un seul segment", () => {
    const { segments, matches } = analyze("hello", "", "g");
    expect(matches).toEqual([]);
    expect(segments).toEqual([{ text: "hello", isMatch: false, matchIdx: -1 }]);
  });

  it("les matches de longueur nulle ne bouclent pas à l'infini", () => {
    const { matches, error } = analyze("bbb", "a*", "g");
    expect(error).toBeNull();
    expect(matches.length).toBeGreaterThan(0);
  });

  it("les segments reconstituent le texte d'origine", () => {
    const text = "Contact hello@utilisio.io ou support@example.com.";
    const { segments } = analyze(text, "[a-z.]+@[a-z.]+", "g");
    expect(segments.map((s) => s.text).join("")).toBe(text);
  });
});
