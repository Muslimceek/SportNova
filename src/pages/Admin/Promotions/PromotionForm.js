import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, DatePicker, InputNumber, Select, Switch, message } from "antd";
import { SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import moment from "moment";

const { Option } = Select;
const { RangePicker } = DatePicker;

const PromotionForm = () => {
  const { promotionId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEditing = !!promotionId;

  useEffect(() => {
    if (promotionId) {
      // Fetch promotion data for editing
      const fetchPromotion = async () => {
        setLoading(true);
        try {
          // Replace with actual API call
          // const response = await fetch(`/api/admin/promotions/${promotionId}`);
          // const promotionData = await response.json();
          
          // Mock data for now
          const promotionData = {
            name: "Summer Sale",
            discountType: "percentage",
            discountValue: 20,
            startDate: "2023-06-01",
            endDate: "2023-08-31",
            active: true,
            description: "Summer season discount on all sportswear",
            applicableProducts: ["all"],
          };
          
          // Format dates for DatePicker
          const formattedData = {
            ...promotionData,
            dateRange: [
              moment(promotionData.startDate),
              moment(promotionData.endDate)
            ]
          };
          
          form.setFieldsValue(formattedData);
        } catch (error) {
          console.error("Error fetching promotion:", error);
          message.error("Failed to load promotion data");
        } finally {
          setLoading(false);
        }
      };

      fetchPromotion();
    }
  }, [promotionId, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Если даты не нужны для дальнейшей обработки, можно не извлекать их
      // const [startDate, endDate] = values.dateRange.map(date => date.format("YYYY-MM-DD"));
      
      // Подготовьте данные для API, если потребуется
      // const dataToSend = {
      //   name: values.name,
      //   discountType: values.discountType,
      //   discountValue: values.discountValue,
      //   startDate, // startDate и endDate можно добавить сюда, если они понадобятся
      //   endDate,
      //   active: values.active,
      //   description: values.description,
      //   applicableProducts: values.applicableProducts,
      // };

      if (isEditing) {
        // Update existing promotion
        // await fetch(`/api/admin/promotions/${promotionId}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(dataToSend),
        // });
        message.success("Promotion updated successfully");
      } else {
        // Create new promotion
        // await fetch('/api/admin/promotions', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(dataToSend),
        // });
        message.success("Promotion created successfully");
      }
      navigate("/admin/promotions");
    } catch (error) {
      console.error("Error saving promotion:", error);
      message.error("Failed to save promotion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      title={isEditing ? "Edit Promotion" : "Create New Promotion"}
      extra={
        <Button type="default" icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/promotions")}>
          Back to Promotions
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          discountType: "percentage",
          active: true,
          applicableProducts: ["all"]
        }}
      >
        <Form.Item
          name="name"
          label="Promotion Name"
          rules={[{ required: true, message: "Please enter promotion name" }]}
        >
          <Input placeholder="Promotion Name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea rows={4} placeholder="Promotion description" />
        </Form.Item>

        <Form.Item
          name="discountType"
          label="Discount Type"
          rules={[{ required: true, message: "Please select discount type" }]}
        >
          <Select>
            <Option value="percentage">Percentage (%)</Option>
            <Option value="fixed">Fixed Amount ($)</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="discountValue"
          label="Discount Value"
          rules={[{ required: true, message: "Please enter discount value" }]}
        >
          <InputNumber 
            min={0} 
            max={form.getFieldValue("discountType") === "percentage" ? 100 : 1000} 
            style={{ width: '100%' }} 
          />
        </Form.Item>

        <Form.Item
          name="dateRange"
          label="Promotion Period"
          rules={[{ required: true, message: "Please select promotion period" }]}
        >
          <RangePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="applicableProducts"
          label="Applicable Products"
          rules={[{ required: true, message: "Please select applicable products" }]}
        >
          <Select mode="multiple" placeholder="Select products">
            <Option value="all">All Products</Option>
            {/* Добавьте опции продуктов, полученных из API */}
            <Option value="1">Product 1</Option>
            <Option value="2">Product 2</Option>
            <Option value="3">Product 3</Option>
          </Select>
        </Form.Item>

        <Form.Item name="active" label="Status" valuePropName="checked">
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SaveOutlined />} 
            loading={loading}
          >
            {isEditing ? "Update Promotion" : "Create Promotion"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PromotionForm;
