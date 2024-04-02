import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  verifyPassword,
  updatePassword,
} from "../controllers/user.controller.js";
import { verifyUser } from "../middleware/verifyUser.js";

const router = express.Router();

router.get("/", verifyUser, getUserProfile);
router.put("/", verifyUser, updateUserProfile);
router.post("/verify-password", verifyUser, verifyPassword);
router.put("/update-password", verifyUser, updatePassword);

export default router;
