const mongoose = require("mongoose");
const Product = require("../models/Product"); // путь к вашей модели продукта
const dotenv = require("dotenv");

dotenv.config();

const products = [
  {
    id: "sportnova-ultraboost",
    slug: "sportnova-ultraboost",
    brand: "SportNova",
    category: {
      id: "мужская-коллекция",
      slug: "muzhskaya-kollektsiya",
      name: { ru: "Мужская коллекция", en: "Men's Collection" }
    },
    subcategory: {
      id: "мужская-обувь",
      slug: "muzhskaya-obuv",
      name: { ru: "Обувь", en: "Footwear" }
    },
    gender: "унисекс",
    ageGroup: "взрослые",
    name: {
      ru: "SportNova УльтраБуст",
      en: "SportNova UltraBoost"
    },
    description: {
      ru: "Современные кроссовки для активного образа жизни...",
      en: "Modern sneakers for an active lifestyle..."
    },
    features: {
      material: ["Сетка", "Синтетика", "Резина"],
      weight: "260 г",
      country: "Китай",
      seasonality: "Всесезонный",
      sportType: ["Бег", "Фитнес"],
      warranty: "12 месяцев",
      technology: ["Nova AirFlow", "UltraFlex Sole"],
      insole: "Стелька с эффектом памяти",
      cushioning: "Пена SoftTouch",
      sole: "Противоскользящая резина",
      flexibility: "Высокая",
      kit: ["Пара кроссовок"]
    },
    options: {
      colors: ["Чёрный", "Белый", "Серый"],
      sizes: ["38", "39", "40", "41", "42", "43"]
    },
    media: {
      imagesByColor: {
        "Чёрный": "https://i.pinimg.com/736x/5d/07/5b/5d075bd6f6c95dcf3c5b73ed35c5f0e5.jpg",
        "Белый": "https://i.pinimg.com/736x/0a/79/97/0a7997b64546624c711663ea2c495f3d.jpg",
        "Серый": "https://i.pinimg.com/736x/4c/7a/99/4c7a9918d2cebe2108383a44e1b68827.jpg"
      },
      additionalImagesByColor: {
        "Чёрный": [
          "https://i.pinimg.com/474x/5f/fe/5c/5ffe5c03ec670f6acaaf27d27ed19b52.jpg",
          "https://i.pinimg.com/474x/db/5b/d2/db5bd2eefc8dc7f8b47c3d30f742f36b.jpg"
        ],
        "Белый": [
          "https://i.pinimg.com/474x/fb/cc/75/fbcc7508f049dc6b756981844bd3135a.jpg",
          "https://i.pinimg.com/474x/57/4e/db/574edb09cb49bf06704dd0324f5db164.jpg"
        ],
        "Серый": [
          "https://i.pinimg.com/474x/77/6c/b5/776cb5e927d4715fcb7136d6c7f825a1.jpg",
          "https://i.pinimg.com/474x/9d/68/1e/9d681e4c87b5dd92ce06d0ac33b9f8c2.jpg"
        ]
      },
      fallbackImage: "https://i.pinimg.com/736x/4c/7a/99/4c7a9918d2cebe2108383a44e1b68827.jpg"
    },
    pricing: {
      currency: "RUB",
      basePrice: 12900,
      minPrice: 11500,
      variants: [
        { color: "Чёрный", size: "38", price: 11990, stock: 10, sku: "SN-UB-BLK-38" },
        { color: "Белый", size: "38", price: 11990, stock: 8, sku: "SN-UB-WHT-38" },
        { color: "Серый", size: "43", price: 11990, stock: 4, sku: "SN-UB-GRY-43" }
        // … остальные варианты вы можете дополнить
      ]
    },
    promotions: [
      { type: "discount", value: 10, unit: "%", active: true },
      { type: "cashback", value: 3, unit: "%", active: true },
      { type: "promoCode", code: "ULTRA10", active: true },
      { type: "gift", value: "Спортивные носки в подарок", active: true }
    ],
    logistics: {
      fulfillment: "FBO",
      deliveryEstimate: "1-3 дня",
      shippingMethods: ["Курьер", "Почта", "Самовывоз"],
      packaging: "Экологичная коробка SportNova",
      deliveryZones: ["Москва", "СПБ", "Екатеринбург", "Казань", "Новосибирск"]
    },
    availability: {
      status: "inStock",
      isPreorder: false,
      restockDate: null
    },
    rating: {
      average: 4.7,
      count: 36
    },
    analytics: {
      views: 1438,
      cartAdds: 274,
      purchases: 89
    },
    relations: {
      relatedProductIds: ["sportnova-runlite", "sportnova-airstep"],
      upsellProductIds: ["sportnova-smartwatch", "sportnova-gymbag"],
      accessories: ["sportnova-socks-pack", "sportnova-cleaner"]
    },
    meta: {
      new: true,
      bestseller: false,
      tags: ["спорт", "новинка", "бег", "унисекс"]
    }
  }
];

async function upload() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Подключено к MongoDB");

    await Product.deleteMany(); // Если нужно сначала очистить
    await Product.insertMany(products);

    console.log("✅ Продукты успешно загружены");
    process.exit();
  } catch (err) {
    console.error("❌ Ошибка загрузки продуктов:", err);
    process.exit(1);
  }
}

upload();
