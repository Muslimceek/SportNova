import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Card, Space, Switch, Tag, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const PromotionsList = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch promotions from API
    const fetchPromotions = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        // const response = await fetch('/api/admin/promotions');
        // const data = await response.json();
        // setPromotions(data);
        
        // Mock data for now
        setPromotions([
          { 
            id: 1, 
            name: "Summer Sale", 
            discountType: "percentage", 
            discountValue: 20, 
            startDate: "2023-06-01", 
            endDate: "2023-08-31", 
            active: true 
          },
          { 
            id: 2, 
            name: "Black Friday", 
            discountType: "fixed", 
            discountValue: 50, 
            startDate: "2023-11-24", 
            endDate: "2023-11-27", 
            active: false 
          },
          { 
            id: 3, 
            name: "New Year Special", 
            discountType: "percentage", 
            discountValue: 15, 
            startDate: "2023-12-25", 
            endDate: "2024-01-10", 
            active: false 
          },
        ]);
      } catch (error) {
        console.error("Error fetching promotions:", error);
        message.error("Failed to load promotions");
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const handleDelete = async (promotionId) => {
    try {
      // Replace with actual API call
      // await fetch(`/api/admin/promotions/${promotionId}`, { method: 'DELETE' });
      setPromotions(promotions.filter(promo => promo.id !== promotionId));
      message.success("Promotion deleted successfully");
    } catch (error) {
      console.error("Error deleting promotion:", error);
      message.error("Failed to delete promotion");
    }
  };

  const handleToggleStatus = async (promotionId, currentStatus) => {
    try {
      // Replace with actual API call
      // await fetch(`/api/admin/promotions/${promotionId}/status`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ active: !currentStatus }),
      // });
      
      setPromotions(promotions.map(promo => {
        if (promo.id === promotionId) {
          return { ...promo, active: !currentStatus };
        }
        return promo;
      }));
      
      message.success(`Promotion ${currentStatus ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      console.error("Error updating promotion status:", error);
      message.error("Failed to update promotion status");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Discount",
      key: "discount",
      render: (_, record) => (
        <span>
          {record.discountType === "percentage" 
            ? `${record.discountValue}%` 
            : `$${record.discountValue}`}
        </span>
      ),
    },
    {
      title: "Period",
      key: "period",
      render: (_, record) => (
        <span>
          {record.startDate} to {record.endDate}
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Tag color={record.active ? "green" : "red"}>
          {record.active ? "Active" : "Inactive"}
        </Tag>
      ),
      filters: [
        { text: "Active", value: true },
        { text: "Inactive", value: false },
      ],
      onFilter: (value, record) => record.active === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
          >
            <Link to={`/admin/promotions/edit/${record.id}`}>Edit</Link>
          </Button>
          <Switch
            checked={record.active}
            onChange={() => handleToggleStatus(record.id, record.active)}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
          />
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title="Promotions Management"
      extra={
        <Button type="primary" icon={<PlusOutlined />}>
          <Link to="/admin/promotions/new">Add Promotion</Link>
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={promotions}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default PromotionsList;