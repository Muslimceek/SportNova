import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

const fetchBrands = async () => {
  // Имитация API-запроса с задержкой
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { name: "Nike", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" },
    { name: "Adidas", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" },
    { name: "Puma", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Puma_Logo.svg" },
    { name: "Under Armour", logo: "https://upload.wikimedia.org/wikipedia/commons/7/73/Under_armour_logo.svg" },
    { name: "Reebok", logo: "https://upload.wikimedia.org/wikipedia/commons/6/66/Reebok_2019_logo.svg" }
  ];
};

const BrandCard = React.memo(({ brand, animationVariants }) => (
  <motion.div
    variants={animationVariants}
    className="group bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl flex flex-col items-center transform transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/20"
  >
    <motion.img
      src={brand.logo}
      alt={brand.name}
      className="w-32 h-32 object-contain mb-6 filter grayscale group-hover:grayscale-0 transition-all"
      loading="lazy"
      width={128}
      height={128}
      whileHover={{ scale: 1.1 }}
    />
    <motion.h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
      {brand.name}
    </motion.h2>
  </motion.div>
));

const InfoBlock = React.memo(({ title, children, animationVariants }) => (
  <motion.div
    variants={animationVariants}
    className="bg-gradient-to-bl from-gray-800 to-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-700"
  >
    <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent mb-4">
      {title}
    </h2>
    <p className="text-gray-300 text-lg leading-relaxed">{children}</p>
  </motion.div>
));

const Brands = () => {
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: fetchBrands,
    staleTime: Infinity,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } }
  };

  const infoVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'keyframes', duration: 0.8 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-950 py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          className="text-center mb-20 space-y-6"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent"
          >
            Наши Бренды
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Мы сотрудничаем с ведущими мировыми брендами, гарантируя подлинность и 
            премиальное качество каждого продукта.
          </motion.p>
        </motion.div>

        {!isLoading && (
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-24"
          >
            {brands.map((brand) => (
              <BrandCard
                key={brand.name}
                brand={brand}
                animationVariants={itemVariants}
              />
            ))}
          </motion.div>
        )}

        <motion.div className="space-y-12 max-w-5xl mx-auto">
          <InfoBlock
            title="Почему оригинальная продукция?"
            animationVariants={infoVariants}
          >
            Подлинность гарантирует высочайшее качество материалов, инновационные технологии 
            и полное соответствие стандартам безопасности. Мы осуществляем строгий контроль 
            на всех этапах поставок.
          </InfoBlock>

          <InfoBlock
            title="Критерии выбора партнёров"
            animationVariants={infoVariants}
          >
            Только бренды с безупречной репутацией, инновационным подходом и подтверждённым 
            качеством продукции. Каждый товар проходит многоэтапную проверку.
          </InfoBlock>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default React.memo(Brands);