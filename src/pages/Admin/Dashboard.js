import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
// Add these imports for date picker and charts
import { Line, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Register Chart.js components
Chart.register(...registerables);

// ReviewItem component remains unchanged
const ReviewItem = ({ review, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(review.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="group relative p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-cyan-400 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-xl">⭐</span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-2">
            <h3 className="text-lg font-semibold text-cyan-400">{review.author}</h3>
            <span className="px-2 py-1 bg-gray-800 text-cyan-400 text-sm rounded-full">
              {review.rating}/5
            </span>
          </div>
          <p className="text-gray-300 mb-4 leading-relaxed">{review.text}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span>
                {new Date(review.date).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}
              </span>
            </div>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-3 py-1.5 text-red-400 hover:text-red-300 transition-colors rounded-lg
                         hover:bg-red-900/30 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              <span className="sr-only">Удалить</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// New loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
  </div>
);

// New empty state component
const EmptyState = ({ message }) => (
  <div className="text-center py-12 border-2 border-dashed border-gray-800 rounded-2xl">
    <svg className="w-16 h-16 mx-auto text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    <p className="text-gray-500">{message || 'Нет данных для отображения'}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()]);
  const [startDate, endDate] = dateRange;
  const [selectedStore, setSelectedStore] = useState("all");
  const [stores, setStores] = useState([]);
  const [categoryData, setCategoryData] = useState({ labels: [], data: [] });
  const [revenueData, setRevenueData] = useState({ labels: [], data: [] });
  const [chartLoading, setChartLoading] = useState(true);
  const auth = getAuth();

  // Fetch stores for filter dropdown
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        
        const token = await user.getIdToken();
        const response = await fetch("http://localhost:4000/api/admin/stores", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.ok) {
          const storesData = await response.json();
          setStores(Array.isArray(storesData) ? storesData : []);
        }
      } catch (error) {
        console.error("Ошибка загрузки магазинов:", error);
      }
    };
    
    fetchStores();
  }, [auth]);

  // Main data fetching with filters
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setChartLoading(true);
      
      try {
        const user = auth.currentUser;
        if (!user) return;
        
        const token = await user.getIdToken();
        
        // Format dates for API
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];
        
        // Fetch stats with filters
        const statsUrl = new URL("http://localhost:4000/api/admin/stats");
        statsUrl.searchParams.append("startDate", formattedStartDate);
        statsUrl.searchParams.append("endDate", formattedEndDate);
        if (selectedStore !== "all") {
          statsUrl.searchParams.append("storeId", selectedStore);
        }
        
        const [statsRes, reviewsRes, categoryRes, revenueRes] = await Promise.all([
          fetch(statsUrl.toString(), {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:4000/api/admin/reviews", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:4000/api/admin/category-stats?startDate=${formattedStartDate}&endDate=${formattedEndDate}${selectedStore !== "all" ? `&storeId=${selectedStore}` : ''}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:4000/api/admin/revenue-timeline?startDate=${formattedStartDate}&endDate=${formattedEndDate}${selectedStore !== "all" ? `&storeId=${selectedStore}` : ''}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        const statsData = await statsRes.json();
        const reviewsData = await reviewsRes.json();
        
        // Process category data for chart
        if (categoryRes.ok) {
          const categoryStats = await categoryRes.json();
          if (categoryStats && Array.isArray(categoryStats)) {
            setCategoryData({
              labels: categoryStats.map(item => item.category),
              data: categoryStats.map(item => item.count)
            });
          } else {
            setCategoryData({ labels: [], data: [] });
          }
        }
        
        // Process revenue timeline data
        if (revenueRes.ok) {
          const revenueTimeline = await revenueRes.json();
          if (revenueTimeline && Array.isArray(revenueTimeline)) {
            setRevenueData({
              labels: revenueTimeline.map(item => new Date(item.date).toLocaleDateString("ru-RU")),
              data: revenueTimeline.map(item => item.revenue)
            });
          } else {
            setRevenueData({ labels: [], data: [] });
          }
        }
        
        setStats({
          products: statsData.products || 0,
          orders: statsData.orders || 0,
          revenue: statsData.revenue || 0
        });
        
        // Ensure reviews is always an array
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      } catch (error) {
        console.error("Ошибка загрузки:", error);
      } finally {
        setLoading(false);
        setChartLoading(false);
      }
    };

    fetchData();
  }, [auth, dateRange, selectedStore, startDate, endDate]);

  const handleDeleteReview = async (reviewId) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      
      const token = await user.getIdToken();
      const res = await fetch(`http://localhost:4000/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error("Ошибка при удалении");
      setReviews(prev => prev.filter(review => review.id !== reviewId));
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  // Chart configurations
  const revenueChartData = {
    labels: revenueData.labels,
    datasets: [
      {
        label: 'Доход',
        data: revenueData.data,
        fill: true,
        backgroundColor: 'rgba(6, 182, 212, 0.2)',
        borderColor: 'rgba(6, 182, 212, 1)',
        tension: 0.4
      }
    ]
  };

  const categoryChartData = {
    labels: categoryData.labels,
    datasets: [
      {
        label: 'Продажи по категориям',
        data: categoryData.data,
        backgroundColor: [
          'rgba(6, 182, 212, 0.7)',
          'rgba(232, 121, 249, 0.7)',
          'rgba(251, 146, 60, 0.7)',
          'rgba(52, 211, 153, 0.7)',
          'rgba(99, 102, 241, 0.7)'
        ],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#9ca3af'
        }
      }
    },
    scales: {
      y: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(75, 85, 99, 0.2)' }
      },
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(75, 85, 99, 0.2)' }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <header>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Спортивный контроль
          </h1>
          <p className="mt-2 text-gray-400">Административная панель управления</p>
        </header>

        {/* Filters Section */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-semibold text-cyan-400 mb-4">Фильтры</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 mb-2">Период времени</label>
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-300 focus:ring-cyan-400 focus:border-cyan-400"
                dateFormat="dd.MM.yyyy"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Магазин</label>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-300 focus:ring-cyan-400 focus:border-cyan-400"
              >
                <option value="all">Все магазины</option>
                {stores.map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Products Card */}
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-cyan-400 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 mb-2">Товаров</p>
                    <p className="text-5xl font-bold text-cyan-400">{stats.products}</p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-xl">
                    <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Orders Card */}
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-pink-400 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 mb-2">Заказов</p>
                    <p className="text-5xl font-bold text-pink-400">{stats.orders}</p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-xl">
                    <svg className="w-8 h-8 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Revenue Card - New */}
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-green-400 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 mb-2">Доход</p>
                    <p className="text-5xl font-bold text-green-400">
                      {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(stats.revenue)}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-xl">
                    <svg className="w-8 h-8 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Timeline Chart */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-semibold text-cyan-400 mb-4">Динамика дохода</h2>
                {chartLoading ? (
                  <LoadingSpinner />
                ) : revenueData.labels.length === 0 ? (
                  <EmptyState message="Нет данных о доходах за выбранный период" />
                ) : (
                  <div className="h-80">
                    <Line data={revenueChartData} options={chartOptions} />
                  </div>
                )}
              </div>

              {/* Category Distribution Chart */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-semibold text-cyan-400 mb-4">Продажи по категориям</h2>
                {chartLoading ? (
                  <LoadingSpinner />
                ) : categoryData.labels.length === 0 ? (
                  <EmptyState message="Нет данных о категориях за выбранный период" />
                ) : (
                  <div className="h-80">
                    <Bar data={categoryChartData} options={chartOptions} />
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-cyan-400">Последние отзывы</h2>
              
              {!Array.isArray(reviews) || reviews.length === 0 ? (
                <EmptyState message="Нет новых отзывов 🏅" />
              ) : (
                <div className="grid gap-4">
                  {reviews.map((review) => (
                    <ReviewItem 
                      key={review.id} 
                      review={review} 
                      onDelete={handleDeleteReview} 
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;