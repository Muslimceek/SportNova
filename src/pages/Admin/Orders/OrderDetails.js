import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Descriptions, Table, Button, Space, Divider, Tag, Steps, Select, Modal, Input, message } from "antd";
import { ArrowLeftOutlined, PrinterOutlined, MailOutlined, SaveOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import { getAuth } from "firebase/auth";

const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [statusNote, setStatusNote] = useState("");

  const auth = getAuth();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) {
          message.error("Пользователь не авторизован");
          setLoading(false);
          return;
        }
        const token = await user.getIdToken();
        // Здесь предполагается, что ваш backend слушает запросы на этот endpoint
        const response = await fetch(`http://localhost:4000/api/admin/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Ошибка загрузки данных заказа");
        }
        const data = await response.json();
        setOrder(data);
        setSelectedStatus(data.status);
      } catch (error) {
        console.error("Error fetching order details:", error);
        message.error("Не удалось загрузить данные заказа");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, auth]);

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setNoteModalVisible(true);
  };

  const handleUpdateStatus = async () => {
    setStatusLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        message.error("Пользователь не авторизован");
        setStatusLoading(false);
        return;
      }
      const token = await user.getIdToken();
      // Отправляем запрос на обновление статуса заказа
      const response = await fetch(`http://localhost:4000/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: selectedStatus,
          note: statusNote,
        }),
      });
      if (!response.ok) {
        throw new Error("Ошибка при обновлении статуса");
      }
      // Обновляем локальное состояние, можно также перезагрузить данные
      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      message.success(`Статус заказа обновлён на ${selectedStatus}`);
      setNoteModalVisible(false);
      setStatusNote("");
    } catch (error) {
      console.error("Error updating order status:", error);
      message.error("Не удалось обновить статус заказа");
    } finally {
      setStatusLoading(false);
    }
  };

  const handlePrintOrder = () => {
    window.print();
  };

  const handleSendEmail = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        message.error("Пользователь не авторизован");
        return;
      }
      const token = await user.getIdToken();
      const response = await fetch(`http://localhost:4000/api/admin/orders/${orderId}/email`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Ошибка при отправке письма");
      }
      message.success("Письмо с подтверждением отправлено клиенту");
    } catch (error) {
      console.error("Error sending email:", error);
      message.error("Не удалось отправить письмо");
    }
  };

  const handleDeleteOrder = () => {
    Modal.confirm({
      title: "Вы уверены, что хотите удалить заказ?",
      content: "Это действие необратимо.",
      okText: "Да, удалить",
      okType: "danger",
      cancelText: "Отмена",
      onOk: async () => {
        try {
          const user = auth.currentUser;
          if (!user) {
            message.error("Пользователь не авторизован");
            return;
          }
          const token = await user.getIdToken();
          const response = await fetch(`http://localhost:4000/api/admin/orders/${orderId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error("Ошибка при удалении заказа");
          }
          message.success("Заказ успешно удалён");
          navigate("/admin/orders");
        } catch (error) {
          console.error("Error deleting order:", error);
          message.error("Не удалось удалить заказ");
        }
      }
    });
  };

  const getStatusColor = (status) => {
    const statusMap = {
      pending: "orange",
      processing: "blue",
      shipped: "cyan",
      delivered: "green",
      cancelled: "red",
      refunded: "purple",
    };
    return statusMap[status] || "default";
  };

  const getStatusStep = (status) => {
    const statusSteps = {
      pending: 0,
      processing: 1,
      shipped: 2,
      delivered: 3,
      cancelled: -1,
      refunded: -1,
    };
    return statusSteps[status] !== undefined ? statusSteps[status] : 0;
  };

  const itemColumns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      render: (subtotal) => `$${subtotal.toFixed(2)}`,
    },
  ];

  if (loading || !order) {
    return (
      <Card loading={true} title="Order Details">
        Загрузка данных заказа...
      </Card>
    );
  }

  return (
    <Card
      title={`Order #${order.orderNumber}`}
      extra={
        <Space>
          <Button type="default" icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/orders")}>
            Back to Orders
          </Button>
          <Button icon={<PrinterOutlined />} onClick={handlePrintOrder}>
            Print
          </Button>
          <Button icon={<MailOutlined />} onClick={handleSendEmail}>
            Email Customer
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={handleDeleteOrder}>
            Delete
          </Button>
        </Space>
      }
    >
      <div className="order-status-section" style={{ marginBottom: 24 }}>
        <Space align="center" style={{ marginBottom: 16 }}>
          <span style={{ marginRight: 8 }}>Order Status:</span>
          <Tag color={getStatusColor(order.status)} style={{ fontSize: 16, padding: "4px 8px" }}>
            {order.status.toUpperCase()}
          </Tag>
          <Select value={selectedStatus} onChange={handleStatusChange} style={{ width: 150 }}>
            <Option value="pending">Pending</Option>
            <Option value="processing">Processing</Option>
            <Option value="shipped">Shipped</Option>
            <Option value="delivered">Delivered</Option>
            <Option value="cancelled">Cancelled</Option>
            <Option value="refunded">Refunded</Option>
          </Select>
        </Space>
        {order.status !== "cancelled" && order.status !== "refunded" && (
          <Steps current={getStatusStep(order.status)} size="small" style={{ maxWidth: 800 }}>
            <Step title="Pending" description="Order placed" />
            <Step title="Processing" description="Payment confirmed" />
            <Step title="Shipped" description="Order shipped" />
            <Step title="Delivered" description="Order delivered" />
          </Steps>
        )}
      </div>

      <Divider orientation="left">Order Information</Divider>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Order Date">
          {moment(order.date).format("YYYY-MM-DD HH:mm:ss")}
        </Descriptions.Item>
        <Descriptions.Item label="Payment Status">
          <Tag color={order.paymentStatus === "paid" ? "green" : "red"}>
            {order.paymentStatus.toUpperCase()}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Payment Method">{order.paymentMethod}</Descriptions.Item>
        <Descriptions.Item label="Shipping Method">{order.shippingMethod}</Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">Customer Information</Divider>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Name">{order.customer.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{order.customer.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{order.customer.phone}</Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">Addresses</Divider>
      <div style={{ display: "flex", gap: 16 }}>
        <Card title="Shipping Address" style={{ flex: 1 }}>
          <p>{order.shippingAddress.street}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
          </p>
          <p>{order.shippingAddress.country}</p>
        </Card>
        <Card title="Billing Address" style={{ flex: 1 }}>
          <p>{order.billingAddress.street}</p>
          <p>
            {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}
          </p>
          <p>{order.billingAddress.country}</p>
        </Card>
      </div>

      <Divider orientation="left">Order Items</Divider>
      <Table
        columns={itemColumns}
        dataSource={order.items}
        rowKey="id"
        pagination={false}
        summary={() => (
          <Table.Summary>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={4} align="right">
                <strong>Subtotal:</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>${order.subtotal.toFixed(2)}</Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={4} align="right">
                <strong>Shipping:</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>${order.shippingCost.toFixed(2)}</Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={4} align="right">
                <strong>Tax:</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>${order.tax.toFixed(2)}</Table.Summary.Cell>
            </Table.Summary.Row>
            {order.discount > 0 && (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={4} align="right">
                  <strong>Discount:</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>-${order.discount.toFixed(2)}</Table.Summary.Cell>
              </Table.Summary.Row>
            )}
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={4} align="right">
                <strong>Total:</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <strong>${order.total.toFixed(2)}</strong>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />

      <Divider orientation="left">Order History</Divider>
      <Table
        dataSource={order.notes}
        rowKey="id"
        pagination={false}
        columns={[
          {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (text) => moment(text).format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            title: "User",
            dataIndex: "user",
            key: "user",
          },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
              <Tag color={getStatusColor(status)}>
                {status.toUpperCase()}
              </Tag>
            ),
          },
          {
            title: "Note",
            dataIndex: "note",
            key: "note",
          },
        ]}
      />

      <Modal
        title="Update Order Status"
        visible={noteModalVisible}
        onCancel={() => setNoteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setNoteModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={statusLoading} onClick={handleUpdateStatus} icon={<SaveOutlined />}>
            Update Status
          </Button>,
        ]}
      >
        <p>
          Changing order status to:{" "}
          <Tag color={getStatusColor(selectedStatus)}>{selectedStatus.toUpperCase()}</Tag>
        </p>
        <TextArea
          rows={4}
          placeholder="Add a note about this status change (optional)"
          value={statusNote}
          onChange={(e) => setStatusNote(e.target.value)}
        />
      </Modal>
    </Card>
  );
};

export default OrderDetails;
