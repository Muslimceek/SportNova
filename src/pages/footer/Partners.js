import React from "react";

const Partners = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 text-white">
      {/* Заголовок страницы */}
      <h1 className="text-4xl font-extrabold mb-6 text-center text-cyan-400">
        Партнерство с SportNova
      </h1>

      <p className="text-lg text-gray-300 leading-relaxed text-center mb-8">
        Мы открыты к сотрудничеству с производителями, поставщиками, блогерами и спортивными
        клубами. Присоединяйтесь к нам и развивайте бизнес вместе!
      </p>

      {/* Преимущества партнерства */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-cyan-400 mb-3">Почему сотрудничать с нами?</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-300">
          <li>Широкая аудитория клиентов по всей стране.</li>
          <li>Гибкие условия сотрудничества.</li>
          <li>Продвижение партнеров через наши платформы.</li>
          <li>Официальные договоры и прозрачные условия.</li>
        </ul>
      </div>

      {/* Варианты партнерства */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-cyan-400 mb-3">Варианты сотрудничества</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-300">
          <li><span className="text-cyan-400 font-semibold">Производители и поставщики:</span> продажа ваших товаров на нашей платформе.</li>
          <li><span className="text-cyan-400 font-semibold">Спортивные клубы:</span> экипировка, спонсорская поддержка и совместные акции.</li>
          <li><span className="text-cyan-400 font-semibold">Инфлюенсеры и блогеры:</span> партнерские программы и рекламные кампании.</li>
          <li><span className="text-cyan-400 font-semibold">Корпоративные клиенты:</span> оптовые закупки для бизнеса и организаций.</li>
        </ul>
      </div>

      {/* Контакты для партнеров */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-cyan-400 mb-3">Свяжитесь с нами</h2>
        <p className="text-gray-300">
          Если вы хотите обсудить возможности сотрудничества, свяжитесь с нашим отделом партнерства:
        </p>
        <ul className="mt-4 space-y-2 text-gray-300">
          <li>📧 <strong>Email:</strong> partners@sportnova.ru</li>
          <li>📞 <strong>Телефон:</strong> +7 (900) 123-45-67</li>
        </ul>
      </div>
    </div>
  );
};

export default Partners;