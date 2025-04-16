import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { FiX, FiAlertCircle, FiSearch, FiChevronRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { CSSTransition } from 'react-transition-group';

// Кастомный хук: убраны избыточные проверки, минимизирован код
const useDebouncedSearch = (query, delay = 300) => {
  const [results, setResults] = useState([]),
        [loading, setLoading] = useState(false),
        [error, setError] = useState(null);
  const abortController = useRef(new AbortController());
  const debouncedSearch = useMemo(() =>
    debounce(async (q) => {
      abortController.current.abort();
      abortController.current = new AbortController();
      if (!q.trim()) return (setResults([]), setLoading(false), setError(null));
      try {
        setLoading(true); setError(null);
        const res = await fetch(`http://localhost:4000/api/products?search=${encodeURIComponent(q)}&limit=10`, { signal: abortController.current.signal });
        if (!res.ok) throw new Error(res.statusText);
        setResults(await res.json());
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
          console.error('Search error:', err);
        }
      } finally {
        setLoading(false);
      }
    }, delay), [delay]
  );
  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);
  return { results, loading, error };
};

const SearchOverlay = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState(''),
        [selectedIndex, setSelectedIndex] = useState(-1);
  const { results, loading, error } = useDebouncedSearch(query);
  const navigate = useNavigate();
  const inputRef = useRef(null), resultsRef = useRef(null), nodeRef = useRef(null);

  const handleSelect = (id) => {
    navigate(`/product/${id}`);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    }
    return () => (document.body.style.overflow = '');
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (resultsRef.current && !resultsRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <CSSTransition in={isOpen} timeout={300} classNames="search-overlay" unmountOnExit nodeRef={nodeRef}>
      <div ref={nodeRef} className="fixed inset-0 z-50 bg-gray-900/90 backdrop-blur-sm" role="dialog" aria-modal="true">
        <div className="max-w-2xl mx-auto pt-[10vh] px-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('Искать Товары')}
              className="w-full px-6 py-5 rounded-xl bg-gray-800 text-white text-xl focus:outline-none focus:ring-4 focus:ring-blue-400/30 placeholder:text-gray-400 border border-gray-700 shadow-xl shadow-black/30"
              aria-label={t('searchInput')}
            />
            {loading && (
              <div className="absolute right-6 top-6 animate-spin">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              </div>
            )}
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              aria-label={t('closeSearch')}
            >
              <FiX size={28} />
            </button>
          </div>
          <div className="mt-4" ref={resultsRef} id="search-results">
            {loading ? (
              <div className="mt-4 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 bg-gray-800 rounded-xl animate-pulse" role="status" aria-live="polite" aria-label="Loading results">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-700 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-gray-700 rounded w-3/4" />
                        <div className="h-4 bg-gray-700 rounded w-1/2" />
                        <div className="h-5 bg-gray-700 rounded w-1/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="mt-4 p-4 bg-red-900/20 rounded-xl flex items-center text-red-400 border border-red-800/50 animate-fade-in" role="alert" aria-live="assertive">
                <FiAlertCircle className="mr-3 flex-shrink-0" />
                <span>{t('searchError')}</span>
              </div>
            ) : results.length ? (
              <>
                <div className="mt-4 px-2 text-gray-400 text-sm animate-fade-in">
                  {t('найдено', { count: results.length })}
                </div>
                <ul className="mt-2 space-y-2 animate-fade-in" role="listbox" aria-label="Search results">
                  {results.map((product, index) => (
                    <li
                      key={product.docId}
                      role="option"
                      aria-selected={index === selectedIndex}
                      className={`p-4 rounded-xl cursor-pointer transition-all ${index === selectedIndex ? 'bg-blue-900/20 ring-2 ring-blue-400' : 'bg-gray-800 hover:bg-gray-700'} focus:outline-none focus:ring-2 focus:ring-blue-400`}
                      onClick={() => handleSelect(product.docId)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      tabIndex={0}
                    >
                      <div className="flex gap-4 items-center">
                        <img
                          src={product.media?.imagesByColor ? Object.values(product.media.imagesByColor)[0] : product.image}
                          alt={product.name?.ru || product.name}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-gray-700"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-white truncate">{product.name?.ru || product.name}</h3>
                          {product.category && (
                            <p className="text-sm text-gray-400 mt-1">{product.category.name?.ru || product.category}</p>
                          )}
                          {product.price && (
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-lg font-bold text-blue-400">{t('currency', { value: product.price })}</span>
                              <FiChevronRight className="text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : query && !loading && (
              <div className="mt-6 text-center p-8 animate-fade-in" role="status" aria-live="polite">
                <FiSearch className="mx-auto text-gray-500 mb-4" size={48} />
                <h3 className="text-gray-400 text-xl font-medium">{t('noResultsTitle')}</h3>
                <p className="text-gray-500 mt-2">{t('noResultsDescription')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default SearchOverlay;



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
  