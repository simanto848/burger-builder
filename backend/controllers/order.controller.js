import Order from "../models/Orders.js";
import Address from "../models/Address.js";

export const createOrder = async (req, res) => {
  try {
    const { productId, totalAmount, addressId, paymentMethod } = req.body;

    const userId = req.user.id;

    const selectedAddress = await Address.findOne({
      _id: addressId,
      userId: userId,
    });
    if (!selectedAddress) {
      return res.status(400).json({ message: "Invalid address!" });
    }

    const order = new Order({
      userId,
      productId,
      totalAmount,
      addressId,
      paymentMethod,
    });

    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error getting order by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId })
      .select("userId totalAmount status paymentMethod")
      .populate({
        path: "productId",
        select: "name",
      })
      .populate({
        path: "addressId",
        select: "phoneNumber state city country street postalCode houseNumber",
      });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order || order.status === "cancelled") {
      return res
        .status(400)
        .json({ message: "Order not found or already cancelled!" });
    }

    if (order.status === "delivered") {
      return res
        .status(400)
        .json({ message: "Order is already delivered. Cannot cancel." });
    }

    order.status = "cancelled";

    await order.save();

    res.json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { orderIds } = req.body;
    const userId = req.user.id;
    const orders = await Order.find({ _id: orderIds, userId });

    const canDelete = orders.every(
      (order) => order.status === "delivered" || order.status === "cancelled"
    );

    if (!canDelete) {
      return res.status(400).json({
        message:
          "Selected orders cannot be deleted as they are not in 'delivered' or 'cancelled' status.",
      });
    }

    await Order.deleteMany({ _id: orderIds, userId });
    res.json({ message: "Selected orders deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};
