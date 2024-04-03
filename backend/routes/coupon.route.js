import express from "express";
import {
  createCoupon,
  applyCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} from "../controllers/coupon.controller.js";
import { verifyUser } from "../middleware/verifyUser.js";

const router = express.Router();

router.post("/create", verifyUser, createCoupon);
router.post("/apply", verifyUser, applyCoupon);
router.get("/", verifyUser, getCoupons);
router.get("/:couponId", verifyUser, getCoupon);
router.put("/:couponId", verifyUser, updateCoupon);
router.delete("/:couponId", verifyUser, deleteCoupon);

export default router;
