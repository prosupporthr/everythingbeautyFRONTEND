

export const convertAndCompressToJpg = async (
  file: File,
  maxSizeKB = 800,
  quality = 0.85, // JPEG quality (0–1)
  onProgress?: (msg: string) => void
): Promise<File> => {
  let workingFile = file;

  const heic2any = (await import("heic2any")).default;

  onProgress?.("Checking file type...");

  // 🔹 Step 1: Convert HEIC/HEIF → JPEG blob first (browser can't decode HEIC)
  if (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif")
  ) {
    onProgress?.("Converting HEIC → JPEG...");
    const convertedBlob = (await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality,
    })) as Blob;

    workingFile = new File(
      [convertedBlob],
      file.name.replace(/\.\w+$/, ".jpg"),
      { type: "image/jpeg" }
    );
  }

  onProgress?.("Processing image...");

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = async () => {
        let { width, height } = img;

        // 🔹 Step 2: Resize large images
        if (width > 1920 || height > 1080) {
          const ratio = Math.min(1920 / width, 1080 / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Canvas not supported");

        // 🔹 Fill white background for transparent images (PNG/WebP)
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(img, 0, 0, width, height);

        let jpgFile: File | null = null;
        let currentQuality = quality;

        while (true) {
          const blob: Blob | null = await new Promise((res) =>
            canvas.toBlob((b) => res(b), "image/jpeg", currentQuality)
          );

          if (!blob) return reject("Failed to create JPEG");

          jpgFile = new File(
            [blob],
            file.name.replace(/\.\w+$/, ".jpg"),
            { type: "image/jpeg" }
          );

          const sizeKB = jpgFile.size / 1024;
          onProgress?.(`Compressing... ${Math.round(sizeKB)} KB`);

          // 🔹 Stop when size is okay or quality too low
          if (sizeKB <= maxSizeKB || currentQuality <= 0.3) {
            onProgress?.("");
            break;
          }

          currentQuality -= 0.05;
        }

        resolve(jpgFile!);
      };

      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };

    reader.onerror = () => reject("Error reading file");
    reader.readAsDataURL(workingFile);
  });
};


// import heic2any from "heic2any";

// export const convertAndCompressToPng = async (
//   file: File,
//   maxSizeKB = 800, 
//   quality = 0.85, // JPEG quality (0–1)
//   onProgress?: (msg: string) => void
// ): Promise<File> => {
//   let workingFile = file;

//   onProgress?.("Checking file type...");

//   // 🔹 Step 1: Convert HEIC → JPEG first
//   if (
//     file.type === "image/heic" ||
//     file.type === "image/heif" ||
//     file.name.toLowerCase().endsWith(".heic") ||
//     file.name.toLowerCase().endsWith(".heif")
//   ) {
//     onProgress?.("Converting HEIC → JPEG...");
//     const convertedBlob = (await heic2any({
//       blob: file,
//       toType: "image/jpeg",
//       quality,
//     })) as Blob;

//     workingFile = new File(
//       [convertedBlob],
//       file.name.replace(/\.\w+$/, ".jpg"),
//       { type: "image/jpeg" }
//     );
//   }

//   onProgress?.("Compressing image...");

//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();

//     reader.onload = (e) => {
//       const img = new Image();
//       img.onload = async () => {
//         let { width, height } = img;

//         // Scale down if too large
//         if (width > 1920 || height > 1080) {
//           const ratio = Math.min(1920 / width, 1080 / height);
//           width = width * ratio;
//           height = height * ratio;
//         }

//         const canvas = document.createElement("canvas");
//         canvas.width = width;
//         canvas.height = height;

//         const ctx = canvas.getContext("2d");
//         if (!ctx) return reject("Canvas not supported");

//         ctx.drawImage(img, 0, 0, width, height);

//         let jpegFile: File | null = null;
//         let currentQuality = quality;

//         while (true) {
//           // ✅ Use JPEG output
//           const blob: Blob | null = await new Promise((res) =>
//             canvas.toBlob((b) => res(b), "image/jpeg", currentQuality)
//           );

//           if (!blob) return reject("Failed to create JPEG");

//           jpegFile = new File(
//             [blob],
//             workingFile.name.replace(/\.\w+$/, ".jpg"),
//             { type: "image/jpeg" }
//           );

//           const sizeKB = jpegFile.size / 1024;
//           onProgress?.(`Compressing... ${Math.round(sizeKB)} KB`);

//           // Stop if size is within limit or quality too low
//           if (sizeKB <= maxSizeKB || currentQuality <= 0.3) {
//             onProgress?.("");
//             break;
//           }

//           // Lower quality gradually
//           currentQuality -= 0.05;
//         }

//         resolve(jpegFile!);
//       };

//       if (e.target?.result) {
//         img.src = e.target.result as string;
//       }
//     };

//     reader.onerror = () => reject("Error reading file");
//     reader.readAsDataURL(workingFile);
//   });
// };
