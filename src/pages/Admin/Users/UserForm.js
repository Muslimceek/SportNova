import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Select, Switch, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";

const { Option } = Select;

const UserForm = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEditing = !!userId;

  useEffect(() => {
    if (isEditing) {
      // Получаем данные пользователя для редактирования
      const fetchUser = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/admin/users/${userId}`);
          if (!response.ok) {
            throw new Error("Ошибка загрузки данных пользователя");
          }
          const userData = await response.json();
          form.setFieldsValue(userData);
        } catch (error) {
          console.error("Ошибка при получении пользователя:", error);
          message.error("Не удалось загрузить данные пользователя");
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [userId, form, isEditing]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (isEditing) {
        // Обновляем данные существующего пользователя
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!response.ok) {
          throw new Error("Ошибка обновления пользователя");
        }
        message.success("Пользователь успешно обновлён");
      } else {
        // Создаем нового пользователя
        const response = await fetch('/api/admin/users/create', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!response.ok) {
          throw new Error("Ошибка создания пользователя");
        }
        message.success("Пользователь успешно создан");
      }
      navigate("/admin/users");
    } catch (error) {
      console.error("Ошибка сохранения пользователя:", error);
      message.error("Не удалось сохранить данные пользователя");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      title={isEditing ? "Редактирование пользователя" : "Создание нового пользователя"}
      extra={
        <Button type="default" icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/users")}>
          Назад к списку
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ role: "user", active: true }}
      >
        <Form.Item
          name="name"
          label="Полное имя"
          rules={[{ required: true, message: "Введите имя пользователя" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Полное имя" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Введите email" },
            { type: "email", message: "Введите корректный email" }
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        {!isEditing && (
          <Form.Item
            name="password"
            label="Пароль"
            rules={[{ required: true, message: "Введите пароль" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
          </Form.Item>
        )}

        <Form.Item
          name="role"
          label="Роль"
          rules={[{ required: true, message: "Выберите роль" }]}
        >
          <Select placeholder="Выберите роль">
            <Option value="user">Пользователь</Option>
            <Option value="admin">Администратор</Option>
          </Select>
        </Form.Item>

        <Form.Item name="active" label="Статус" valuePropName="checked">
          <Switch checkedChildren="Активен" unCheckedChildren="Заблокирован" />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SaveOutlined />} 
            loading={loading}
          >
            {isEditing ? "Обновить пользователя" : "Создать пользователя"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default UserForm;
