require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../models/Category");

// Подключение к базе
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Подключено к MongoDB"))
  .catch((err) => {
    console.error("❌ Ошибка подключения:", err);
    process.exit(1);
  });

// 👉 Здесь массив категорий прямо в JS:
const categories = [
    {
      id: "новинки-и-избранное",
      slug: "novinki-i-izbrannoe",
      slugAuto: true, // флаг автоматической генерации
      name: {
        ru: "Новинки и Избранное",
        en: "Featured & New"
      },
      description: {
        ru: "Самые свежие новинки и эксклюзивные модели в ограниченном выпуске.",
        en: "The latest arrivals and exclusive limited-edition items."
      },
      image: "https://i.pinimg.com/736x/22/58/26/225826deb5a797a2b81826dbc44ae42e.jpg",
      icon: {
        type: "emoji",
        value: "🆕"
      },
      filters: [
        "бренд:select",
        "сезон:tag",
        "тип:category",
        "новинка:flag"
      ],
      categoryType: ["promotional", "seasonal"],
      role: "primary",
    
      seo: {
        title: "Новинки и эксклюзивы от SportNova",
        description: "Откройте для себя новые поступления и лимитированные коллекции в SportNova. Эксклюзивно и только сейчас.",
        keywords: ["новинки", "эксклюзив", "ограниченная серия", "SportNova"],
        index: true,
        canonical: "/categories/novinki-i-izbrannoe"
      },
    
      landingPageId: "featured-landing",
    
      meta: {
        isFeatured: true,
        isHidden: false,
        sortPriority: 1,
        badgeColor: "#FF3B30",
        createdAt: "2024-01-15T12:00:00Z",
        updatedAt: "2025-03-24T00:00:00Z",
        priorityWeight: 98
      },
    
      analytics: {
        views: 18234,
        clicks: 2941,
        conversions: 503,
        ctr: 16.1,
        avgTimeOnPage: 38
      },
    
      subcategories: [
        {
          id: "новые-поступления",
          slug: "novye-postupleniya",
          name: {
            ru: "Новые поступления",
            en: "New Arrivals"
          },
          image: "https://example.com/new-arrivals.jpg",
          tag: "new",
          icon: { type: "emoji", value: "📦" },
          targetGender: "unisex",
          filters: [
            "бренд:select",
            "тип:category"
          ],
          meta: {
            badge: "🔥 Новое",
            sortWeight: 1,
            isHidden: false
          },
          analytics: {
            views: 8301,
            clicks: 1302,
            conversions: 312
          },
          cta: {
            text: "Смотреть новинки",
            url: "/catalog?tag=new",
            style: "primary"
          }
        },
        {
          id: "ограниченные-серии",
          slug: "ogranichennye-serii",
          name: {
            ru: "Ограниченные серии",
            en: "Limited Editions"
          },
          image: "https://example.com/limited.jpg",
          tag: "limited",
          icon: { type: "emoji", value: "⏳" },
          filters: [
            "бренд:select",
            "коллекция:text"
          ],
          meta: {
            badge: "⛔ Ограничено",
            sortWeight: 2,
            isHidden: false
          },
          analytics: {
            views: 3202,
            clicks: 480,
            conversions: 91
          },
          cta: {
            text: "Успей купить",
            url: "/catalog?tag=limited",
            style: "warning"
          }
        }
      ]
    }
    ,
    {
      id: "мужская-коллекция",
      slug: "muzhskaya-kollektsiya",
      slugAuto: true,
      name: {
        ru: "Мужская коллекция",
        en: "Men's Collection"
      },
      description: {
        ru: "Современная спортивная и повседневная одежда для мужчин.",
        en: "Modern sportswear and casual wear for men."
      },
      image: "https://i.pinimg.com/736x/ee/44/d7/ee44d7d3d9189d0303cb0a62c9bf60de.jpg",
      icon: {
        type: "emoji",
        value: "👟"
      },
      filters: [
        "бренд:select",
        "тип:category",
        "размер:size",
        "сезон:tag",
        "новинка:flag"
      ],
    
      categoryType: ["gendered"],
      role: "primary",
    
      seo: {
        title: "Мужская коллекция – Одежда и обувь для мужчин | SportNova",
        description: "Одежда, обувь и спортивные аксессуары для мужчин от бренда SportNova. Стиль и технологии для активной жизни.",
        keywords: ["мужская одежда", "мужская обувь", "спорт", "стиль", "активный образ жизни"],
        index: true,
        canonical: "/categories/muzhskaya-kollektsiya"
      },
    
      landingPageId: "mens-collection-landing",
    
      meta: {
        isFeatured: false,
        isHidden: false,
        sortPriority: 2,
        badgeColor: "#0F62FE",
        createdAt: "2024-01-15T12:00:00Z",
        updatedAt: "2025-03-24T00:00:00Z",
        priorityWeight: 85
      },
    
      analytics: {
        views: 21230,
        clicks: 3680,
        conversions: 654,
        ctr: 17.3,
        avgTimeOnPage: 42
      },
    
      subcategories: [
        {
          id: "мужская-обувь",
          slug: "muzhskaya-obuv",
          name: {
            ru: "Обувь",
            en: "Footwear"
          },
          image: "https://i.pinimg.com/736x/b7/4c/41/b74c41b0422dfc61f2e860cbf0321709.jpg",
          tag: "shoes",
          icon: { type: "emoji", value: "👞" },
          targetGender: "male",
          filters: [
            "размер:size",
            "бренд:select",
            "технологии:tag"
          ],
          meta: {
            badge: "Мужская обувь",
            sortWeight: 1,
            isHidden: false
          },
          analytics: {
            views: 9100,
            clicks: 1220,
            conversions: 245
          },
          cta: {
            text: "Смотреть обувь",
            url: "/catalog?category=мужская-коллекция&subcategory=мужская-обувь",
            style: "primary"
          }
        },
        {
          id: "мужская-одежда",
          slug: "muzhskaya-odezhda",
          name: {
            ru: "Одежда",
            en: "Clothing"
          },
          image: "https://i.pinimg.com/736x/df/b6/2b/dfb62b7418b35df943c107cf66e42a42.jpg",
          tag: "clothing",
          icon: { type: "emoji", value: "🧥" },
          targetGender: "male",
          filters: [
            "размер:size",
            "тип:category",
            "материал:text"
          ],
          meta: {
            badge: "Мужская одежда",
            sortWeight: 2,
            isHidden: false
          },
          analytics: {
            views: 8720,
            clicks: 1103,
            conversions: 203
          },
          cta: {
            text: "Смотреть одежду",
            url: "/catalog?category=мужская-коллекция&subcategory=мужская-одежда",
            style: "secondary"
          }
        }
      ]
    }
    ,
    {
      id: "женская-коллекция",
      slug: "zhenskaya-kollektsiya",
      slugAuto: true,
      name: {
        ru: "Женская коллекция",
        en: "Women's Collection"
      },
      description: {
        ru: "Спортивная одежда, обувь и аксессуары для женщин.",
        en: "Sportswear, footwear, and accessories for women."
      },
      image: "https://i.pinimg.com/736x/db/4f/8c/db4f8c329a28c854a5bec280f14cf6c7.jpg",
      icon: {
        type: "emoji",
        value: "👟"
      },
      filters: [
        "бренд:select",
        "размер:size",
        "тип:category",
        "сезон:tag",
        "новинка:flag"
      ],
    
      categoryType: ["gendered"],
      role: "primary",
    
      seo: {
        title: "Женская спортивная коллекция – Одежда и обувь | SportNova",
        description: "Откройте женскую коллекцию от SportNova: кроссовки, одежда и аксессуары, разработанные для движения и стиля.",
        keywords: ["женская одежда", "женская обувь", "спорт", "спорт стиль", "женская коллекция"],
        index: true,
        canonical: "/categories/zhenskaya-kollektsiya"
      },
    
      landingPageId: "womens-collection-landing",
    
      meta: {
        isFeatured: true,
        isHidden: false,
        sortPriority: 3,
        badgeColor: "#E91E63",
        createdAt: "2024-01-15T12:00:00Z",
        updatedAt: "2025-03-24T00:00:00Z",
        priorityWeight: 92
      },
    
      analytics: {
        views: 18940,
        clicks: 3150,
        conversions: 587,
        ctr: 16.6,
        avgTimeOnPage: 41
      },
    
      subcategories: [
        {
          id: "женская-обувь",
          slug: "zhenskaya-obuv",
          name: {
            ru: "Обувь",
            en: "Footwear"
          },
          image: "https://i.pinimg.com/736x/50/15/17/501517302a5c1867a3f2162d4c6f7b9b.jpg",
          tag: "shoes",
          icon: { type: "emoji", value: "👠" },
          targetGender: "female",
          filters: [
            "размер:size",
            "тип:category",
            "технология:tag"
          ],
          meta: {
            badge: "Обувь",
            sortWeight: 1,
            isHidden: false
          },
          analytics: {
            views: 7400,
            clicks: 1083,
            conversions: 224
          },
          cta: {
            text: "Смотреть обувь",
            url: "/catalog?category=женская-коллекция&subcategory=женская-обувь",
            style: "primary"
          }
        },
        {
          id: "женская-одежда",
          slug: "zhenskaya-odezhda",
          name: {
            ru: "Одежда",
            en: "Clothing"
          },
          image: "https://i.pinimg.com/736x/32/f5/7e/32f57e3e8b6c79e8a985aabecb38bc15.jpg",
          tag: "clothing",
          icon: { type: "emoji", value: "👗" },
          targetGender: "female",
          filters: [
            "размер:size",
            "материал:text",
            "цвет:select"
          ],
          meta: {
            badge: "Одежда",
            sortWeight: 2,
            isHidden: false
          },
          analytics: {
            views: 7520,
            clicks: 987,
            conversions: 201
          },
          cta: {
            text: "Смотреть одежду",
            url: "/catalog?category=женская-коллекция&subcategory=женская-одежда",
            style: "secondary"
          }
        }
      ]
    }
    ,
    {
      id: "детская-коллекция",
      slug: "detskaya-kollektsiya",
      slugAuto: true,
      name: {
        ru: "Детская коллекция",
        en: "Kids Collection"
      },
      description: {
        ru: "Одежда, обувь и аксессуары для детей любого возраста.",
        en: "Clothing, shoes, and accessories for kids of all ages."
      },
      image: "https://i.pinimg.com/736x/ee/a8/43/eea8435a717d5af9c3cb6e35fd32b786.jpg",
      icon: {
        type: "emoji",
        value: "🧒"
      },
      filters: [
        "размер:size",
        "возраст:range",
        "бренд:select",
        "тип:category"
      ],
    
      categoryType: ["gendered", "seasonal"],
      role: "primary",
    
      seo: {
        title: "Детская коллекция – Одежда и обувь для детей | SportNova",
        description: "Качественная и удобная одежда и обувь для малышей и подростков. Детская коллекция SportNova — комфорт, стиль, безопасность.",
        keywords: ["детская одежда", "детская обувь", "мальчики", "девочки", "детский спорт"],
        index: true,
        canonical: "/categories/detskaya-kollektsiya"
      },
    
      landingPageId: "kids-collection-landing",
    
      meta: {
        isFeatured: true,
        isHidden: false,
        sortPriority: 4,
        badgeColor: "#FFA726",
        createdAt: "2024-01-15T12:00:00Z",
        updatedAt: "2025-03-24T00:00:00Z",
        priorityWeight: 88
      },
    
      analytics: {
        views: 13200,
        clicks: 2240,
        conversions: 427,
        ctr: 16.9,
        avgTimeOnPage: 36
      },
    
      subcategories: [
        {
          id: "детская-обувь",
          slug: "detskaya-obuv",
          name: {
            ru: "Обувь",
            en: "Footwear"
          },
          image: "https://i.pinimg.com/736x/7e/e7/e3/7ee7e37df14740596a4c7e5ad02d5704.jpg",
          tag: "shoes",
          icon: { type: "emoji", value: "👟" },
          targetGender: "unisex",
          filters: [
            "размер:size",
            "возраст:range",
            "тип:category"
          ],
          meta: {
            badge: "Детская обувь",
            sortWeight: 1,
            isHidden: false
          },
          analytics: {
            views: 6030,
            clicks: 820,
            conversions: 179
          },
          cta: {
            text: "Выбрать обувь",
            url: "/catalog?category=детская-коллекция&subcategory=детская-обувь",
            style: "primary"
          }
        },
        {
          id: "детская-одежда",
          slug: "detskaya-odezhda",
          name: {
            ru: "Одежда",
            en: "Clothing"
          },
          image: "https://i.pinimg.com/736x/94/3d/07/943d07ee06585fd33f7d981c9ac15bfc.jpg",
          tag: "clothing",
          icon: { type: "emoji", value: "👕" },
          targetGender: "unisex",
          filters: [
            "размер:size",
            "материал:text",
            "тип:category"
          ],
          meta: {
            badge: "Детская одежда",
            sortWeight: 2,
            isHidden: false
          },
          analytics: {
            views: 7170,
            clicks: 932,
            conversions: 182
          },
          cta: {
            text: "Смотреть одежду",
            url: "/catalog?category=детская-коллекция&subcategory=детская-одежда",
            style: "secondary"
          }
        }
      ]
    }
    ,
    {
      id: "скидки-и-акции",
      slug: "skidki-i-aktsii",
      slugAuto: true,
      name: {
        ru: "Скидки и Акции",
        en: "Discounts & Deals"
      },
      description: {
        ru: "Лучшие предложения и выгодные скидки на одежду, обувь и аксессуары от SportNova.",
        en: "Top offers and exclusive discounts on clothing, footwear, and accessories from SportNova."
      },
      image: "https://i.pinimg.com/736x/cf/b6/7b/cfb67beb3ff7db0520a0b12a5e7db3af.jpg",
      icon: {
        type: "emoji",
        value: "💸"
      },
      filters: [
        "бренд:select",
        "размер:size",
        "тип:category",
        "размер скидки:range"
      ],
    
      categoryType: ["promotional", "discounted"],
      role: "seasonal",
    
      seo: {
        title: "Скидки и акции – Выгодные предложения на товары | SportNova",
        description: "Успей купить со скидкой! В этом разделе собраны товары с лучшими акциями и временными предложениями от SportNova.",
        keywords: ["скидка", "акции", "распродажа", "промокод", "дешево", "распродажа спорттоваров"],
        index: true,
        canonical: "/categories/skidki-i-aktsii"
      },
    
      landingPageId: "discounts-and-deals-landing",
    
      meta: {
        isFeatured: true,
        isHidden: false,
        sortPriority: 5,
        badgeColor: "#43A047",
        createdAt: "2024-01-15T12:00:00Z",
        updatedAt: "2025-03-24T00:00:00Z",
        priorityWeight: 95
      },
    
      analytics: {
        views: 25830,
        clicks: 5210,
        conversions: 1013,
        ctr: 20.1,
        avgTimeOnPage: 52
      },
    
      subcategories: [
        {
          id: "все-скидки",
          slug: "vse-skidki",
          name: {
            ru: "Все скидки",
            en: "All Discounts"
          },
          image: "https://i.pinimg.com/736x/b6/47/fc/b647fc63c36ddc23302ab700e00f5c96.jpg",
          tag: "sale",
          icon: { type: "emoji", value: "🤑" },
          filters: [
            "размер скидки:range",
            "категория:category"
          ],
          meta: {
            badge: "-%",
            sortWeight: 1,
            isHidden: false
          },
          analytics: {
            views: 8800,
            clicks: 1423,
            conversions: 350
          },
          cta: {
            text: "Смотреть все скидки",
            url: "/catalog?tag=sale",
            style: "primary"
          }
        },
        {
          id: "обувь-со-скидкой",
          slug: "obuv-so-skidkoy",
          name: {
            ru: "Обувь со скидкой",
            en: "Shoes on Sale"
          },
          image: "https://i.pinimg.com/736x/92/9e/f2/929ef2e6f06de7d9734a88aa1cf8d775.jpg",
          tag: "shoes",
          icon: { type: "emoji", value: "👟" },
          filters: [
            "размер:size",
            "бренд:select"
          ],
          meta: {
            badge: "Обувь %%",
            sortWeight: 2,
            isHidden: false
          },
          analytics: {
            views: 6450,
            clicks: 1110,
            conversions: 210
          },
          cta: {
            text: "Смотреть обувь",
            url: "/catalog?category=скидки-и-акции&subcategory=обувь-со-скидкой",
            style: "secondary"
          }
        },
        {
          id: "одежда-со-скидкой",
          slug: "odezhda-so-skidkoy",
          name: {
            ru: "Одежда со скидкой",
            en: "Clothing on Sale"
          },
          image: "https://i.pinimg.com/736x/f1/5f/53/f15f535f6a2d31b531c469a74c4ffb1a.jpg",
          tag: "clothing",
          icon: { type: "emoji", value: "👕" },
          filters: [
            "размер:size",
            "тип:category"
          ],
          meta: {
            badge: "Одежда %",
            sortWeight: 3,
            isHidden: false
          },
          analytics: {
            views: 6580,
            clicks: 1005,
            conversions: 197
          },
          cta: {
            text: "Смотреть одежду",
            url: "/catalog?category=скидки-и-акции&subcategory=одежда-со-скидкой",
            style: "secondary"
          }
        }
      ]
    }
    
  ];

const upload = async () => {
  try {
    await Category.deleteMany(); // очистить старые
    await Category.insertMany(categories); // вставить новые
    console.log("✅ Категории успешно загружены");
    process.exit(0);
  } catch (err) {
    console.error("❌ Ошибка загрузки категорий:", err);
    process.exit(1);
  }
};

upload();
