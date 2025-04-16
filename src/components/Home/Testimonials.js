import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaStar, FaChevronLeft, FaChevronRight, FaQuoteRight } from "react-icons/fa";

const testimonialsData = [
  {
    id: 1,
    name: "Алексей Иванов",
    review:
      "Заказывал в SportNova уже несколько раз. Всегда быстрая доставка и отличное качество!",
    rating: 5,
    image:
      "https://i.pinimg.com/736x/08/9d/73/089d73207d592ad65bd0f0ad63a7fd4a.jpg",
    sport: "Бег",
  },
  {
    id: 2,
    name: "Мария Смирнова",
    review:
      "SportNova — это просто находка! Помогли с выбором экипировки, очень вежливые менеджеры.",
    rating: 5,
    image:
      "https://i.pinimg.com/474x/76/93/9c/76939c8d8c3d63f7e2536587d34272da.jpg",
    sport: "Йога",
  },
  {
    id: 3,
    name: "Иван Петров",
    review:
      "Брал здесь гантели и тренажёр. Товар пришёл вовремя, качество супер. Буду заказывать ещё!",
    rating: 4,
    image:
      "https://i.pinimg.com/474x/df/8e/f9/df8ef99ba84e27ef80f49a94718fbd7d.jpg",
  },
  {
    id: 4,
    name: "Виктория Крылова",
    review:
      "Заказала спортивную форму в SportNova. Размер подошёл идеально, цвета яркие. Рекомендую!",
    rating: 5,
    image:
      "https://i.pinimg.com/474x/06/64/53/066453262bf81b36d69f7046f84e121c.jpg",
  },
  {
    id: 5,
    name: "Андрей Фёдоров",
    review:
      "Классный магазин! Ассортимент огромный, а цены приятные. Покупал кроссовки — очень доволен!",
    rating: 5,
    image:
      "https://i.pinimg.com/474x/b4/51/82/b4518222729c3db274f3cd0f6847925c.jpg",
  },
  {
    id: 6,
    name: "Светлана Лебедева",
    review:
      "SportNova спасла меня, когда искала подарок для мужа. Всё быстро, качественно и без проблем!",
    rating: 5,
    image:
      "https://i.pinimg.com/474x/19/90/44/199044fca6f9377f97c9651607be5124.jpg",
  },
  {
    id: 7,
    name: "Дмитрий Соколов",
    review:
      "Нашёл тут редкую модель штанги. Доставили в срок, упаковка надёжная. Респект SportNova!",
    rating: 5,
    image:
      "https://i.pinimg.com/474x/12/4d/bc/124dbc9893a2f55116c5fa6c28e0265b.jpg",
  },
];

const Testimonials = () => {
  const carouselRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [width, setWidth] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    const updateWidth = () => {
      if (carouselRef.current) {
        const scrollWidth = carouselRef.current.scrollWidth;
        const offsetWidth = carouselRef.current.offsetWidth;
        setWidth(scrollWidth - offsetWidth);
      }
      checkMobile();
    };
    
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handleNext = () => {
    if (currentSlide < testimonialsData.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      // Циклическая навигация для лучшего UX
      setCurrentSlide(0);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    } else {
      // Циклическая навигация для лучшего UX
      setCurrentSlide(testimonialsData.length - 1);
    }
  };

  // Auto-scroll functionality with pause on hover or touch
  useEffect(() => {
    if (isHovering) return;
    
    const interval = setInterval(() => {
      if (currentSlide < testimonialsData.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else {
        setCurrentSlide(0);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentSlide, isHovering]);

  // Вычисление размера слайда в зависимости от устройства
  const slideWidth = isMobile ? 280 + 16 : 420 + 32; // ширина + отступ

  return (
    <section className="py-8 md:py-16 lg:py-24 bg-black text-white overflow-hidden relative" aria-labelledby="testimonials-heading">
      {/* Background design elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute -top-10 -left-10 w-32 md:w-80 h-32 md:h-80 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-40 md:w-96 h-40 md:h-96 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-24 md:w-64 h-24 md:h-64 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="text-center mb-8 md:mb-16">
          <motion.p
            className="text-emerald-400 font-bold tracking-widest uppercase mb-2 text-xs md:text-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Голос наших клиентов
          </motion.p>
          
          <motion.h2
            id="testimonials-heading"
            className="text-2xl md:text-4xl lg:text-6xl font-black tracking-tight mb-3 md:mb-6 leading-none"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
              ОТЗЫВЫ
            </span>{" "}
            ЧЕМПИОНОВ
          </motion.h2>
          
          <motion.div 
            className="h-1 w-12 md:w-24 bg-emerald-400 mx-auto mb-3 md:mb-6"
            initial={{ width: 0 }}
            whileInView={{ width: isMobile ? 48 : 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          
          <motion.p
            className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            Узнайте, что говорят о нас те, кто уже достигает своих спортивных целей с нашей экипировкой
          </motion.p>
        </header>

        <div 
          className="relative group"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onTouchStart={() => setIsHovering(true)}
          onTouchEnd={() => setIsHovering(false)}
        >
          {/* Градиентные края для визуального указания на прокрутку */}
          <div className="absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

          <motion.div
            ref={carouselRef}
            className="overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y"
            aria-roledescription="carousel"
            aria-label="Отзывы клиентов"
          >
            <motion.div
              className="flex gap-4 md:gap-8"
              drag="x"
              dragConstraints={{ right: 0, left: -width }}
              animate={{ x: -currentSlide * slideWidth }}
              transition={{ type: "spring", stiffness: 120, damping: 25 }}
              aria-live="polite"
            >
              {testimonialsData.map((item, index) => (
                <motion.article
                  key={item.id}
                  className="min-w-[280px] md:min-w-[420px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl md:rounded-3xl p-4 md:p-8 relative overflow-hidden border border-gray-800 shadow-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.4)",
                    borderColor: "rgba(52, 211, 153, 0.3)"
                  }}
                  aria-roledescription="slide"
                  aria-label={`Отзыв от ${item.name}`}
                >
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-blue-500" />
                  
                  <FaQuoteRight className="absolute top-3 md:top-6 right-3 md:right-6 text-xl md:text-3xl text-gray-800" />
                  
                  <header className="flex items-start gap-3 md:gap-5 mb-4 md:mb-6">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={`Фото клиента ${item.name}`}
                        className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg shadow-lg"
                        loading="lazy"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-emerald-400 to-blue-500 text-white rounded-full px-2 py-0.5 text-[8px] md:text-xs font-bold shadow-lg">
                        {item.sport || "Спорт"}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm md:text-xl font-bold text-white mb-1">
                        {item.name}
                      </h3>
                      <div className="flex gap-1 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`w-3 h-3 md:w-4 md:h-4 ${i < item.rating ? "fill-current" : "text-gray-700"}`}
                            aria-hidden={i >= item.rating}
                          />
                        ))}
                        <span className="sr-only">Рейтинг {item.rating} из 5</span>
                      </div>
                    </div>
                  </header>
                  
                  <blockquote className="text-gray-300 leading-relaxed mb-4 md:mb-6 text-sm md:text-base font-light italic">
                    "{item.review}"
                  </blockquote>
                  
                  <footer className="flex justify-between items-center text-xs md:text-sm">
                    <div className="flex items-center gap-1 md:gap-2">
                      <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-emerald-400 flex items-center justify-center">
                        <svg className="w-2 h-2 md:w-3 md:h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-400">Проверенный покупатель</span>
                    </div>
                    
                    <div className="text-gray-600 font-mono">
                      #{item.id.toString().padStart(2, "0")}
                    </div>
                  </footer>
                  
                  <div className="absolute -bottom-8 -right-8 w-16 md:w-32 h-16 md:h-32 rounded-full bg-gradient-to-r from-emerald-400/10 to-blue-500/10 blur-2xl" />
                </motion.article>
              ))}
            </motion.div>
          </motion.div>

          {/* Навигационные кнопки с улучшенной доступностью и touch-областью */}
          <button
            onClick={handlePrev}
            className="absolute left-1 md:left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-emerald-500 shadow-lg p-3 md:p-4 rounded-full transition-all duration-300 z-30 border border-gray-800 hover:border-emerald-400 group touch-manipulation"
            aria-label="Предыдущий отзыв"
          >
            <FaChevronLeft className="text-white text-sm md:text-lg group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-1 md:right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-emerald-500 shadow-lg p-3 md:p-4 rounded-full transition-all duration-300 z-30 border border-gray-800 hover:border-emerald-400 group touch-manipulation"
            aria-label="Следующий отзыв"
          >
            <FaChevronRight className="text-white text-sm md:text-lg group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Индикаторы слайдов с улучшенной доступностью */}
        <div className="flex justify-center gap-2 mt-4 md:mt-8" role="tablist">
          {testimonialsData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 md:h-3 rounded-full transition-all duration-500 ${
                index === currentSlide 
                  ? "bg-gradient-to-r from-emerald-400 to-blue-500 w-6 md:w-10" 
                  : "bg-gray-700 hover:bg-gray-600 w-2 md:w-3"
              }`}
              aria-label={`Перейти к отзыву ${index + 1}`}
              aria-selected={index === currentSlide}
              role="tab"
            />
          ))}
        </div>
        
        <motion.div 
          className="mt-6 md:mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <a 
            href="/reviews" 
            className="inline-flex items-center gap-1 md:gap-2 text-emerald-400 font-bold text-sm md:text-lg hover:text-emerald-300 transition-colors group"
            aria-label="Смотреть все отзывы клиентов"
          >
            <span>Смотреть все отзывы</span>
            <svg 
              className="w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;