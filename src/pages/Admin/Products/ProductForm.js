import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

// Общие стили для инпутов
const inputClass = "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all";

// Универсальный компонент секции формы
const Section = ({ title, children, gridCols = "grid-cols-1 md:grid-cols-2" }) => (
  <section className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-2xl mb-8">
    <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
    <div className={`grid ${gridCols} gap-6`}>{children}</div>
  </section>
);

// Универсальный компонент текстового поля
const InputField = ({ label, name, value, onChange, type = "text", placeholder = "" }) => (
  <div>
    <label className="block text-gray-300 text-sm mb-2">{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className={inputClass} />
  </div>
);

// Функция для глубокого обновления вложенных полей
const updateField = (prev, keys, value) => {
  let updated = { ...prev };
  let obj = updated;
  keys.slice(0, -1).forEach((key) => {
    obj[key] = { ...obj[key] };
    obj = obj[key];
  });
  obj[keys[keys.length - 1]] = value;
  return updated;
};

const ProductForm = () => {
  const { docId } = useParams();
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [productData, setProductData] = useState({
    id: "", slug: "", brand: "",
    category: { id: "", slug: "", name: { ru: "", en: "" } },
    subcategory: { id: "", slug: "", name: { ru: "", en: "" } },
    gender: "", ageGroup: "",
    name: { ru: "", en: "" },
    description: { ru: "", en: "" },
    features: {
      material: [], weight: "", country: "", warranty: "", sportType: [], seasonality: "", kit: [], technology: [], insole: "", cushioning: "", soleType: "", flexibility: ""
    },
    options: { colors: [], sizes: [] },
    media: { imagesByColor: {}, additionalImagesByColor: {}, fallbackImage: "" },
    pricing: { currency: "", basePrice: 0, minPrice: 0, variants: [] },
    promotions: [],
    logistics: { fulfillment: "", deliveryTime: "", shippingOptions: [], packaging: "" },
    availability: { status: "", isPreorder: false, restockDate: null },
    rating: { average: 0, count: 0 },
    analytics: {}, relations: {}, meta: {},
    selectedSize: "", selectedColor: "", favorite: false, localReviews: [],
  });

  // Пример автозаполнения
  const sampleProduct = {
    id: "sportnova-ultraboost", slug: "sportnova-ultraboost", brand: "SportNova",
    category: { id: "новинки-и-изbrannoe", slug: "novinki-i-izbrannoe", name: { ru: "Новинки и Избранное", en: "Featured & New" } },
    subcategory: { id: "новые-поступления", slug: "novye-postupleniya", name: { ru: "Новые поступления", en: "New Arrivals" } },
    gender: "унисекс", ageGroup: "взрослые",
    name: { ru: "SportNova УльтраБуст", en: "SportNova UltraBoost" },
    description: {
      ru: "Современные кроссовки для активного образа жизни с инновационной амортизацией и стильным дизайном.",
      en: "Modern sneakers for an active lifestyle with innovative cushioning and stylish design.",
    },
    features: {
      material: ["Сетка", "Синтетика", "Резина"], weight: "260 г", country: "Китай", warranty: "12 месяцев",
      sportType: ["Бег", "Фитнес"], seasonality: "Всесезонный", kit: ["Пара кроссовок"], technology: ["Nova AirFlow", "UltraFlex Sole"],
      insole: "Стелька с эффектом памяти", cushioning: "Пена SoftTouch", soleType: "Противоскользящая резина", flexibility: "Высокая",
    },
    options: { colors: ["Чёрный", "Белый", "Серый"], sizes: ["38", "39", "40", "41", "42", "43"] },
    media: {
      imagesByColor: {
        "Чёрный": "https://i.pinimg.com/736x/5d/07/5b/5d075bd6f6c95dcf3c5b73ed35c5f0e5.jpg",
        "Белый": "https://i.pinimg.com/736x/0a/79/97/0a7997b64546624c711663ea2c495f3d.jpg",
        "Серый": "https://i.pinimg.com/736x/4c/7a/99/4c7a9918d2cebe2108383a44e1b68827.jpg",
      },
      additionalImagesByColor: {
        "Чёрный": [
          "https://i.pinimg.com/474x/5f/fe/5c/5ffe5c03ec670f6acaaf27d27ed19b52.jpg",
          "https://i.pinimg.com/474x/db/5b/d2/db5bd2eefc8dc7f8b47c3d30f742f36b.jpg",
        ],
        "Белый": [
          "https://i.pinimg.com/474x/fb/cc/75/fbcc7508f049dc6b756981844bd3135a.jpg",
          "https://i.pinimg.com/474x/57/4e/db/574edb09cb49bf06704dd0324f5db164.jpg",
        ],
        "Серый": [
          "https://i.pinimg.com/474x/77/6c/b5/776cb5e927d4715fcb7136d6c7f825a1.jpg",
          "https://i.pinimg.com/474x/9d/68/1e/9d681e4c87b5dd92ce06d0ac33b9f8c2.jpg",
        ],
      },
      fallbackImage: "https://i.pinimg.com/736x/4c/7a/99/4c7a9918d2cebe2108383a44e1b68827.jpg",
    },
    pricing: {
      currency: "RUB", basePrice: 12900, minPrice: 11500,
      variants: [
        { color: "Чёрный", size: "38", price: 11990, stock: 10, sku: "SN-UB-BLK-38" },
        // ... другие варианты
      ],
    },
    promotions: [
      { type: "discount", value: 10, unit: "%", active: true },
      { type: "cashback", value: 3, unit: "%", active: true },
      { type: "promoCode", code: "ULTRA10", active: true },
      { type: "gift", value: "Спортивные носки в подарок", active: true },
    ],
    logistics: {
      fulfillment: "FBO", deliveryTime: "1-3 дня", shippingOptions: ["Курьер", "Почта", "Самовывоз"],
      packaging: "Экологичная коробка SportNova",
    },
    availability: { status: "inStock", isPreorder: false, restockDate: null },
    rating: { average: 4.7, count: 36 },
    analytics: { views: 1438, cartAdds: 274, purchases: 89 },
    relations: {
      relatedProductIds: ["sportnova-runlite", "sportnova-airstep"],
      upsellProductIds: ["sportnova-smartwatch", "sportnova-gymbag"],
      accessories: ["sportnova-socks-pack", "sportnova-cleaner"],
    },
    meta: { new: true, bestseller: false, tags: ["спорт", "новинка", "бег", "унисекс"] },
    selectedSize: "42", selectedColor: "Чёрный", favorite: false, localReviews: [],
  };

  // Обработчики обновления данных
  const handleAutoFill = () => setProductData(sampleProduct);
  const handleChange = e => setProductData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleNestedChange = (e, field) => setProductData(prev => updateField(prev, [field, e.target.name], e.target.value));
  const handleArrayChange = (e, key, parent = "features") => {
    const arr = e.target.value.split(",").map(item => item.trim());
    setProductData(prev => updateField(prev, [parent, key], arr));
  };
  const handleNestedArrayChange = (e, parentField, childField) => {
    const arr = e.target.value.split(",").map(item => item.trim());
    setProductData(prev => updateField(prev, [parentField, childField], arr));
  };
  const handleJsonChange = (e, fieldName) => {
    try {
      const parsed = JSON.parse(e.target.value);
      setProductData(prev => ({ ...prev, [fieldName]: parsed }));
    } catch (error) {
      console.error(`Invalid JSON for ${fieldName}`);
    }
  };
  const handleImageUpload = (e, color, fieldType) => {
    const files = e.target.files;
    if (!files.length) return;
    if (fieldType === "imagesByColor") {
      const imageUrl = URL.createObjectURL(files[0]);
      setProductData(prev => ({
        ...prev,
        media: {
          ...prev.media,
          imagesByColor: { ...prev.media.imagesByColor, [color]: imageUrl },
        },
      }));
    } else if (fieldType === "additionalImagesByColor") {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setProductData(prev => ({
        ...prev,
        media: {
          ...prev.media,
          additionalImagesByColor: {
            ...prev.media.additionalImagesByColor,
            [color]: [...(prev.media.additionalImagesByColor[color] || []), ...newImages],
          },
        },
      }));
    }
  };


  useEffect(() => {
    if (docId) {
      setLoading(true);
      (async () => {
        try {
          const token = await auth.currentUser.getIdToken();
          const res = await fetch(`http://localhost:4000/api/products/${docId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Ошибка при загрузке товара");
          const data = await res.json();
          setProductData(data);
        } catch (error) {
          setError(error.message);
          console.error(error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [docId, auth]);

  const navigate = useNavigate();
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = await auth.currentUser.getIdToken();
      const method = docId ? "PUT" : "POST";
      const url = docId
        ? `http://localhost:4000/api/products/${docId}`
        : "http://localhost:4000/api/products";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(productData),
      });
      if (!res.ok) throw new Error("Ошибка сохранения товара");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!docId || !window.confirm("Вы уверены, что хотите удалить этот товар?")) return;
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`http://localhost:4000/api/products/${docId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Ошибка при удалении товара");
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="text-white text-xl">Загрузка...</div>
        </div>
      )}
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
          Ошибка: {error}
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-8">
          {docId ? "Редактирование продукта" : "Новый продукт"}
        </h1>
        <button
          type="button"
          onClick={handleAutoFill}
          className="mb-6 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:scale-105 transition-transform"
        >
          Автозаполнить пример
        </button>
        <form onSubmit={handleSubmit} className="space-y-8">
          <Section title="Основная информация" gridCols="grid-cols-1 md:grid-cols-2">
            <InputField label="Название (RU)" name="ru" value={productData.name?.ru || ""} onChange={e => setProductData(updateField(productData, ["name", "ru"], e.target.value))} />
            <InputField label="Название (EN)" name="en" value={productData.name?.en || ""} onChange={e => setProductData(updateField(productData, ["name", "en"], e.target.value))} />
            <InputField label="Бренд" name="brand" value={productData.brand || ""} onChange={handleChange} />
            <InputField label="Категория ID" name="id" value={productData.category?.id || ""} onChange={e => setProductData(updateField(productData, ["category", "id"], e.target.value))} />
            <InputField label="Категория slug" name="slug" value={productData.category?.slug || ""} onChange={e => setProductData(updateField(productData, ["category", "slug"], e.target.value))} />
            <InputField label="Название категории (RU)" name="ru" value={productData.category?.name?.ru || ""} onChange={e => setProductData(updateField(productData, ["category", "name", "ru"], e.target.value))} />
            <InputField label="Название категории (EN)" name="en" value={productData.category?.name?.en || ""} onChange={e => setProductData(updateField(productData, ["category", "name", "en"], e.target.value))} />
            <InputField label="Подкатегория ID" name="id" value={productData.subcategory?.id || ""} onChange={e => setProductData(updateField(productData, ["subcategory", "id"], e.target.value))} />
            <InputField label="Подкатегория slug" name="slug" value={productData.subcategory?.slug || ""} onChange={e => setProductData(updateField(productData, ["subcategory", "slug"], e.target.value))} />
            <InputField label="Название подкатегории (RU)" name="ru" value={productData.subcategory?.name?.ru || ""} onChange={e => setProductData(updateField(productData, ["subcategory", "name", "ru"], e.target.value))} />
            <InputField label="Название подкатегории (EN)" name="en" value={productData.subcategory?.name?.en || ""} onChange={e => setProductData(updateField(productData, ["subcategory", "name", "en"], e.target.value))} />
            <InputField label="Описание (RU)" name="ru" value={productData.description?.ru || ""} onChange={e => setProductData(updateField(productData, ["description", "ru"], e.target.value))} />
            <InputField label="Описание (EN)" name="en" value={productData.description?.en || ""} onChange={e => setProductData(updateField(productData, ["description", "en"], e.target.value))} />
            <InputField label="Пол" name="gender" value={productData.gender || ""} onChange={handleChange} />
            <InputField label="Возраст (ageGroup)" name="ageGroup" value={productData.ageGroup || ""} onChange={handleChange} />
            <InputField label="Доступные цвета (через запятую)" name="colors" value={productData.options?.colors?.join(", ") || ""} onChange={e => handleArrayChange(e, "colors", "options")} />
            <InputField label="Доступные размеры (через запятую)" name="sizes" value={productData.options?.sizes?.join(", ") || ""} onChange={e => handleArrayChange(e, "sizes", "options")} />
            <InputField label="Выбранный размер" name="selectedSize" value={productData.selectedSize || ""} onChange={handleChange} />
            <InputField label="Выбранный цвет" name="selectedColor" value={productData.selectedColor || ""} onChange={handleChange} />
          </Section>
          <Section title="Ценообразование" gridCols="grid-cols-1 md:grid-cols-3">
            <InputField label="Оригинальная цена" name="basePrice" type="number" value={productData.pricing?.basePrice || ""} onChange={e => setProductData(updateField(productData, ["pricing", "basePrice"], e.target.value))} />
            <InputField label="Цена со скидкой" name="discounted" type="number" value={productData.pricing?.discounted || ""} onChange={e => setProductData(updateField(productData, ["pricing", "discounted"], e.target.value))} />
            <InputField label="Минимальная цена" name="minPrice" type="number" value={productData.pricing?.minPrice || ""} onChange={e => setProductData(updateField(productData, ["pricing", "minPrice"], e.target.value))} />
            <InputField label="Валюта" name="currency" value={productData.pricing?.currency || ""} onChange={e => setProductData(updateField(productData, ["pricing", "currency"], e.target.value))} />
          </Section>
          <Section title="Характеристики" gridCols="grid-cols-1 md:grid-cols-2">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Материал (через запятую)</label>
              <input type="text" name="material" value={productData.features?.material?.join(", ") || ""} onChange={e => handleArrayChange(e, "material")} className={inputClass} />
            </div>
            <InputField label="Вес" name="weight" value={productData.features?.weight || ""} onChange={e => handleNestedChange(e, "features")} />
            <InputField label="Страна производства" name="country" value={productData.features?.country || ""} onChange={e => handleNestedChange(e, "features")} />
            <InputField label="Гарантия" name="warranty" value={productData.features?.warranty || ""} onChange={e => handleNestedChange(e, "features")} />
            <div>
              <label className="block text-gray-300 text-sm mb-2">Тип спорта (через запятую)</label>
              <input type="text" name="sportType" value={productData.features?.sportType?.join(", ") || ""} onChange={e => handleArrayChange(e, "sportType")} className={inputClass} />
            </div>
            <InputField label="Сезонность" name="seasonality" value={productData.features?.seasonality || ""} onChange={e => handleNestedChange(e, "features")} />
            <div>
              <label className="block text-gray-300 text-sm mb-2">Комплектация (через запятую)</label>
              <input type="text" name="kit" value={productData.features?.kit?.join(", ") || ""} onChange={e => handleArrayChange(e, "kit")} className={inputClass} />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Технологии (через запятую)</label>
              <input type="text" name="technology" value={productData.features?.technology?.join(", ") || ""} onChange={e => handleArrayChange(e, "technology")} className={inputClass} />
            </div>
            <InputField label="Стелька" name="insole" value={productData.features?.insole || ""} onChange={e => handleNestedChange(e, "features")} />
            <InputField label="Амортизация" name="cushioning" value={productData.features?.cushioning || ""} onChange={e => handleNestedChange(e, "features")} />
            <InputField label="Тип подошвы" name="soleType" value={productData.features?.soleType || ""} onChange={e => handleNestedChange(e, "features")} />
            <InputField label="Гибкость" name="flexibility" value={productData.features?.flexibility || ""} onChange={e => handleNestedChange(e, "features")} />
          </Section>
          <Section title="Медиа" gridCols="grid-cols-1">
            <InputField label="URL основного изображения" name="fallbackImage" value={productData.media?.fallbackImage || ""} onChange={e => setProductData(prev => ({ ...prev, media: { ...prev.media, fallbackImage: e.target.value } }))} />
            {productData.media?.fallbackImage && (
              <div className="relative group mb-4">
                <div className="border-2 border-gray-700 rounded-xl overflow-hidden transition-all group-hover:border-cyan-500">
                  <img src={productData.media.fallbackImage} alt="Предпросмотр" className="w-full h-64 object-cover rounded-lg" />
                </div>
              </div>
            )}
            <div className="mb-4">
              <h3 className="text-white text-lg mb-2">Загрузка основного изображения по цвету</h3>
              {productData.options?.colors?.length ? (
                productData.options.colors.map(color => (
                  <div key={color} className="mb-4">
                    <label className="block text-gray-300 text-sm mb-2">Выберите файл для {color}:</label>
                    <input type="file" accept="image/*" onChange={e => handleImageUpload(e, color, "imagesByColor")} className="text-white" />
                  </div>
                ))
              ) : (
                <p className="text-gray-300">Укажите цвета в опциях для загрузки изображений.</p>
              )}
            </div>
            <div className="mb-4">
              <h3 className="text-white text-lg mb-2">Загрузка дополнительных изображений по цвету</h3>
              {productData.options?.colors?.length ? (
                productData.options.colors.map(color => (
                  <div key={color} className="mb-4">
                    <label className="block text-gray-300 text-sm mb-2">Выберите файлы для {color} (множественный выбор):</label>
                    <input type="file" accept="image/*" multiple onChange={e => handleImageUpload(e, color, "additionalImagesByColor")} className="text-white" />
                  </div>
                ))
              ) : (
                <p className="text-gray-300">Укажите цвета в опциях для загрузки изображений.</p>
              )}
            </div>
            <div className="mt-4">
              <label className="block text-gray-300 text-sm mb-2">JSON-формат основного изображения по цвету:</label>
              <textarea readOnly value={JSON.stringify(productData.media?.imagesByColor || {}, null, 2)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white h-32" />
            </div>
            <div className="mt-4">
              <label className="block text-gray-300 text-sm mb-2">JSON-формат дополнительных изображений по цвету:</label>
              <textarea readOnly value={JSON.stringify(productData.media?.additionalImagesByColor || {}, null, 2)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white h-32" />
            </div>
          </Section>
          <Section title="Логистика" gridCols="grid-cols-1 md:grid-cols-2">
            <InputField label="Fulfillment" name="fulfillment" value={productData.logistics?.fulfillment || ""} onChange={e => handleNestedChange(e, "logistics")} />
            <InputField label="Срок доставки" name="deliveryTime" value={productData.logistics?.deliveryTime || ""} onChange={e => handleNestedChange(e, "logistics")} />
            <div>
              <label className="block text-gray-300 text-sm mb-2">Варианты доставки (через запятую)</label>
              <input type="text" name="shippingOptions" value={productData.logistics?.shippingOptions?.join(", ") || ""} onChange={e => handleNestedArrayChange(e, "logistics", "shippingOptions")} className={inputClass} />
            </div>
            <InputField label="Упаковка" name="packaging" value={productData.logistics?.packaging || ""} onChange={e => handleNestedChange(e, "logistics")} />
          </Section>
          <Section title="Акции" gridCols="grid-cols-1">
            <label className="block text-gray-300 text-sm mb-2">Введите акции в формате JSON (массив объектов)</label>
            <textarea name="promotions" value={JSON.stringify(productData.promotions || [], null, 2)} onChange={e => handleJsonChange(e, "promotions")} className={`${inputClass} h-32`} />
          </Section>
          <Section title="Остатки (JSON формат)" gridCols="grid-cols-1">
            <label className="block text-gray-300 text-sm mb-2">Введите остатки (если требуется) в формате JSON</label>
            <textarea name="stock" value={JSON.stringify(productData.stock || {}, null, 2)} onChange={e => handleJsonChange(e, "stock")} className={`${inputClass} h-32`} />
          </Section>
          <div className="flex justify-end space-x-4">
            {docId && (
              <button type="button" onClick={handleDelete} className="flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl hover:scale-105 transition-transform">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Удалить
              </button>
            )}
            <button type="submit" className="flex items-center px-6 py-3 bg-gradient-to-r from-green-400 to-cyan-500 rounded-xl hover:scale-105 transition-transform">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              {docId ? "Сохранить изменения" : "Создать продукт"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
// ; ; Шаблон структуры товара Если что это шаблон структуры моих товаров и категорий точно такой структурой у меня имеется все товары на базе данной firebase Я тут просто сделал поставил структуру товаров и категории чтобы ты просто посмотрел как у меня реализован структура но основные все товары точно реализованы и заполнены и они находятся у меня на базе данных
// ; {
// ;   "id": "product-id",
// ;   "slug": "product-slug",
// ;   "brand": "Бренд",
// ;   "category": {
// ;     "id": "категория-id",
// ;     "slug": "категория-slug",
// ;     "name": {
// ;       "ru": "Название категории (RU)",
// ;       "en": "Category Name (EN)"
// ;     }
// ;   },
// ;   "subcategory": {
// ;     "id": "подкатегория-id",
// ;     "slug": "подкатегория-slug",
// ;     "name": {
// ;       "ru": "Название подкатегории (RU)",
// ;       "en": "Subcategory Name (EN)"
// ;     }
// ;   },
// ;   "gender": "мужской / женский / унисекс",
// ;   "ageGroup": "дети / взрослые / подростки",
// ;   "name": {
// ;     "ru": "Название товара (RU)",
// ;     "en": "Product Name (EN)"
// ;   },
// ;   "description": {
// ;     "ru": "Описание товара (RU)",
// ;     "en": "Product Description (EN)"
// ;   },
// ;   "features": {
// ;     "material": ["Материал1", "Материал2"],
// ;     "weight": "Вес",
// ;     "country": "Страна производства",
// ;     "seasonality": "Сезонность",
// ;     "sportType": ["Спорт1", "Спорт2"],
// ;     "warranty": "Гарантия",
// ;     "technology": ["Технология1", "Технология2"],
// ;     "insole": "Стелька",
// ;     "cushioning": "Амортизация",
// ;     "sole": "Подошва",
// ;     "flexibility": "Гибкость",
// ;     "kit": ["Что входит в комплект"]
// ;   },
// ;   "options": {
// ;     "colors": ["Цвет1", "Цвет2"],
// ;     "sizes": ["Размер1", "Размер2"]
// ;   },
// ;   "media": {
// ;     "imagesByColor": {
// ;       "Цвет1": "Ссылка на основное изображение",
// ;       "Цвет2": "Ссылка на основное изображение"
// ;     },
// ;     "additionalImagesByColor": {
// ;       "Цвет1": ["URL1", "URL2"],
// ;       "Цвет2": ["URL1", "URL2"]
// ;     },
// ;     "fallbackImage": "URL запасного изображения"
// ;   },
// ;   "pricing": {
// ;     "currency": "Валюта",
// ;     "basePrice": 0,
// ;     "minPrice": 0,
// ;     "variants": [
// ;       {
// ;         "color": "Цвет",
// ;         "size": "Размер",
// ;         "price": 0,
// ;         "stock": 0,
// ;         "sku": "Уникальный код товара"
// ;       }
// ;     ]
// ;   },
// ;   "promotions": [
// ;     { "type": "discount", "value": 0, "unit": "%", "active": true },
// ;     { "type": "cashback", "value": 0, "unit": "%", "active": false },
// ;     { "type": "promoCode", "code": "Код", "active": false },
// ;     { "type": "gift", "value": "Описание подарка", "active": false }
// ;   ],
// ;   "logistics": {
// ;     "fulfillment": "FBO / FBS / DBR",
// ;     "deliveryEstimate": "1–3 дня",
// ;     "shippingMethods": ["Курьер", "Почта", "Самовывоз"],
// ;     "packaging": "Описание упаковки",
// ;     "deliveryZones": ["Город1", "Город2"]
// ;   },
// ;   "availability": {
// ;     "status": "inStock / outOfStock / preorder",
// ;     "isPreorder": false,
// ;     "restockDate": null
// ;   },
// ;   "rating": {
// ;     "average": 0.0,
// ;     "count": 0
// ;   },
// ;   "analytics": {
// ;     "views": 0,
// ;     "cartAdds": 0,
// ;     "purchases": 0
// ;   },
// ;   "relations": {
// ;     "relatedProductIds": ["id1", "id2"],
// ;     "upsellProductIds": ["id3", "id4"],
// ;     "accessories": ["id5", "id6"]
// ;   },
// ;   "meta": {
// ;     "new": true,
// ;     "bestseller": false,
// ;     "tags": ["тег1", "тег2"]
// ;   }
// ; }

// ; Шаблон структуры категории 
// ; {
// ;   "id": "category-id",
// ;   "slug": "category-slug",
// ;   "slugAuto": true,
// ;   "name": {
// ;     "ru": "Название категории (RU)",
// ;     "en": "Category Name (EN)"
// ;   },
// ;   "description": {
// ;     "ru": "Описание категории (RU)",
// ;     "en": "Category Description (EN)"
// ;   },
// ;   "image": "URL изображения категории",
// ;   "icon": {
// ;     "type": "emoji | image",
// ;     "value": "Иконка (например, 🆕 или URL к изображению)"
// ;   },
// ;   "filters": [
// ;     { "name": "название фильтра", "type": "тип фильтра (select, tag, category, flag, range, size, text)" }
// ;   ],
// ;   "categoryType": ["promotional", "seasonal", "gendered", "discounted"],
// ;   "role": "primary | seasonal | secondary",
// ;   "seo": {
// ;     "title": "SEO заголовок",
// ;     "description": "SEO описание",
// ;     "keywords": ["keyword1", "keyword2"],
// ;     "index": true,
// ;     "canonical": "/categories/category-slug"
// ;   },
// ;   "landingPageId": "landing-page-identifier",
// ;   "meta": {
// ;     "isFeatured": true,
// ;     "isHidden": false,
// ;     "sortPriority": 1,
// ;     "badgeColor": "#FF3B30",
// ;     "createdAt": "2024-01-15T12:00:00Z",
// ;     "updatedAt": "2025-03-24T00:00:00Z",
// ;     "priorityWeight": 98
// ;   },
// ;   "analytics": {
// ;     "views": 0,
// ;     "clicks": 0,
// ;     "conversions": 0,
// ;     "ctr": 0.0,
// ;     "avgTimeOnPage": 0
// ;   },
// ;   "subcategories": [
// ;     {
// ;       "id": "subcategory-id",
// ;       "slug": "subcategory-slug",
// ;       "name": {
// ;         "ru": "Название подкатегории (RU)",
// ;         "en": "Subcategory Name (EN)"
// ;       },
// ;       "image": "URL изображения подкатегории",
// ;       "tag": "тег для фильтрации (например, new, limited, sale)",
// ;       "icon": {
// ;         "type": "emoji | image",
// ;         "value": "Иконка (например, 📦)"
// ;       },
// ;       "targetGender": "male | female | unisex",
// ;       "filters": [
// ;         { "name": "название фильтра", "type": "тип фильтра (select, tag, category, flag, range, size, text)" }
// ;       ],
// ;       "meta": {
// ;         "badge": "Текстовый бейдж",
// ;         "sortWeight": 1,
// ;         "isHidden": false
// ;       },
// ;       "analytics": {
// ;         "views": 0,
// ;         "clicks": 0,
// ;         "conversions": 0
// ;       },
// ;       "cta": {
// ;         "text": "Текст кнопки",
// ;         "url": "/catalog?category=category-id&subcategory=subcategory-id",
// ;         "style": "primary | secondary | warning"
// ;       }
// ;     }
// ;   ]
// ; }
  