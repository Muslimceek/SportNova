import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { toast } from "react-hot-toast";
import { getAuth } from "firebase/auth";

const fetchOrders = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      throw new Error("Не авторизован. Пожалуйста, войдите в систему");
    }
    const token = await user.getIdToken();
    
    const res = await fetch("http://localhost:4000/api/orders", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Ошибка загрузки заказов");
    }
    
    return res.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

const updateOrderStatus = async ({ orderId, status }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Не авторизован. Пожалуйста, войдите в систему");
  }
  const token = await user.getIdToken();
  
  const res = await fetch(`http://localhost:4000/api/orders/${orderId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Ошибка обновления статуса");
  return res.json();
};

const updateOrderComment = async ({ orderId, adminComment }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Не авторизован. Пожалуйста, войдите в систему");
  }
  const token = await user.getIdToken();
  
  const res = await fetch(`http://localhost:4000/api/orders/${orderId}/comment`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ adminComment }),
  });
  if (!res.ok) throw new Error("Ошибка сохранения комментария");
  return res.json();
};

const AdminOrdersList = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["orders"], queryFn: fetchOrders });

  const updateStatusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Статус заказа обновлен");
    },
    onError: (error) => {
      toast.error(`Ошибка: ${error.message}`);
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: updateOrderComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Комментарий сохранен");
    },
    onError: (error) => {
      toast.error(`Ошибка: ${error.message}`);
    },
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  const handleCommentSave = (orderId, comment) => {
    updateCommentMutation.mutate({ orderId, adminComment: comment });
  };

  let orders = data?.orders || [];
  if (statusFilter !== "all") orders = orders.filter(order => order.status === statusFilter);
  const toggleExpand = id => setExpandedOrderId(prev => (prev === id ? null : id));

  const StatusBadge = ({ status }) => {
    const config = {
      pending: { color: "from-yellow-400 to-orange-500", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: "Pending" },
      completed: { color: "from-green-400 to-cyan-500", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", label: "Completed" },
      cancelled: { color: "from-red-500 to-pink-600", icon: "M6 18L18 6M6 6l12 12", label: "Cancelled" },
      "in-transit": { color: "from-blue-400 to-purple-500", icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7", label: "In Transit" },
    }[status] || {
      color: "from-gray-500 to-gray-600",
      icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      label: status,
    };
    return (
      <div className={`bg-gradient-to-r ${config.color} flex items-center px-4 py-2 rounded-full space-x-2`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={config.icon} />
        </svg>
        <span className="text-sm font-medium capitalize">{config.label}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-8">
          Управление заказами
        </h1>
        <div className="flex items-center mb-8 space-x-4">
          <span className="text-gray-300 font-medium">Фильтр:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
          >
            <option value="all" className="bg-gray-800">Все статусы</option>
            <option value="pending" className="bg-gray-800">В обработке (pending)</option>
            <option value="completed" className="bg-gray-800">Завершён (completed)</option>
            <option value="cancelled" className="bg-gray-800">Отменён (cancelled)</option>
            <option value="in-transit" className="bg-gray-800">В пути (in-transit)</option>
          </select>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <ClipLoader size={40} color="#00FFFF" />
          </div>
        )}
        {error && (
          <div className="bg-red-500/20 text-red-400 p-4 rounded-xl text-center mb-4">
            {error.message}
          </div>
        )}
        {!isLoading && orders.length === 0 && (
          <div className="text-center py-12 bg-gray-900/50 rounded-xl">
            <p className="text-xl text-gray-400">Нет заказов по выбранному фильтру</p>
          </div>
        )}
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-2xl hover:shadow-nike transition-all">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white">Заказ #{order.id}</h2>
                  <p className="text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                  {order.total ? (
                    <div className="text-cyan-400 text-xl font-bold">
                      {Number(order.total).toLocaleString()} ₽
                    </div>
                  ) : (
                    <div className="text-gray-500 text-xl font-bold">Сумма не указана</div>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <StatusBadge status={order.status} />
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-6">
                <button
                  onClick={() => toggleExpand(order.id)}
                  className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all group"
                >
                  <svg
                    className={`w-5 h-5 mr-2 text-cyan-400 transition-transform ${expandedOrderId === order.id ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={expandedOrderId === order.id ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                  </svg>
                  <span className="text-gray-300 group-hover:text-white">
                    {expandedOrderId === order.id ? "Свернуть" : "Подробности"}
                  </span>
                </button>
                
                {/* Кнопки для обновления статуса */}
                {order.status !== "completed" && (
                  <button 
                    onClick={() => handleStatusChange(order.id, "completed")}
                    className="flex items-center px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all"
                    disabled={updateStatusMutation.isPending}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Завершить
                  </button>
                )}
                
                {order.status === "pending" && (
                  <button 
                    onClick={() => handleStatusChange(order.id, "in-transit")}
                    className="flex items-center px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all"
                    disabled={updateStatusMutation.isPending}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    В пути
                  </button>
                )}
                
                {order.status !== "cancelled" && order.status !== "completed" && (
                  <button 
                    onClick={() => handleStatusChange(order.id, "cancelled")}
                    className="flex items-center px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                    disabled={updateStatusMutation.isPending}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Отменить
                  </button>
                )}
              </div>
              
              {expandedOrderId === order.id && (
                <div className="mt-6 pt-6 border-t border-gray-700 space-y-6">
                  {/* Секция с товарами заказа */}
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-white mb-4">Товары в заказе</h3>
                    <div className="space-y-3">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                            <div className="flex items-center space-x-3">
                              {item.imageUrl && (
                                <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded" />
                              )}
                              <div>
                                <p className="text-white font-medium">{item.name}</p>
                                <p className="text-gray-400 text-sm">Количество: {item.quantity}</p>
                              </div>
                            </div>
                            <div className="text-cyan-400 font-bold">
                              {Number(item.price).toLocaleString()} ₽
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400">Нет данных о товарах</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Секция с информацией о доставке и комментариями */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4">Информация о доставке</h3>
                      <div className="space-y-2 text-gray-300">
                        <p>
                          <span className="font-medium">Способ:</span> {order.deliveryMethod || "Не указан"}
                        </p>
                        <p>
                          <span className="font-medium">Адрес:</span> {order.deliveryAddress || "Не указан"}
                        </p>
                        {order.trackingNumber && (
                          <p>
                            <span className="font-medium">Трекинг:</span> {order.trackingNumber}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4">Комментарий</h3>
                      <textarea
                        defaultValue={order.adminComment || ""}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                        placeholder="Добавьте служебный комментарий..."
                        rows="3"
                        onBlur={(e) => {
                          if (e.target.value !== order.adminComment) {
                            handleCommentSave(order.id, e.target.value);
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Секция истории статусов */}
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-white mb-4">История статусов</h3>
                    <div className="space-y-2">
                      {order.statusHistory?.length > 0 ? (
                        order.statusHistory.map((st, i) => (
                          <div key={i} className="flex items-center space-x-3 text-gray-300">
                            <div className="h-2 w-2 bg-cyan-400 rounded-full" />
                            <span>{new Date(st.date).toLocaleString()}</span>
                            <span className="capitalize">{st.status}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400">Нет истории статусов</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {orders.length >= 10 && (
          <div className="flex justify-center mt-8">
            <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl hover:scale-105 transition-transform text-white font-medium">
              Загрузить ещё
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersList;
