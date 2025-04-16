import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all", // all, read, unread, archived
    dateRange: "all", // all, today, week, month
    searchTerm: "", // for email/name search
  });
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const { getIdToken } = useAuth();

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getIdToken();
      const { data } = await axios.get("/api/admin/contacts", {
        headers: { Authorization: `Bearer ${token}` },
        params: filters,
      });
      setMessages(data);
    } catch (error) {
      console.error("Ошибка при загрузке сообщений:", error);
    } finally {
      setLoading(false);
    }
  }, [getIdToken, filters]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleMarkAsRead = async (messageId) => {
    try {
      const token = await getIdToken();
      await axios.put(
        `/api/admin/contacts/${messageId}/status`,
        { status: "read" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(
        messages.map((msg) =>
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
    } catch (error) {
      console.error("Ошибка при отметке сообщения как прочитанное:", error);
    }
  };

  const handleArchive = async (messageId) => {
    try {
      const token = await getIdToken();
      await axios.put(
        `/api/admin/contacts/${messageId}/status`,
        { status: "archived" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(
        messages.map((msg) =>
          msg.id === messageId ? { ...msg, archived: true } : msg
        )
      );
    } catch (error) {
      console.error("Ошибка при архивации сообщения:", error);
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    
    try {
      const token = await getIdToken();
      await axios.post(
        `/api/admin/contacts/${selectedMessage.id}/reply`,
        { replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the message to show it has been replied to
      setMessages(
        messages.map((msg) =>
          msg.id === selectedMessage.id ? { ...msg, replied: true } : msg
        )
      );
      
      setReplyText("");
      setSelectedMessage(null);
    } catch (error) {
      console.error("Ошибка при отправке ответа:", error);
    }
  };

  // Replace this line with proper filtering logic
  const filteredMessages = Array.isArray(messages) ? messages.filter(msg => {
    // Filter by status
    if (filters.status === 'read' && !msg.read) return false;
    if (filters.status === 'unread' && msg.read) return false;
    if (filters.status === 'archived' && !msg.archived) return false;
    if (filters.status !== 'all' && filters.status !== 'archived' && msg.archived) return false;
    
    // Filter by search term
    if (filters.searchTerm && 
        !msg.name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) && 
        !msg.email?.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by date range
    if (filters.dateRange !== 'all' && msg.createdAt) {
      const messageDate = new Date(msg.createdAt._seconds * 1000);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      if (filters.dateRange === 'today') {
        if (messageDate < today) return false;
      } else if (filters.dateRange === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        if (messageDate < weekAgo) return false;
      } else if (filters.dateRange === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        if (messageDate < monthAgo) return false;
      }
    }
    
    return true;
  }) : [];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 tracking-tight">
        📬 Сообщения
        <span className="block mt-1 text-lg font-medium text-blue-600">
          Обратная связь от пользователей
        </span>
      </h2>

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Статус
            </label>
            <select
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="all">Все сообщения</option>
              <option value="unread">Непрочитанные</option>
              <option value="read">Прочитанные</option>
              <option value="archived">Архивированные</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Период
            </label>
            <select
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={filters.dateRange}
              onChange={(e) =>
                setFilters({ ...filters, dateRange: e.target.value })
              }
            >
              <option value="all">За все время</option>
              <option value="today">Сегодня</option>
              <option value="week">За неделю</option>
              <option value="month">За месяц</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Поиск по email/имени
            </label>
            <input
              type="text"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Введите email или имя"
              value={filters.searchTerm}
              onChange={(e) =>
                setFilters({ ...filters, searchTerm: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl p-4">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏄♂️</div>
          <p className="text-gray-500 text-lg">Пока нет новых сообщений</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`group relative p-6 rounded-2xl transition-all duration-200 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg border border-gray-100 hover:border-blue-100 ${
                !msg.read && "border-l-4 border-l-blue-500"
              } ${msg.archived ? "opacity-70" : ""}`}
            >
              {!msg.read && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    Новое
                  </span>
                </div>
              )}
              {msg.archived && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                    Архив
                  </span>
                </div>
              )}
              {msg.replied && (
                <div className="absolute top-3 right-16">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Отвечено
                  </span>
                </div>
              )}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600">👤</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{msg.name}</h3>
                    <p className="text-sm text-blue-600">{msg.email}</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{msg.message}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    {msg.createdAt
                      ? new Date(msg.createdAt._seconds * 1000).toLocaleString()
                      : "—"}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!msg.read && (
                      <button
                        onClick={() => handleMarkAsRead(msg.id)}
                        className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                      >
                        Прочитано
                      </button>
                    )}
                    {!msg.archived && (
                      <button
                        onClick={() => handleArchive(msg.id)}
                        className="px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
                      >
                        Архивировать
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedMessage(msg)}
                      className="px-2 py-1 text-xs bg-green-50 text-green-600 rounded hover:bg-green-100"
                    >
                      Ответить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-bold mb-4">
              Ответ для {selectedMessage.name}
            </h3>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Исходное сообщение:</p>
              <p className="text-gray-700">{selectedMessage.message}</p>
            </div>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-4"
              rows="5"
              placeholder="Введите ваш ответ..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Отмена
              </button>
              <button
                onClick={handleReply}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                disabled={!replyText.trim()}
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
