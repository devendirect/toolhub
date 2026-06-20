import { describe, it, expect } from "vitest";
import { toMarkdown } from "@/components/workspaces/MarkdownTable";

describe("toMarkdown", () => {
  it("génère un tableau basique", () => {
    const rows = [["A", "B"], ["1", "2"]];
    const aligns = ["left", "left"] as const;
    const out = toMarkdown(rows, aligns);
    expect(out).toContain("| A | B |");
    expect(out).toContain("| 1 | 2 |");
  });

  it("génère les séparateurs d'alignement", () => {
    const rows = [["H1", "H2", "H3"], ["v1", "v2", "v3"]];
    const aligns = ["left", "center", "right"] as const;
    const out = toMarkdown(rows, aligns);
    const lines = out.split("\n");
    expect(lines[1]).toContain(":---");
    expect(lines[1]).toContain(":---:");
    expect(lines[1]).toContain("---:");
  });

  it("alignement left → :---", () => {
    const out = toMarkdown([["H"], ["v"]], ["left"]);
    expect(out.split("\n")[1]).toContain(":---");
  });

  it("alignement center → :---:", () => {
    const out = toMarkdown([["H"], ["v"]], ["center"]);
    expect(out.split("\n")[1]).toContain(":---:");
  });

  it("alignement right → ---:", () => {
    const out = toMarkdown([["H"], ["v"]], ["right"]);
    expect(out.split("\n")[1]).toContain("---:");
  });

  it("échappe les pipes dans le contenu", () => {
    const rows = [["A|B", "C"], ["1|2", "3"]];
    const out = toMarkdown(rows, ["left", "left"]);
    expect(out).toContain("A\\|B");
    expect(out).toContain("1\\|2");
  });

  it("remplace les sauts de ligne par des espaces", () => {
    const rows = [["line1\nline2", "B"], ["v", "w"]];
    const out = toMarkdown(rows, ["left", "left"]);
    expect(out).not.toContain("\n\n");
    expect(out).toContain("line1 line2");
  });

  it("gère un tableau à une seule colonne", () => {
    const out = toMarkdown([["Header"], ["Cell"]], ["center"]);
    expect(out).toContain("| Header |");
    expect(out).toContain("| Cell |");
  });

  it("produit 3 lignes pour un tableau 2×2 (header + sep + data)", () => {
    const out = toMarkdown([["H1", "H2"], ["D1", "D2"]], ["left", "left"]);
    expect(out.split("\n")).toHaveLength(3);
  });
});
