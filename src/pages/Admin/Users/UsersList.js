import React, { useState, useEffect } from "react";
import { Table, Input, Space, Button, Card, message } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, UserAddOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Функция загрузки пользователей с сервера
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Если у вас настроена переменная окружения, можно использовать её для формирования URL:
      const API_URL = process.env.REACT_APP_API_URL || "";
      const response = await fetch(`${API_URL}/api/admin/users`);
      if (!response.ok) {
        throw new Error("Ошибка получения данных");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Ошибка загрузки пользователей:", error);
      message.error("Не удалось загрузить список пользователей");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Фильтрация пользователей по поисковому запросу с проверкой на наличие имени и email
  const filteredUsers = users.filter(
    (user) =>
      (user.name ? user.name.toLowerCase() : "").includes(searchText.toLowerCase()) ||
      (user.email ? user.email.toLowerCase() : "").includes(searchText.toLowerCase())
  );

  // Обработчик удаления пользователя
  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Ошибка удаления");
      }
      message.success("Пользователь успешно удалён");
      // Обновляем список после удаления
      fetchUsers();
    } catch (error) {
      console.error("Ошибка удаления пользователя:", error);
      message.error("Не удалось удалить пользователя");
    }
  };

  // Определение колонок таблицы
  const columns = [
    {
      title: "Имя",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Роль",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/admin/users/edit/${record.id}`}>
            <Button type="primary" icon={<EditOutlined />} size="small">
              Редактировать
            </Button>
          </Link>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record.id)}
          >
            Удалить
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Управление пользователями">
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Поиск пользователей"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Link to="/admin/users/new">
          <Button type="primary" icon={<UserAddOutlined />}>
            Добавить нового пользователя
          </Button>
        </Link>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default UsersList;
