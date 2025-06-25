import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getAllUploadImage,
  getImage,
  getImagesByCategory,
  getMyImages,
  search,
  toggleLikeImage,
  toggleSaveImage,
  uploadImage,
} from "../controllers/fileUpload-controller.js";
import upload from "../middlewares/multer.js";

const mediaRoutes = express.Router();

mediaRoutes.post(
  "/upload",
  authMiddleware,
  upload.single("imageUrl"),
  uploadImage
);
mediaRoutes.get("/get-all-upload", getAllUploadImage);
mediaRoutes.get("/my-upload", authMiddleware, getMyImages);
mediaRoutes.get("/image/:id", getImage);
mediaRoutes.get("/images/category/:categoryId", getImagesByCategory);
mediaRoutes.put("/like/:id", authMiddleware, toggleLikeImage);
mediaRoutes.put("/save/:id", authMiddleware, toggleSaveImage);
mediaRoutes.post("/search", search);

export default mediaRoutes;
