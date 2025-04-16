import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Truck, Heart, Lock, ChevronLeft, ChevronRight } from 'lucide-react';

const BenefitsCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const benefitsData = useMemo(() => [
    {
      icon: Shield,
      title: 'Защита покупки',
      description: 'Гарантированный возврат до 30 дней',
      color: 'red',
      gradientFrom: 'from-red-100',
      gradientTo: 'to-red-200',
      ariaLabel: 'Условия возврата товара'
    },
    {
      icon: Truck,
      title: 'Быстрая доставка',
      description: 'Доставка по всей России за 3-5 дней',
      color: 'blue',
      gradientFrom: 'from-blue-100',
      gradientTo: 'to-blue-200',
      ariaLabel: 'Информация о доставке'
    },
    {
      icon: Heart,
      title: 'Премиум Качество',
      description: 'Профессиональные спортивные технологии',
      color: 'green',
      gradientFrom: 'from-green-100',
      gradientTo: 'to-green-200',
      ariaLabel: 'Гарантия качества продукта'
    },
    {
      icon: Lock,
      title: 'Безопасность',
      description: 'Защищенные транзакции и данные',
      color: 'purple',
      gradientFrom: 'from-purple-100',
      gradientTo: 'to-purple-200',
      ariaLabel: 'Безопасность платежей'
    }
  ], []);

  const totalSlides = benefitsData.length;
  const currentBenefit = benefitsData[currentSlide];

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [nextSlide, isPaused]);

  const handleKeyNavigation = useCallback((e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  }, [nextSlide, prevSlide]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyNavigation);
    return () => window.removeEventListener('keydown', handleKeyNavigation);
  }, [handleKeyNavigation]);

  const CurrentIcon = currentBenefit.icon;

  return (
    <div 
      ref={carouselRef}
      className="relative w-full min-h-[500px] flex items-center justify-center bg-gray-50 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-roledescription="Carousel of Product Benefits"
    >
      <AnimatePresence>
        <motion.div 
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className={`relative w-full max-w-5xl flex flex-col md:flex-row items-center justify-between p-8 rounded-3xl bg-gradient-to-br ${currentBenefit.gradientFrom} ${currentBenefit.gradientTo} shadow-2xl mx-4`}
          aria-label={currentBenefit.ariaLabel}
        >
          <button 
            onClick={prevSlide} 
            aria-label="Previous Slide"
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-all z-10 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <ChevronLeft className={`w-8 h-8 text-${currentBenefit.color}-700`} />
          </button>
          <button 
            onClick={nextSlide} 
            aria-label="Next Slide"
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-all z-10 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <ChevronRight className={`w-8 h-8 text-${currentBenefit.color}-700`} />
          </button>
          <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-12">
            <CurrentIcon className={`w-24 h-24 text-${currentBenefit.color}-600`} />
          </div>
          <div className="text-center md:text-left flex-grow">
            <motion.h3 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`text-3xl font-bold mb-4 text-${currentBenefit.color}-800`}
            >
              {currentBenefit.title}
            </motion.h3>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-700"
            >
              {currentBenefit.description}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>
      <div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3"
        role="tablist"
      >
        {benefitsData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            role="tab"
            aria-selected={currentSlide === index}
            className={`
              w-3 h-3 rounded-full cursor-pointer transition-all
              focus:outline-none focus:ring-2 focus:ring-offset-2
              ${currentSlide === index 
                ? `bg-${currentBenefit.color}-600 scale-150` 
                : 'bg-gray-300 hover:bg-gray-500'}
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(BenefitsCarousel);
