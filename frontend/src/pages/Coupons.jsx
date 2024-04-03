import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, DatePicker, message } from "antd";
import toast, { Toaster } from "react-hot-toast";
import moment from "moment";
import { Link } from "react-router-dom";

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updateCouponData, setUpdateCouponData] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch("/api/coupon");
      if (response.ok) {
        const data = await response.json();
        setCoupons(data);
      } else {
        throw new Error("Failed to fetch coupons");
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch coupons");
    }
  };

  const onSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
  };

  const showUpdateModal = (coupon) => {
    setUpdateCouponData(coupon);
    setUpdateModalVisible(true);
    form.setFieldsValue({
      name: coupon.name,
      expiry: moment(coupon.expiry),
      discount: coupon.discount,
    });
  };

  const handleUpdateCoupon = async () => {
    try {
      const values = await form.validateFields();
      const response = await fetch(`/api/coupon/${updateCouponData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        message.success("Coupon updated successfully");
        fetchCoupons();
        setUpdateModalVisible(false);
      } else {
        throw new Error("Failed to update coupon");
      }
    } catch (error) {
      message.error(error.message || "Failed to update coupon");
    }
  };

  const handleDeleteCoupons = async () => {
    if (!selectedRowKeys.length) {
      message.error("Please select coupons to delete");
      return;
    }

    Modal.confirm({
      title: "Confirm Delete Coupons",
      content: "Are you sure you want to delete the selected coupons?",
      onOk: async () => {
        try {
          const deletePromises = selectedRowKeys.map(async (couponId) => {
            const response = await fetch(`/api/coupon/${couponId}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (!response.ok) {
              throw new Error(`Failed to delete coupon with ID: ${couponId}`);
            }
          });

          await Promise.all(deletePromises);

          message.success("Coupons deleted successfully");
          fetchCoupons();
          setSelectedRowKeys([]);
        } catch (error) {
          message.error(error.message || "Failed to delete coupons");
        }
      },
      onCancel: () => {
        // Do nothing if cancel is clicked
      },
    });
  };

  const columns = [
    {
      title: "Coupon Name",
      dataIndex: "name",
    },
    {
      title: "Expiry",
      dataIndex: "expiry",
    },
    {
      title: "Discount",
      dataIndex: "discount",
    },
    {
      title: "Actions",
      render: (_, coupon) => (
        <Button type="primary" onClick={() => showUpdateModal(coupon)}>
          Update
        </Button>
      ),
    },
  ];

  const data = coupons.map((coupon) => ({
    key: coupon._id,
    _id: coupon._id,
    name: coupon.name,
    expiry: coupon.expiry,
    discount: coupon.discount,
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
          onClick={handleDeleteCoupons}
          disabled={!hasSelected}
        >
          Delete Selected Coupons
        </Button>
        <Button
          type="primary"
          onClick={() => setUpdateModalVisible(true)}
          style={{ marginLeft: 16, textDecoration: "none" }}
        >
          <Link to="/add-coupon">Add Coupon</Link>
        </Button>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
      <Modal
        title="Update Coupon"
        visible={updateModalVisible}
        onOk={handleUpdateCoupon}
        onCancel={() => setUpdateModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Coupon Name"
            rules={[{ required: true, message: "Please enter coupon name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="expiry"
            label="Expiry Date"
            rules={[{ required: true, message: "Please select expiry date" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="discount"
            label="Discount"
            rules={[{ required: true, message: "Please enter discount" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
