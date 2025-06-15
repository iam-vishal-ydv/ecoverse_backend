import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getAllUploadImage,
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
mediaRoutes.get("/get-all", getAllUploadImage);

export default mediaRoutes;
