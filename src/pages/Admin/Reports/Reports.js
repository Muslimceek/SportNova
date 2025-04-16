import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Tabs, Button, DatePicker, Space, Table, Statistic, Row, Col, Select, message } from "antd";
import { DownloadOutlined, BarChartOutlined, LineChartOutlined, PieChartOutlined } from "@ant-design/icons";
import moment from "moment";

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Reports = ({ type = "sales" }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(type);
  const [dateRange, setDateRange] = useState([moment().subtract(30, 'days'), moment()]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState("excel");

  useEffect(() => {
    fetchReportData(activeTab, dateRange);
  }, [activeTab, dateRange]);

  const fetchReportData = async (reportType, dates) => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const [startDate, endDate] = dates.map(date => date.format("YYYY-MM-DD"));
      // const response = await fetch(`/api/admin/reports/${reportType}?startDate=${startDate}&endDate=${endDate}`);
      // const data = await response.json();
      // setReportData(data);
      
      // Mock data for different report types
      let mockData = [];
      
      if (reportType === "sales") {
        mockData = [
          { date: "2023-05-01", revenue: 1250, orders: 25, averageOrderValue: 50 },
          { date: "2023-05-02", revenue: 980, orders: 18, averageOrderValue: 54.44 },
          { date: "2023-05-03", revenue: 1540, orders: 30, averageOrderValue: 51.33 },
          // More data...
        ];
      } else if (reportType === "inventory") {
        mockData = [
          { productId: 1, name: "Running Shoes", stock: 45, reorderLevel: 10, status: "In Stock" },
          { productId: 2, name: "Yoga Mat", stock: 8, reorderLevel: 15, status: "Low Stock" },
          { productId: 3, name: "Dumbbells 5kg", stock: 0, reorderLevel: 5, status: "Out of Stock" },
          // More data...
        ];
      } else if (reportType === "customers") {
        mockData = [
          { userId: 1, name: "John Doe", totalOrders: 12, totalSpent: 850, lastOrder: "2023-04-28" },
          { userId: 2, name: "Jane Smith", totalOrders: 8, totalSpent: 620, lastOrder: "2023-05-01" },
          { userId: 3, name: "Bob Johnson", totalOrders: 3, totalSpent: 210, lastOrder: "2023-03-15" },
          // More data...
        ];
      }
      
      setReportData(mockData);
    } catch (error) {
      console.error(`Error fetching ${reportType} report:`, error);
      message.error(`Failed to load ${reportType} report`);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    navigate(`/admin/reports/${key}`);
  };

  const handleExport = async () => {
    try {
      // Replace with actual API call
      // const [startDate, endDate] = dateRange.map(date => date.format("YYYY-MM-DD"));
      // const response = await fetch(`/api/admin/reports/export/${activeTab}?startDate=${startDate}&endDate=${endDate}&format=${exportFormat}`, {
      //   method: 'GET',
      // });
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `${activeTab}_report_${startDate}_to_${endDate}.${exportFormat === 'excel' ? 'xlsx' : 'csv'}`;
      // document.body.appendChild(a);
      // a.click();
      // a.remove();
      
      message.success(`Report exported as ${exportFormat.toUpperCase()}`);
    } catch (error) {
      console.error("Error exporting report:", error);
      message.error("Failed to export report");
    }
  };

  // Different columns for different report types
  const getColumns = () => {
    if (activeTab === "sales") {
      return [
        {
          title: "Date",
          dataIndex: "date",
          key: "date",
        },
        {
          title: "Revenue",
          dataIndex: "revenue",
          key: "revenue",
          render: (value) => `$${value.toFixed(2)}`,
          sorter: (a, b) => a.revenue - b.revenue,
        },
        {
          title: "Orders",
          dataIndex: "orders",
          key: "orders",
          sorter: (a, b) => a.orders - b.orders,
        },
        {
          title: "Average Order Value",
          dataIndex: "averageOrderValue",
          key: "averageOrderValue",
          render: (value) => `$${value.toFixed(2)}`,
          sorter: (a, b) => a.averageOrderValue - b.averageOrderValue,
        },
      ];
    } else if (activeTab === "inventory") {
      return [
        {
          title: "Product ID",
          dataIndex: "productId",
          key: "productId",
        },
        {
          title: "Product Name",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "Current Stock",
          dataIndex: "stock",
          key: "stock",
          sorter: (a, b) => a.stock - b.stock,
        },
        {
          title: "Reorder Level",
          dataIndex: "reorderLevel",
          key: "reorderLevel",
        },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
          render: (status) => {
            let color = "green";
            if (status === "Low Stock") color = "orange";
            if (status === "Out of Stock") color = "red";
            return <span style={{ color }}>{status}</span>;
          },
          filters: [
            { text: "In Stock", value: "In Stock" },
            { text: "Low Stock", value: "Low Stock" },
            { text: "Out of Stock", value: "Out of Stock" },
          ],
          onFilter: (value, record) => record.status === value,
        },
      ];
    } else if (activeTab === "customers") {
      return [
        {
          title: "User ID",
          dataIndex: "userId",
          key: "userId",
        },
        {
          title: "Customer Name",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "Total Orders",
          dataIndex: "totalOrders",
          key: "totalOrders",
          sorter: (a, b) => a.totalOrders - b.totalOrders,
        },
        {
          title: "Total Spent",
          dataIndex: "totalSpent",
          key: "totalSpent",
          render: (value) => `$${value.toFixed(2)}`,
          sorter: (a, b) => a.totalSpent - b.totalSpent,
        },
        {
          title: "Last Order Date",
          dataIndex: "lastOrder",
          key: "lastOrder",
          sorter: (a, b) => moment(a.lastOrder).unix() - moment(b.lastOrder).unix(),
        },
      ];
    }
    return [];
  };

  // Summary statistics for the top of the report
  const renderSummary = () => {
    if (activeTab === "sales") {
      const totalRevenue = reportData.reduce((sum, item) => sum + item.revenue, 0);
      const totalOrders = reportData.reduce((sum, item) => sum + item.orders, 0);
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      
      return (
        <Row gutter={16}>
          <Col span={8}>
            <Statistic title="Total Revenue" value={totalRevenue} prefix="$" precision={2} />
          </Col>
          <Col span={8}>
            <Statistic title="Total Orders" value={totalOrders} />
          </Col>
          <Col span={8}>
            <Statistic title="Average Order Value" value={avgOrderValue} prefix="$" precision={2} />
          </Col>
        </Row>
      );
    } else if (activeTab === "inventory") {
      const totalProducts = reportData.length;
      const outOfStock = reportData.filter(item => item.status === "Out of Stock").length;
      const lowStock = reportData.filter(item => item.status === "Low Stock").length;
      
      return (
        <Row gutter={16}>
          <Col span={8}>
            <Statistic title="Total Products" value={totalProducts} />
          </Col>
          <Col span={8}>
            <Statistic title="Out of Stock" value={outOfStock} valueStyle={{ color: 'red' }} />
          </Col>
          <Col span={8}>
            <Statistic title="Low Stock" value={lowStock} valueStyle={{ color: 'orange' }} />
          </Col>
        </Row>
      );
    } else if (activeTab === "customers") {
      const totalCustomers = reportData.length;
      const totalRevenue = reportData.reduce((sum, item) => sum + item.totalSpent, 0);
      const avgSpentPerCustomer = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
      
      return (
        <Row gutter={16}>
          <Col span={8}>
            <Statistic title="Total Customers" value={totalCustomers} />
          </Col>
          <Col span={8}>
            <Statistic title="Total Revenue" value={totalRevenue} prefix="$" precision={2} />
          </Col>
          <Col span={8}>
            <Statistic title="Avg. Spent per Customer" value={avgSpentPerCustomer} prefix="$" precision={2} />
          </Col>
        </Row>
      );
    }
    return null;
  };

  return (
    <Card title="Reports">
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab={<span><BarChartOutlined />Sales</span>} key="sales" />
        <TabPane tab={<span><LineChartOutlined />Inventory</span>} key="inventory" />
        <TabPane tab={<span><PieChartOutlined />Customers</span>} key="customers" />
      </Tabs>
      
      <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: 16 }}>
        <Space>
          <RangePicker 
            value={dateRange} 
            onChange={setDateRange} 
            allowClear={false}
          />
          <Select 
            value={exportFormat} 
            onChange={setExportFormat} 
            style={{ width: 120 }}
          >
            <Option value="excel">Excel</Option>
            <Option value="csv">CSV</Option>
            <Option value="pdf">PDF</Option>
          </Select>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            onClick={handleExport}
          >
            Export
          </Button>
        </Space>
        
        {renderSummary()}
      </Space>
      
      <Table
        columns={getColumns()}
        dataSource={reportData}
        rowKey={activeTab === "sales" ? "date" : activeTab === "inventory" ? "productId" : "userId"}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default Reports;