import { describe, it, expect } from "vitest";
import { removeLineBreaks } from "@/components/workspaces/RemoveLineBreaks";

describe("removeLineBreaks", () => {
  it("mode space : remplace les sauts de ligne par des espaces", () => {
    expect(removeLineBreaks("one\ntwo\nthree", "space")).toBe("one two three");
  });

  it("mode space : condense les sauts multiples et les espaces répétés", () => {
    expect(removeLineBreaks("one\n\n\ntwo   three", "space")).toBe("one two three");
  });

  it("mode remove : supprime les sauts sans ajouter d'espace", () => {
    expect(removeLineBreaks("one\ntwo", "remove")).toBe("onetwo");
  });

  it("mode normalize : conserve les paragraphes, fusionne le reste", () => {
    expect(removeLineBreaks("line one\nline two\n\npara two", "normalize"))
      .toBe("line one line two\n\npara two");
  });

  it("gère les fins de ligne Windows (CRLF)", () => {
    expect(removeLineBreaks("one\r\ntwo", "space")).toBe("one two");
    expect(removeLineBreaks("one\r\ntwo", "remove")).toBe("onetwo");
  });

  it("chaîne vide → chaîne vide", () => {
    expect(removeLineBreaks("", "space")).toBe("");
  });
});
