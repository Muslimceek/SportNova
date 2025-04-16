// src/pages/Checkout/OrderSuccess.js
import React from "react";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-green-900 font-montserrat">
      <h1 className="text-4xl font-bold mb-4">✅ Спасибо за покупку!</h1>
      <p className="text-lg mb-6">Ваш заказ успешно оформлен.</p>
      <Link
        to="/catalog"
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Вернуться в магазин
      </Link>
    </div>
  );
};

export default OrderSuccess;
