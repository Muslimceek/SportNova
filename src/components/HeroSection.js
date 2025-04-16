import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FiArrowDown, FiChevronRight } from 'react-icons/fi';

const SCROLL_RANGE = [0, 800], TEXT_OFFSET = 200;

const SportNovaHero = () => {
  const containerRef = useRef(null);
  const { scrollY } = useScroll({ target: containerRef });
  const textY = useTransform(scrollY, SCROLL_RANGE, [0, -TEXT_OFFSET]);
  const contentOpacity = useTransform(scrollY, SCROLL_RANGE, [1, 0]);
  const [slide, setSlide] = useState(0);
  const slides = [
    { title: "ИННОВАЦИИ", gradient: "from-orange-500 to-red-500" },
    { title: "ПРОИЗВОДИТЕЛЬНОСТЬ", gradient: "from-blue-500 to-purple-500" },
    { title: "СТИЛЬ", gradient: "from-emerald-400 to-cyan-400" }
  ];

  useEffect(() => {
    const interval = setInterval(() => setSlide((s) => (s + 1) % slides.length), 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <header
      ref={containerRef}
      role="banner"
      aria-label="Вступительный экран SportNova"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Фоновое видео с затемнением */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <video autoPlay muted loop playsInline className="absolute w-full h-full object-cover">
          <source src="https://static.nike.com/a/videos/q_90/61f5179d-8c5a-4f8a-baff-7c5c29f7fde4/video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Асимметричные линии - брендовое оформление */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 0.5 }} className="absolute inset-0 z-0 overflow-hidden">
        <motion.div className="absolute -left-[10%] top-0 w-[120%] h-1 bg-white/20 origin-left" style={{ rotate: 15 }} />
        <motion.div className="absolute -left-[10%] top-[30%] w-[120%] h-[0.5px] bg-white/10 origin-left" style={{ rotate: -10 }} />
      </motion.div>

      {/* Основной контент с параллаксом */}
      <motion.div className="relative z-10 max-w-5xl px-6 sm:px-8 md:px-12 mx-auto text-center" style={{ y: textY, opacity: contentOpacity }}>
        <div className="grid grid-cols-1 gap-8">
          <div>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="inline-block mb-6 sm:mb-8">
              <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white font-medium">
                Новое поколение спорта
              </span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }} className="text-5xl sm:text-7xl md:text-9xl font-black text-white leading-none tracking-tighter mb-6 sm:mb-8">
              <div className="flex items-center justify-center">
                <motion.span className="text-white">SPORT</motion.span>
                <AnimatePresence mode="wait">
                  <motion.span key={slide} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className={`bg-gradient-to-r ${slides[slide].gradient} bg-clip-text text-transparent`}>
                    NOVA
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1.5 }} className="text-base sm:text-lg md:text-xl text-neutral-300 mt-4 sm:mt-6 leading-relaxed max-w-2xl mx-auto">
              Переосмысливая границы возможного. Инновационные технологии для максимальных достижений.
            </motion.p>
            <CTAButtons />
          </div>
        </div>
      </motion.div>

      <FeaturedTags />
      <ScrollPrompt />
    </header>
  );
};

const CTAButtons = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }} className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
    <motion.a href="/catalog" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="group relative px-8 py-4 bg-white text-black text-sm sm:text-base font-bold rounded-full overflow-hidden transition-all duration-300 hover:bg-white/90">
      <span className="relative z-10 flex items-center justify-center">
        НАЧАТЬ ПОКУПКИ
        <motion.span className="ml-2 inline-block" animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <FiChevronRight />
        </motion.span>
      </span>
      <motion.span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-cyan-400" whileHover={{ height: "100%" }} transition={{ duration: 0.3 }} />
    </motion.a>
    <motion.a href="/about" whileHover={{ borderColor: 'rgba(255,255,255,0.5)' }} whileTap={{ scale: 0.98 }} className="px-8 py-4 border border-white/30 text-white text-sm sm:text-base font-bold rounded-full transition-all duration-300 hover:bg-white/5">
      УЗНАТЬ БОЛЬШЕ
    </motion.a>
  </motion.div>
);

const FeaturedTags = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }} className="absolute bottom-24 left-0 w-full z-10 overflow-hidden">
    <motion.div animate={{ x: [0, -1000] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="flex whitespace-nowrap">
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={i} className="text-5xl font-black text-white/10 mx-8">SPORTNOVA</span>
      ))}
    </motion.div>
  </motion.div>
);

const ScrollPrompt = () => (
  <motion.div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 0.8 }} aria-hidden="true">
    <motion.div animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center">
      <FiArrowDown className="text-xl sm:text-2xl text-white mb-2" />
      <span className="text-xs sm:text-sm text-white/70 tracking-widest uppercase font-medium">Scroll</span>
    </motion.div>
  </motion.div>
);

export default React.memo(SportNovaHero);