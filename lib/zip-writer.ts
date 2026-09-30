/**
 * Écriture d'un ZIP au fil de l'eau avec fflate (déjà utilisé par zip-extractor).
 *
 * Les fichiers sont stockés sans recompression (ZipPassThrough) : des JPG, PNG
 * ou WebP ne gagneraient qu'un pour cent en deflate, pour beaucoup de temps.
 * Les morceaux produits sont gardés tels quels et assemblés en Blob à la fin :
 * l'archive n'est jamais recopiée d'un bloc en mémoire.
 */
export async function createZipWriter() {
  const { Zip, ZipPassThrough } = await import("fflate");
  const chunks: BlobPart[] = [];
  let resolveDone!: (blob: Blob) => void;
  let rejectDone!: (err: Error) => void;
  const done = new Promise<Blob>((res, rej) => { resolveDone = res; rejectDone = rej; });

  const zip = new Zip((err, data, final) => {
    if (err) return rejectDone(err);
    chunks.push(data as Uint8Array<ArrayBuffer>);
    if (final) resolveDone(new Blob(chunks, { type: "application/zip" }));
  });

  return {
    async add(name: string, blob: Blob) {
      const entry = new ZipPassThrough(name);
      zip.add(entry);
      entry.push(new Uint8Array(await blob.arrayBuffer()), true);
    },
    finish(): Promise<Blob> {
      zip.end();
      return done;
    },
  };
}
