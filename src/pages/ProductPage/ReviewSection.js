// src/components/ReviewSection.js
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { StarIcon, HandThumbUpIcon, ArrowUturnLeftIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Skeleton } from '@mui/material';
import { Chart, CategoryScale, LinearScale, BarElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement);

const ReviewSection = ({ productId }) => {
  const [state, setState] = useState({
    reviews: [],
    formData: { author: '', rating: 5, text: '' },
    loading: true,
    error: null,
    sortBy: 'newest',
    showChart: true,
  });

  // Состояние для хранения ответов для каждого отзыва: { [reviewId]: [reply, reply, ...] }
  const [repliesByReview, setRepliesByReview] = useState({});
  // Состояние для активной формы ответа (хранит reviewId и данные формы)
  const [activeReply, setActiveReply] = useState({ reviewId: null, replyData: { author: '', text: '' } });

  const ratingsDistribution = state.reviews.reduce((acc, { rating }) => {
    acc[rating - 1] = (acc[rating - 1] || 0) + 1;
    return acc;
  }, Array(5).fill(0));

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/reviews/${productId}`);
      if (!res.ok) throw new Error('Ошибка загрузки отзывов');
      const data = await res.json();
      setState(prev => ({
        ...prev,
        reviews: data.sort((a, b) => new Date(b.date) - new Date(a.date)),
        loading: false
      }));
    } catch (err) {
      setState(prev => ({ ...prev, error: err.message, loading: false }));
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, [name]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, ...state.formData })
      });
      
      if (!res.ok) throw new Error('Не удалось отправить отзыв');
      
      const newReview = await res.json();
      newReview.likes = newReview.likes || 0;
      setState(prev => ({
        ...prev,
        reviews: [newReview, ...prev.reviews],
        formData: { author: '', rating: 5, text: '' }
      }));
    } catch (err) {
      // Обработка ошибок (например, можно вывести уведомление)
    }
  };

  const sortedReviews = [...state.reviews].sort((a, b) => {
    if (state.sortBy === 'highest') return b.rating - a.rating;
    if (state.sortBy === 'lowest') return a.rating - b.rating;
    return new Date(b.date) - new Date(a.date);
  });

  const ratingChartData = {
    labels: ['5 звезд', '4 звезды', '3 звезды', '2 звезды', '1 звезда'],
    datasets: [{
      label: 'Распределение оценок',
      data: ratingsDistribution,
      backgroundColor: 'rgba(16, 185, 129, 0.8)'
    }]
  };

  // --- Функция для лайка ---
  const handleLike = async (reviewId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/reviews/${reviewId}/like`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Ошибка при добавлении лайка');
      // Обновляем локальное состояние: увеличиваем лайки для нужного отзыва
      setState(prev => ({
        ...prev,
        reviews: prev.reviews.map(review =>
          review.id === reviewId ? { ...review, likes: (review.likes || 0) + 1 } : review
        )
      }));
    } catch (error) {
      console.error(error);
    }
  };

  // --- Функции для ответов ---
  // Переключение отображения формы ответа для конкретного отзыва
  const handleToggleReply = (reviewId) => {
    if (activeReply.reviewId === reviewId) {
      setActiveReply({ reviewId: null, replyData: { author: '', text: '' } });
    } else {
      setActiveReply({ reviewId, replyData: { author: '', text: '' } });
    }
  };

  // Обработка изменений в форме ответа
  const handleReplyChange = (e) => {
    const { name, value } = e.target;
    setActiveReply(prev => ({
      ...prev,
      replyData: { ...prev.replyData, [name]: value }
    }));
  };

  // Отправка ответа для отзыва
  const handleReplySubmit = async (reviewId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/reviews/${reviewId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activeReply.replyData)
      });
      if (!res.ok) throw new Error('Ошибка при отправке ответа');
      const newReply = await res.json();
      setRepliesByReview(prev => ({
        ...prev,
        [reviewId]: prev[reviewId] ? [ ...prev[reviewId], newReply ] : [newReply]
      }));
      setActiveReply({ reviewId: null, replyData: { author: '', text: '' } });
    } catch (error) {
      console.error(error);
    }
  };

  // Загрузка ответов для отзыва
  const handleLoadReplies = async (reviewId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/reviews/${reviewId}/replies`);
      if (!res.ok) throw new Error('Ошибка загрузки ответов');
      const data = await res.json();
      setRepliesByReview(prev => ({ ...prev, [reviewId]: data }));
    } catch (error) {
      console.error(error);
    }
  };

  // --- Функция для жалобы ---
  const handleReport = async (reviewId) => {
    const reporter = prompt("Введите ваше имя для жалобы:");
    const reason = prompt("Опишите причину жалобы:");
    if (!reporter || !reason) return;
    try {
      const res = await fetch(`http://localhost:4000/api/reviews/${reviewId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reporter, reason })
      });
      if (!res.ok) throw new Error('Ошибка при отправке жалобы');
      alert("Жалоба отправлена. Спасибо за обратную связь.");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <motion.h3 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-emerald-600 to-green-400 bg-clip-text text-transparent"
      >
        Отзывы о товаре
      </motion.h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
        <div className="lg:col-span-2">
          <motion.form 
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl transition-all duration-300 hover:shadow-2xl"
          >
            <h4 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Оставьте свой отзыв</h4>
            <div className="mb-3 sm:mb-4">
              <input
                type="text"
                name="author"
                value={state.formData.author}
                onChange={handleChange}
                placeholder="Ваше имя"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 bg-transparent transition-all text-sm sm:text-base"
                required
              />
            </div>
            <div className="mb-3 sm:mb-4">
              <div className="flex gap-1 sm:gap-2 mb-1 sm:mb-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setState(prev => ({
                      ...prev,
                      formData: { ...prev.formData, rating: num }
                    }))}
                    className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                      num <= state.formData.rating 
                        ? 'text-yellow-400 hover:text-yellow-500'
                        : 'text-gray-300 hover:text-gray-400'
                    }`}
                  >
                    <StarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4 sm:mb-6">
              <textarea
                name="text"
                value={state.formData.text}
                onChange={handleChange}
                placeholder="Напишите ваш отзыв..."
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 bg-transparent transition-all text-sm sm:text-base"
                rows="3"
                required
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-all hover:shadow-lg text-sm sm:text-base"
            >
              Опубликовать отзыв
            </motion.button>
          </motion.form>
        </div>

        {state.showChart && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl"
          >
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Распределение оценок</h4>
            <Bar 
              data={ratingChartData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
              }}
            />
          </motion.div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-6 items-center justify-between">
        <div className="flex items-center">
          <select
            value={state.sortBy}
            onChange={(e) => setState(prev => ({ ...prev, sortBy: e.target.value }))}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm"
          >
            <option value="newest">Сначала новые</option>
            <option value="highest">Высокий рейтинг</option>
            <option value="lowest">Низкий рейтинг</option>
          </select>
        </div>
      </div>

      {state.loading ? (
        <div className="space-y-3 sm:space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton 
              key={i}
              variant="rectangular"
              width="100%"
              height={100}
              className="rounded-xl"
            />
          ))}
        </div>
      ) : state.error ? (
        <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm sm:text-base">
          {state.error}
        </div>
      ) : (
        <AnimatePresence>
          {sortedReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg mb-3 sm:mb-4 overflow-hidden"
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4">
                  <div>
                    <h5 className="font-bold text-base sm:text-lg">{review.author}</h5>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            i < review.rating 
                              ? 'text-yellow-400' 
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">
                    {new Date(review.date).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">{review.text}</p>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-2">
                  <button 
                    className="flex items-center gap-1 sm:gap-2 text-gray-500 hover:text-emerald-600 transition-colors text-xs sm:text-sm"
                    onClick={() => handleLike(review.id)}
                  >
                    <HandThumbUpIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{review.likes || 0}</span>
                  </button>
                  <button 
                    className="flex items-center gap-1 sm:gap-2 text-gray-500 hover:text-emerald-600 transition-colors text-xs sm:text-sm"
                    onClick={() => handleToggleReply(review.id)}
                  >
                    <ArrowUturnLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Ответить</span>
                  </button>
                  <button 
                    className="flex items-center gap-1 sm:gap-2 text-gray-500 hover:text-red-600 transition-colors text-xs sm:text-sm"
                    onClick={() => handleReport(review.id)}
                  >
                    <ExclamationCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Пожаловаться</span>
                  </button>
                  <button 
                    className="text-xs sm:text-sm text-blue-500 underline"
                    onClick={() => handleLoadReplies(review.id)}
                  >
                    Показать ответы
                  </button>
                </div>
                {/* Форма ответа */}
                {activeReply.reviewId === review.id && (
                  <div className="mb-3 sm:mb-4 border p-3 sm:p-4 rounded-lg">
                    <input 
                      type="text"
                      name="author"
                      value={activeReply.replyData.author}
                      onChange={handleReplyChange}
                      placeholder="Ваше имя"
                      className="w-full px-3 py-2 mb-2 border rounded text-sm"
                      required
                    />
                    <textarea
                      name="text"
                      value={activeReply.replyData.text}
                      onChange={handleReplyChange}
                      placeholder="Ваш ответ..."
                      className="w-full px-3 py-2 mb-2 border rounded text-sm"
                      rows="2"
                      required
                    />
                    <button
                      onClick={() => handleReplySubmit(review.id)}
                      className="bg-blue-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm"
                    >
                      Отправить ответ
                    </button>
                  </div>
                )}
                {/* Вывод ответов */}
                {repliesByReview[review.id] && repliesByReview[review.id].length > 0 && (
                  <div className="ml-3 sm:ml-4 border-l pl-3 sm:pl-4">
                    {repliesByReview[review.id].map(reply => (
                      <div key={reply.id} className="mb-2">
                        <p className="text-xs sm:text-sm font-semibold">{reply.author}</p>
                        <p className="text-xs sm:text-sm">{reply.text}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(reply.date).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </section>
  );
};

export default ReviewSection;
