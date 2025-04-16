import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Массив элементов навигации
const navItems = [
  {
    label: "Главная",
    to: "/admin",
    svg: (
      <svg className="w-6 h-6 text-cyan-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "Товары",
    to: "/admin/products",
    svg: (
      <svg className="w-6 h-6 text-pink-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    label: "Категории",
    to: "/admin/categories",
    svg: (
      <svg className="w-6 h-6 text-purple-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    label: "Заказы",
    to: "/admin/orders",
    svg: (
      <svg className="w-6 h-6 text-green-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    label: "Пользователи",
    to: "/admin/users",
    svg: (
      <svg className="w-6 h-6 text-indigo-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    label: "Отзывы",
    to: "/admin/reviews",
    svg: (
      <svg className="w-6 h-6 text-yellow-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 16v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2z" />
      </svg>
    ),
  },
  {
    label: "Статистика",
    to: "/admin/stats",
    svg: (
      <svg className="w-6 h-6 text-blue-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    subItems: [
      { label: "Общая статистика", to: "/admin/stats" },
      { label: "Дневная статистика", to: "/admin/stats/daily" },
      { label: "Месячная статистика", to: "/admin/stats/monthly" },
      { label: "Годовая статистика", to: "/admin/stats/yearly" },
      { label: "История заказов", to: "/admin/order-history" },
    ]
  },
  {
    label: "Отчеты",
    to: "/admin/reports",
    svg: (
      <svg className="w-6 h-6 text-orange-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    subItems: [
      { label: "Все отчеты", to: "/admin/reports" },
      { label: "Отчеты по продажам", to: "/admin/reports/sales" },
      { label: "Отчеты по складу", to: "/admin/reports/inventory" },
      { label: "Отчеты по клиентам", to: "/admin/reports/customers" },
      { label: "Экспорт отчетов", to: "/admin/reports/export" },
    ]
  },
  {
    label: "Акции",
    to: "/admin/promotions",
    svg: (
      <svg className="w-6 h-6 text-red-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
  },
  {
    label: "Контакты",
    to: "/admin/contacts",
    svg: (
      <svg className="w-6 h-6 text-blue-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Логи",
    to: "/admin/logs",
    svg: (
      <svg className="w-6 h-6 text-purple-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    label: "Настройки",
    to: "/admin/settings",
    svg: (
      <svg className="w-6 h-6 text-gray-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const AdminLayout = ({ children, userProfile }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedItem, setExpandedItem] = useState(null);
  const location = useLocation();
  // Пример: локальное состояние профиля (его можно заменить на данные, полученные с сервера)
  const [profile] = useState(userProfile || { name: "Администратор", email: "admin@example.com" });

  // Пример загрузки данных профиля с сервера (раскомментируйте и адаптируйте при необходимости)
  /*
  useEffect(() => {
    fetch("/api/admin/profile")
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error("Ошибка загрузки профиля:", err));
  }, []);
  */

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (!sidebarOpen) {
      setExpandedItem(null);
    }
  };

  const toggleSubMenu = (index) => {
    if (expandedItem === index) {
      setExpandedItem(null);
    } else {
      setExpandedItem(index);
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Кнопка для мобильного меню */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-md text-white"
        onClick={toggleSidebar}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
          />
        </svg>
      </button>

      {/* Сайдбар с адаптивностью */}
      <aside 
        className={`fixed md:relative h-full z-40 overflow-hidden transition-all duration-500 ${
          sidebarOpen ? 'w-80' : 'w-0 md:w-20'
        } bg-gradient-to-b from-gray-900 to-gray-800 p-6 border-r border-gray-800 shadow-2xl`}
      >
        {/* Логотип и название панели */}
        <div className="flex items-center mb-8">
          <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h2 className={`${sidebarOpen ? 'block' : 'hidden'} ml-3 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tighter`}>
            Admin Panel
          </h2>
        </div>

        {/* Профиль администратора */}
        <div className={`${sidebarOpen ? 'flex' : 'hidden'} items-center mb-8 p-3 bg-gray-800 rounded-xl`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
            {profile.name[0]}
          </div>
          <div className="ml-3">
            <p className="text-white font-medium">{profile.name}</p>
            <p className="text-gray-400 text-sm">{profile.email}</p>
          </div>
        </div>

        {/* Навигация */}
        <nav>
          <ul className="space-y-4">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.to || 
                            (item.subItems && item.subItems.some(subItem => location.pathname === subItem.to));
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedItem === index;
              
              return (
                <li key={item.to}>
                  <div 
                    className={`flex items-center p-4 rounded-xl group hover:bg-gray-800 transition-all duration-500 ${
                      isActive ? 'bg-gray-800 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => hasSubItems ? toggleSubMenu(index) : null}
                  >
                    {hasSubItems ? (
                      <div className="flex items-center justify-between w-full cursor-pointer">
                        <div className="flex items-center">
                          {item.svg}
                          <span className={`${sidebarOpen ? 'block' : 'hidden'} text-gray-300 group-hover:text-white font-medium text-lg transition-colors duration-500 ${
                            isActive ? 'text-white' : ''
                          }`}>
                            {item.label}
                          </span>
                        </div>
                        {sidebarOpen && hasSubItems && (
                          <svg 
                            className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </div>
                    ) : (
                      <Link to={item.to} className="flex items-center w-full">
                        {item.svg}
                        <span className={`${sidebarOpen ? 'block' : 'hidden'} text-gray-300 group-hover:text-white font-medium text-lg transition-colors duration-500 ${
                          isActive ? 'text-white' : ''
                        }`}>
                          {item.label}
                        </span>
                      </Link>
                    )}
                  </div>
                  
                  {/* Подменю */}
                  {sidebarOpen && hasSubItems && isExpanded && (
                    <ul className="ml-10 mt-2 space-y-2">
                      {item.subItems.map(subItem => {
                        const isSubActive = location.pathname === subItem.to;
                        return (
                          <li key={subItem.to}>
                            <Link 
                              to={subItem.to}
                              className={`flex items-center p-2 rounded-lg hover:bg-gray-700 transition-all duration-300 ${
                                isSubActive ? 'bg-gray-700 text-white' : 'text-gray-400'
                              }`}
                            >
                              <span className="w-2 h-2 bg-gray-500 rounded-full mr-3"></span>
                              <span className="text-sm">{subItem.label}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Кнопка выхода */}
        <div className={`${sidebarOpen ? 'block' : 'hidden'} mt-auto pt-6`}>
          <Link
            to="/logout"
            className="flex items-center p-4 rounded-xl group hover:bg-gray-800 transition-all duration-500"
          >
            <svg className="w-6 h-6 text-red-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
              />
            </svg>
            <span className="text-gray-300 group-hover:text-white font-medium text-lg transition-colors duration-500">
              Выйти
            </span>
          </Link>
        </div>
      </aside>

      {/* Основной контент */}
      <main className={`flex-1 p-8 bg-gradient-to-br from-black to-gray-900 transition-all duration-500 ${sidebarOpen ? 'md:ml-0' : 'md:ml-0'}`}>
        <div className="max-w-7xl mx-auto pt-10 md:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
