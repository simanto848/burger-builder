import { Button, Table, message, Modal } from "antd";
import { useState, useEffect } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
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
        fetchOrders(); // Refresh order list
      } else {
        throw new Error("Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      message.error(error.message || "Failed to cancel order");
    } finally {
      setCancelModalVisible(false); // Close the modal
    }
  };

  const showCancelModal = (orderId) => {
    setCancelOrderId(orderId); // Set the order ID to be cancelled
    setCancelModalVisible(true); // Show the modal
  };

  const hideCancelModal = () => {
    setCancelOrderId(null); // Clear the order ID
    setCancelModalVisible(false); // Close the modal
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
        `${address.street}, ${address.city}, ${address.country}`, // Format the address
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
    burgerName: order.productId.name, // Retrieve product name
    totalAmount: `$${order.totalAmount}`,
    address: order.addressId, // Assuming addressId corresponds to the address
    status: order.status, // Add order status
  }));

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
        }}
      >
        <Button
          type="primary"
          onClick={start}
          disabled={!hasSelected}
          loading={loading}
        >
          Reload
        </Button>
        <span
          style={{
            marginLeft: 8,
          }}
        >
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
        </span>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />

      {/* Cancel Order Modal */}
      <Modal
        title="Confirm Cancel Order"
        visible={cancelModalVisible}
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
