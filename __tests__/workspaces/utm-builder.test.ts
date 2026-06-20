import { describe, it, expect } from "vitest";
import { buildUtm } from "@/components/workspaces/UtmBuilder";

describe("buildUtm", () => {
  const base = { url: "https://example.com", source: "google", medium: "cpc", campaign: "spring" };

  describe("champs requis manquants → null", () => {
    it("URL vide → null", () => {
      expect(buildUtm("", "google", "cpc", "spring", "", "")).toBeNull();
    });

    it("source vide → null", () => {
      expect(buildUtm("https://example.com", "", "cpc", "spring", "", "")).toBeNull();
    });

    it("medium vide → null", () => {
      expect(buildUtm("https://example.com", "google", "", "spring", "", "")).toBeNull();
    });

    it("campaign vide → null", () => {
      expect(buildUtm("https://example.com", "google", "cpc", "", "", "")).toBeNull();
    });
  });

  describe("construction de l'URL", () => {
    it("inclut utm_source, utm_medium, utm_campaign", () => {
      const url = buildUtm(base.url, base.source, base.medium, base.campaign, "", "");
      expect(url).toContain("utm_source=google");
      expect(url).toContain("utm_medium=cpc");
      expect(url).toContain("utm_campaign=spring");
    });

    it("n'inclut pas utm_term si vide", () => {
      const url = buildUtm(base.url, base.source, base.medium, base.campaign, "", "");
      expect(url).not.toContain("utm_term");
    });

    it("n'inclut pas utm_content si vide", () => {
      const url = buildUtm(base.url, base.source, base.medium, base.campaign, "", "");
      expect(url).not.toContain("utm_content");
    });

    it("inclut utm_term si renseigné", () => {
      const url = buildUtm(base.url, base.source, base.medium, base.campaign, "running+shoes", "");
      expect(url).toContain("utm_term=running%2Bshoes");
    });

    it("inclut utm_content si renseigné", () => {
      const url = buildUtm(base.url, base.source, base.medium, base.campaign, "", "banner_top");
      expect(url).toContain("utm_content=banner_top");
    });
  });

  describe("normalisation de l'URL", () => {
    it("préfixe https:// si pas de protocole", () => {
      const url = buildUtm("example.com", base.source, base.medium, base.campaign, "", "");
      expect(url).toMatch(/^https:\/\/example\.com/);
    });

    it("préserve les query params existants", () => {
      const url = buildUtm("https://example.com?existing=1", base.source, base.medium, base.campaign, "", "");
      expect(url).toContain("existing=1");
      expect(url).toContain("utm_source=google");
    });
  });

  describe("trim des valeurs", () => {
    it("supprime les espaces autour de l'URL", () => {
      const url = buildUtm("  https://example.com  ", base.source, base.medium, base.campaign, "", "");
      expect(url).not.toBeNull();
      expect(url).toContain("utm_source=google");
    });

    it("supprime les espaces autour des paramètres", () => {
      const url = buildUtm(base.url, "  google  ", "  cpc  ", "  spring  ", "", "");
      expect(url).toContain("utm_source=google");
      expect(url).toContain("utm_medium=cpc");
    });
  });
});
