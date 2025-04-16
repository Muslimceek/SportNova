import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../contexts/CartContext";
import CheckoutForm from "./CheckoutForm";
import Breadcrumbs from "../../components/Breadcrumbs";

// Мобильный селектор размеров – без изменений
const MobileSizeSelector = ({ sizes, selectedSize, onSelect }) => (
  <div className="flex gap-2 overflow-x-auto py-2">
    {sizes.map((size) => (
      <button
        key={size}
        onClick={() => onSelect(size)}
        className={`px-3 py-1 rounded transition-colors duration-200 ${
          selectedSize === size ? "bg-black text-white" : "bg-gray-100 text-black hover:bg-gray-200"
        }`}
      >
        {size}
      </button>
    ))}
  </div>
);

const ClearCartButton = () => {
  const { clearCart } = useCart();
  return (
    <button
      onClick={() => window.confirm("Очистить корзину?") && clearCart()}
      className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
    >
      Очистить всё
    </button>
  );
};

const CartHeader = ({ updateMessage, totalItems, itemsTotal }) => (
  <header className="bg-white text-black font-sans py-6 px-4 md:px-8 border-b border-gray-200 shadow-sm">
    <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Ваша корзина</h1>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-4">
          <p className="text-base">
            {totalItems} {totalItems === 1 ? "предмет" : "предметов"}
          </p>
          <div className="w-px h-6 bg-gray-300" />
          <p className="text-xl font-bold">₽{itemsTotal.toFixed(2)}</p>
        </div>
        <ClearCartButton />
      </div>
    </div>
    {updateMessage && (
      <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-center text-base font-medium text-black">
        {updateMessage}
      </motion.p>
    )}
  </header>
);

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    updateCartItem,
    getTotalAmount,
    getTotalItemsCount,
  } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  const handleVariantChange = useCallback(
    (item, newSize, newColor) => {
      updateCartItem(item.id, item.selectedSize, item.selectedColor, {
        selectedSize: newSize || item.selectedSize,
        selectedColor: newColor || item.selectedColor,
      });
      setUpdateMessage("Корзина обновлена");
      setTimeout(() => setUpdateMessage(""), 2000);
    },
    [updateCartItem]
  );

  const CartItem = ({ item }) => {
    const defaultImage = item.media?.fallbackImage || "";
    const initialImage = item.media?.imagesByColor?.[item.selectedColor] || defaultImage;
    const [currentImage, setCurrentImage] = useState(initialImage);

    const uniqueSizes = useMemo(() => {
      const sizes = item.pricing?.variants
        .filter((v) => v.color === item.selectedColor && v.stock > 0)
        .map((v) => v.size) || [];
      return Array.from(new Set(sizes));
    }, [item]);

    const currentVariant = useMemo(() => 
      item.pricing?.variants.find(
        (v) => v.color === item.selectedColor && v.size === item.selectedSize
      ), [item]);

    const stockCount = currentVariant ? currentVariant.stock : 0;

    const variantPrice = useMemo(() => {
      const variant = item.pricing?.variants.find(
        (v) => v.color === item.selectedColor && v.size === item.selectedSize
      );
      return variant ? Number(variant.price) : Number(item.pricing?.basePrice || 0);
    }, [item]);

    const discountPromotion = useMemo(() => item.promotions?.find((p) => p.type === "discount" && p.active), [item]);
    const finalPrice = discountPromotion ? variantPrice * (1 - discountPromotion.value / 100) : variantPrice;

    useEffect(() => {
      setCurrentImage(item.media?.imagesByColor?.[item.selectedColor] || defaultImage);
    }, [item.selectedColor, item.media, defaultImage]);

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col md:flex-row bg-gray-50 text-black p-6 gap-6 border-b border-gray-200 rounded transition-all">
        <div className="w-full md:w-80 flex-shrink-0">
          <div className="relative aspect-square bg-gray-100 rounded overflow-hidden">
            <img src={currentImage} alt={item.name?.ru || "Товар"} className="w-full h-full object-contain p-4" />
            <div className="absolute bottom-2 left-2 flex gap-2">
              {item.media?.imagesByColor &&
                Object.keys(item.media.imagesByColor).map((color) => (
                  <button
                    key={color}
                    onClick={() => handleVariantChange(item, null, color)}
                    onMouseEnter={() => setCurrentImage(item.media.imagesByColor[color] || defaultImage)}
                    onMouseLeave={() => setCurrentImage(item.media.imagesByColor[item.selectedColor] || defaultImage)}
                    className={`w-8 h-8 rounded-full border transition-colors ${item.selectedColor === color ? "border-black" : "border-transparent"} overflow-hidden`}
                  >
                    <img src={item.media.imagesByColor[color] || defaultImage} alt={`Цвет ${color}`} className="w-full h-full object-cover" />
                  </button>
                ))}
            </div>
          </div>
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {item.media?.additionalImagesByColor?.[item.selectedColor]?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Доп. изображение ${i + 1}`}
                className="w-20 h-20 object-cover rounded cursor-pointer transition-transform hover:scale-105"
                onClick={() => setCurrentImage(img)}
              />
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{item.name?.ru || "Товар"}</h2>
            {item.sku && <p className="text-sm text-gray-500 mb-2">SKU: {item.sku}</p>}
            <div className="mb-4">
              <p className="text-sm mb-2">Доступные размеры:</p>
              <div className="flex flex-wrap gap-2">
                {(item.options?.sizes || uniqueSizes).map((size) => (
                  <button
                    key={size}
                    onClick={() => handleVariantChange(item, size, null)}
                    disabled={!uniqueSizes.includes(size)}
                    className={`px-4 py-2 rounded text-sm transition-colors ${
                      item.selectedSize === size
                        ? "bg-black text-white"
                        : uniqueSizes.includes(size)
                        ? "bg-gray-100 hover:bg-gray-200"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="text-xs mt-2">Осталось: {stockCount} {stockCount === 1 ? "пара" : "пар"}</p>
            </div>
            <div className="space-y-2 text-sm mb-6">
              <p>Технологии: {(item.features?.technology || []).join(" • ")}</p>
              <p>Материал: {(item.features?.material || []).join(" / ")}</p>
              <p>Стелька: {item.features?.insole}</p>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-gray-100 rounded-full px-4 py-2">
                <button
                  onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="text-black hover:text-gray-600 disabled:opacity-30 transition-colors"
                >
                  −
                </button>
                <motion.span key={item.quantity} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-8 text-center font-medium">
                  {item.quantity}
                </motion.span>
                <button
                  onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                  className="text-black hover:text-gray-600 transition-colors"
                >
                  +
                </button>
              </div>
              <button onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)} className="text-black hover:text-gray-600 transition-colors">
                Удалить
              </button>
            </div>
            <div className="text-right">
              {discountPromotion ? (
                <>
                  <p className="text-sm line-through">₽{variantPrice.toFixed(2)}</p>
                  <p className="text-xl font-bold">₽{finalPrice.toFixed(2)}</p>
                  <p className="text-xs mt-1">Экономия ₽{(variantPrice - finalPrice).toFixed(2)}</p>
                </>
              ) : (
                <p className="text-xl font-bold">₽{variantPrice.toFixed(2)}</p>
              )}
            </div>
          </div>
        </div>
        <div className="md:hidden mt-4">
          <MobileSizeSelector sizes={uniqueSizes} selectedSize={item.selectedSize} onSelect={(newSize) => handleVariantChange(item, newSize, null)} />
        </div>
        <motion.div key={`${item.selectedColor}-${item.selectedSize}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-4">
          <p className="text-sm">Вариант: {item.selectedColor}, {item.selectedSize}</p>
        </motion.div>
      </motion.div>
    );
  };

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <CartHeader updateMessage={updateMessage} totalItems={getTotalItemsCount()} itemsTotal={getTotalAmount()} />
        <CheckoutForm amount={getTotalAmount()} onBack={() => setShowCheckout(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <CartHeader updateMessage={updateMessage} totalItems={getTotalItemsCount()} itemsTotal={getTotalAmount()} />
      <div className="max-w-screen-xl mx-auto px-4 py-2 text-sm">
        <Breadcrumbs />
      </div>
      <main className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-24">
            <h2 className="text-3xl font-bold mb-6">Ваша корзина пуста</h2>
            <Link to="/catalog" className="inline-block px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition">
              Начать покупки
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <CartItem key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} item={item} />
                ))}
              </AnimatePresence>
            </div>
            <div className="bg-gray-50 text-black p-6 rounded-xl border border-gray-200 h-fit sticky top-8 shadow-sm">
              <h3 className="text-2xl font-bold mb-6">Сумма заказа</h3>
              <div className="space-y-4">
                {cartItems.some((item) => item.promotions?.gift) && (
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="font-medium mb-2">🎁 Ваши подарки:</p>
                    <ul className="space-y-1 text-sm">
                      {cartItems.map((item) => item.promotions?.gift && <li key={item.id}>• {item.promotions.gift}</li>)}
                    </ul>
                  </div>
                )}
                <div className="space-y-2">
                  <input placeholder="Введите промокод" className="w-full px-4 py-2 bg-gray-100 rounded text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition" />
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <span>Доставка:</span>
                    <span className="font-medium">{cartItems[0]?.logistics?.deliveryTime || "Не указано"}</span>
                  </div>
                  <p className="text-sm">📦 {cartItems[0]?.logistics?.packaging || ""}</p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <span>Итого:</span>
                    <span className="text-2xl font-bold">₽{getTotalAmount().toFixed(2)}</span>
                  </div>
                  <button onClick={() => setShowCheckout(true)} className="w-full py-4 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition">
                    Перейти к оплате
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
