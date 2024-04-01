import express from "express";
import {
  getAllOrders,
  getOrderById,
  cancelOrder,
  createOrder,
} from "../controllers/order.controller.js";
import { verifyUser } from "../middleware/verifyUser.js";

const router = express.Router();

router.post("/", verifyUser, createOrder);
router.get("/", verifyUser, getAllOrders);
router.get("/:orderId", verifyUser, getOrderById);
router.post("/:orderId/cancel", verifyUser, cancelOrder);

export default router;
