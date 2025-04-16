import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaChevronRight, FaCalendarAlt } from "react-icons/fa";

const LatestNews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const eventsPerPage = 6;
  
  // Simplified event data
  const events = [
    {
      id: 1,
      title: "Чемпионат мира по футболу 2026",
      description: "Расписание матчей, команды-участницы и прогнозы на предстоящий чемпионат.",
      image: "https://i.pinimg.com/736x/61/0a/fd/610afd0daaf1d1278436c3f59ca3429c.jpg",
      date: "10 июня 2026",
      category: "Футбол"
    },
    {
      id: 2,
      title: "Олимпийские игры 2028 в Лос-Анджелесе",
      description: "Подготовка к Олимпийским играм и новые спортивные дисциплины.",
      image: "https://i.pinimg.com/736x/24/40/92/24409257c5f455404042d734e0efe254.jpg",
      date: "15 мая 2025",
      category: "Олимпиада"
    },
    {
      id: 3,
      title: "Чемпионат Европы по баскетболу 2025",
      description: "Обзор команд-участниц и расписание матчей предстоящего чемпионата.",
      image: "https://i.pinimg.com/736x/55/1f/2d/551f2d86d1c7870ee986166daafd010a.jpg",
      date: "20 августа 2025",
      category: "Баскетбол"
    },
    {
      id: 4,
      title: "Мировой турнир по теннису в Мадриде",
      description: "Ключевые игроки и прогнозы на престижный теннисный турнир.",
      image: "https://i.pinimg.com/736x/98/dc/87/98dc87265885de6ff972fd1db5edfcff.jpg",
      date: "5 апреля 2025",
      category: "Теннис"
    },
    {
      id: 5,
      title: "Чемпионат мира по хоккею 2025",
      description: "Анализ шансов сборных на предстоящем чемпионате мира по хоккею.",
      image: "https://i.pinimg.com/736x/9b/8a/f5/9b8af5c23ba44f6857f8ffe1c36d1a96.jpg",
      date: "1 мая 2025",
      category: "Хоккей"
    },
    {
      id: 6,
      title: "Формула-1: Гран-при Монако",
      description: "Превью самой престижной гонки сезона на легендарной городской трассе.",
      image: "https://i.pinimg.com/736x/9f/cc/c6/9fccc6619ea92a6b7dadaf8e1b97457a.jpg",
      date: "25 мая 2025",
      category: "Автоспорт"
    }
  ];

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Get unique categories
  const categories = ["Все", ...new Set(events.map(event => event.category))];
  
  // Filter events based on search and category
  const filteredEvents = events.filter(event => {
    const matchesCategory = activeCategory === "Все" || event.category === activeCategory;
    const matchesSearch = !searchTerm || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory]);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 sm:mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
        >
          Спортивные события
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-sm sm:text-base text-gray-500 max-w-2xl mx-auto mb-6 sm:mb-10"
        >
          Следите за главными спортивными мероприятиями, соревнованиями и турнирами со всего мира.
        </motion.p>

        {/* Search */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-md mx-auto mb-6 sm:mb-8"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск событий..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 sm:px-5 py-2.5 sm:py-3 pl-10 sm:pl-12 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all text-sm sm:text-base"
            />
            <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
          </div>
        </motion.div>

        {/* Category filters */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center mb-6 sm:mb-10 gap-1.5 sm:gap-2"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              onClick={() => setActiveCategory(category)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-all duration-300 
                ${activeCategory === category
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Loading state */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="w-full h-36 sm:h-48 bg-gray-200"></div>
                <div className="p-4 sm:p-5">
                  <div className="h-3 sm:h-4 w-16 bg-gray-200 rounded-full mb-2 sm:mb-3"></div>
                  <div className="h-5 sm:h-6 w-full bg-gray-200 rounded mb-2 sm:mb-3"></div>
                  <div className="h-3 sm:h-4 w-full bg-gray-200 rounded mb-2 sm:mb-3"></div>
                  <div className="h-3 sm:h-4 w-3/4 bg-gray-200 rounded mb-2 sm:mb-3"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-2 sm:h-3 w-16 sm:w-20 bg-gray-200 rounded"></div>
                    <div className="h-2 sm:h-3 w-20 sm:w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Events grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + searchTerm + currentPage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              >
                {currentEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                  >
                    <Link to={`/events/${event.id}`} className="block">
                      <div className="relative">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-36 sm:h-48 object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-medium flex items-center">
                          <FaCalendarAlt className="mr-1 text-gray-500 text-[8px] sm:text-xs" />
                          {event.date}
                        </div>
                      </div>
                      <div className="p-3 sm:p-5">
                        <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium">
                          {event.category}
                        </span>
                        <h3 className="text-base sm:text-lg font-semibold mt-2 sm:mt-3 mb-1 sm:mb-2 line-clamp-2 hover:text-gray-700 transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                          {event.description}
                        </p>
                        <div className="flex justify-end items-center">
                          <span className="text-gray-900 text-xs sm:text-sm font-medium flex items-center group">
                            Подробнее 
                            <FaChevronRight className="ml-1 text-[10px] sm:text-xs group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
            
            {/* Pagination */}
            {filteredEvents.length > eventsPerPage && (
              <div className="flex justify-center mt-6 sm:mt-10 gap-1 sm:gap-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors text-sm ${
                      currentPage === index + 1
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
            
            {/* Empty state */}
            {filteredEvents.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 sm:py-16"
              >
                <p className="text-lg sm:text-xl text-gray-500 mb-4">По вашему запросу ничего не найдено</p>
                <button
                  onClick={() => {
                    setActiveCategory("Все");
                    setSearchTerm("");
                  }}
                  className="px-4 sm:px-6 py-1.5 sm:py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors text-sm sm:text-base"
                >
                  Сбросить фильтры
                </button>
              </motion.div>
            )}
            
            {/* View all button */}
            {filteredEvents.length > 0 && (
              <div className="text-center mt-8 sm:mt-12">
                <Link to="/events" className="inline-block px-6 sm:px-8 py-2 sm:py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg text-sm sm:text-base">
                  Смотреть все события
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default LatestNews;
