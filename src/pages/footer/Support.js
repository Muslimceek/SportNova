import React from "react";

const Support = () => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Поддержка</h1>
      <p className="text-gray-400 mb-6">
        Свяжитесь с нами, если вам нужна помощь с заказом или у вас возникли вопросы.
      </p>

      {/* Раздел FAQ */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Часто задаваемые вопросы</h2>
        <ul className="list-disc list-inside text-gray-400">
          <li className="mb-2">
            <strong>Как отследить мой заказ?</strong>
            <p>Вы можете отследить свой заказ, перейдя в раздел <a href="/track" className="text-cyan-400">Отслеживание заказа</a>.</p>
          </li>
          <li className="mb-2">
            <strong>Как вернуть товар?</strong>
            <p>Инструкции по возврату товара доступны в разделе <a href="/returns" className="text-cyan-400">Возвраты</a>.</p>
          </li>
          <li className="mb-2">
            <strong>Какие варианты доставки доступны?</strong>
            <p>Подробную информацию о доставке вы найдете в разделе <a href="/shipping" className="text-cyan-400">Доставка</a>.</p>
          </li>
        </ul>
      </div>

      {/* Контактная информация */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Свяжитесь с нами</h2>
        <p className="text-gray-400">
          Если у вас есть дополнительные вопросы, свяжитесь с нашей службой поддержки:
        </p>
        <ul className="list-none mt-4 text-gray-400">
          <li className="mb-2">
            <strong>Телефон:</strong> <a href="tel:+1234567890" className="text-cyan-400">+1 (234) 567-890</a>
          </li>
          <li className="mb-2">
            <strong>Электронная почта:</strong> <a href="mailto:support@example.com" className="text-cyan-400">support@example.com</a>
          </li>
        </ul>
      </div>

      {/* Форма обратной связи */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Отправить запрос</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-400 mb-2">Имя</label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 text-gray-900 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-400 mb-2">Электронная почта</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 text-gray-900 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-400 mb-2">Сообщение</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              className="w-full px-4 py-2 text-gray-900 rounded-md"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-cyan-400 text-gray-900 px-4 py-2 rounded-md hover:bg-cyan-500"
          >
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
};

export default Support;