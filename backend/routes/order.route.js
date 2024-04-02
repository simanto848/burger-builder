import express from "express";
import {
  getAllOrders,
  getOrderById,
  cancelOrder,
  createOrder,
  deleteOrder,
  handleSuccess,
  handleFailure,
  handleCancellation,
} from "../controllers/order.controller.js";
import { verifyUser } from "../middleware/verifyUser.js";

const router = express.Router();

router.post("/", verifyUser, createOrder);
router.get("/", verifyUser, getAllOrders);
router.get("/:orderId", verifyUser, getOrderById);
router.post("/:orderId/cancel", verifyUser, cancelOrder);
router.delete("/", verifyUser, deleteOrder);
router.post("/payment/success/:transactionId", handleSuccess);
router.post("/payment/failure/:transactionId", handleFailure);
router.post("/payment/cancel/:transactionId", handleCancellation);

export default router;
