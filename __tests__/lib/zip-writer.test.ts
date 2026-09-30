import { describe, it, expect } from "vitest";
import { unzipSync, strFromU8 } from "fflate";
import { createZipWriter } from "@/lib/zip-writer";

describe("createZipWriter", () => {
  it("produit une archive relisible, fichiers stockés à l'identique", async () => {
    const zip = await createZipWriter();
    await zip.add("a.jpg", new Blob(["premier"]));
    await zip.add("b.jpg", new Blob(["second"]));
    const blob = await zip.finish();

    expect(blob.type).toBe("application/zip");
    const files = unzipSync(new Uint8Array(await blob.arrayBuffer()));
    expect(Object.keys(files)).toEqual(["a.jpg", "b.jpg"]);
    expect(strFromU8(files["a.jpg"]!)).toBe("premier");
    expect(strFromU8(files["b.jpg"]!)).toBe("second");
  });
});
