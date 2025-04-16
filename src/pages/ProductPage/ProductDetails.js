import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiChevronUp, FiShare2, FiHeart } from "react-icons/fi";
import clsx from "clsx";

const commonTransition = { duration: 0.5, ease: "easeInOut" };
const descriptionVariants = {
  open: { height: "auto", opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } },
  closed: { height: 0, opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } },
};
const brandStyles = {
  Nike: { primary: "text-black", accent: "border-black", bg: "bg-white", selectedBg: "bg-black", selectedText: "text-white" },
  Adidas: { primary: "text-blue-900", accent: "border-blue-900", bg: "bg-white", selectedBg: "bg-blue-900", selectedText: "text-white" },
  Puma: { primary: "text-red-900", accent: "border-red-900", bg: "bg-white", selectedBg: "bg-red-900", selectedText: "text-white" },
  default: { primary: "text-gray-900", accent: "border-gray-900", bg: "bg-gray-100", selectedBg: "bg-gray-900", selectedText: "text-white" },
};

const ProductDetails = ({
  product, productPrice, selectedSize, setSelectedSize,
  selectedColor, setSelectedColor, quantity, setQuantity,
  addToCart, setShowSizeGuide
}) => {
  const [showDescription, setShowDescription] = useState(false);
  const colorKeys = useMemo(() => product.media?.imagesByColor ? Object.keys(product.media.imagesByColor) : [], [product.media]);
  const sizes = product.options?.sizes || [];
  const promotionMap = useMemo(() => Array.isArray(product.promotions)
    ? product.promotions.reduce((acc, promo) => ({ ...acc, [promo.type]: promo }), {})
    : {}, [product.promotions]);
  const brand = product.brand || "default";
  const { primary, accent, bg, selectedBg, selectedText } = brandStyles[brand] || brandStyles.default;
  const handleAddToCart = useCallback(() => {
    addToCart({
      ...product,
      quantity, selectedSize, selectedColor,
      description: product.description || "Описание отсутствует",
      promotions: product.promotions || [],
      media: product.media || {},
      features: product.features || {}
    });
  }, [addToCart, product, quantity, selectedSize, selectedColor]);

  return (
    <article className="flex flex-col" aria-label="Детали товара">
      <header>
        <motion.h1 className={clsx("text-3xl md:text-4xl font-bold tracking-tight", primary)}
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...commonTransition, delay: 0.1 }}>
          {product.name?.ru || product.name} <span className="font-normal text-gray-600">SportNova</span>
        </motion.h1>
        <motion.p className="mt-2 text-sm text-gray-500"
          initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ ...commonTransition, delay: 0.2 }}>
          Артикул: <span className="font-medium">{product.sku || `SNV-${product.id.slice(0, 8).toUpperCase()}`}</span>
        </motion.p>
      </header>

      <motion.div className="mt-6 flex items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...commonTransition, delay: 0.3 }} aria-label="Цена товара">
        <span className={clsx("text-3xl md:text-4xl font-extrabold tracking-tight", primary)}>{productPrice} ₽</span>
        {product.price?.original && <span className="text-lg text-gray-500 line-through">{product.price.original} ₽</span>}
      </motion.div>

      {colorKeys.length > 0 && (
        <section className="mt-8" aria-label="Выбор цвета товара">
          <motion.h3 className="text-sm font-semibold text-gray-800 mb-3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...commonTransition, delay: 0.4 }}>
            Цвет
          </motion.h3>
          <div className="grid grid-cols-5 gap-4">
            {colorKeys.map((colorKey) => {
              const images = product.media.imagesByColor[colorKey];
              const thumbnail = Array.isArray(images) ? images[0] : images;
              return (
                <motion.button key={colorKey} onClick={() => setSelectedColor(colorKey)}
                  className={clsx("w-20 h-20 rounded-md overflow-hidden border transition-all duration-200 focus:outline-none focus:ring-2",
                    selectedColor === colorKey ? clsx("border-2", accent) : "border-gray-300 hover:border-gray-500")}
                  aria-label={`Выбрать цвет: ${colorKey}`} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <img src={thumbnail} alt={`Изображение цвета ${colorKey}`} className="object-cover w-full h-full"
                    onError={(e) => { e.target.onerror = null; e.target.src = "/fallback-image.png"; }} />
                </motion.button>
              );
            })}
          </div>
        </section>
      )}

      {sizes.length > 0 && (
        <section className="mt-8" aria-label="Выбор размера товара">
          <div className="flex items-center justify-between mb-3">
            <motion.h3 className="text-sm font-semibold text-gray-800" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ ...commonTransition, delay: 0.5 }}>
              Размер
            </motion.h3>
            <motion.button onClick={() => setShowSizeGuide(true)}
              className="text-xs text-gray-600 hover:text-gray-800 transition-colors duration-200 focus:outline-none"
              aria-label="Открыть таблицу размеров" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...commonTransition, delay: 0.5 }}>
              Таблица размеров
            </motion.button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {sizes.map((size) => (
              <motion.button key={size} onClick={() => setSelectedSize(size)}
                className={clsx("py-2 rounded-md border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2",
                  selectedSize === size ? clsx(selectedBg, selectedText) : "bg-gray-100 text-gray-900 border-gray-300 hover:border-gray-400 hover:bg-gray-200")}
                aria-label={`Размер: ${size}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {size}
              </motion.button>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8" aria-label="Выбор количества товара">
        <motion.h3 className="text-sm font-semibold text-gray-800 mb-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ ...commonTransition, delay: 0.6 }}>
          Количество
        </motion.h3>
        <div className="flex items-center gap-3">
          <motion.button onClick={() => setQuantity(q => Math.max(q - 1, 1))}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:border-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2"
            aria-label="Уменьшить количество" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <span className="text-lg text-gray-800">–</span>
          </motion.button>
          <motion.input type="number" min="1" value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
            className="w-16 h-10 text-center text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
            aria-label="Количество товара" />
          <motion.button onClick={() => setQuantity(q => q + 1)}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:border-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2"
            aria-label="Увеличить количество" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <span className="text-lg text-gray-800">+</span>
          </motion.button>
        </div>
      </section>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <motion.button onClick={handleAddToCart}
          className={clsx("w-full py-3 flex items-center justify-center gap-3 font-bold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2", bg, primary, accent)}
          aria-label="Добавить товар в корзину" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <span className="text-xl" aria-hidden="true">🛒</span> Добавить в корзину
        </motion.button>
        <motion.button onClick={() => {}}
          className="w-full py-3 flex items-center justify-center gap-2 border border-gray-300 rounded-md hover:border-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2"
          aria-label="Поделиться товаром" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <FiShare2 className="text-lg" /> Поделиться
        </motion.button>
        <motion.button onClick={() => {}}
          className="w-full py-3 flex items-center justify-center gap-2 border border-gray-300 rounded-md hover:border-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2"
          aria-label="Добавить в избранное" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <FiHeart className="text-lg" /> В избранное
        </motion.button>
      </div>

      {product.promotions && Array.isArray(product.promotions) && (
        <motion.section className="mt-8 p-4 border border-gray-200 rounded-md bg-gray-50"
          aria-label="Акции и предложения" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ ...commonTransition, delay: 0.7 }}>
          <motion.h3 className="text-sm font-semibold text-gray-800 mb-2">Акции и предложения SportNova:</motion.h3>
          {promotionMap.discount && (
            <motion.p className="text-xs mt-1 text-gray-700">
              <span className="mr-1 inline-block text-blue-500" aria-hidden="true">🏷️</span>
              Скидка: <span className="font-medium">{promotionMap.discount.value}{promotionMap.discount.unit}</span>
            </motion.p>
          )}
          {promotionMap.cashback && (
            <motion.p className="text-xs mt-1 text-gray-700">
              <span className="mr-1 inline-block text-green-500" aria-hidden="true">💰</span>
              Кэшбэк: <span className="font-medium">{promotionMap.cashback.value}{promotionMap.cashback.unit}</span>
            </motion.p>
          )}
          {promotionMap.promoCode && (
            <motion.p className="text-xs mt-1 text-gray-700">
              <span className="mr-1 inline-block text-purple-500" aria-hidden="true">🎟️</span>
              Промокод: <strong className="font-semibold">{promotionMap.promoCode.code}</strong>
            </motion.p>
          )}
          {promotionMap.gift && (
            <motion.p className="text-xs mt-1 text-gray-700">
              <span className="mr-1 inline-block text-orange-500" aria-hidden="true">🎁</span>
              Подарок: <span className="font-medium">{promotionMap.gift.value}</span>
            </motion.p>
          )}
        </motion.section>
      )}

      <section className="mt-10 pt-6 border-t border-gray-200">
        <motion.button className="w-full flex justify-between items-center mb-4 focus:outline-none"
          onClick={() => setShowDescription(prev => !prev)}
          aria-expanded={showDescription} aria-controls="product-description" whileTap={{ scale: 0.98 }}>
          <span className="text-sm font-semibold text-gray-800">Детали товара</span>
          <span className="text-base font-bold text-gray-700" aria-hidden="true">
            {showDescription ? <FiChevronUp /> : <FiChevronDown />}
          </span>
        </motion.button>
        <AnimatePresence initial={false}>
          {showDescription && (
            <motion.div id="product-description" className="overflow-hidden" variants={descriptionVariants}
              initial="closed" animate="open" exit="closed">
              <div className="mt-2 text-gray-600 text-sm leading-relaxed">
                <p className="mb-4">
                  {product.description?.ru || product.description?.en || "Описание для этого товара еще не добавлено."}
                </p>
                {product.features && (
                  <ul className="mt-2 space-y-2 list-disc list-inside">
                    {product.features.material && <li>Материалы: <span className="font-medium">{product.features.material.join(", ")}</span></li>}
                    {product.features.weight && <li>Вес: <span className="font-medium">{product.features.weight}</span></li>}
                    {product.features.country && <li>Страна производства: <span className="font-medium">{product.features.country}</span></li>}
                    {product.features.warranty && <li>Гарантия: <span className="font-medium">{product.features.warranty}</span></li>}
                    {product.features.flexibility && <li>Гибкость: <span className="font-medium">{product.features.flexibility}</span></li>}
                    {product.features.sportType && <li>Вид спорта: <span className="font-medium">{product.features.sportType.join(", ")}</span></li>}
                    {product.features.technology && <li>Технологии: <span className="font-medium">{product.features.technology.join(", ")}</span></li>}
                  </ul>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </article>
  );
};

export default ProductDetails;