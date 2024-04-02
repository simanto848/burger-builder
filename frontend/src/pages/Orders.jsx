import { Button, Table, message, Modal } from "antd";
import { useState, useEffect } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/order");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleCancelOrder = async () => {
    try {
      const response = await fetch(`/api/order/${cancelOrderId}/cancel`, {
        method: "POST",
      });
      console.log(response);
      if (response.ok) {
        message.success("Order cancelled successfully");
        fetchOrders();
      } else {
        throw new Error("Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      message.error(error.message || "Failed to cancel order");
    } finally {
      setCancelModalVisible(false);
    }
  };

  const showCancelModal = (orderId) => {
    setCancelOrderId(orderId);
    setCancelModalVisible(true);
  };

  const hideCancelModal = () => {
    setCancelOrderId(null);
    setCancelModalVisible(false);
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
      render: (address) =>
        `${address.street}, ${address.city}, ${address.country}`,
    },
    {
      title: "Order Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="danger" onClick={() => showCancelModal(record.key)}>
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

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
        }}
      >
        <span
          style={{
            marginLeft: 8,
          }}
        >
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
        </span>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />

      <Modal
        title="Confirm Cancel Order"
        open={cancelModalVisible}
        onOk={handleCancelOrder}
        onCancel={hideCancelModal}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>Are you sure you want to cancel this order?</p>
      </Modal>
    </div>
  );
};

export default Orders;
