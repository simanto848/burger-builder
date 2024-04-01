import Coupon from "../models/Coupon.js";

export const createCoupon = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(400).json({ message: "Access denied" });

    const { name, expiry, discount } = req.body;
    if (!name || !expiry || !discount)
      return res.status(400).json({ message: "All fields are required!" });

    const existingCoupon = await Coupon.findOne({ name });
    if (existingCoupon)
      return res.status(400).json({ message: "Coupon already exists!" });

    const coupon = new Coupon({ name, expiry, discount });
    await coupon.save();
    return res.status(201).json({ message: "Coupon created successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return res.status(200).json(coupons);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.couponId);
    return res.status(200).json(coupon);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

export const updateCoupon = async (req, res) => {
  const { name, expiry, discount } = req.body;
  if (!name || !expiry || !discount)
    return res.status(400).json({ message: "All fields are required!" });

  try {
    if (req.user.role !== "admin")
      return res.status(400).json({ message: "Access denied" });

    await Coupon.findByIdAndUpdate(req.params.couponId, {
      name,
      expiry,
      discount,
    });
    return res.status(200).json({ message: "Coupon updated successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(400).json({ message: "Access denied" });

    await Coupon.findByIdAndDelete(req.params.couponId);
    return res.status(200).json({ message: "Coupon deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
};
