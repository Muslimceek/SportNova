import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronRight, Star, Zap, Sparkles } from "lucide-react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

// Add CSS custom property for card heights
const CARD_STYLES = {
  "--card-height": "clamp(320px, 70vh, 380px)", // Responsive height using clamp
};

const fetchCategories = async () => {
  const res = await fetch(`${API_URL}/api/categories`);
  if (!res.ok) throw new Error("Ошибка загрузки данных");
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Некорректный формат данных");
  return data;
};

const localize = (val, fallback) =>
  !val ? fallback : typeof val === "string" ? val : String(val.ru || val.en || fallback);

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
  hover: {
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { type: "spring", stiffness: 400, damping: 20 },
  },
  tap: {
    scale: 0.98,
    transition: { type: "spring", stiffness: 400, damping: 17 },
  },
};

const HeroCarousel = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 600000,
  });

  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragState, setDragState] = useState({ isDragging: false, startX: 0, scrollLeft: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const scroll = useCallback((dir) => {
    if (!scrollRef.current) return;
    const amt = scrollRef.current.offsetWidth * 0.7;
    scrollRef.current.scrollTo({
      left: scrollRef.current.scrollLeft + (dir === "left" ? -amt : amt),
      behavior: "smooth",
    });
  }, []);

  const handleMouseDown = (e) => {
    setDragState({
      isDragging: true,
      startX: e.pageX - scrollRef.current.offsetLeft,
      scrollLeft: scrollRef.current.scrollLeft,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragState.isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = dragState.scrollLeft - (x - dragState.startX) * 2;
  };

  // Add touch event handlers for mobile
  const handleTouchStart = (e) => {
    setDragState({
      isDragging: true,
      startX: e.touches[0].pageX - scrollRef.current.offsetLeft,
      scrollLeft: scrollRef.current.scrollLeft,
    });
  };

  const handleTouchMove = (e) => {
    if (!dragState.isDragging) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - dragState.startX) * 1.5; // Adjust sensitivity
    scrollRef.current.scrollLeft = dragState.scrollLeft - walk;
  };

  const endDrag = () => setDragState((state) => ({ ...state, isDragging: false }));

  useEffect(() => {
    const handleScroll = () => {
      const amt = scrollRef.current.offsetWidth * 0.7;
      setActiveIndex(Math.round(scrollRef.current.scrollLeft / amt));
    };
    const container = scrollRef.current;
    container && container.addEventListener("scroll", handleScroll);
    return () => container && container.removeEventListener("scroll", handleScroll);
  }, []);

  const renderContent = useCallback(() => {
    if (isLoading)
      return (
        <AnimatePresence>
          {Array.from({ length: 4 }).map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex-shrink-0 min-w-[16rem] w-[calc(100vw-2rem)] sm:w-[calc(50%-1.5rem)] md:w-[calc(33.333%-1.5rem)] lg:w-80 max-w-sm h-[var(--card-height)] bg-gradient-to-br from-gray-100/80 to-gray-200/80 dark:from-zinc-800/80 dark:to-zinc-700/80 rounded-2xl overflow-hidden shadow-lg backdrop-blur-sm"
              style={CARD_STYLES}
              aria-hidden="true"
            >
              <div className="relative h-full w-full p-6 flex flex-col justify-between">
                <div className="w-2/3 h-6 bg-gray-300/70 dark:bg-zinc-600/70 rounded-lg animate-pulse"></div>
                <div className="space-y-3">
                  <div className="w-full h-4 bg-gray-300/70 dark:bg-zinc-600/70 rounded-lg animate-pulse"></div>
                  <div className="w-4/5 h-4 bg-gray-300/70 dark:bg-zinc-600/70 rounded-lg animate-pulse"></div>
                  <div className="w-full h-12 bg-gray-300/70 dark:bg-zinc-600/70 rounded-full mt-4 animate-pulse"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      );

    if (isError)
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center justify-center w-full h-80 text-red-500 font-medium space-y-6 px-4"
        >
          <div className="relative">
            <Zap className="w-16 h-16 text-red-500/20 absolute -top-1 -left-1 animate-pulse" />
            <Zap className="w-16 h-16 relative z-10" />
          </div>
          <p className="text-xl text-center">Ошибка загрузки: {error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-500/20 font-medium"
          >
            Попробовать снова
          </button>
        </motion.div>
      );

    if (!data?.length)
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center justify-center w-full h-80 text-gray-500 dark:text-gray-400 font-medium space-y-6 px-4"
        >
          <div className="relative">
            <Star className="w-16 h-16 text-yellow-500/20 absolute -top-1 -left-1 animate-pulse" />
            <Star className="w-16 h-16 relative z-10" />
          </div>
          <p className="text-xl text-center">Категории пока не добавлены</p>
          <Link
            to="/admin/categories"
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/20 font-medium"
          >
            Добавить категории
          </Link>
        </motion.div>
      );

    return (
      <AnimatePresence>
        {data.map((item, index) => {
          const name = localize(item.name, "Без названия");
          const description = localize(item.description, "Описание категории");
          const active = activeIndex === index;
          return (
            <motion.article
              key={item.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover="hover"
              whileTap="tap"
              style={CARD_STYLES}
              className={`flex-shrink-0 min-w-[16rem] w-[calc(100vw-2rem)] sm:w-[calc(50%-1.5rem)] md:w-[calc(33.333%-1.5rem)] lg:w-80 max-w-sm h-[var(--card-height)] snap-center rounded-2xl overflow-hidden transition-all duration-300 ${
                active
                  ? "ring-2 ring-blue-500/50 dark:ring-blue-400/50 shadow-xl shadow-blue-500/10 dark:shadow-blue-400/5"
                  : "ring-1 ring-gray-200/50 dark:ring-zinc-700/50 shadow-lg"
              } hover:ring-2 hover:ring-blue-400/70 dark:hover:ring-blue-300/70`}
              role="listitem"
              tabIndex={0}
              aria-label={`Категория: ${name}`}
            >
              <figure className="relative h-full w-full">
                <img
                  src={item.image || "/placeholder.jpg"}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out"
                  loading="lazy"
                  onError={(e) => (e.target.src = "/placeholder.jpg")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {item.isPopular && (
                  <div className="absolute top-4 right-4 z-10">
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.4, type: "spring" }}
                      className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-4 py-1.5 rounded-full text-xs font-bold flex items-center shadow-lg"
                    >
                      <Sparkles className="w-3 h-3 mr-1.5" /> Популярное
                    </motion.div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-sm bg-gradient-to-t from-black/60 to-transparent">
                  <motion.h2
                    className="text-white text-2xl font-bold mb-2 drop-shadow-sm tracking-tight font-['Montserrat']"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  >
                    {name}
                  </motion.h2>
                  <motion.p
                    className="text-white/90 text-sm mb-5 line-clamp-2 leading-relaxed font-['Montserrat']"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  >
                    {description}
                  </motion.p>
                  <Link
                    to={`/catalog?category=${encodeURIComponent(item.id)}`}
                    className="group flex items-center justify-center gap-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-6 py-3.5 rounded-full font-medium text-sm hover:bg-white dark:hover:bg-zinc-800 hover:shadow-lg transition-all duration-300 w-full font-['Montserrat']"
                  >
                    Смотреть товары
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </motion.span>
                  </Link>
                </div>
              </figure>
            </motion.article>
          );
        })}
      </AnimatePresence>
    );
  }, [data, isError, isLoading, error, activeIndex]);

  return (
    <section className="relative py-10 sm:py-16 overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800 font-['Montserrat']">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-10 gap-2 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-1 sm:space-y-2"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight font-['Montserrat']">
              Популярные категории
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-lg font-['Montserrat']">
              Исследуйте наши лучшие коллекции спортивных товаров
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to="/catalog"
              className="group flex items-center gap-1 sm:gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors font-medium text-sm sm:text-base"
            >
              Смотреть все
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5" />
              </motion.span>
            </Link>
          </motion.div>
        </div>
        <div className="relative">
          {data?.length > 0 && (
            <>
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isHovering || dragState.isDragging ? 1 : 0.7, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scroll("left")}
                className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-700 text-black dark:text-white rounded-full shadow-lg p-2 sm:p-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                aria-label="Прокрутить влево"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: isHovering || dragState.isDragging ? 1 : 0.7, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scroll("right")}
                className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-700 text-black dark:text-white rounded-full shadow-lg p-2 sm:p-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                aria-label="Прокрутить вправо"
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </motion.button>
            </>
          )}
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth space-x-3 sm:space-x-6 px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 no-scrollbar"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
              endDrag();
              setIsHovering(false);
            }}
            onMouseUp={endDrag}
            onMouseEnter={() => setIsHovering(true)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={endDrag}
            style={{ cursor: dragState.isDragging ? "grabbing" : "grab" }}
            role="list"
            aria-live="polite"
          >
            {renderContent()}
          </div>
        </div>
        {data?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-8"
          >
            {data.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (scrollRef.current)
                    scrollRef.current.scrollTo({
                      left: idx * scrollRef.current.offsetWidth * 0.7,
                      behavior: "smooth",
                    });
                }}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  activeIndex === idx
                    ? "bg-blue-500 w-6 sm:w-8"
                    : "bg-gray-300 dark:bg-zinc-600 w-1.5 sm:w-2 hover:bg-gray-400 dark:hover:bg-zinc-500"
                }`}
                aria-label={`Перейти к слайду ${idx + 1}`}
                aria-current={activeIndex === idx ? "true" : "false"}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default HeroCarousel;
