import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getAuth } from "firebase/auth";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [statusFilter, setStatusFilter] = useState("all");
  const [responseText, setResponseText] = useState("");
  const [respondingTo, setRespondingTo] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();
        const res = await fetch("http://localhost:4000/api/admin/reviews", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.error("Ошибка загрузки отзывов:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [auth]);

  const handleDelete = useCallback(async (reviewId) => {
    setDeleteConfirmation(null);
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch(`http://localhost:4000/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Ошибка при удалении отзыва");
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    } catch (error) {
      console.error("Ошибка при удалении отзыва:", error);
    }
  }, [auth]);

  const handleStatusChange = useCallback(async (reviewId, status) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch(`http://localhost:4000/api/admin/reviews/${reviewId}/status`, {
        method: "PATCH",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error(`Ошибка при изменении статуса отзыва на ${status}`);
      
      setReviews((prev) => 
        prev.map((review) => 
          review.id === reviewId ? { ...review, status } : review
        )
      );
    } catch (error) {
      console.error("Ошибка при обновлении статуса:", error);
    }
  }, [auth]);

  const handleResponse = useCallback(async (reviewId) => {
    if (!responseText.trim()) return;
    
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch(`http://localhost:4000/api/admin/reviews/${reviewId}/respond`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ response: responseText })
      });
      
      if (!res.ok) throw new Error("Ошибка при отправке ответа");
      
      // Remove the unused 'data' variable
      await res.json();
      setReviews((prev) => 
        prev.map((review) => 
          review.id === reviewId ? { ...review, adminResponse: responseText, status: "responded" } : review
        )
      );
      
      setResponseText("");
      setRespondingTo(null);
    } catch (error) {
      console.error("Ошибка при отправке ответа:", error);
    }
  }, [auth, responseText]);

  const filteredReviews = useMemo(() => {
    if (statusFilter === "all") return reviews;
    return reviews.filter(review => review.status === statusFilter);
  }, [reviews, statusFilter]);

  const sortedReviews = useMemo(() => {
    return [...filteredReviews].sort((a, b) => {
      if (sortConfig.key === "date") {
        return sortConfig.direction === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      return sortConfig.direction === "asc"
        ? a[sortConfig.key]?.localeCompare(b[sortConfig.key])
        : b[sortConfig.key]?.localeCompare(a[sortConfig.key]);
    });
  }, [filteredReviews, sortConfig]);

  const SortButton = ({ sortKey, label }) => (
    <button
      onClick={() =>
        setSortConfig((prev) => ({
          key: sortKey,
          direction: prev.key === sortKey && prev.direction === "asc" ? "desc" : "asc",
        }))
      }
      className={`px-4 py-2 rounded-lg transition-colors ${
        sortConfig.key === sortKey ? "bg-blue-600 text-white" : "bg-gray-700 hover:bg-gray-600 text-gray-300"
      }`}
    >
      {label} {sortConfig.key === sortKey && (sortConfig.direction === "asc" ? "↑" : "↓")}
    </button>
  );

  const FilterButton = ({ value, label }) => (
    <button
      onClick={() => setStatusFilter(value)}
      className={`px-4 py-2 rounded-lg transition-colors ${
        statusFilter === value ? "bg-green-600 text-white" : "bg-gray-700 hover:bg-gray-600 text-gray-300"
      }`}
    >
      {label}
    </button>
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500", text: "На проверке" },
      approved: { color: "bg-green-500", text: "Одобрено" },
      hidden: { color: "bg-gray-500", text: "Скрыто" },
      reported: { color: "bg-red-500", text: "Жалоба" },
      flagged: { color: "bg-orange-500", text: "Помечено" },
      responded: { color: "bg-blue-500", text: "С ответом" },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`${config.color} text-white text-xs px-2 py-1 rounded-full`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-white">Модерация отзывов</h1>
        <div className="flex gap-2 flex-wrap">
          <SortButton sortKey="date" label="По дате" />
          <SortButton sortKey="author" label="По автору" />
          <SortButton sortKey="rating" label="По рейтингу" />
        </div>
      </div>
      
      <div className="mb-6 flex flex-wrap gap-2">
        <FilterButton value="all" label="Все отзывы" />
        <FilterButton value="pending" label="На проверке" />
        <FilterButton value="reported" label="Жалобы" />
        <FilterButton value="flagged" label="Помеченные" />
        <FilterButton value="approved" label="Одобренные" />
        <FilterButton value="hidden" label="Скрытые" />
        <FilterButton value="responded" label="С ответом" />
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-800 rounded-xl p-4 h-48">
              <div className="h-4 bg-gray-700 rounded w-1/3 mb-3"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="h-3 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      ) : sortedReviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Отзывов не найдено</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedReviews.map((review) => (
            <div key={review.id} className="bg-gray-800 rounded-xl p-4 shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold text-lg">{review.author}</h3>
                    {getStatusBadge(review.status || "pending")}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-gray-300">{review.rating}/5</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDeleteConfirmation(review.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                    aria-label="Удалить отзыв"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-gray-300 mb-4">{review.text}</p>
              
              {review.adminResponse && (
                <div className="bg-gray-700 p-3 rounded-lg mb-4">
                  <p className="text-sm text-gray-300 font-semibold mb-1">Ответ администратора:</p>
                  <p className="text-gray-300 text-sm">{review.adminResponse}</p>
                </div>
              )}
              
              <div className="flex justify-between items-center text-sm mb-3">
                <span className="text-gray-400">
                  {new Date(review.date).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => handleStatusChange(review.id, "approved")}
                  className={`px-3 py-1 text-xs rounded ${
                    review.status === "approved" 
                      ? "bg-green-700 text-white" 
                      : "bg-gray-700 hover:bg-green-600 text-gray-300 hover:text-white"
                  } transition-colors`}
                >
                  Одобрить
                </button>
                <button
                  onClick={() => handleStatusChange(review.id, "hidden")}
                  className={`px-3 py-1 text-xs rounded ${
                    review.status === "hidden" 
                      ? "bg-gray-600 text-white" 
                      : "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
                  } transition-colors`}
                >
                  Скрыть
                </button>
                <button
                  onClick={() => handleStatusChange(review.id, "flagged")}
                  className={`px-3 py-1 text-xs rounded ${
                    review.status === "flagged" 
                      ? "bg-orange-700 text-white" 
                      : "bg-gray-700 hover:bg-orange-600 text-gray-300 hover:text-white"
                  } transition-colors`}
                >
                  Пометить
                </button>
                <button
                  onClick={() => setRespondingTo(review.id)}
                  className={`px-3 py-1 text-xs rounded ${
                    respondingTo === review.id 
                      ? "bg-blue-700 text-white" 
                      : "bg-gray-700 hover:bg-blue-600 text-gray-300 hover:text-white"
                  } transition-colors`}
                >
                  Ответить
                </button>
              </div>
              
              {respondingTo === review.id && (
                <div className="mt-3">
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Напишите ответ на отзыв..."
                    className="w-full bg-gray-700 text-white rounded-lg p-2 text-sm"
                    rows={3}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setRespondingTo(null)}
                      className="px-3 py-1 text-xs rounded bg-gray-600 hover:bg-gray-500 text-white transition-colors"
                    >
                      Отмена
                    </button>
                    <button
                      onClick={() => handleResponse(review.id)}
                      className="px-3 py-1 text-xs rounded bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                    >
                      Отправить
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">Подтвердите удаление</h3>
            <p className="text-gray-300 mb-6">
              Вы уверены, что хотите удалить этот отзыв? Это действие нельзя отменить.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmation)}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;