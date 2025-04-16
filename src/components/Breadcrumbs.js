import React from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

// Выносим переводы в отдельный константный объект для удобства поддержки
const PATH_TRANSLATIONS = {
  catalog: "Каталог",
  product: "Товар",
  cart: "Корзина",
  favorites: "Избранное",
  privacy: "Политика конфиденциальности",
  terms: "Условия использования",
  login: "Вход",
  register: "Регистрация",
  order: "Заказ",
  about: "О нас",
  admin: "Админ-панель",
  user: "Личный кабинет",
  profile: "Профиль",
  orders: "Заказы",
};

// Выносим анимации в отдельный объект для улучшения читаемости
const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  },
  item: {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  },
  separator: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 150 },
    },
  },
};

const Breadcrumbs = ({ className = "" }) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((segment) => segment);

  if (pathnames.length === 0) return null;

  const getTranslatedSegment = (segment) => {
    const cleanedSegment = segment.toLowerCase().replace(/\s+/g, "-");
    return PATH_TRANSLATIONS[cleanedSegment] || segment;
  };

  return (
    <motion.nav
      aria-label="Хлебные крошки"
      initial="hidden"
      animate="visible"
      variants={ANIMATION_VARIANTS.container}
      className={`px-4 py-3 bg-gray-50 ${className}`}
    >
      <ul className="flex flex-wrap items-center gap-x-2 text-sm font-medium text-gray-600">
        <motion.li variants={ANIMATION_VARIANTS.item}>
          <Link
            to="/"
            className="hover:text-black transition-colors duration-200 aria-[current=page]:text-black aria-[current=page]:pointer-events-none"
          >
            Главная
          </Link>
        </motion.li>
        
        {pathnames.map((segment, index) => {
          const isLast = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const displayName = getTranslatedSegment(segment);

          return (
            <React.Fragment key={to}>
              <motion.span
                variants={ANIMATION_VARIANTS.separator}
                className="text-gray-400"
                aria-hidden="true"
              >
                /
              </motion.span>
              <motion.li variants={ANIMATION_VARIANTS.item}>
                {!isLast ? (
                  <Link
                    to={to}
                    className="hover:text-black transition-colors duration-200 aria-[current=page]:text-black aria-[current=page]:pointer-events-none"
                  >
                    {displayName}
                  </Link>
                ) : (
                  <span 
                    className="text-gray-800"
                    aria-current="page"
                  >
                    {displayName}
                  </span>
                )}
              </motion.li>
            </React.Fragment>
          );
        })}
      </ul>
    </motion.nav>
  );
};

Breadcrumbs.propTypes = {
  className: PropTypes.string,
};

export default Breadcrumbs;