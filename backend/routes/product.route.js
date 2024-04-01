import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { verifyUser } from "../middleware/verifyUser.js";

const router = express.Router();

router.post("/create", verifyUser, createProduct);
router.get("/", verifyUser, getProducts);
router.get("/:productId", verifyUser, getProduct);
router.put("/:productId", verifyUser, updateProduct);
router.delete("/:productId", verifyUser, deleteProduct);

export default router;
