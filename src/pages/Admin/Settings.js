import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: "Спорт Нова",
    siteDescription: "Магазин спортивных товаров",
    contactEmail: "info@sportnova.com",
    contactPhone: "+7 (999) 123-45-67",
    address: "г. Москва, ул. Спортивная, 10",
    socialLinks: {
      facebook: "https://facebook.com/sportnova",
      instagram: "https://instagram.com/sportnova",
      twitter: "https://twitter.com/sportnova",
      vk: "https://vk.com/sportnova",
    },
    maintenanceMode: false,
    allowRegistration: true,
    orderEmailNotifications: true,
    defaultCurrency: "RUB",
    taxRate: 20,
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    // Здесь можно загрузить настройки с сервера
    // fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/settings");
      setSettings(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке настроек:", error);
      toast.error("Не удалось загрузить настройки");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setSettings({
        ...settings,
        [parent]: {
          ...settings[parent],
          [child]: value
        }
      });
    } else {
      setSettings({
        ...settings,
        [name]: type === "checkbox" ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Здесь будет запрос на сохранение настроек
      // await axios.post("/api/admin/settings", settings);
      toast.success("Настройки успешно сохранены");
    } catch (error) {
      console.error("Ошибка при сохранении настроек:", error);
      toast.error("Не удалось сохранить настройки");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-xl p-6 text-white">
      <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
        Настройки системы
      </h1>

      <div className="mb-6 border-b border-gray-700">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab("general")}
            className={`py-2 px-4 ${
              activeTab === "general"
                ? "border-b-2 border-blue-500 text-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Общие
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={`py-2 px-4 ${
              activeTab === "contact"
                ? "border-b-2 border-blue-500 text-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Контакты
          </button>
          <button
            onClick={() => setActiveTab("social")}
            className={`py-2 px-4 ${
              activeTab === "social"
                ? "border-b-2 border-blue-500 text-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Соц. сети
          </button>
          <button
            onClick={() => setActiveTab("system")}
            className={`py-2 px-4 ${
              activeTab === "system"
                ? "border-b-2 border-blue-500 text-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Система
          </button>
        </nav>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Общие настройки */}
        {activeTab === "general" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">Название сайта</label>
                <input
                  type="text"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Описание сайта</label>
                <input
                  type="text"
                  name="siteDescription"
                  value={settings.siteDescription}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Валюта по умолчанию</label>
                <select
                  name="defaultCurrency"
                  value={settings.defaultCurrency}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="RUB">Российский рубль (₽)</option>
                  <option value="USD">Доллар США ($)</option>
                  <option value="EUR">Евро (€)</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Ставка налога (%)</label>
                <input
                  type="number"
                  name="taxRate"
                  value={settings.taxRate}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Контактная информация */}
        {activeTab === "contact" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">Email для связи</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Телефон</label>
                <input
                  type="text"
                  name="contactPhone"
                  value={settings.contactPhone}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">Адрес</label>
                <textarea
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* Социальные сети */}
        {activeTab === "social" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">Facebook</label>
                <input
                  type="url"
                  name="socialLinks.facebook"
                  value={settings.socialLinks.facebook}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Instagram</label>
                <input
                  type="url"
                  name="socialLinks.instagram"
                  value={settings.socialLinks.instagram}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Twitter</label>
                <input
                  type="url"
                  name="socialLinks.twitter"
                  value={settings.socialLinks.twitter}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">ВКонтакте</label>
                <input
                  type="url"
                  name="socialLinks.vk"
                  value={settings.socialLinks.vk}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Системные настройки */}
        {activeTab === "system" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="maintenanceMode"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500 bg-gray-800 border-gray-700"
                />
                <label htmlFor="maintenanceMode" className="ml-2 text-gray-300">
                  Режим обслуживания (сайт будет недоступен для посетителей)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allowRegistration"
                  name="allowRegistration"
                  checked={settings.allowRegistration}
                  onChange={handleChange}
                  className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500 bg-gray-800 border-gray-700"
                />
                <label htmlFor="allowRegistration" className="ml-2 text-gray-300">
                  Разрешить регистрацию новых пользователей
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="orderEmailNotifications"
                  name="orderEmailNotifications"
                  checked={settings.orderEmailNotifications}
                  onChange={handleChange}
                  className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500 bg-gray-800 border-gray-700"
                />
                <label htmlFor="orderEmailNotifications" className="ml-2 text-gray-300">
                  Отправлять уведомления о заказах на email
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => fetchSettings()}
            className="px-6 py-2 mr-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Сбросить
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-colors flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Сохранение...
              </>
            ) : (
              "Сохранить настройки"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;