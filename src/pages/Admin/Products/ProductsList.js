import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

// Функция для вычисления цены с учетом скидки
const getProductPricing = (prod) => {
  const base = Number(prod.pricing?.basePrice) || 0;
  const discount = prod.promotions?.find((p) => p.type === "discount" && p.active);
  return discount ? { original: base, discounted: base * (1 - discount.value / 100) } : { original: base };
};

// Группировка остатков по размерам для выбранного цвета
const getStockBySizes = (prod, color) => {
  if (Array.isArray(prod.pricing?.variants)) {
    return prod.pricing.variants
      .filter((v) => v.color === color)
      .reduce((acc, v) => ({ ...acc, [v.size]: v.stock }), {});
  }
  return null;
};

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    (async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();
        const res = await fetch("http://localhost:4000/api/products", {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Ошибка загрузки товаров");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Ошибка при загрузке товаров:", err);
      }
    })();
  }, [auth]);

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Управление товарами
        </h1>
        <Link
          to="/admin/products/new"
          className="flex items-center bg-gradient-to-r from-green-400 to-cyan-500 px-6 py-3 rounded-xl hover:scale-105 transition-transform duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Добавить товар
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-xl">Нет доступных товаров</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((prod) => {
            const colors = prod.options?.colors || [];
            const imageUrl = prod.media?.fallbackImage || "";
            const prodName = prod.name?.ru || "Товар";
            const prodDesc = prod.description?.ru || "";
            const pricing = getProductPricing(prod);
            const categoryName = prod.category?.name?.ru || "";
            const subcategoryName = prod.subcategory?.name?.ru || "";
            const brand = prod.brand || "";
            const gender = prod.gender || "";
            const ageGroup = prod.ageGroup || "";
            const defaultColor = colors[0] || null;
            const stockBySizes = defaultColor ? getStockBySizes(prod, defaultColor) : null;
            const additionalImages = prod.media?.additionalImagesByColor?.[defaultColor] || [];

            return (
              <div
                key={prod.docId || prod.id}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="mb-4">
                  <div className="h-48 bg-gray-700 rounded-xl mb-4 flex items-center justify-center">
                    {imageUrl ? (
                      <img src={imageUrl} alt={prodName} className="h-full w-full object-cover rounded-xl" />
                    ) : (
                      <span className="text-gray-400">Изображение отсутствует</span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{prodName}</h3>
                  <p className="text-gray-300 mb-2">{prodDesc}</p>
                  <div className="flex flex-col text-gray-400 text-sm mb-4">
                    <span>
                      Цена:{" "}
                      {pricing.discounted ? (
                        <>
                          <span className="line-through mr-2">{pricing.original.toFixed(2)} ₽</span>
                          <span className="text-green-400 mr-2">{pricing.discounted.toFixed(2)} ₽</span>
                          <span className="text-blue-400">(Мин: {Number(prod.pricing?.minPrice || 0).toFixed(2)} ₽)</span>
                        </>
                      ) : (
                        pricing.original.toFixed(2) + " ₽"
                      )}
                    </span>
                    <span>Валюта: {prod.pricing?.currency || "RUB"}</span>
                    <span>Категория: {categoryName}</span>
                    <span>Подкатегория: {subcategoryName}</span>
                    <span>Бренд: {brand}</span>
                    <span>Пол: {gender}</span>
                    <span>Возраст: {ageGroup}</span>
                  </div>
                  {prod.features && (
                    <div className="text-gray-300 text-sm mb-4">
                      <h4 className="font-semibold mb-1">Характеристики:</h4>
                      <ul className="list-disc ml-5">
                        {Object.entries(prod.features).map(([key, value]) => (
                          <li key={key}>
                            <strong>{key}:</strong>{" "}
                            {Array.isArray(value) ? value.join(", ") : value}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {additionalImages.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-300 mb-2">Доп. изображения ({defaultColor}):</h4>
                      <div className="flex space-x-2">
                        {additionalImages.map((url, idx) => (
                          <img key={idx} src={url} alt={`Доп изображение ${idx + 1}`} className="w-16 h-16 object-cover rounded" />
                        ))}
                      </div>
                    </div>
                  )}
                  {stockBySizes && (
                    <div className="text-gray-300 text-sm mb-4">
                      <h4 className="font-semibold mb-1">Остатки по размерам ({defaultColor}):</h4>
                      <ul className="list-disc ml-5">
                        {Object.entries(stockBySizes).map(([size, qty]) => (
                          <li key={size}>
                            <strong>Размер {size}:</strong> {qty} шт.
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {prod.promotions && Array.isArray(prod.promotions) && prod.promotions.length > 0 && (
                    <div className="text-gray-300 text-sm mb-4">
                      <h4 className="font-semibold mb-1">Акции:</h4>
                      <ul className="list-disc ml-5">
                        {prod.promotions.map((promo, i) => (
                          <li key={i}>
                            <strong>{promo.type}:</strong>{" "}
                            {promo.type === "promoCode" ? promo.code : promo.value + (promo.unit || "")}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-3">
                  <Link
                    to={`/admin/products/edit/${prod.docId || prod.id}`}
                    className="flex items-center px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Редактировать
                  </Link>
                  <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                    Удалить
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductsList;
