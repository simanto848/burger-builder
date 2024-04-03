import User from "../models/User.js";
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

export const applyCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;
    const userId = req.user.id;

    // Fetch coupon information based on the provided coupon code
    const coupon = await Coupon.findOne({ name: couponCode });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    // Check if the user has already used this coupon
    const user = await User.findById(userId);
    if (user.usedCoupons.includes(coupon._id)) {
      return res.status(400).json({ message: "Coupon already used" });
    }

    // If not used, add the coupon to the user's usedCoupons array
    user.usedCoupons.push(coupon._id);
    await user.save();

    // Return the coupon details to the client
    res.status(200).json({ discount: coupon.discount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};
