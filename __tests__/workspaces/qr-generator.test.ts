import { describe, it, expect } from "vitest";
import { wifiPayload } from "@/components/workspaces/QrGenerator";

describe("wifiPayload", () => {
  it("format standard WPA", () => {
    expect(wifiPayload("Maison", "secret123", "WPA", false)).toBe("WIFI:T:WPA;S:Maison;P:secret123;;");
  });

  it("échappe ; , : \" et l'antislash dans le nom et le mot de passe", () => {
    expect(wifiPayload("Bar;Wi-Fi", String.raw`a;b,c:d"e\f`, "WPA", false))
      .toBe(String.raw`WIFI:T:WPA;S:Bar\;Wi-Fi;P:a\;b\,c\:d\"e\\f;;`);
  });

  it("réseau ouvert : pas de mot de passe ; réseau masqué : H:true", () => {
    expect(wifiPayload("Invités", "ignored", "nopass", true)).toBe("WIFI:T:nopass;S:Invités;H:true;;");
  });
});
