import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../contexts/CartContext";
import ProductCard from "../../components/ProductCard";

const FeaturedProducts = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clickedProductId, setClickedProductId] = useState(null);
  const { addToCart } = useCart();
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/products");
        const data = await res.json();

        const sorted = data
          .map((p) => ({
            ...p,
            popularityScore: p.analytics?.views || 0,
          }))
          .sort((a, b) => b.popularityScore - a.popularityScore)
          .slice(0, 8);

        setPopularProducts(sorted.length ? sorted : data.slice(0, 8));
      } catch (error) {
        console.error("Ошибка загрузки:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleBuyNow = (product) => {
    setClickedProductId(product.id);
    addToCart({ ...product, quantity: 1 });
    setTimeout(() => {
      setClickedProductId(null);
      window.location.href = "/cart";
    }, 800);
  };

  const scrollSlider = (direction) => {
    const scrollAmount = sliderRef.current.offsetWidth * 0.85;
    sliderRef.current.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="relative py-16 px-6 md:py-20 md:px-8 bg-[#f9f9f9] dark:bg-neutral-900 transition-colors"
      aria-labelledby="title-featured-products"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 gap-4">
          <h2
            id="title-featured-products"
            className="text-3xl md:text-4xl font-bold tracking-wide text-black dark:text-white uppercase"
          >
            Популярные товары
          </h2>
          <div className="flex gap-3">
            {["prev", "next"].map((dir) => (
              <button
                key={dir}
                aria-label={dir === "prev" ? "Предыдущие товары" : "Следующие товары"}
                onClick={() => scrollSlider(dir)}
                className="p-2.5 rounded-full border hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 ease-in-out tracking-wide"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    d={
                      dir === "prev"
                        ? "M15.525 18.966L8.558 12l6.967-6.967"
                        : "M8.474 18.966L15.44 12 8.474 5.033"
                    }
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div
          ref={sliderRef}
          className="overflow-x-auto scroll-smooth no-scrollbar"
        >
          {loading ? (
            <div className="flex gap-5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="min-w-[18rem] w-72 h-[480px] bg-gray-200 dark:bg-neutral-700 rounded-lg overflow-hidden shadow-sm animate-pulse"
                >
                  <div className="h-3/5 bg-gray-300 dark:bg-neutral-600"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-gray-300 dark:bg-neutral-600 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-neutral-600 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-300 dark:bg-neutral-600 rounded w-full mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : popularProducts.length > 0 ? (
            <AnimatePresence>
              <ul className="flex gap-5" aria-label="Список популярных товаров">
                {popularProducts.map((product, index) => (
                  <motion.li
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5, ease: "easeInOut" }}
                    className="min-w-[18rem] hover:shadow-md transition-shadow duration-300 ease-in-out"
                  >
                    <ProductCard
                      product={product}
                      onBuyNow={() => handleBuyNow(product)}
                      isClicked={clickedProductId === product.id}
                      hoverEffect="highlight"
                    />
                  </motion.li>
                ))}
              </ul>
            </AnimatePresence>
          ) : (
            <motion.div
              className="text-center py-10 md:py-14"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                Нет доступных товаров.
              </p>
              <button className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-neutral-800 transition-all duration-300 ease-in-out">
                Смотреть все товары
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
