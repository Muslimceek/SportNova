import React from "react";

const Returns = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 text-white">
      {/* Заголовок страницы */}
      <h1 className="text-4xl font-extrabold mb-6 text-center text-cyan-400">
        Политика возврата товаров
      </h1>

      <p className="text-lg text-gray-300 leading-relaxed text-center mb-8">
        Мы стремимся сделать процесс возврата удобным и простым. Ознакомьтесь с нашими условиями возврата и получите деньги обратно без лишних сложностей.
      </p>

      {/* Раздел: Условия возврата */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-3">1. Условия возврата</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-300">
          <li>Товар можно вернуть в течение <span className="text-cyan-400 font-semibold">14 дней</span> с момента покупки.</li>
          <li>Возврат возможен только при наличии чека или подтверждения покупки.</li>
          <li>Товар должен быть в оригинальной упаковке, без следов использования.</li>
          <li>Некоторые категории товаров (например, нижнее белье, гигиенические изделия) не подлежат возврату.</li>
        </ul>
      </div>

      {/* Раздел: Как вернуть товар */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-3">2. Как вернуть товар?</h2>
        <p className="text-gray-300">
          Для оформления возврата выполните следующие шаги:
        </p>
        <ul className="list-decimal pl-6 space-y-2 text-gray-300 mt-3">
          <li>Свяжитесь с нашей службой поддержки и уточните возможность возврата.</li>
          <li>Упакуйте товар в оригинальную упаковку.</li>
          <li>Отправьте товар на наш склад или передайте его в одном из розничных магазинов.</li>
          <li>После проверки состояния товара деньги будут возвращены на ваш счет в течение 3-5 рабочих дней.</li>
        </ul>
      </div>

      {/* Раздел: Способы возврата средств */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-3">3. Способы возврата средств</h2>
        <p className="text-gray-300">
          Вы можете получить возврат средств следующим способом:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-300 mt-3">
          <li>На банковскую карту (Visa, MasterCard, МИР).</li>
          <li>На электронный кошелек (Qiwi, ЮMoney).</li>
          <li>Наличными в розничном магазине.</li>
        </ul>
      </div>

      {/* Раздел: Контакты службы поддержки */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-cyan-400 mb-3">4. Контакты службы поддержки</h2>
        <p className="text-gray-300">
          Если у вас есть вопросы по возврату, обратитесь в службу поддержки:
        </p>
        <ul className="mt-4 space-y-2 text-gray-300">
          <li>📧 <strong>Email:</strong> returns@sportnova.ru</li>
          <li>📞 <strong>Телефон:</strong> +7 (900) 123-45-67</li>
          <li>📍 <strong>Адрес склада:</strong> Москва, ул. Спортивная, д. 12</li>
        </ul>
      </div>
    </div>
  );
};

export default Returns;