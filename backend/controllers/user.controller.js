import User from "../models/User.js";
import bcryptjs from "bcryptjs";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.email = req.body.email || user.email;
      user.profilePicture = req.body.profilePicture || user.profilePicture;

      const updatedUser = await user.save();
      return res.json(updatedUser);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const verifyPassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcryptjs.compare(
      req.body.currentPassword,
      user.password
    );
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }
    return res.json({ message: "Password verified" });
  } catch (error) {
    console.error("Error verifying password:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcryptjs.compare(
      req.body.currentPassword,
      user.password
    );
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const hashedPassword = await bcryptjs.hash(req.body.newPassword, 10);
    user.password = hashedPassword;

    const updatedUser = await user.save();
    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
