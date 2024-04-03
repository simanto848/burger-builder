/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Form, Input, Button, message, DatePicker } from "antd";

const AddCoupon = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // Define form instance

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Convert expiry date to ISO format
      values.expiry = values.expiry.format("YYYY-MM-DD");

      // Send a POST request to your backend API to add the coupon
      const response = await fetch("/api/coupon/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        // Reset form fields and display success message
        form.resetFields();
        message.success("Coupon added successfully!");
      } else {
        throw new Error("Failed to add coupon");
      }
    } catch (error) {
      message.error("Failed to add coupon. Please try again later.");
    }
    setLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h1>Add Coupon</h1>
      <Form
        form={form} // Assign the form instance
        name="addCoupon"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
      >
        <Form.Item
          label="Coupon Name"
          name="name"
          rules={[{ required: true, message: "Please enter coupon name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Expiry Date"
          name="expiry"
          rules={[{ required: true, message: "Please select expiry date!" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Discount"
          name="discount"
          rules={[{ required: true, message: "Please enter discount!" }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Coupon
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddCoupon;
