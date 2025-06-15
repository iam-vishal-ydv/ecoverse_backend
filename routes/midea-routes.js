import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getAllUploadImage,
  getMyImages,
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

export default mediaRoutes;
