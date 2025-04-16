import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

// Skeleton-заглушка (опционально, если нет данных)
const SkeletonCard = () => (
  <div className="aspect-square rounded-2xl bg-gray-100 animate-pulse shadow-inner" />
);

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 1, 0.5, 1],
      scale: { type: "spring", stiffness: 150 },
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const CategoryCard = ({ category }) => {
  if (!category || !category.image) return <SkeletonCard />;

  const displayName = category.name?.ru || category.name?.en || "Без названия";
  const slug = category.slug || displayName.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link
      to={`/catalog?category=${slug}`}
      aria-label={`Перейти в категорию ${displayName}`}
      className="block"
    >
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        whileHover="hover"
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        className="relative overflow-hidden rounded-2xl bg-primary-50 shadow-xl transition-all duration-300 group"
      >
        <figure className="relative aspect-square overflow-hidden">
          <motion.img
            loading="lazy"
            src={`${category.image}?w=800&h=800&fit=crop&auto=format`}
            alt={`Изображение категории ${displayName}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <figcaption className="sr-only">
            Изображение категории {displayName}
          </figcaption>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        </figure>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-center">
          <div className="inline-flex flex-col items-center">
            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white mb-1 sm:mb-2 truncate">
              {displayName}
            </h3>
            <span className="text-white bg-black/50 px-3 py-1 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm">
              {category.productCount || 0}+ товаров
            </span>
          </div>
        </div>

        {category.discount !== undefined && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs sm:text-sm font-semibold text-red-600 shadow-sm">
              🔥 −{category.discount}%
            </div>
          </div>
        )}
      </motion.div>
    </Link>
  );
};

CategoryCard.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.shape({
      ru: PropTypes.string,
      en: PropTypes.string,
    }).isRequired,
    slug: PropTypes.string,
    image: PropTypes.string.isRequired,
    productCount: PropTypes.number,
    discount: PropTypes.number,
  }).isRequired,
};

export default CategoryCard;
