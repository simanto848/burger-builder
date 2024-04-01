import express from "express";
import {
  createAddress,
  getDefaultAddress,
  getAllAddresses,
  updateAddress,
  deleteAddress,
} from "../controllers/address.controller.js";
import { verifyUser } from "../middleware/verifyUser.js";

const router = express.Router();

router.post("/create", verifyUser, createAddress);
router.get("/default", verifyUser, getDefaultAddress);
router.get("/", verifyUser, getAllAddresses);
router.put("/:id", verifyUser, updateAddress);
router.delete("/:id", verifyUser, deleteAddress);

export default router;
