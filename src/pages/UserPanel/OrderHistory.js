import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { FiPackage, FiClock, FiCheckCircle, FiAlertCircle, FiArrowRight, FiFilter, FiChevronLeft, FiChevronRight, FiHome } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";

const fetchUserOrders = async (uid) => {
  const ordersRef = collection(db, "orders");
  
  try {
    const q = query(
      ordersRef, 
      where("userId", "==", uid),
      orderBy("createdAt", "desc") // Сортировка по дате (новые сначала)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    // Check if the error is about missing index
    if (error.code === 'failed-precondition' && error.message.includes('index')) {
      console.error("Требуется индекс для Firebase. Пожалуйста, создайте его по ссылке в сообщении об ошибке.");
      // Fallback to a simpler query without ordering
      const simpleQuery = query(ordersRef, where("userId", "==", uid));
      const fallbackSnapshot = await getDocs(simpleQuery);
      // Sort the results in memory instead
      return fallbackSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => {
          // Sort by createdAt in descending order if available
          if (a.createdAt && b.createdAt) {
            return b.createdAt.seconds - a.createdAt.seconds;
          }
          return 0;
        });
    }
    throw error; // Re-throw if it's a different error
  }
};

const formatDate = (timestamp) => {
  if (!timestamp) return "Дата не указана";
  
  try {
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    console.error("Ошибка форматирования даты:", error);
    return "Некорректная дата";
  }
};

const formatPrice = (amount) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(amount || 0);
};

const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      color: "bg-yellow-100 text-yellow-800",
      icon: <FiClock className="w-4 h-4" />,
      label: "В обработке"
    },
    "in-transit": {
      color: "bg-blue-100 text-blue-800",
      icon: <FiPackage className="w-4 h-4" />,
      label: "В пути"
    },
    completed: {
      color: "bg-green-100 text-green-800",
      icon: <FiCheckCircle className="w-4 h-4" />,
      label: "Завершен"
    },
    cancelled: {
      color: "bg-red-100 text-red-800",
      icon: <FiAlertCircle className="w-4 h-4" />,
      label: "Отменен"
    },
  };

  const config = statusConfig[status] || {
    color: "bg-gray-100 text-gray-800",
    icon: <FiPackage className="w-4 h-4" />,
    label: status || "не указан"
  };

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${config.color}`}>
      {config.icon}
      <span className="ml-2">{config.label}</span>
    </div>
  );
};

const OrderCard = ({ order }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
      <div className="mb-2 md:mb-0">
        <h3 className="text-lg font-semibold">
          Заказ #{order.id.slice(-6).toUpperCase()}
        </h3>
        <p className="text-gray-500 text-sm mt-1">
          {formatDate(order.createdAt)}
        </p>
      </div>
      <OrderStatusBadge status={order.status} />
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <div>
        <p className="text-sm text-gray-500">Сумма</p>
        <p className="font-medium">{formatPrice(order.amount)}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Способ оплаты</p>
        <p className="font-medium">{order.paymentMethod || "Не указано"}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Товаров</p>
        <p className="font-medium">{order.items?.length || 0}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Адрес доставки</p>
        <p className="font-medium truncate">{order.shippingAddress || "Не указан"}</p>
      </div>
    </div>

    <button
      onClick={() => window.location.href = `/user/orders/${order.id}`}
      className="w-full md:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-opacity-90 transition-colors"
      aria-label={`Подробнее о заказе ${order.id.slice(-6).toUpperCase()}`}
    >
      <span>Подробнее о заказе</span>
      <FiArrowRight className="w-4 h-4" />
    </button>
  </div>
);

const OrderHistory = () => {
  const { currentUser, loading } = useAuth();
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userOrders", currentUser?.uid],
    queryFn: () => fetchUserOrders(currentUser.uid),
    enabled: !!currentUser && !loading,
  });

  // Фильтрация заказов по статусу
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return statusFilter === "all" 
      ? orders 
      : orders.filter(order => order.status === statusFilter);
  }, [orders, statusFilter]);

  // Пагинация
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Обработчики пагинации
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  if (!currentUser && !loading) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">
          Пожалуйста, войдите в аккаунт, чтобы просмотреть заказы.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb navigation */}
      <nav className="mb-4 text-sm text-gray-600">
        <ol className="flex space-x-2">
          <li>
            <Link to="/" className="hover:text-black transition-colors">
              <FiHome className="inline-block mr-1 -mt-1" />
              Главная
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/user" className="hover:text-black transition-colors">
              Аккаунт
            </Link>
          </li>
          <li>/</li>
          <li className="text-black">История заказов</li>
        </ol>
      </nav>

      {/* Improved header section */}
      <div className="mb-8 pb-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <FiPackage className="w-8 h-8 text-black" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">История заказов</h1>
            <p className="text-gray-500 mt-2">Все ваши предыдущие заказы</p>
          </div>
        </div>
      </div>

      {/* Фильтр по статусу */}
      {!isLoading && orders?.length > 0 && (
        <div className="sticky top-0 bg-white z-10 py-4 mb-6 border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center text-gray-600 mr-2">
              <FiFilter className="w-4 h-4 mr-1" />
              <span>Фильтр:</span>
            </div>
            {["all", "processing", "shipped", "delivered", "cancelled"].map((status) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                className={`relative px-3 py-1.5 text-sm rounded-full transition-colors flex items-center space-x-2 ${
                  statusFilter === status
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status === "all" ? (
                  <>
                    <span>Все</span>
                    {statusFilter === "all" && (
                      <FiAlertCircle 
                        className="w-4 h-4 cursor-pointer hover:text-gray-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          setStatusFilter("all");
                        }}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {status === "processing" && <FiClock className="w-4 h-4" />}
                    {status === "shipped" && <FiPackage className="w-4 h-4" />}
                    {status === "delivered" && <FiCheckCircle className="w-4 h-4" />}
                    {status === "cancelled" && <FiAlertCircle className="w-4 h-4" />}
                    <span>
                      {status === "processing" ? "В обработке" :
                       status === "shipped" ? "Отправлен" :
                       status === "delivered" ? "Доставлен" : "Отменен"}
                    </span>
                    {statusFilter === status && (
                      <FiAlertCircle 
                        className="w-4 h-4 cursor-pointer hover:text-gray-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          setStatusFilter("all");
                        }}
                      />
                    )}
                  </>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <Skeleton height={30} width={200} className="mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <Skeleton width={100} />
                    <Skeleton width={80} />
                  </div>
                ))}
              </div>
              <Skeleton height={40} />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 p-6 rounded-xl flex items-center space-x-4">
          <FiAlertCircle className="w-8 h-8 text-red-400" />
          <div>
            <h3 className="text-red-800 font-medium">Ошибка загрузки</h3>
            <p className="text-red-700 text-sm">{error.message}</p>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {statusFilter === "all" ? "Заказов не найдено" : "Заказов с таким статусом не найдено"}
            </h3>
            <p className="text-gray-500">
              {statusFilter === "all" 
                ? "Совершите свой первый заказ, и он появится здесь" 
                : "Попробуйте выбрать другой фильтр"}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {currentOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
          
          {/* Пагинация */}
          {totalPages > 1 && (
            <motion.div 
              className="flex flex-col items-center mt-8 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-2">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-black hover:bg-gray-100"
                  }`}
                >
                  <FiChevronLeft className="w-5 h-5" />
                  <span>Назад</span>
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === page
                          ? "bg-black text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-black hover:bg-gray-100"
                  }`}
                >
                  <span>Вперед</span>
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
              
              {/* Placeholder for loading indicator */}
              {isLoading && (
                <div className="mt-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </motion.div>
            )}
        </>
      )}
    </div>
  );
};

export default OrderHistory;
