import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, HelpCircle } from "lucide-react";

const SuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ✅ Получаем реальные данные платежа из URL (clientSecret, orderId, amount)
  const refNumber = searchParams.get("orderId") || "000085752257";
  const status = "Success";
  const date = new Date().toLocaleString("ru-RU");
  const amount = searchParams.get("amount") || "₽1,000,000";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gray-100 px-4"
    >
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        {/* ✅ Верхний блок с подтверждением */}
        <div className="text-center p-6 border-b">
          <CheckCircle size={50} className="text-green-500 mx-auto mb-2" />
          <h2 className="text-xl font-semibold text-gray-900">Оплата прошла успешно!</h2>
          <p className="text-2xl font-bold mt-2">{amount}</p>
        </div>

        {/* ✅ Детали платежа */}
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Детали платежа</h3>
          <div className="space-y-2 text-gray-600">
            <div className="flex justify-between">
              <span>Номер заказа</span>
              <span className="font-medium">{refNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Статус платежа</span>
              <span className="font-medium text-green-500">{status}</span>
            </div>
            <div className="flex justify-between">
              <span>Дата и время</span>
              <span className="font-medium">{date}</span>
            </div>
            <div className="flex justify-between">
              <span>Итого</span>
              <span className="font-medium">{amount}</span>
            </div>
          </div>
        </div>

        {/* ✅ Кнопка возврата */}
        <div className="p-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition w-full"
          >
            Вернуться на главную
          </button>
        </div>

        {/* ✅ Блок "Проблемы с оплатой?" */}
        <div className="p-4 flex items-center gap-3 border-t cursor-pointer hover:bg-gray-100 transition">
          <HelpCircle size={24} className="text-purple-500" />
          <div>
            <p className="text-gray-800 font-semibold">Проблемы с оплатой?</p>
            <p className="text-gray-600 text-sm">Обратитесь в службу поддержки.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SuccessPage;