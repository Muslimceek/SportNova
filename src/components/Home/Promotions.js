import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import ProductCard from "../ProductCard";

const Promotions = () => {
  const [promotedProducts, setPromotedProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Ошибка получения товаров");
        }
        return res.json();
      })
      .then((data) => {
        const filteredProducts = data
          .filter(
            (product) =>
              product.promotions?.some(
                (promo) => promo.type === "discount" && promo.active
              )
          )
          .slice(0, 8);
        setPromotedProducts(filteredProducts);
      })
      .catch((err) => console.error("Ошибка загрузки товаров:", err));
  }, []);

  return (
    <section className="relative bg-[#f5f5f5] text-black py-20 px-4 font-montserrat">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight mb-4">
            Специальные предложения
          </h2>
          <p className="text-neutral-600 text-lg">Лучшие скидки сезона</p>
        </motion.div>

        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          spaceBetween={24}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet bg-black/20",
            bulletActiveClass: "!bg-black",
          }}
          autoplay={{ delay: 5000, pauseOnMouseEnter: true }}
          breakpoints={{
            480: { slidesPerView: 1.2 },
            640: { slidesPerView: 1.5 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="!pb-16"
        >
          {promotedProducts.map((product, index) => (
            <SwiperSlide key={product.id || product.slug || index}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Promotions;
