import cloudinary from "../services/cloudinary.js";

async function uploadImageCloudinary(image) {
  try {
    const buffer = image.buffer || Buffer.from(await image.arrayBuffer());
    if (!buffer || buffer.length === 0) {
      throw new Error("Empty file buffer");
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "ecoverse",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return reject(error);
          }
          resolve(result);
        }
      );

      uploadStream.on("error", (err) => {
        console.error("Stream error:", err);
        reject(err);
      });

      uploadStream.end(buffer);
    });

    console.log("Upload successful:", uploadResult);
    return uploadResult;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}

export default uploadImageCloudinary;
