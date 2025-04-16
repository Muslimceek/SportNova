import React, { useState, useEffect } from "react";

const SizeGuideModal = ({ setShowSizeGuide }) => {
  const [genderGuide, setGenderGuide] = useState("men"); // "men", "women", "kids"
  const [guideType, setGuideType] = useState("clothing"); // "clothing" или "shoes"
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Запускаем анимацию открытия
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShowSizeGuide(false);
    }, 300);
  };

  const renderTable = () => {
    if (genderGuide === "men") {
      if (guideType === "clothing") {
        return (
          <table className="w-full text-sm text-left text-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Размер</th>
                <th className="px-4 py-2 border">Обхват груди (см)</th>
                <th className="px-4 py-2 border">Обхват талии (см)</th>
                <th className="px-4 py-2 border">Обхват бедер (см)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border">S</td>
                <td className="px-4 py-2 border">92-96</td>
                <td className="px-4 py-2 border">76-80</td>
                <td className="px-4 py-2 border">96-100</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border">M</td>
                <td className="px-4 py-2 border">96-100</td>
                <td className="px-4 py-2 border">80-84</td>
                <td className="px-4 py-2 border">100-104</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border">L</td>
                <td className="px-4 py-2 border">100-104</td>
                <td className="px-4 py-2 border">84-88</td>
                <td className="px-4 py-2 border">104-108</td>
              </tr>
            </tbody>
          </table>
        );
      } else {
        // Мужская обувь
        return (
          <table className="w-full text-sm text-left text-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Размер (EU)</th>
                <th className="px-4 py-2 border">Размер (US)</th>
                <th className="px-4 py-2 border">Длина стопы (см)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border">40</td>
                <td className="px-4 py-2 border">7</td>
                <td className="px-4 py-2 border">25</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border">41</td>
                <td className="px-4 py-2 border">7.5</td>
                <td className="px-4 py-2 border">25.5</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border">42</td>
                <td className="px-4 py-2 border">8</td>
                <td className="px-4 py-2 border">26</td>
              </tr>
            </tbody>
          </table>
        );
      }
    } else if (genderGuide === "women") {
      if (guideType === "clothing") {
        return (
          <table className="w-full text-sm text-left text-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Размер</th>
                <th className="px-4 py-2 border">Обхват груди (см)</th>
                <th className="px-4 py-2 border">Обхват талии (см)</th>
                <th className="px-4 py-2 border">Обхват бедер (см)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border">XS</td>
                <td className="px-4 py-2 border">78-82</td>
                <td className="px-4 py-2 border">62-66</td>
                <td className="px-4 py-2 border">86-90</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border">S</td>
                <td className="px-4 py-2 border">82-86</td>
                <td className="px-4 py-2 border">66-70</td>
                <td className="px-4 py-2 border">90-94</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border">M</td>
                <td className="px-4 py-2 border">86-90</td>
                <td className="px-4 py-2 border">70-74</td>
                <td className="px-4 py-2 border">94-98</td>
              </tr>
            </tbody>
          </table>
        );
      } else {
        // Женская обувь
        return (
          <table className="w-full text-sm text-left text-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Размер (EU)</th>
                <th className="px-4 py-2 border">Размер (US)</th>
                <th className="px-4 py-2 border">Длина стопы (см)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border">36</td>
                <td className="px-4 py-2 border">5</td>
                <td className="px-4 py-2 border">22.5</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border">37</td>
                <td className="px-4 py-2 border">5.5</td>
                <td className="px-4 py-2 border">23</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border">38</td>
                <td className="px-4 py-2 border">6</td>
                <td className="px-4 py-2 border">23.5</td>
              </tr>
            </tbody>
          </table>
        );
      }
    } else if (genderGuide === "kids") {
      if (guideType === "clothing") {
        return (
          <table className="w-full text-sm text-left text-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Размер</th>
                <th className="px-4 py-2 border">Рост (см)</th>
                <th className="px-4 py-2 border">Обхват талии (см)</th>
                <th className="px-4 py-2 border">Обхват бедер (см)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border">110-116</td>
                <td className="px-4 py-2 border">110-116</td>
                <td className="px-4 py-2 border">50-54</td>
                <td className="px-4 py-2 border">55-59</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border">116-122</td>
                <td className="px-4 py-2 border">116-122</td>
                <td className="px-4 py-2 border">54-58</td>
                <td className="px-4 py-2 border">59-63</td>
              </tr>
            </tbody>
          </table>
        );
      } else {
        // Детская обувь
        return (
          <table className="w-full text-sm text-left text-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Размер (EU)</th>
                <th className="px-4 py-2 border">Размер (US)</th>
                <th className="px-4 py-2 border">Длина стопы (см)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border">28</td>
                <td className="px-4 py-2 border">9</td>
                <td className="px-4 py-2 border">16</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border">29</td>
                <td className="px-4 py-2 border">9.5</td>
                <td className="px-4 py-2 border">16.5</td>
              </tr>
            </tbody>
          </table>
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`
          bg-white rounded-lg max-w-2xl w-full p-6 transform transition-all duration-300
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}
        `}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Таблица размеров</h3>
          <button onClick={handleClose} className="text-gray-600 hover:text-gray-900 transition">
            &times;
          </button>
        </div>

        {/* Переключатель по полу */}
        <div className="flex mb-4 border-b">
          <button
            onClick={() => setGenderGuide("men")}
            className={`mr-4 pb-2 transition-colors ${
              genderGuide === "men"
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Мужская
          </button>
          <button
            onClick={() => setGenderGuide("women")}
            className={`mr-4 pb-2 transition-colors ${
              genderGuide === "women"
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Женская
          </button>
          <button
            onClick={() => setGenderGuide("kids")}
            className={`pb-2 transition-colors ${
              genderGuide === "kids"
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Детская
          </button>
        </div>

        {/* Переключатель типа таблицы */}
        <div className="flex mb-4 border-b">
          <button
            onClick={() => setGuideType("clothing")}
            className={`mr-4 pb-2 transition-colors ${
              guideType === "clothing"
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Одежда
          </button>
          <button
            onClick={() => setGuideType("shoes")}
            className={`pb-2 transition-colors ${
              guideType === "shoes"
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Обувь
          </button>
        </div>

        <div className="overflow-auto max-h-96">{renderTable()}</div>
        <div className="mt-4 flex justify-end">
          <button onClick={handleClose} className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;