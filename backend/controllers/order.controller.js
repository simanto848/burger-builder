import Order from "../models/Orders.js";
import Address from "../models/Address.js";
import SSLCommerzPayment from "sslcommerz-lts";

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

    const transactionId = `SSLCZ_TEST_${new Date().getTime()}`;

    const order = new Order({
      userId,
      productId,
      totalAmount,
      transactionId: transactionId,
      addressId,
      paymentMethod,
    });

    const store_id = process.env.STORE_ID;
    const store_passwd = process.env.STORE_PASSWORD;
    const is_live = false;

    const data = {
      total_amount: totalAmount,
      currency: "BDT",
      tran_id: transactionId,
      success_url: `http://localhost:5000/api/order/payment/success/${transactionId}`,
      fail_url: `http://localhost:5000/api/order/payment/failure/${transactionId}`,
      cancel_url: `http://localhost:5000/api/order/payment/cancel/${transactionId}`,
      ipn_url: "http://yoursite.com/ipn",
      shipping_method: "Courier",
      product_name: "Computer.",
      product_category: "Electronic",
      product_profile: "general",
      cus_name: "Customer Name",
      cus_email: req.user.email,
      cus_add1: selectedAddress.street,
      cus_add2: selectedAddress.street,
      cus_city: selectedAddress.city,
      cus_state: selectedAddress.state,
      cus_postcode: selectedAddress.postalCode,
      cus_country: selectedAddress.country,
      cus_phone: "01711111111",
      cus_fax: "01711111111",
      ship_name: "Customer Name",
      ship_add1: selectedAddress.street,
      ship_add2: selectedAddress.street,
      ship_city: selectedAddress.city,
      ship_state: selectedAddress.state,
      ship_postcode: selectedAddress.postalCode,
      ship_country: selectedAddress.country,
      multi_card_name: "mastercard",
      value_a: "ref001_A",
      value_b: "ref002_B",
      value_c: "ref003_C",
      value_d: "ref004_D",
    };

    const sslcommerz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const paymentData = await sslcommerz.init(data);

    const savedOrder = await order.save();

    res
      .status(200)
      .json({ order: savedOrder, paymentUrl: paymentData.GatewayPageURL });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const handleSuccess = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const result = await Order.updateOne(
      { transactionId: transactionId },
      { $set: { paymentStatus: "paid" } }
    );

    if (!result || result.nModified === 0) {
      return res
        .status(400)
        .json({ message: "Payment not found or already updated!" });
    }

    res.redirect("http://localhost:5173/payment/success/" + transactionId);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleFailure = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const result = await Order.deleteOne({ transactionId });

    if (!result || result.deletedCount === 0) {
      return res
        .status(400)
        .json({ message: "Payment not found or already deleted!" });
    }
    res.redirect("http://localhost:5173/payment/failure/" + transactionId);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleCancellation = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const result = await Order.deleteOne({ transactionId });

    if (!result || result.deletedCount === 0) {
      return res
        .status(400)
        .json({ message: "Payment not found or already deleted!" });
    }
    res.redirect("http://localhost:5173/payment/cancel/" + transactionId);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
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
      .select("userId totalAmount status paymentMethod paymentStatus createdAt")
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
