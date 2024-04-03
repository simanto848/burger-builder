import express from "express";
import {
  createOrder,
  handleSuccess,
  handleFailure,
  handleCancellation,
  getAllOrders,
  getUserOrders,
  getOrderById,
  cancelOrder,
  deleteOrder,
  updateOrder,
} from "../controllers/order.controller.js";
import { verifyUser } from "../middleware/verifyUser.js";

const router = express.Router();

router.post("/", verifyUser, createOrder);
router.post("/payment/success/:transactionId", handleSuccess);
router.post("/payment/failure/:transactionId", handleFailure);
router.post("/payment/cancel/:transactionId", handleCancellation);
router.get("/all", verifyUser, getAllOrders);
router.get("/", verifyUser, getUserOrders);
router.get("/:orderId", verifyUser, getOrderById);
router.post("/:orderId/cancel", verifyUser, cancelOrder);
router.put("/:orderId/update", verifyUser, updateOrder);
router.delete("/", verifyUser, deleteOrder);

export default router;
