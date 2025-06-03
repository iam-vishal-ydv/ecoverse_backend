import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

async function uploadImageCloudinary(image) {
  const buffer = image.buffer || Buffer.from(await image.arrayBuffer());

  const uploadImage = await new Promise((reslove, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "ecoverse" }, (error, uploadResult) => {
        return reslove(uploadResult);
      })
      .end(buffer);
  });

  return uploadImage;
}

export default uploadImageCloudinary;
