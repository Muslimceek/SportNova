import React from "react";

const Privacy = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 text-white">
      {/* Заголовок страницы */}
      <h1 className="text-4xl font-extrabold mb-6 text-center text-cyan-400">
        Политика конфиденциальности
      </h1>

      <p className="text-lg text-gray-300 leading-relaxed text-center mb-8">
        Ваша конфиденциальность важна для нас. Мы стремимся обеспечивать защиту ваших персональных данных и 
        предоставлять вам максимальный контроль над тем, как они используются.
      </p>

      {/* 1. Сбор информации */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-3">1. Сбор информации</h2>
        <p className="text-gray-300">
          Мы собираем следующую информацию:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-300 mt-3">
          <li>Персональные данные (имя, email, телефон, адрес доставки) — при регистрации или оформлении заказа.</li>
          <li>Технические данные (IP-адрес, тип устройства, браузер) — для улучшения работы сайта.</li>
          <li>Информация о заказах и платежах — для обработки транзакций.</li>
        </ul>
      </div>

      {/* 2. Использование информации */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-3">2. Использование информации</h2>
        <p className="text-gray-300">
          Мы используем собранные данные для:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-300 mt-3">
          <li>Оформления и доставки ваших заказов.</li>
          <li>Улучшения работы сайта и удобства пользователей.</li>
          <li>Отправки уведомлений, акций и персонализированных предложений.</li>
        </ul>
      </div>

      {/* 3. Защита данных */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-3">3. Защита данных</h2>
        <p className="text-gray-300">
          Мы принимаем меры по защите ваших данных от утечек, несанкционированного доступа и взломов. 
          Однако, несмотря на все усилия, полная защита в интернете не может быть гарантирована.
        </p>
      </div>

      {/* 4. Раскрытие информации третьим лицам */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-3">4. Раскрытие информации третьим лицам</h2>
        <p className="text-gray-300">
          Мы не передаем ваши данные третьим лицам, за исключением случаев:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-300 mt-3">
          <li>Если это необходимо для выполнения заказа (службы доставки, платежные системы).</li>
          <li>Если этого требует законодательство.</li>
          <li>При защите наших прав или предотвращении мошенничества.</li>
        </ul>
      </div>

      {/* 5. Файлы cookie */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-3">5. Файлы cookie</h2>
        <p className="text-gray-300">
          Мы используем файлы cookie для улучшения пользовательского опыта. Вы можете отключить их в настройках браузера, 
          но это может повлиять на функциональность сайта.
        </p>
      </div>

      {/* 6. Ссылки на сторонние ресурсы */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-3">6. Сторонние ресурсы</h2>
        <p className="text-gray-300">
          Мы не несем ответственности за политику конфиденциальности сторонних сайтов, на которые могут вести ссылки с нашего ресурса.
        </p>
      </div>

      {/* 7. Изменения в политике */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-3">7. Изменения в политике</h2>
        <p className="text-gray-300">
          Мы можем обновлять данную политику конфиденциальности. Все изменения будут опубликованы на этой странице.
        </p>
      </div>

      {/* 8. Контакты */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-cyan-400 mb-3">8. Контакты</h2>
        <p className="text-gray-300">
          Если у вас есть вопросы по поводу политики конфиденциальности, свяжитесь с нами:
        </p>
        <ul className="mt-4 space-y-2 text-gray-300">
          <li>📧 <strong>Email:</strong> privacy@sportnova.ru</li>
          <li>📞 <strong>Телефон:</strong> +7 (900) 123-45-67</li>
        </ul>
      </div>
    </div>
  );
};

export default Privacy;