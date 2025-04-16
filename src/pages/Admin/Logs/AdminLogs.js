import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Table, DatePicker, Input, Space, Select, Button, Tag, message } from "antd";
import { SearchOutlined, FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import moment from "moment";

const { RangePicker } = DatePicker;
const { Option } = Select;

const AdminLogs = () => {
  const { userId } = useParams();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([moment().subtract(7, 'days'), moment()]);
  const [searchText, setSearchText] = useState("");
  const [actionType, setActionType] = useState("all");

  useEffect(() => {
    fetchLogs();
  }, [userId, dateRange, actionType]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const [startDate, endDate] = dateRange.map(date => date.format("YYYY-MM-DD"));
      // let url = `/api/admin/logs?startDate=${startDate}&endDate=${endDate}`;
      // if (userId) url += `&userId=${userId}`;
      // if (actionType !== "all") url += `&actionType=${actionType}`;
      // const response = await fetch(url);
      // const data = await response.json();
      // setLogs(data);
      
      // Mock data
      setLogs([
        { 
          id: 1, 
          timestamp: "2023-05-01T10:30:00", 
          userId: 1, 
          userName: "admin", 
          action: "product_create", 
          details: "Created product: Running Shoes", 
          ip: "192.168.1.1" 
        },
        { 
          id: 2, 
          timestamp: "2023-05-01T11:15:00", 
          userId: 1, 
          userName: "admin", 
          action: "order_update", 
          details: "Updated order #1001 status to Shipped", 
          ip: "192.168.1.1" 
        },
        { 
          id: 3, 
          timestamp: "2023-05-02T09:45:00", 
          userId: 2, 
          userName: "manager", 
          action: "user_block", 
          details: "Blocked user: john@example.com", 
          ip: "192.168.1.2" 
        },
        // More logs...
      ]);
    } catch (error) {
      console.error("Error fetching logs:", error);
      message.error("Failed to load logs");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleReset = () => {
    setSearchText("");
    setActionType("all");
    setDateRange([moment().subtract(7, 'days'), moment()]);
  };

  const getActionColor = (action) => {
    const actionMap = {
      product_create: "green",
      product_update: "blue",
      product_delete: "red",
      order_update: "purple",
      user_block: "orange",
      user_unblock: "cyan",
      login: "geekblue",
      logout: "gray",
    };
    return actionMap[action] || "default";
  };

  const getActionLabel = (action) => {
    return action.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const columns = [
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (text) => moment(text).format("YYYY-MM-DD HH:mm:ss"),
      sorter: (a, b) => moment(a.timestamp).unix() - moment(b.timestamp).unix(),
    },
    {
      title: "User",
      dataIndex: "userName",
      key: "userName",
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => 
        record.userName.toLowerCase().includes(value.toLowerCase()) ||
        record.details.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text) => (
        <Tag color={getActionColor(text)}>
          {getActionLabel(text)}
        </Tag>
      ),
      filters: [
        { text: "Product Create", value: "product_create" },
        { text: "Product Update", value: "product_update" },
        { text: "Product Delete", value: "product_delete" },
        { text: "Order Update", value: "order_update" },
        { text: "User Block", value: "user_block" },
        { text: "User Unblock", value: "user_unblock" },
        { text: "Login", value: "login" },
        { text: "Logout", value: "logout" },
      ],
      onFilter: (value, record) => record.action === value,
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      ellipsis: true,
    },
    {
      title: "IP Address",
      dataIndex: "ip",
      key: "ip",
    },
  ];

  return (
    <Card 
      title={userId ? `User Activity Logs (User ID: ${userId})` : "Admin Activity Logs"}
      extra={
        <Button icon={<ReloadOutlined />} onClick={fetchLogs}>
          Refresh
        </Button>
      }
    >
      <Space style={{ marginBottom: 16 }}>
        <RangePicker 
          value={dateRange} 
          onChange={setDateRange} 
          allowClear={false}
        />
        <Select 
          value={actionType} 
          onChange={setActionType} 
          style={{ width: 150 }}
        >
          <Option value="all">All Actions</Option>
          <Option value="product">Product Actions</Option>
          <Option value="order">Order Actions</Option>
          <Option value="user">User Actions</Option>
          <Option value="auth">Authentication</Option>
        </Select>
        <Input
          placeholder="Search user or details"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 250 }}
        />
        <Button icon={<FilterOutlined />} onClick={handleReset}>
          Reset Filters
        </Button>
      </Space>
      
      <Table
        columns={columns}
        dataSource={logs}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 20 }}
      />
    </Card>
  );
};

export default AdminLogs;