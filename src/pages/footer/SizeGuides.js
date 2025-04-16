import React from "react";

const SizeGuides = () => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Гайды по размеру</h1>
      <p className="text-gray-400 mb-8">
        Выберите правильный размер для вашей экипировки, используя наши подробные таблицы размеров.
      </p>

      {/* Men's Footwear Size Chart */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Мужская обувь</h2>
        <table className="w-full text-gray-400">
          <thead>
            <tr>
              <th className="border px-4 py-2">US Размер</th>
              <th className="border px-4 py-2">UK Размер</th>
              <th className="border px-4 py-2">EU Размер</th>
              <th className="border px-4 py-2">Длина стопы (см)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">7</td>
              <td className="border px-4 py-2">6</td>
              <td className="border px-4 py-2">40</td>
              <td className="border px-4 py-2">25</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">8</td>
              <td className="border px-4 py-2">7</td>
              <td className="border px-4 py-2">41</td>
              <td className="border px-4 py-2">26</td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>

      {/* Women's Tops Size Chart */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Женские топы</h2>
        <table className="w-full text-gray-400">
          <thead>
            <tr>
              <th className="border px-4 py-2">Размер</th>
              <th className="border px-4 py-2">Обхват груди (см)</th>
              <th className="border px-4 py-2">Обхват талии (см)</th>
              <th className="border px-4 py-2">Обхват бедер (см)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">S</td>
              <td className="border px-4 py-2">82–88</td>
              <td className="border px-4 py-2">67–72</td>
              <td className="border px-4 py-2">91–96</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">M</td>
              <td className="border px-4 py-2">88–94</td>
              <td className="border px-4 py-2">72–77</td>
              <td className="border px-4 py-2">96–101</td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>

      {/* Kids' Footwear Size Chart */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Детская обувь</h2>
        <table className="w-full text-gray-400">
          <thead>
            <tr>
              <th className="border px-4 py-2">US Размер</th>
              <th className="border px-4 py-2">UK Размер</th>
              <th className="border px-4 py-2">EU Размер</th>
              <th className="border px-4 py-2">Длина стопы (см)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">1Y</td>
              <td className="border px-4 py-2">13.5</td>
              <td className="border px-4 py-2">32</td>
              <td className="border px-4 py-2">20.3</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">2Y</td>
              <td className="border px-4 py-2">1.5</td>
              <td className="border px-4 py-2">33.5</td>
              <td className="border px-4 py-2">21.2</td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>

      <p className="text-gray-400">
        Для получения более подробной информации посетите официальный сайт Nike:{" "}
        <a
          href="https://www.nike.com/ru/size-fit-guide"
          className="text-cyan-400 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nike Size Guide
        </a>
      </p>
    </div>
  );
};

export default SizeGuides;