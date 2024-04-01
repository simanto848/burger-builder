import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    expiry: { type: Date, required: true },
    discount: { type: Number, required: true },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("coupon", couponSchema);

export default Coupon;
