import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Button, Modal, Form, Input, Radio, Select } from "antd";
import { useSelector } from "react-redux";

export default function Checkout() {
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("PayNow");
  const [totalAmount, setTotalAmount] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const [form] = Form.useForm();

  useEffect(() => {
    const storedTotalAmount = localStorage.getItem("totalAmount");
    if (storedTotalAmount) {
      setTotalAmount(parseFloat(storedTotalAmount));
    }

    const storedIngredients = localStorage.getItem("selectedIngredients");
    if (storedIngredients) {
      const parsedIngredients = JSON.parse(storedIngredients);
    }
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/address");
      if (!res.ok) {
        throw new Error("Failed to fetch addresses!");
      }
      const data = await res.json();
      setAddresses(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddAddress = () => {
    setShowAddressModal(true);
  };

  const handleCancelAddressModal = () => {
    setShowAddressModal(false);
  };

  const onFinish = async (values) => {
    try {
      const addressData = { ...values, userId: currentUser._id };
      const response = await fetch("/api/address/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      });
      if (!response.ok) {
        throw new Error("Failed to add address!");
      }
      const data = await response.json();
      setAddresses([...addresses, data]);
      setShowAddressModal(false);
      form.resetFields();
      toast.success("Address added successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      toast.error("Please select an address.");
      return;
    }

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addressId: selectedAddress,
          paymentMethod: paymentMethod,
          totalAmount: totalAmount,
          productId: localStorage.getItem("selectedBurger"),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to place order!");
      }

      console.log(response);

      const data = await response.json();

      if (paymentMethod === "PayNow") {
        toast.success("Payment successful. Your order is being processed.");
      } else {
        toast.success("Your order will be delivered shortly.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="checkout-container">
      <Toaster />
      <Modal
        title="Add New Address"
        open={showAddressModal}
        onCancel={handleCancelAddressModal}
        footer={null}
      >
        <Form form={form} name="add_address" onFinish={onFinish}>
          <Form.Item name="phoneNumber" label="Phone Number">
            <Input />
          </Form.Item>
          <Form.Item name="state" label="State">
            <Input />
          </Form.Item>
          <Form.Item name="city" label="City">
            <Input />
          </Form.Item>
          <Form.Item name="country" label="Country">
            <Input />
          </Form.Item>
          <Form.Item name="street" label="Street">
            <Input />
          </Form.Item>
          <Form.Item name="postalCode" label="Postal Code">
            <Input />
          </Form.Item>
          <Form.Item name="houseNumber" label="House Number">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Address
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <div className="address-section">
        <h2>Select Address</h2>
        <Select
          style={{ width: "100%", marginBottom: "20px" }}
          placeholder="Select Address"
          onChange={(value) => setSelectedAddress(value)}
        >
          {addresses.map((address) => (
            <Select.Option key={address._id} value={address._id}>
              {address.street}, {address.city}, {address.state},{" "}
              {address.country}
            </Select.Option>
          ))}
        </Select>
        <Button onClick={handleAddAddress}>Add New Address</Button>
      </div>
      <div className="payment-section">
        <h2>Select Payment Method</h2>
        <Radio.Group onChange={handlePaymentMethodChange} value={paymentMethod}>
          <Radio value="PayNow">Pay Now</Radio>
          <Radio value="CashOnDelivery">Cash on Delivery</Radio>
        </Radio.Group>
        <Button onClick={handleCheckout} style={{ marginTop: "20px" }}>
          Checkout
        </Button>
      </div>
      <div className="total-amount-section">
        <h2>Total Amount: {totalAmount} BDT</h2>
      </div>
    </div>
  );
}
