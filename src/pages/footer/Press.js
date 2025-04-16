import React from "react";

const pressArticles = [
  {
    title: "SportNova выходит на международный рынок",
    link: "https://www.rbc.ru/tags/?tag=%D0%A1%D0%9C%D0%98",
    date: "15 января 2024",
    source: "РБК"
  },
  {
    title: "Новая коллекция спортивной экипировки от SportNova",
    link: "https://www.kommersant.ru/",
    date: "20 декабря 2023",
    source: "Коммерсант"
  },
  {
    title: "Как SportNova меняет рынок спортивных товаров",
    link: "https://www.forbes.ru/",
    date: "5 ноября 2023",
    source: "Forbes"
  }
];

const Press = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 text-white">
      {/* Заголовок страницы */}
      <h1 className="text-4xl font-extrabold mb-6 text-center text-cyan-400">
        Пресса о SportNova
      </h1>

      <p className="text-lg text-gray-300 leading-relaxed text-center mb-8">
        Мы гордимся тем, что СМИ пишут о нас! Ознакомьтесь с последними новостями, 
        интервью и аналитическими материалами.
      </p>

      {/* Список публикаций в СМИ */}
      <div className="space-y-6">
        {pressArticles.map((article, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-white">{article.title}</h3>
            <p className="text-gray-400">{article.source} · {article.date}</p>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline mt-2 inline-block"
            >
              Читать статью →
            </a>
          </div>
        ))}
      </div>

      {/* Блок "Контакты для прессы" */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
        <h2 className="text-2xl font-bold text-cyan-400 mb-3">Контакты для прессы</h2>
        <p className="text-gray-300">
          Если вы журналист или представитель СМИ и хотите сотрудничать с нами, свяжитесь с нами:
        </p>
        <ul className="mt-4 space-y-2 text-gray-300">
          <li>📧 <strong>Email:</strong> press@sportnova.ru</li>
          <li>📞 <strong>Телефон:</strong> +7 (900) 123-45-67</li>
        </ul>
      </div>
    </div>
  );
};

export default Press;