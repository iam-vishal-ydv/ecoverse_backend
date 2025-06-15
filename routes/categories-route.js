import express from "express";
import {
  categoriesController,
  createCategoryController,
} from "../controllers/category-controller.js";

const categoriesRoutes = express.Router();

categoriesRoutes.post("/", createCategoryController);
categoriesRoutes.get("/", categoriesController);

export default categoriesRoutes;
