import { useState, useEffect } from "react";
import { Table, Button, Modal, message } from "antd";
import toast, { Toaster } from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/order");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        throw new Error("Failed to fetch orders");
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch orders");
    }
  };

  const onSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
  };

  const showCancelModal = (orderId) => {
    setCancelOrderId(orderId);
    setCancelModalVisible(true);
  };

  const handleCancelOrder = async () => {
    try {
      const response = await fetch(`/api/order/${cancelOrderId}/cancel`, {
        method: "POST",
      });
      if (response.ok) {
        message.success("Order cancelled successfully");
        fetchOrders();
      } else {
        throw new Error("Failed to cancel order");
      }
    } catch (error) {
      message.error(error.message || "Failed to cancel order");
    } finally {
      setCancelModalVisible(false);
    }
  };

  const handleDeleteOrders = async () => {
    try {
      const response = await fetch("/api/order/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderIds: selectedRowKeys }),
      });
      if (response.ok) {
        message.success("Orders deleted successfully");
        fetchOrders();
        setSelectedRowKeys([]);
      } else {
        throw new Error("Failed to delete orders");
      }
    } catch (error) {
      message.error(error.message || "Failed to delete orders");
    } finally {
      setDeleteModalVisible(false);
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
      title: "Actions",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => showCancelModal(record.key)}
          disabled={record.status !== "pending"}
        >
          Cancel Order
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
  }));

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div>
      <Toaster />
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={() => setDeleteModalVisible(true)}
          disabled={!hasSelected}
        >
          Delete Selected Orders
        </Button>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
      <Modal
        title="Confirm Cancel Order"
        visible={cancelModalVisible}
        onOk={handleCancelOrder}
        onCancel={() => setCancelModalVisible(false)}
      >
        <p>Are you sure you want to cancel this order?</p>
      </Modal>
      <Modal
        title="Confirm Delete Orders"
        visible={deleteModalVisible}
        onOk={handleDeleteOrders}
        onCancel={() => setDeleteModalVisible(false)}
      >
        <p>Are you sure you want to delete the selected orders?</p>
      </Modal>
    </div>
  );
};

export default Orders;
