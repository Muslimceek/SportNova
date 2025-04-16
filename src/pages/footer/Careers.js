import React, { useState } from "react";

const jobListings = [
  {
    title: "Менеджер по продажам",
    location: "Москва, Россия",
    type: "Полная занятость",
    description: "Ищем активного и целеустремленного менеджера для работы с клиентами.",
    requirements: ["Опыт в продажах от 1 года", "Коммуникабельность", "Грамотная речь"],
  },
  {
    title: "Контент-менеджер",
    location: "Удаленно",
    type: "Частичная занятость",
    description: "Создание контента для социальных сетей и сайта магазина.",
    requirements: ["Опыт работы с контентом", "Знание SMM", "Креативность"],
  },
  {
    title: "Курьер",
    location: "Санкт-Петербург, Россия",
    type: "Частичная занятость",
    description: "Доставка товаров клиентам по городу и области.",
    requirements: ["Ответственность", "Наличие личного транспорта приветствуется"],
  },
];

const JobCard = ({ job }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
    <h3 className="text-xl font-semibold text-white">{job.title}</h3>
    <p className="text-gray-400">{job.location} · {job.type}</p>
    <p className="text-gray-300 mt-2">{job.description}</p>
    <h4 className="text-lg font-semibold text-cyan-400 mt-4">Требования:</h4>
    <ul className="list-disc pl-6 text-gray-300">
      {job.requirements.map((req, idx) => (
        <li key={idx}>{req}</li>
      ))}
    </ul>
  </div>
);

const Careers = () => {
  const [filter, setFilter] = useState("");

  const filteredJobs = jobListings.filter(
    (job) =>
      job.type.includes(filter) ||
      job.location.includes(filter)
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 text-white">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-cyan-400">
        Карьера в SportNova
      </h1>

      <p className="text-lg text-gray-300 leading-relaxed text-center mb-8">
        Мы постоянно развиваемся и ищем профессионалов, которые хотят стать частью нашей команды.
      </p>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-cyan-400 mb-3">Почему стоит работать у нас?</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-300">
          <li>Конкурентоспособная зарплата и бонусы.</li>
          <li>Дружный коллектив и комфортная рабочая атмосфера.</li>
          <li>Гибкий график и возможность удаленной работы.</li>
          <li>Скидки на спортивные товары и экипировку.</li>
        </ul>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-3">Открытые вакансии</h2>
        <input
          type="text"
          placeholder="Фильтр по типу занятости или местоположению"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mb-4 p-2 rounded-lg bg-gray-700 text-white"
        />
        {filteredJobs.map((job, index) => (
          <JobCard key={index} job={job} />
        ))}
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
        <h2 className="text-2xl font-bold text-cyan-400 mb-3">Как подать заявку?</h2>
        <p className="text-gray-300">
          Отправьте свое резюме на email: <span className="text-cyan-400 font-semibold">hr@sportnova.ru</span>
          с темой письма "Вакансия - [Название должности]".
        </p>
      </div>
    </div>
  );
};

export default Careers;