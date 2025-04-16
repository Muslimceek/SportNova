import React, { useState, useCallback, memo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useFavorites } from "../contexts/FavoritesContext";
import { useCart } from "../contexts/CartContext";

const colorVariants = {
  "Чёрный": "bg-black",
  "Белый": "bg-white border-2",
  "Серый": "bg-gray-400",
  "Красный": "bg-red-600",
  "Синий": "bg-blue-600",
  "Зелёный": "bg-green-600",
};

const getColorWord = (count) => {
  const lastDigit = count % 10;
  if (lastDigit === 1 && count !== 11) return "цвет";
  if (lastDigit >= 2 && lastDigit <= 4 && (count < 10 || count > 20)) return "цвета";
  return "цветов";
};

const fallbackHandler = (e) => {
  e.target.src = "/fallback.jpg";
};

const ProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  if (!product) return null;

  const { id } = product;
  const productName = product.name?.ru || "Без названия";
  const productBrand = product.brand || "Без бренда";
  const productCategory = product.category?.name?.ru || "Без категории";
  const productSubcategory = product.subcategory?.name?.ru;
  const categoryText = productSubcategory ? `${productCategory} • ${productSubcategory}` : productCategory;
  const productDescription = product.description?.ru || "";
  const colors = product.options?.colors || [];
  const colorsCount = colors.length;
  const { imagesByColor = {}, additionalImagesByColor = {}, fallbackImage } = product.media || {};
  const availableColors = Object.keys(imagesByColor);
  const actualColor = (colors.length && colors[0]) || (availableColors.length ? availableColors[0] : "Чёрный");
  const mainImage = imagesByColor[actualColor] || fallbackImage || "/fallback.jpg";
  const secondImage = (additionalImagesByColor[actualColor]?.[0]) || mainImage;
  const { basePrice = 0, minPrice = 0, currency = "₽" } = product.pricing || {};
  const hasDiscount = minPrice > 0 && minPrice < basePrice;
  const discountPromotion = product.promotions?.find((p) => p.type === "discount" && p.active);
  const discountLabel = discountPromotion ? `-${discountPromotion.value}${discountPromotion.unit}` : null;
  const isNew = product.meta?.new;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group relative ${isMobile ? 'w-full h-[380px]' : 'w-72 h-[480px]'} bg-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1 rounded-xl`}
      role="article"
      aria-labelledby={`product-title-${id}`}
    >
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        <AnimatePresence>
          {isNew && <PromotionBadge key="new" type="new" label="Новинка" />}
          {discountLabel && hasDiscount && <PromotionBadge key="discount" type="discount" label={discountLabel} />}
        </AnimatePresence>
      </div>
      <div className={`relative overflow-hidden ${isMobile ? 'h-56' : 'h-64'}`}>
        {!imageLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse" aria-hidden="true" />}
        <Link to={`/product/${id}`} className="block w-full h-full focus:outline-none">
          <motion.img
            src={mainImage}
            alt={productName}
            className="w-full h-full object-cover transition-opacity duration-500"
            style={{ display: imageLoaded ? "block" : "none" }}
            onLoad={() => setImageLoaded(true)}
            onError={fallbackHandler}
          />
          <motion.img
            src={secondImage}
            alt={`${productName} - дополнительное фото`}
            className="w-full h-full object-cover absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            onError={fallbackHandler}
          />
        </Link>
        <div className="absolute bottom-3 right-3 flex gap-2 z-10">
          {isMobile && <AddToCartButton product={product} />}
          <FavoriteButton product={product} />
        </div>
      </div>
      <div className={`p-4 ${isMobile ? 'h-[calc(100%-14rem)]' : 'h-[calc(100%-16rem)]'} flex flex-col`}>
        <div className="relative flex-1">
          {isMobile ? (
            <MobileCardContent
              name={productName}
              brand={productBrand}
              original={basePrice}
              discounted={minPrice}
              hasDiscount={hasDiscount}
              productId={id}
              currency={currency}
            />
          ) : (
            <CardContent
              name={productName}
              brand={productBrand}
              category={categoryText}
              description={productDescription}
              colors={colors}
              selectedColor={actualColor}
              original={basePrice}
              discounted={minPrice}
              hasDiscount={hasDiscount}
              colorsCount={colorsCount}
              productId={id}
              currency={currency}
            />
          )}
        </div>
      </div>
    </motion.article>
  );
};

// Add a new MobileCardContent component for mobile view
const MobileCardContent = memo(
  ({ name, brand, original, discounted, hasDiscount, productId, currency }) => (
    <div className="flex flex-col" id={`product-title-${productId}`}>
      <h3 className="text-base font-semibold text-gray-900 truncate mb-1">{name}</h3>
      <p className="text-xs text-gray-500 mb-2">{brand}</p>
      <PriceDisplay original={original} discounted={discounted} currency={currency} />
    </div>
  )
);

const CardContent = memo(
  ({ name, brand, category, description, colors, selectedColor, original, discounted, hasDiscount, colorsCount, productId, currency }) => (
    <>
      <div className="absolute inset-0 flex flex-col transition-opacity group-hover:opacity-0" id={`product-title-${productId}`}>
        <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">{name}</h3>
        <p className="text-sm text-gray-500 mb-2">
          {brand} • {category}
        </p>
        <PriceDisplay original={original} discounted={discounted} currency={currency} />
      </div>
      <div className="absolute inset-0 flex flex-col opacity-0 transition-opacity group-hover:opacity-100">
        <p className="text-sm text-gray-600 mb-3 line-clamp-3 leading-relaxed">
          {description || "Описание отсутствует"}
        </p>
        {colors.length > 0 && (
          <div className="mt-auto">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {colorsCount} {getColorWord(colorsCount)}
              </span>
              <ColorSwatches colors={colors} selectedColor={selectedColor} variants={colorVariants} />
            </div>
          </div>
        )}
      </div>
    </>
  )
);

const PromotionBadge = memo(({ type, label }) => {
  const typeStyles = { new: "bg-blue-600 text-white", discount: "bg-red-600 text-white" };
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className={`px-2.5 py-1 text-xs font-medium rounded-full ${typeStyles[type]} shadow-sm`}
    >
      {label}
    </motion.span>
  );
});

const ColorSwatches = memo(({ colors, selectedColor, variants }) => (
  <div className="flex gap-1.5 flex-wrap">
    {colors.map((color) => (
      <motion.span
        key={color}
        whileHover={{ scale: 1.1 }}
        className={`w-6 h-6 rounded-full border-2 ${color === selectedColor ? "border-gray-900 ring-2 ring-gray-300" : "border-gray-200"} ${variants[color] || ""}`}
        title={color}
        role="img"
        aria-label={color}
      />
    ))}
  </div>
));

const PriceDisplay = memo(({ original, discounted, currency }) => {
  const currencySymbol = currency === "RUB" || currency === "₽" ? "₽" : currency;
  const isDiscounted = discounted > 0 && discounted < original;
  return (
    <div className="flex flex-col">
      {isDiscounted ? (
        <>
          <span className="text-xl font-bold text-red-600">
            {discounted.toLocaleString()} {currencySymbol}
          </span>
          <span className="text-sm text-gray-400 line-through">
            {original.toLocaleString()} {currencySymbol}
          </span>
        </>
      ) : (
        <span className="text-xl font-bold text-gray-900">
          {original.toLocaleString()} {currencySymbol}
        </span>
      )}
    </div>
  );
});

const FavoriteButton = memo(({ product, className }) => {
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const isFavorite = favorites.some((item) => item.id === product.id);
  const handleClick = useCallback(
    async (e) => {
      e.preventDefault();
      isFavorite ? await removeFavorite(product.id) : await addFavorite(product);
    },
    [isFavorite, product, addFavorite, removeFavorite]
  );
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      type="button"
      className={`p-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm ${className}`}
      aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
    >
      {isFavorite ? (
        <HeartSolid className="w-6 h-6 text-red-600" />
      ) : (
        <HeartOutline className="w-6 h-6 text-gray-400 hover:text-red-600 transition-colors" />
      )}
    </motion.button>
  );
});

// Add a new ProductOptionsModal component
const ProductOptionsModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedColor, setSelectedColor] = useState(product.options?.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product.options?.sizes?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  
  const colors = product.options?.colors || [];
  const sizes = product.options?.sizes || [];
  const hasColors = colors.length > 0;
  const hasSizes = sizes.length > 0;
  
  const isFormValid = 
    (!hasColors || selectedColor) && 
    (!hasSizes || selectedSize) && 
    quantity > 0;
  
  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      selectedColor,
      selectedSize,
      quantity,
    });
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center sm:items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-md p-4 sm:p-6 max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Выберите параметры</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2">{product.name?.ru}</h4>
          <p className="text-sm text-gray-500">{product.brand}</p>
        </div>
        
        {hasColors && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Цвет:
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 ${
                    selectedColor === color 
                      ? "border-gray-900 ring-2 ring-gray-300" 
                      : "border-gray-200"
                  } ${colorVariants[color] || ""}`}
                  title={color}
                  aria-label={color}
                />
              ))}
            </div>
          </div>
        )}
        
        {hasSizes && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Размер:
            </label>
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-2 border rounded-md ${
                    selectedSize === size
                      ? "border-gray-900 bg-gray-100"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Количество:
          </label>
          <div className="flex items-center">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              className="px-3 py-1 border border-gray-300 rounded-l-md"
              disabled={quantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 text-center py-1 border-t border-b border-gray-300"
            />
            <button
              onClick={() => setQuantity(prev => prev + 1)}
              className="px-3 py-1 border border-gray-300 rounded-r-md"
            >
              +
            </button>
          </div>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={!isFormValid}
          className={`w-full py-3 px-4 rounded-lg font-medium ${
            isFormValid
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Добавить в корзину
        </button>
      </motion.div>
    </motion.div>
  );
};

// Update the AddToCartButton component
const AddToCartButton = memo(({ product, className }) => {
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      setIsModalOpen(true);
    },
    []
  );
  
  const handleAddToCart = useCallback(
    (productWithOptions) => {
      addToCart(productWithOptions);
      console.log("Добавлено в корзину:", product.id, productWithOptions.selectedOptions);
    },
    [product, addToCart]
  );
  
  return (
    <>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
        type="button"
        className={`p-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm ${className}`}
        aria-label="Добавить в корзину"
      >
        <ShoppingCartIcon className="w-6 h-6 text-gray-600 hover:text-green-600 transition-colors" />
      </motion.button>
      
      <AnimatePresence>
        {isModalOpen && (
          <ProductOptionsModal
            product={product}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>
    </>
  );
});

export default memo(ProductCard);


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
  