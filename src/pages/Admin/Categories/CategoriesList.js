import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Card, Space, message, Image } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import axios from "axios"; // Add axios import

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      setLoading(true);
      try {
        // Replace mock data with actual API call
        const response = await axios.get('/api/categories');
        const data = response.data;
        
        // Sort categories by order field
        const sortedCategories = data.sort((a, b) => a.order - b.order);
        setCategories(sortedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        message.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (categoryId) => {
    try {
      // Replace with actual API call
      await axios.delete(`/api/categories/${categoryId}`);
      setCategories(categories.filter(category => category.id !== categoryId));
      message.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      message.error("Failed to delete category");
    }
  };

  const handleUpdateOrder = async (categoryId, direction) => {
    try {
      // Update order via API
      await axios.put(`/api/categories/${categoryId}/order`, { direction });
      
      // Update local state to reflect the change in order
      const updatedCategories = [...categories];
      const index = updatedCategories.findIndex(cat => cat.id === categoryId);
      
      // Rest of the function remains the same
      if (direction === 'up' && index > 0) {
        // Swap with the category above
        [updatedCategories[index].order, updatedCategories[index - 1].order] = 
        [updatedCategories[index - 1].order, updatedCategories[index].order];
        
        // Swap positions in array
        [updatedCategories[index], updatedCategories[index - 1]] = 
        [updatedCategories[index - 1], updatedCategories[index]];
      } else if (direction === 'down' && index < updatedCategories.length - 1) {
        // Swap with the category below
        [updatedCategories[index].order, updatedCategories[index + 1].order] = 
        [updatedCategories[index + 1].order, updatedCategories[index].order];
        
        // Swap positions in array
        [updatedCategories[index], updatedCategories[index + 1]] = 
        [updatedCategories[index + 1], updatedCategories[index]];
      }
      
      setCategories(updatedCategories);
      message.success("Category order updated");
    } catch (error) {
      console.error("Error updating category order:", error);
      message.error("Failed to update category order");
    }
  };

  const columns = [
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
      sorter: (a, b) => a.order - b.order,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => <Image src={image || "https://via.placeholder.com/50"} width={50} height={50} alt="Category" />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Subcategories",
      dataIndex: "subcategories",
      key: "subcategories",
      render: (_, record) => record.subcategories?.length || 0,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record, index) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
          >
            <Link to={`/admin/categories/edit/${record.id}`}>Edit</Link>
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
          <Button
            icon={<ArrowUpOutlined />}
            size="small"
            disabled={index === 0}
            onClick={() => handleUpdateOrder(record.id, 'up')}
          />
          <Button
            icon={<ArrowDownOutlined />}
            size="small"
            disabled={index === categories.length - 1}
            onClick={() => handleUpdateOrder(record.id, 'down')}
          />
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title="Categories Management"
      extra={
        <Button type="primary" icon={<PlusOutlined />}>
          <Link to="/admin/categories/new">Add Category</Link>
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
    </Card>
  );
};

export default CategoriesList;