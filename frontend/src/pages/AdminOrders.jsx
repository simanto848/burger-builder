/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, message, Select } from "antd";
import moment from "moment";

const { Option } = Select;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [updateStatus, setUpdateStatus] = useState("");

  useEffect(() => {
    fetchAdminOrders();
  }, []);

  const fetchAdminOrders = async () => {
    try {
      const response = await fetch("/api/order/all");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        throw new Error("Failed to fetch orders");
      }
    } catch (error) {
      message.error(error.message || "Failed to fetch orders");
    }
  };

  const showUpdateModal = (orderId) => {
    setSelectedOrderId(orderId);
    const selectedOrder = orders.find((order) => order._id === orderId);
    setUpdateStatus(selectedOrder.status);
    setUpdateModalVisible(true);
  };

  const handleUpdateStatus = async () => {
    try {
      const response = await fetch(`/api/order/${selectedOrderId}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: updateStatus }),
      });
      console.log(response);
      if (response.ok) {
        message.success("Order status updated successfully");
        fetchAdminOrders();
      } else {
        throw new Error("Failed to update order status");
      }
    } catch (error) {
      message.error(error.message || "Failed to update order status");
    } finally {
      setUpdateModalVisible(false);
    }
  };

  const columns = [
    {
      title: "Burger Name",
      dataIndex: "burgerName",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Order Status",
      dataIndex: "status",
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      render: (createdAt) =>
        moment(createdAt).format("MMMM Do YYYY, h:mm:ss a"),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Button type="primary" onClick={() => showUpdateModal(record.key)}>
          Update Status
        </Button>
      ),
    },
  ];

  const data = orders.map((order) => ({
    key: order._id,
    burgerName: order.productId.name,
    totalAmount: `$${order.totalAmount}`,
    address: order.addressId
      ? `${order.addressId.street}, ${order.addressId.city}, ${order.addressId.country}`
      : "No address available",
    status: order.status,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt,
  }));

  return (
    <div>
      <Table columns={columns} dataSource={data} />
      <Modal
        title="Update Order Status"
        open={updateModalVisible}
        onOk={handleUpdateStatus}
        onCancel={() => setUpdateModalVisible(false)}
      >
        <p>Update order status:</p>
        <Select
          value={updateStatus}
          style={{ width: 120 }}
          onChange={(value) => setUpdateStatus(value)}
        >
          <Option value="pending">Pending</Option>
          <Option value="confirmed">Confirmed</Option>
          <Option value="shipped">Shipped</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>
      </Modal>
    </div>
  );
};

export default AdminOrders;
