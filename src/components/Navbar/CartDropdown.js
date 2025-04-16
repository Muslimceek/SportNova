import React, { useCallback, useEffect, useRef, useState, memo } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { FiX, FiPlus, FiMinus, FiShoppingBag, FiChevronRight, FiFilter, FiTrash2 } from "react-icons/fi";
import { useCart } from "../../contexts/CartContext";

const BACKDROP_ZINDEX = 10000, CONTENT_ZINDEX = 10001;

// Enhanced container with premium animations
const CartDropdownContainer = ({ isOpen, onClose, children }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!isOpen) return;
    containerRef.current?.focus();
    const handleKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-end"
          style={{ zIndex: BACKDROP_ZINDEX }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          ref={containerRef}
        >
          <motion.div
            className="w-full max-w-xl bg-gradient-to-br from-white to-gray-50 text-black h-full overflow-hidden shadow-2xl relative md:rounded-l-3xl flex flex-col"
            style={{ zIndex: CONTENT_ZINDEX }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              mass: 1
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Premium background effects */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden md:rounded-l-3xl">
              <motion.div 
                className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-purple-100/30 to-blue-100/20 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.4, 0.3]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <motion.div 
                className="absolute bottom-32 -left-32 w-72 h-72 bg-gradient-to-tr from-amber-100/20 to-rose-100/10 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 2
                }}
              />
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Enhanced header with premium animations
const CartDropdownHeader = ({ onClose }) => (
  <div className="p-4 md:p-6 border-b border-gray-100/80 flex justify-between items-center bg-white/80 backdrop-blur-lg sticky top-0 z-10 shadow-sm">
    <div className="flex items-center space-x-3 md:space-x-4">
      <motion.div 
        className="p-2 md:p-3 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl shadow-lg"
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <FiShoppingBag className="text-white text-lg md:text-xl" />
      </motion.div>
      <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
        Корзина
      </h2>
    </div>
    <motion.button
      onClick={onClose}
      className="p-2 hover:bg-gray-100/80 rounded-full transition-all duration-300"
      aria-label="Закрыть корзину"
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <FiX size={22} className="text-gray-500" />
    </motion.button>
  </div>
);

const getVariantPrice = (item) => {
  const { pricing, selectedColor, selectedSize } = item;
  if (pricing?.variants) {
    const variant = pricing.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
    return variant ? Number(variant.price) : Number(pricing.basePrice);
  }
  return pricing ? Number(pricing.basePrice) : 0;
};

// Enhanced controls with premium animations
const CartItemControls = ({ item, onQuantityChange }) => {
  const price = getVariantPrice(item) * item.quantity;
  
  // Получаем текущий вариант товара (цвет+размер)
  const currentVariant = item.pricing?.variants?.find(
    v => v.color === item.selectedColor && v.size === item.selectedSize
  );
  
  // Максимальное количество = остаток на складе (если есть) или 5 по умолчанию
  const maxQuantity = currentVariant?.stock ?? 5;
  const isMaxQuantity = item.quantity >= maxQuantity;

  return (
    <div className="flex items-center justify-between mt-2">
      <motion.p 
        className="text-base md:text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        ${price.toFixed(2)}
      </motion.p>
      <div className="flex flex-col items-end gap-1">
        {isMaxQuantity && (
          <motion.span 
            className="text-xs text-amber-600 flex items-center gap-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {currentVariant?.stock === 0 ? (
              '❌ Товар закончился'
            ) : (
              `⚠️ Максимум ${maxQuantity} шт.`
            )}
          </motion.span>
        )}
        <div className="flex items-center gap-2 bg-gray-50 rounded-full px-2 py-1 shadow-sm border border-gray-100/80">
          <motion.button
            onClick={() => onQuantityChange(item, -1)}
            className="p-1 hover:bg-gray-100 rounded-full transition-all"
            aria-label="Уменьшить количество"
            whileHover={{ scale: 1.2, backgroundColor: "#f3f4f6" }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <FiMinus className="w-3 h-3 md:w-4 md:h-4 text-gray-700" />
          </motion.button>
          <motion.span 
            className="font-medium text-gray-900 min-w-[20px] text-center"
            key={item.quantity}
            initial={{ scale: 1.2, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {item.quantity}
          </motion.span>
          <motion.button
            onClick={() => !isMaxQuantity && onQuantityChange(item, 1)}
            disabled={isMaxQuantity || currentVariant?.stock === 0}
            className={`p-1 hover:bg-gray-100 rounded-full transition-all ${
              isMaxQuantity || currentVariant?.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Увеличить количество"
            whileHover={!isMaxQuantity && { scale: 1.2, backgroundColor: "#f3f4f6" }}
            whileTap={!isMaxQuantity && { scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <FiPlus className="w-3 h-3 md:w-4 md:h-4 text-gray-700" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

const CartItemCustomization = ({ item, onColorChange, onSizeChange }) => (
  <div className="flex gap-2 mt-1 flex-wrap">
    {item.options?.colors && item.selectedColor && (
      <motion.div 
        className="flex items-center gap-1"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <span className="text-sm text-gray-500">Цвет:</span>
        <span className="px-2 py-1 rounded-md bg-gray-50 border border-gray-200 text-sm shadow-sm">
          {item.selectedColor}
        </span>
      </motion.div>
    )}
    {item.options?.sizes && item.selectedSize && (
      <motion.div 
        className="flex items-center gap-1"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <span className="text-sm text-gray-500">Размер:</span>
        <span className="px-2 py-1 rounded-md bg-gray-50 border border-gray-200 text-sm shadow-sm">
          {item.selectedSize}
        </span>
        {item.pricing?.variants?.find(
          v => v.color === item.selectedColor && 
               v.size === item.selectedSize
        )?.stock === 0 && (
          <motion.span 
            className="text-xs text-red-500 flex items-center gap-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            ❌ Данный размер закончился
          </motion.span>
        )}
      </motion.div>
    )}
    {item.selectedColor && !item.selectedSize && (
      <motion.span 
        className="text-xs text-amber-500 flex items-center gap-1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        ⚠️ Пожалуйста, выберите размер
      </motion.span>
    )}
  </div>
);

const getCartItemKey = (item) =>
  `${item.id}-${item.selectedSize || "nosize"}-${item.selectedColor || "nocolor"}`;

// Enhanced cart item with premium animations
const CartItem = memo(
  ({ item, onRemove, onQuantityChange, onSizeChange, onColorChange }) => {
    const x = useMotionValue(0);
    const opacity = useTransform(x, [-100, 0], [0.5, 1]);
    const scale = useTransform(x, [-100, 0], [0.95, 1]);
    
    const handleDragEnd = (event, info) => {
      if (info.offset.x < -100) {
        onRemove(item);
      }
    };
    
    return (
      <motion.li
        key={getCartItemKey(item)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
        className="py-3 md:py-5 group relative"
        whileHover={{ 
          y: -2,
          transition: { duration: 0.2 }
        }}
        style={{ x, opacity, scale }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
      >
        {/* Swipe indicator */}
        <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center opacity-0 group-hover:opacity-30 text-red-500 pointer-events-none">
          <FiTrash2 size={20} />
        </div>
        
        <div className="flex gap-3 md:gap-4">
          <div className="relative flex-shrink-0">
            <motion.img
              src={item.media?.fallbackImage || item.image}
              alt={item.name?.ru || "Товар"}
              className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl shadow-md border border-gray-100 transition-all duration-300"
              loading="lazy"
              whileHover={{ 
                scale: 1.05, 
                y: -2,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
            />
            <motion.div 
              className="absolute -top-2 -right-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.button
                onClick={() => onRemove(item)}
                className="p-1 md:p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 transition-all duration-300"
                aria-label="Удалить товар"
                whileHover={{ 
                  backgroundColor: "#FEF2F2", 
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX className="text-gray-400 w-3 h-3 md:w-4 md:h-4 group-hover:text-red-400" />
              </motion.button>
            </motion.div>
          </div>
          <div className="flex-grow">
            <motion.h3 
              className="text-base md:text-lg font-medium text-gray-900 truncate group-hover:text-black transition-colors"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {item.name?.ru || "Товар"}
            </motion.h3>
            <CartItemCustomization
              item={item}
              onColorChange={onColorChange}
              onSizeChange={onSizeChange}
            />
            <CartItemControls item={item} onQuantityChange={onQuantityChange} />
          </div>
        </div>
      </motion.li>
    );
  }
);

// Enhanced summary with premium animations
const CartSummary = ({ totalAmount, onClose }) => (
  <div className="sticky bottom-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 px-4 md:px-6 py-4 md:py-5 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]">
    <div className="flex justify-between items-center mb-3 md:mb-4">
      <span className="text-base md:text-lg font-medium text-gray-600">Итого:</span>
      <motion.span 
        className="text-lg md:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
        key={totalAmount}
        initial={{ scale: 1.1, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        ${totalAmount.toFixed(2)}
      </motion.span>
    </div>
    <div className="grid grid-cols-2 gap-2 md:block">
      <motion.div
        whileHover={{ y: -3 }}
        whileTap={{ y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Link
          to="/cart"
          onClick={onClose}
          className="block w-full py-2.5 md:py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-center rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform text-sm md:text-base relative overflow-hidden group"
        >
          <span className="relative z-10">Оформить заказ</span>
          {/* Premium hover effect */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <motion.span 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <FiChevronRight />
          </motion.span>
        </Link>
      </motion.div>
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="md:mt-3"
      >
        <Link
          to="/catalog"
          onClick={onClose}
          className="block w-full py-2 md:py-2.5 bg-gradient-to-r from-gray-200 to-gray-100 text-center rounded-xl font-medium transition-all duration-300 border border-gray-200 shadow-md hover:shadow-lg text-sm md:text-base relative overflow-hidden group"
        >
          <span className="relative z-10">Продолжить покупки</span>
          {/* Premium hover effect */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-100 to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
      </motion.div>
    </div>
  </div>
);

// Enhanced empty cart with premium animations
const EmptyCartMessage = () => (
  <div className="h-full flex flex-col items-center justify-center p-6 md:p-8 text-center">
    <motion.div 
      className="mb-5 md:mb-6 p-4 md:p-5 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full shadow-inner"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ 
        scale: 1.1,
        rotate: [0, -5, 5, -5, 0],
        transition: { duration: 0.5 }
      }}
    >
      <FiShoppingBag className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
    </motion.div>
    <motion.h3 
      className="text-lg md:text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      Ваша корзина пуста
    </motion.h3>
    <motion.p 
      className="text-sm md:text-base text-gray-500 max-w-xs mx-auto"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      Начните добавлять товары в корзину, и они появятся здесь
    </motion.p>
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      whileHover={{ y: -3 }}
      whileTap={{ y: 0 }}
    >
      <Link
        to="/catalog"
        className="mt-5 md:mt-6 px-5 md:px-6 py-2 md:py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-center rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg transform text-sm md:text-base inline-block relative overflow-hidden group"
      >
        <span className="relative z-10">Перейти в каталог</span>
        {/* Premium hover effect */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <motion.span 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <FiChevronRight />
        </motion.span>
      </Link>
    </motion.div>
  </div>
);

// Enhanced filter with premium animations
const CategoryFilter = ({ value, onChange }) => (
  <motion.div 
    className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-gray-100/80 to-gray-50/80 backdrop-blur-sm flex items-center gap-2 md:gap-3 border-b border-gray-100/50 overflow-x-auto"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.2 }}
  >
    <div className="flex items-center gap-1.5 text-gray-700">
      <FiFilter size={14} className="opacity-70" />
      <span className="text-xs md:text-sm font-medium whitespace-nowrap">Фильтр:</span>
    </div>
    <div className="relative flex-grow">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-gray-200 text-xs md:text-sm focus:ring-2 focus:ring-gray-200 shadow-sm bg-white/80 backdrop-blur-sm transition-all appearance-none pr-8"
      >
        <option value="">Все категории</option>
        <option value="новинки-и-избранное">Новинки и Избранное</option>
        <option value="мужская-коллекция">Мужская коллекция</option>
        <option value="женская-коллекция">Женская коллекция</option>
        <option value="детская-коллекция">Детская коллекция</option>
        <option value="скидки-и-акции">Скидки и Акции</option>
      </select>
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
        <FiChevronRight size={14} className="rotate-90" />
      </div>
    </div>
  </motion.div>
);

const CartDropdown = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateCartItem, getTotalAmount } = useCart();
  const [categoryFilter, setCategoryFilter] = useState("");
  const totalAmount = getTotalAmount();
  const contentRef = useRef(null);

  // Фильтрация с учётом объекта category
  const filteredItems = cartItems.filter((item) =>
    !categoryFilter ||
    (typeof item.category === "object"
      ? item.category.id === categoryFilter
      : item.category === categoryFilter)
  );

  const handleUpdate = useCallback(
    (item, changes) => {
      updateCartItem(item.id, item.selectedSize, item.selectedColor, changes);
    },
    [updateCartItem]
  );

  // Scroll to top when filter changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [categoryFilter]);

  return (
    <CartDropdownContainer isOpen={isOpen} onClose={onClose}>
      <CartDropdownHeader onClose={onClose} />
      
      {cartItems.length ? (
        <>
          <CategoryFilter value={categoryFilter} onChange={setCategoryFilter} />
          
          <motion.div 
            className="flex-grow overflow-y-auto"
            ref={contentRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <ul className="divide-y divide-gray-100/70 px-4 md:px-6">
              <AnimatePresence>
                {filteredItems.map((item) => (
                  <CartItem
                    key={getCartItemKey(item)}
                    item={item}
                    onRemove={(i) => {
                      handleUpdate(i, { remove: true });
                      removeFromCart(i.id, i.selectedSize, i.selectedColor);
                    }}
                    onQuantityChange={(i, delta) =>
                      handleUpdate(i, { quantity: i.quantity + delta })
                    }
                    onSizeChange={(i, size) =>
                      handleUpdate(i, { selectedSize: size })
                    }
                    onColorChange={(i, color) =>
                      handleUpdate(i, { selectedColor: color })
                    }
                  />
                ))}
              </AnimatePresence>
              
              {filteredItems.length === 0 && categoryFilter && (
                <motion.div 
                  className="py-10 text-center text-gray-500"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p>Нет товаров в выбранной категории</p>
                </motion.div>
              )}
            </ul>
          </motion.div>
          
          <CartSummary totalAmount={totalAmount} onClose={onClose} />
        </>
      ) : (
        <EmptyCartMessage />
      )}
    </CartDropdownContainer>
  );
};

export default memo(CartDropdown);

// ; ; Шаблон структуры товара Если что это шаблон структуры моих товаров и категорий точно такой структурой у меня имеется все товары на базе данной firebase Я тут просто сделал поставил структуру товаров и категории чтобы ты просто посмотрел как у меня реализован структура но основные все товары точно реализованы и заполнены и они находятся у меня на базе данных
// ; {
// ;   "id": "product-id",
// ;   "slug": "product-slug",
// ;   "brand": "Бренд",
// ;   "category": {
// ;     "id": "категория-id",
// ;     "slug": "категория-slug",
// ;     "name": {
// ;       "ru": "Название категории (RU)",
// ;       "en": "Category Name (EN)"
// ;     }
// ;   },
// ;   "subcategory": {
// ;     "id": "подкатегория-id",
// ;     "slug": "подкатегория-slug",
// ;     "name": {
// ;       "ru": "Название подкатегории (RU)",
// ;       "en": "Subcategory Name (EN)"
// ;     }
// ;   },
// ;   "gender": "мужской / женский / унисекс",
// ;   "ageGroup": "дети / взрослые / подростки",
// ;   "name": {
// ;     "ru": "Название товара (RU)",
// ;     "en": "Product Name (EN)"
// ;   },
// ;   "description": {
// ;     "ru": "Описание товара (RU)",
// ;     "en": "Product Description (EN)"
// ;   },
// ;   "features": {
// ;     "material": ["Материал1", "Материал2"],
// ;     "weight": "Вес",
// ;     "country": "Страна производства",
// ;     "seasonality": "Сезонность",
// ;     "sportType": ["Спорт1", "Спорт2"],
// ;     "warranty": "Гарантия",
// ;     "technology": ["Технология1", "Технология2"],
// ;     "insole": "Стелька",
// ;     "cushioning": "Амортизация",
// ;     "sole": "Подошва",
// ;     "flexibility": "Гибкость",
// ;     "kit": ["Что входит в комплект"]
// ;   },
// ;   "options": {
// ;     "colors": ["Цвет1", "Цвет2"],
// ;     "sizes": ["Размер1", "Размер2"]
// ;   },
// ;   "media": {
// ;     "imagesByColor": {
// ;       "Цвет1": "Ссылка на основное изображение",
// ;       "Цвет2": "Ссылка на основное изображение"
// ;     },
// ;     "additionalImagesByColor": {
// ;       "Цвет1": ["URL1", "URL2"],
// ;       "Цвет2": ["URL1", "URL2"]
// ;     },
// ;     "fallbackImage": "URL запасного изображения"
// ;   },
// ;   "pricing": {
// ;     "currency": "Валюта",
// ;     "basePrice": 0,
// ;     "minPrice": 0,
// ;     "variants": [
// ;       {
// ;         "color": "Цвет",
// ;         "size": "Размер",
// ;         "price": 0,
// ;         "stock": 0,
// ;         "sku": "Уникальный код товара"
// ;       }
// ;     ]
// ;   },
// ;   "promotions": [
// ;     { "type": "discount", "value": 0, "unit": "%", "active": true },
// ;     { "type": "cashback", "value": 0, "unit": "%", "active": false },
// ;     { "type": "promoCode", "code": "Код", "active": false },
// ;     { "type": "gift", "value": "Описание подарка", "active": false }
// ;   ],
// ;   "logistics": {
// ;     "fulfillment": "FBO / FBS / DBR",
// ;     "deliveryEstimate": "1–3 дня",
// ;     "shippingMethods": ["Курьер", "Почта", "Самовывоз"],
// ;     "packaging": "Описание упаковки",
// ;     "deliveryZones": ["Город1", "Город2"]
// ;   },
// ;   "availability": {
// ;     "status": "inStock / outOfStock / preorder",
// ;     "isPreorder": false,
// ;     "restockDate": null
// ;   },
// ;   "rating": {
// ;     "average": 0.0,
// ;     "count": 0
// ;   },
// ;   "analytics": {
// ;     "views": 0,
// ;     "cartAdds": 0,
// ;     "purchases": 0
// ;   },
// ;   "relations": {
// ;     "relatedProductIds": ["id1", "id2"],
// ;     "upsellProductIds": ["id3", "id4"],
// ;     "accessories": ["id5", "id6"]
// ;   },
// ;   "meta": {
// ;     "new": true,
// ;     "bestseller": false,
// ;     "tags": ["тег1", "тег2"]
// ;   }
// ; }

// ; Шаблон структуры категории 
// ; {
// ;   "id": "category-id",
// ;   "slug": "category-slug",
// ;   "slugAuto": true,
// ;   "name": {
// ;     "ru": "Название категории (RU)",
// ;     "en": "Category Name (EN)"
// ;   },
// ;   "description": {
// ;     "ru": "Описание категории (RU)",
// ;     "en": "Category Description (EN)"
// ;   },
// ;   "image": "URL изображения категории",
// ;   "icon": {
// ;     "type": "emoji | image",
// ;     "value": "Иконка (например, 🆕 или URL к изображению)"
// ;   },
// ;   "filters": [
// ;     { "name": "название фильтра", "type": "тип фильтра (select, tag, category, flag, range, size, text)" }
// ;   ],
// ;   "categoryType": ["promotional", "seasonal", "gendered", "discounted"],
// ;   "role": "primary | seasonal | secondary",
// ;   "seo": {
// ;     "title": "SEO заголовок",
// ;     "description": "SEO описание",
// ;     "keywords": ["keyword1", "keyword2"],
// ;     "index": true,
// ;     "canonical": "/categories/category-slug"
// ;   },
// ;   "landingPageId": "landing-page-identifier",
// ;   "meta": {
// ;     "isFeatured": true,
// ;     "isHidden": false,
// ;     "sortPriority": 1,
// ;     "badgeColor": "#FF3B30",
// ;     "createdAt": "2024-01-15T12:00:00Z",
// ;     "updatedAt": "2025-03-24T00:00:00Z",
// ;     "priorityWeight": 98
// ;   },
// ;   "analytics": {
// ;     "views": 0,
// ;     "clicks": 0,
// ;     "conversions": 0,
// ;     "ctr": 0.0,
// ;     "avgTimeOnPage": 0
// ;   },
// ;   "subcategories": [
// ;     {
// ;       "id": "subcategory-id",
// ;       "slug": "subcategory-slug",
// ;       "name": {
// ;         "ru": "Название подкатегории (RU)",
// ;         "en": "Subcategory Name (EN)"
// ;       },
// ;       "image": "URL изображения подкатегории",
// ;       "tag": "тег для фильтрации (например, new, limited, sale)",
// ;       "icon": {
// ;         "type": "emoji | image",
// ;         "value": "Иконка (например, 📦)"
// ;       },
// ;       "targetGender": "male | female | unisex",
// ;       "filters": [
// ;         { "name": "название фильтра", "type": "тип фильтра (select, tag, category, flag, range, size, text)" }
// ;       ],
// ;       "meta": {
// ;         "badge": "Текстовый бейдж",
// ;         "sortWeight": 1,
// ;         "isHidden": false
// ;       },
// ;       "analytics": {
// ;         "views": 0,
// ;         "clicks": 0,
// ;         "conversions": 0
// ;       },
// ;       "cta": {
// ;         "text": "Текст кнопки",
// ;         "url": "/catalog?category=category-id&subcategory=subcategory-id",
// ;         "style": "primary | secondary | warning"
// ;       }
// ;     }
// ;   ]
// ; }
  