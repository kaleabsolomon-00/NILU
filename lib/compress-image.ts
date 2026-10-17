// Shrinks a photo to a JPEG under maxBytes. Runs in the browser.
export async function compressImage(
  file: File,
  maxSide = 1600,
  maxBytes = 800 * 1024,
): Promise<File> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error(
      "We couldn't read that file. Please choose a JPEG or PNG photo.",
    );
  }

  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  let width = Math.round(bitmap.width * scale);
  let height = Math.round(bitmap.height * scale);

  for (let attempt = 0; attempt < 5; attempt++) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) break;
    ctx.drawImage(bitmap, 0, 0, width, height);

    for (const quality of [0.85, 0.75, 0.65, 0.55]) {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", quality),
      );
      if (blob && blob.size <= maxBytes) {
        bitmap.close();
        return new File([blob], "photo.jpg", { type: "image/jpeg" });
      }
    }
    // Still too big: make the picture smaller and try again
    width = Math.round(width * 0.8);
    height = Math.round(height * 0.8);
  }

  bitmap.close();
  throw new Error(
    "That photo is too large to process. Please try a different one.",
  );
}
