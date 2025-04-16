import React from "react";

const Shipping = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 text-white">
      {/* Заголовок страницы */}
      <h1 className="text-4xl font-extrabold mb-6 text-center text-cyan-400">
        Варианты и сроки доставки
      </h1>

      <p className="text-lg text-gray-300 leading-relaxed text-center mb-8">
        Мы предлагаем удобные способы доставки по всей стране. Выберите оптимальный вариант и получите свой заказ вовремя.
      </p>

      {/* Раздел: Способы доставки */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-3">1. Способы доставки</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-300">
          <li><strong>Курьерская доставка</strong> – 2-4 дня, до двери.</li>
          <li><strong>Пункты самовывоза</strong> – 1-3 дня, удобное местоположение.</li>
          <li><strong>Почтовая доставка</strong> – 5-10 дней, доступна по всей России.</li>
          <li><strong>Экспресс-доставка</strong> – в течение 24 часов (в крупных городах).</li>
        </ul>
      </div>

      {/* Раздел: Стоимость доставки */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-3">2. Стоимость доставки</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-300">
          <li><strong>Курьер:</strong> 300₽ (бесплатно при заказе от 5000₽).</li>
          <li><strong>Самовывоз:</strong> бесплатно.</li>
          <li><strong>Почта России:</strong> 200-400₽ (в зависимости от региона).</li>
          <li><strong>Экспресс:</strong> 700₽.</li>
        </ul>
      </div>

      {/* Раздел: Отслеживание заказа */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-3">3. Отслеживание заказа</h2>
        <p className="text-gray-300">
          После оформления заказа вы получите трек-номер для отслеживания посылки. Перейдите в <a href="/track" className="text-cyan-400 hover:underline">раздел отслеживания</a>, чтобы проверить статус доставки.
        </p>
      </div>

      {/* Раздел: Контакты службы поддержки */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-cyan-400 mb-3">4. Контакты службы доставки</h2>
        <p className="text-gray-300">
          Если у вас есть вопросы по доставке, свяжитесь с нашей поддержкой:
        </p>
        <ul className="mt-4 space-y-2 text-gray-300">
          <li>📧 <strong>Email:</strong> shipping@sportnova.ru</li>
          <li>📞 <strong>Телефон:</strong> +7 (900) 123-45-67</li>
          <li>📍 <strong>Адрес склада:</strong> Москва, ул. Логистическая, д. 8</li>
        </ul>
      </div>
    </div>
  );
};

export default Shipping;