import { describe, it, expect } from "vitest";
import { isSafeUrl } from "@/lib/route-security";

describe("isSafeUrl", () => {
  describe("URLs valides", () => {
    it("accepte une URL HTTPS publique", () => {
      const r = isSafeUrl("https://example.com");
      expect(r.ok).toBe(true);
    });

    it("accepte une URL HTTP publique", () => {
      const r = isSafeUrl("http://example.com");
      expect(r.ok).toBe(true);
    });

    it("accepte une URL avec chemin et query", () => {
      const r = isSafeUrl("https://example.com/path?q=1");
      expect(r.ok).toBe(true);
    });

    it("retourne l'objet URL parsé", () => {
      const r = isSafeUrl("https://example.com");
      expect(r.ok && r.url.hostname).toBe("example.com");
    });
  });

  describe("protocoles interdits", () => {
    it("refuse javascript:", () => {
      const r = isSafeUrl("javascript:alert(1)");
      expect(r.ok).toBe(false);
    });

    it("refuse ftp:", () => {
      const r = isSafeUrl("ftp://example.com");
      expect(r.ok).toBe(false);
    });

    it("refuse data:", () => {
      const r = isSafeUrl("data:text/html,<h1>xss</h1>");
      expect(r.ok).toBe(false);
    });
  });

  describe("URL invalide", () => {
    it("refuse une string vide", () => {
      const r = isSafeUrl("");
      expect(r.ok).toBe(false);
    });

    it("refuse un chemin relatif", () => {
      const r = isSafeUrl("/api/test");
      expect(r.ok).toBe(false);
    });

    it("refuse du texte libre", () => {
      const r = isSafeUrl("not a url at all");
      expect(r.ok).toBe(false);
    });
  });

  describe("adresses loopback / localhost (SSRF)", () => {
    it("refuse localhost", () => {
      expect(isSafeUrl("http://localhost").ok).toBe(false);
    });

    it("refuse 127.0.0.1", () => {
      expect(isSafeUrl("http://127.0.0.1").ok).toBe(false);
    });

    it("refuse 127.0.0.2", () => {
      expect(isSafeUrl("http://127.0.0.2").ok).toBe(false);
    });

    it("refuse ::1 (IPv6 loopback)", () => {
      expect(isSafeUrl("http://[::1]").ok).toBe(false);
    });

    it("refuse 0.0.0.0", () => {
      expect(isSafeUrl("http://0.0.0.0").ok).toBe(false);
    });
  });

  describe("plages IP privées (SSRF)", () => {
    it("refuse 10.0.0.1", () => {
      expect(isSafeUrl("http://10.0.0.1").ok).toBe(false);
    });

    it("refuse 10.255.255.255", () => {
      expect(isSafeUrl("http://10.255.255.255").ok).toBe(false);
    });

    it("refuse 192.168.1.1", () => {
      expect(isSafeUrl("http://192.168.1.1").ok).toBe(false);
    });

    it("refuse 172.16.0.1", () => {
      expect(isSafeUrl("http://172.16.0.1").ok).toBe(false);
    });

    it("refuse 172.31.255.255", () => {
      expect(isSafeUrl("http://172.31.255.255").ok).toBe(false);
    });

    it("accepte 172.15.x.x (hors plage)", () => {
      expect(isSafeUrl("http://172.15.0.1").ok).toBe(true);
    });

    it("accepte 172.32.x.x (hors plage)", () => {
      expect(isSafeUrl("http://172.32.0.1").ok).toBe(true);
    });

    it("refuse 169.254.169.254 (AWS metadata)", () => {
      expect(isSafeUrl("http://169.254.169.254").ok).toBe(false);
    });

    it("refuse CGNAT 100.64.0.1", () => {
      expect(isSafeUrl("http://100.64.0.1").ok).toBe(false);
    });

    it("refuse CGNAT 100.127.255.255", () => {
      expect(isSafeUrl("http://100.127.255.255").ok).toBe(false);
    });

    it("accepte 100.128.0.1 (hors CGNAT)", () => {
      expect(isSafeUrl("http://100.128.0.1").ok).toBe(true);
    });
  });

  describe("TLDs privés (SSRF)", () => {
    it("refuse .local", () => {
      expect(isSafeUrl("http://server.local").ok).toBe(false);
    });

    it("refuse .internal", () => {
      expect(isSafeUrl("http://api.internal").ok).toBe(false);
    });

    it("refuse .corp", () => {
      expect(isSafeUrl("http://intranet.corp").ok).toBe(false);
    });

    it("refuse .lan", () => {
      expect(isSafeUrl("http://router.lan").ok).toBe(false);
    });

    it("refuse .intranet", () => {
      expect(isSafeUrl("http://portal.intranet").ok).toBe(false);
    });
  });
});
