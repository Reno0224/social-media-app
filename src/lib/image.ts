const SKIP_TYPES = ["image/gif", "image/svg+xml"]; // GIF animasi dan SVG tidak boleh diubah lewat canvas

interface CompressOptions {
  maxSide?: number; // sisi terpanjang dalam piksel
  quality?: number; // 0 sampai 1
}

/** Perkecil foto di browser. Kalau gagal atau tidak perlu, kembalikan file asli. */
export async function compressImage(
  file: File,
  { maxSide = 1280, quality = 0.82 }: CompressOptions = {},
): Promise<File> {
  if (SKIP_TYPES.includes(file.type)) return file;

  try {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    // sudah kecil dan ukuran file wajar: tidak perlu diubah
    if (scale === 1 && file.size <= 500 * 1024) {
      bitmap.close();
      return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }

    // latar putih supaya PNG transparan tidak berubah jadi hitam saat dijadikan JPEG
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality),
    );
    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg" });
  } catch {
    return file;
  }
}
