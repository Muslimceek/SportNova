import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useCart } from "../../contexts/CartContext";

const calculateTotalStock = prod =>
  prod.pricing?.variants?.reduce((total, { stock = 0 }) => total + stock, 0) || 0;

const getProductPrice = prod => {
  const basePrice = Number(prod.pricing?.basePrice) || 0;
  const discount = prod.promotions?.find(p => p.type === "discount" && p.active);
  return discount
    ? { discounted: basePrice * (1 - discount.value / 100), original: basePrice }
    : { original: basePrice };
};

const RelatedProducts = ({ currentProductId, activeFilter = "category", setActiveFilter }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:4000/api/products");
        const data = await res.json();
        setRelatedProducts(data.filter(p => p.id !== currentProductId).slice(0, 4));
      } catch (error) {
        console.error("Ошибка при загрузке связанных товаров:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentProductId]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-8 sm:py-12 text-base sm:text-xl font-semibold">
        Загрузка товаров...
      </div>
    );

  return (
    <section className="py-8 sm:py-10 md:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-black uppercase">
            Рекомендуем
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {["category", "brand", "price"].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 sm:px-5 py-1.5 sm:py-2.5 text-xs sm:text-sm font-semibold uppercase transition-all rounded-full shadow-md tracking-wide ${
                  (activeFilter || "category") === filter
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                }`}
              >
                {filter === "category" ? "Категория" : filter === "brand" ? "Бренд" : "Цена"}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {relatedProducts.map(prod => {
            const totalStock = calculateTotalStock(prod);
            const pricing = getProductPrice(prod);
            return (
              <div
                key={prod.id}
                className="group bg-gray-100 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 relative"
              >
                {totalStock <= 5 && (
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-red-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold">
                    Осталось мало!
                  </div>
                )}
                <Link to={`/product/${prod.id}`} className="block p-3 sm:p-5 pb-0">
                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={prod.media?.fallbackImage || ""}
                      alt={prod.name?.ru || "Товар"}
                      className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </Link>
                <div className="p-3 sm:p-5">
                  <Link to={`/product/${prod.id}`} className="block">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2">
                      {prod.name?.ru || "Товар"}
                    </h3>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500 line-clamp-2">
                      {prod.shortDescription || prod.description?.ru}
                    </p>
                  </Link>
                  <div className="mt-2 sm:mt-3 flex items-center gap-2 sm:gap-3">
                    {"discounted" in pricing ? (
                      <>
                        <span className="text-lg sm:text-xl font-bold text-black">
                          {pricing.discounted.toFixed(2)} ₽
                        </span>
                        <span className="text-xs sm:text-sm text-gray-400 line-through">
                          {pricing.original.toFixed(2)} ₽
                        </span>
                      </>
                    ) : (
                      <span className="text-lg sm:text-xl font-bold text-black">
                        {pricing.original.toFixed(2)} ₽
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      addToCart({
                        ...prod,
                        quantity: 1,
                        selectedSize: prod.options?.sizes?.[0] || null,
                        selectedColor: prod.options?.colors?.[0] || null,
                      })
                    }
                    className="w-full mt-3 sm:mt-4 py-2 sm:py-3 bg-black text-white text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 hover:bg-gray-900 active:scale-95"
                  >
                    Добавить в корзину
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

RelatedProducts.propTypes = {
  currentProductId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  activeFilter: PropTypes.string,
  setActiveFilter: PropTypes.func.isRequired,
};

export default RelatedProducts;
