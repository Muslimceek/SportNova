import React from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db } from "../../firebaseConfig";
import { FiArrowLeft } from "react-icons/fi";

const fetchOrderById = async (orderId) => {
  const orderRef = doc(db, "orders", orderId);
  const orderSnap = await getDoc(orderRef);
  if (!orderSnap.exists()) throw new Error("Заказ не найден");
  return { id: orderSnap.id, ...orderSnap.data() };
};

const OrderDetail = () => {
  const { orderId } = useParams();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ["orderDetail", orderId],
    queryFn: () => fetchOrderById(orderId),
    enabled: !!orderId,
  });

  if (isLoading) {
    return <div className="text-center py-20">Загрузка заказа...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600 font-medium">
        Ошибка: {error.message}
      </div>
    );
  }

  // Приводим createdAt к Date. Если хранится Timestamp (например, Firestore Timestamp), то используем метод toDate()
  const orderDate =
    order.createdAt && typeof order.createdAt === "object" && order.createdAt.toDate
      ? order.createdAt.toDate()
      : new Date(order.createdAt);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        to="/user/orders"
        className="flex items-center mb-6 text-sm text-gray-600 hover:underline"
      >
        <FiArrowLeft className="mr-2" />
        Назад к заказам
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Заказ #{order.id.slice(-6).toUpperCase()}
      </h1>

      <div className="bg-white rounded-xl p-6 shadow-md mb-6">
        <p className="text-gray-600 mb-2">
          Дата оформления:{" "}
          {order.createdAt
            ? orderDate.toLocaleString("ru-RU", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Не указана"}
        </p>
        <p className="text-gray-600 mb-2">
          Сумма: <strong>₽{Number(order.amount).toFixed(2)}</strong>
        </p>
        <p className="text-gray-600 mb-2">
          Статус: <strong>{order.status || "Ожидается"}</strong>
        </p>
        <p className="text-gray-600 mb-2">
          Способ оплаты: <strong>{order.paymentMethod || "Не указан"}</strong>
        </p>
        <p className="text-gray-600">
          Адрес доставки:{" "}
          <strong>{order.shippingAddress || "Не указан"}</strong>
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-4">Товары в заказе:</h2>
      <div className="space-y-6">
        {order.items?.map((item, index) => {
          const selectedColor = item.variant?.color || item.selectedColor || "Не указан";
          const selectedSize = item.variant?.size || item.selectedSize || "Не указан";
          const priceValue = item.variant?.price || item.price || 0;
          const price = typeof priceValue === "number" ? priceValue.toFixed(2) : priceValue;

          const media = item.media || {};
          const mainImage =
            (media.imagesByColor && media.imagesByColor[selectedColor]) ||
            media.fallbackImage ||
            "/fallback.jpg";

          return (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center gap-6 bg-gray-50 p-6 rounded-lg border"
            >
              <div className="md:w-1/3">
                <img
                  src={mainImage}
                  alt={item.name?.ru || item.name || "Товар"}
                  className="w-full h-auto object-contain rounded"
                />
              </div>

              <div className="flex-1">
                <p className="font-medium text-gray-900 text-lg">
                  {item.name?.ru || item.name || "Без названия"}
                </p>
                <p className="text-sm text-gray-500">
                  Бренд: {item.brand || "Не указан"}
                </p>
                <p className="text-sm text-gray-500">
                  Категория: {item.category?.name?.ru || "Не указана"}
                  {item.subcategory?.name?.ru && ` / ${item.subcategory.name.ru}`}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {item.description?.ru || "Описание отсутствует"}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Выбранный цвет: {selectedColor}
                </p>
                <p className="text-sm text-gray-600">
                  Выбранный размер: {selectedSize}
                </p>
                <p className="text-sm text-gray-600">
                  Количество: {item.quantity}
                </p>
                {item.features && (
                  <div className="mt-2 text-sm text-gray-600">
                    {item.features.material && (
                      <p>
                        Материал:{" "}
                        {Array.isArray(item.features.material)
                          ? item.features.material.join(", ")
                          : item.features.material}
                      </p>
                    )}
                    {item.features.technology && (
                      <p>
                        Технологии:{" "}
                        {Array.isArray(item.features.technology)
                          ? item.features.technology.join(", ")
                          : item.features.technology}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <p className="font-semibold text-black text-lg">₽{price}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderDetail;
