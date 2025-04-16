import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Upload, message, Select } from "antd";
import { SaveOutlined, ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const CategoryForm = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // Заменяем useState на вычисляемое значение, так как setIsEditing не требуется.
  const isEditing = Boolean(categoryId);
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch all categories for parent selection
    const fetchCategories = async () => {
      try {
        // Реализуйте реальный вызов API, если необходимо
        setCategories([
          { id: 1, name: "Sportswear" },
          { id: 2, name: "Equipment" },
          { id: 3, name: "Accessories" },
        ]);
      } catch (error) {
        console.error("Error fetching categories:", error);
        message.error("Failed to load categories");
      }
    };

    fetchCategories();

    if (categoryId) {
      // Fetch category data for editing
      const fetchCategory = async () => {
        setLoading(true);
        try {
          // Реализуйте реальный вызов API, если необходимо
          const categoryData = {
            name: "Sportswear",
            parentId: null,
            image: "https://via.placeholder.com/200",
            order: 1,
          };
          
          form.setFieldsValue(categoryData);
          setImageUrl(categoryData.image);
        } catch (error) {
          console.error("Error fetching category:", error);
          message.error("Failed to load category data");
        } finally {
          setLoading(false);
        }
      };

      fetchCategory();
    }
  }, [categoryId, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Подготовка данных формы с изображением (если есть)
      const formData = new FormData();
      formData.append("name", values.name);
      if (values.parentId) {
        formData.append("parentId", values.parentId);
      }
      if (values.image && values.image.file) {
        formData.append("image", values.image.file);
      }
      
      if (isEditing) {
        // Обновление существующей категории
        // await fetch(`/api/admin/categories/${categoryId}`, { method: 'PUT', body: formData });
        message.success("Category updated successfully");
      } else {
        // Создание новой категории
        // await fetch('/api/admin/categories', { method: 'POST', body: formData });
        message.success("Category created successfully");
      }
      navigate("/admin/categories");
    } catch (error) {
      console.error("Error saving category:", error);
      message.error("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    name: "file",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76", // Замените на реальный endpoint для загрузки
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
        // Устанавливаем URL изображения из ответа сервера
        setImageUrl(info.file.response.url);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    showUploadList: false,
  };

  return (
    <Card 
      title={isEditing ? "Edit Category" : "Create New Category"}
      extra={
        <Button type="default" icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/categories")}>
          Back to Categories
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="Category Name"
          rules={[{ required: true, message: "Please enter category name" }]}
        >
          <Input placeholder="Category Name" />
        </Form.Item>

        <Form.Item
          name="parentId"
          label="Parent Category"
        >
          <Select placeholder="Select parent category (optional)">
            <Option value={null}>None (Top Level Category)</Option>
            {categories.map(category => (
              <Option key={category.id} value={category.id}>{category.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="image"
          label="Category Image"
          valuePropName="file"
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt="Category" 
                style={{ width: 200, marginBottom: 16 }} 
              />
            )}
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </div>
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SaveOutlined />} 
            loading={loading}
          >
            {isEditing ? "Update Category" : "Create Category"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CategoryForm;
