import React, { useState, useEffect, useRef, useReducer, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getFirestore, collection, getDocs, query, limit } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronUpIcon, FunnelIcon, Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline";
import HeroWithNav from "./HeroWithNav";
import FilterModal from "./FilterModal";
import ProductCard from "../../components/ProductCard";

// Custom hooks (refactored for brevity)
const useDebounce = (val, delay = 300) => {
  const [debounced, setDebounced] = useState(val);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(val), delay);
    return () => clearTimeout(timer);
  }, [val, delay]);
  return debounced;
};

const useScrollToTop = () => {
  const [show, setShow] = useState(false);
  const scrollToTop = useCallback(() => window.scrollTo({ top: 0, behavior: "smooth" }), []);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return { scrollToTop, show };
};

// Filters
const initialFilters = {
  searchQuery: "",
  selectedCategory: "all",
  selectedSubcategory: "",
  selectedBrand: "",
  selectedColor: "",
  selectedSize: "",
  minPrice: "",
  maxPrice: "",
  minDiscount: "",
  inStockOnly: false,
  sortBy: "relevance",
};
const filtersReducer = (state, { type, filterName, payload }) =>
  type === "UPDATE_FILTER"
    ? { ...state, [filterName]: payload }
    : type === "SET_FILTERS"
    ? { ...state, ...payload }
    : type === "RESET_FILTERS"
    ? { ...initialFilters, selectedCategory: state.selectedCategory, selectedSubcategory: state.selectedSubcategory }
    : state;

// Filtering & sorting utilities
const matchFilter = (field, val) =>
  field ? (typeof field === "object" ? field.id === val : field === val) : false;
const getPrice = (p) => p.pricing?.basePrice ?? 0;
const getDiscount = (p) =>
  p.pricing?.basePrice && p.pricing?.minPrice
    ? Math.round(((p.pricing.basePrice - p.pricing.minPrice) / p.pricing.basePrice) * 100)
    : 0;

const applyFilters = (products, f) =>
  products.filter((p) =>
    (f.selectedCategory === "all" || matchFilter(p.category.id, f.selectedCategory)) &&
    (!f.selectedSubcategory || matchFilter(p.subcategory.id, f.selectedSubcategory)) &&
    (!f.selectedBrand || p.brand?.toLowerCase().includes(f.selectedBrand.toLowerCase())) &&
    (!f.selectedColor || p.options?.colors?.includes(f.selectedColor)) &&
    (!f.selectedSize || p.pricing?.variants?.some((v) => v.size === f.selectedSize && v.stock > 0)) &&
    (!f.minPrice || isNaN(parseFloat(f.minPrice)) || getPrice(p) >= parseFloat(f.minPrice)) &&
    (!f.maxPrice || isNaN(parseFloat(f.maxPrice)) || getPrice(p) <= parseFloat(f.maxPrice)) &&
    (!f.minDiscount || getDiscount(p) >= parseFloat(f.minDiscount)) &&
    (!f.inStockOnly || p.pricing?.variants?.some((v) => v.stock > 0)) &&
    (!f.searchQuery ||
      (p.name?.ru?.toLowerCase() || "").includes(f.searchQuery.toLowerCase()) ||
      (p.description?.ru?.toLowerCase() || "").includes(f.searchQuery.toLowerCase()) ||
      (p.brand?.toLowerCase() || "").includes(f.searchQuery.toLowerCase()))
  );
const sortProducts = (products, sortBy) => {
  const sorted = [...products];
  return sortBy === "price-asc"
    ? sorted.sort((a, b) => getPrice(a) - getPrice(b))
    : sortBy === "price-desc"
    ? sorted.sort((a, b) => getPrice(b) - getPrice(a))
    : sortBy === "discount"
    ? sorted.sort((a, b) => getDiscount(b) - getDiscount(a))
    : sortBy === "newest"
    ? sorted.sort((a, b) => (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0))
    : sorted;
};

// UI Components
const SkeletonCard = () => (
  <div className="animate-pulse rounded-xl overflow-hidden h-[380px] sm:h-[420px] w-full bg-gray-100">
    <div className="h-52 sm:h-64 bg-gray-300" />
    <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
      <div className="h-3 sm:h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-3 sm:h-4 bg-gray-300 rounded w-1/2" />
      <div className="h-5 sm:h-6 bg-gray-300 rounded w-1/3 mt-2" />
      <div className="h-7 sm:h-8 bg-gray-300 rounded w-full mt-3 sm:mt-4" />
    </div>
  </div>
);

const SkeletonGrid = ({ count = 8, layout = "grid" }) => (
  <div className={layout === "grid" ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6" : "space-y-4 sm:space-y-6"}>
    {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

const EmptyState = ({ query, resetFilters }) => (
  <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 sm:py-24 px-4">
    <div className="text-6xl sm:text-8xl mb-4 sm:mb-6">🌌</div>
    <h3 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-4">Ничего не найдено</h3>
    <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 max-w-md mx-auto">
      {query ? `Не удалось найти товары по запросу "${query}".` : "Попробуйте изменить параметры поиска или выбрать другую категорию."}
    </p>
    <button onClick={resetFilters} className="px-5 sm:px-6 py-2.5 sm:py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
      Сбросить фильтры
    </button>
  </motion.div>
);
const ErrorState = ({ error, retry }) => (
  <div className="text-center py-24 px-4">
    <div className="text-6xl mb-6">⚠️</div>
    <h3 className="text-2xl font-bold mb-4">Произошла ошибка</h3>
    <p className="text-gray-700 mb-8 max-w-md mx-auto">
      {error?.message || "Не удалось загрузить товары. Пожалуйста, попробуйте позже."}
    </p>
    <button onClick={retry} className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
      Попробовать снова
    </button>
  </div>
);
const SortDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const options = [
    { value: "relevance", label: "По релевантности" },
    { value: "price-asc", label: "Сначала дешевле" },
    { value: "price-desc", label: "Сначала дороже" },
    { value: "discount", label: "По скидке" },
    { value: "newest", label: "Новинки" },
  ];
  const current = options.find((o) => o.value === value) || options[0];
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black" aria-haspopup="listbox" aria-expanded={open}>
        {current.label}
        <ChevronUpIcon className={`w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 transition-transform ${open ? "" : "transform rotate-180"}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-xs sm:text-sm ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none" tabIndex={-1} role="listbox">
            {options.map((o) => (
              <li key={o.value} onClick={() => { onChange(o.value); setOpen(false); }} className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 ${value === o.value ? "bg-gray-100" : ""}`} role="option" aria-selected={value === o.value}>
                {o.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
const ViewToggle = ({ view, setView }) => (
  <div className="hidden sm:flex items-center border border-gray-300 rounded-md overflow-hidden">
    {["grid", "list"].map((mode) => (
      <button key={mode} onClick={() => setView(mode)} className={`p-2 ${view === mode ? "bg-gray-200" : "bg-white hover:bg-gray-100"}`} aria-label={`${mode} view`} title={`${mode} view`}>
        {mode === "grid" ? <Squares2X2Icon className="w-5 h-5" /> : <ListBulletIcon className="w-5 h-5" />}
      </button>
    ))}
  </div>
);
const FilterButton = ({ onClick, activeFiltersCount }) => (
  <button onClick={onClick} className="relative flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black">
    <FunnelIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />Фильтры
    {activeFiltersCount > 0 && (
      <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 bg-black text-white text-xs rounded-full">
        {activeFiltersCount}
      </span>
    )}
  </button>
);
const ScrollToTopButton = ({ show, onClick }) => (
  <AnimatePresence>
    {show && (
      <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClick} className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-50 p-2 sm:p-3 bg-black text-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black" aria-label="Scroll to top">
        <ChevronUpIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      </motion.button>
    )}
  </AnimatePresence>
);
const ProductGrid = ({ products, view = "grid" }) => {
  const containerVar = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } } };
  const itemVar = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 0.3 } }, exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } } };
  return view === "grid" ? (
    <motion.div variants={containerVar} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
      <AnimatePresence>
        {products.map((p) => (
          <motion.div key={p.id} variants={itemVar} exit="exit" layout whileHover={{ y: -4, transition: { duration: 0.2 } }} className="rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-black">
            <ProductCard product={p} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  ) : (
    <motion.div variants={containerVar} initial="hidden" animate="show" className="space-y-4 sm:space-y-6">
      <AnimatePresence>
        {products.map((p) => (
          <motion.div key={p.id} variants={itemVar} exit="exit" layout whileHover={{ x: 4, transition: { duration: 0.2 } }} className="rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-black">
            <ProductCard product={p} layout="horizontal" />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

// Main Component (Catalog)
const Catalog = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFiltersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [filters, dispatch] = useReducer(filtersReducer, initialFilters);
  const debouncedSearch = useDebounce(filters.searchQuery);
  const { scrollToTop, show: showButton } = useScrollToTop();
  const productsRef = useRef(null);
  const db = getFirestore();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Add a ref to track if products are already loaded
  const productsLoadedRef = useRef(false);

  // Add auto-scroll to top when pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const loadProducts = useCallback(async () => {
    // Skip loading if products are already loaded
    if (allProducts.length > 0 || productsLoadedRef.current) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const snap = await getDocs(query(collection(db, "products"), limit(100)));
      const products = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        category: doc.data().category || { id: "", slug: "", name: { ru: "", en: "" } },
        subcategory: doc.data().subcategory || { id: "", slug: "", name: { ru: "", en: "" } },
        name: doc.data().name || { ru: "", en: "" },
        description: doc.data().description || { ru: "", en: "" },
        pricing: doc.data().pricing || { currency: "", basePrice: 0, minPrice: 0, variants: [] },
        options: doc.data().options || { colors: [], sizes: [] },
        // Add other fields as necessary
      }));
      setAllProducts(products);
      productsLoadedRef.current = true;
    } catch (err) {
      console.error(err);
      setError(err);
    }
    setLoading(false);
  }, [db, allProducts.length]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    dispatch({
      type: "SET_FILTERS",
      payload: {
        selectedCategory: params.get("category") || "all",
        selectedSubcategory: params.get("subcategory") || "",
        selectedBrand: params.get("brand") || "",
        searchQuery: params.get("q") || "",
        sortBy: params.get("sort") || initialFilters.sortBy,
      },
    });
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.selectedCategory !== "all") params.set("category", filters.selectedCategory);
    if (filters.selectedSubcategory) params.set("subcategory", filters.selectedSubcategory);
    if (filters.selectedBrand) params.set("brand", filters.selectedBrand);
    if (debouncedSearch) params.set("q", debouncedSearch);
    if (filters.sortBy !== initialFilters.sortBy) params.set("sort", filters.sortBy);
    const newUrl = `/catalog${params.toString() ? `?${params}` : ""}`;
    if (location.pathname + location.search !== newUrl) navigate(newUrl, { replace: true });
  }, [
    filters.selectedCategory,
    filters.selectedSubcategory,
    filters.selectedBrand,
    debouncedSearch,
    filters.sortBy,
    navigate,
    location.pathname,
    location.search,
  ]);

  const filteredProducts = useMemo(
    () => sortProducts(applyFilters(allProducts, { ...filters, searchQuery: debouncedSearch }), filters.sortBy),
    [allProducts, filters, debouncedSearch]
  );
  const activeFiltersCount = useMemo(() => {
    const keys = ["selectedCategory", "selectedSubcategory", "selectedBrand", "selectedColor", "selectedSize", "minPrice", "maxPrice", "minDiscount"];
    return keys.reduce((count, key) => count + (filters[key] && (key === "selectedCategory" ? filters[key] !== "all" : 1)), filters.inStockOnly ? 1 : 0);
  }, [filters]);

  const handleCategory = useCallback(({ category, subcategory = "" }) => {
    dispatch({ type: "SET_FILTERS", payload: { selectedCategory: category, selectedSubcategory: subcategory } });
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  const handleResetFilters = useCallback(() => dispatch({ type: "RESET_FILTERS" }), []);

  if (error) return <ErrorState error={error} retry={loadProducts} />;
  return (
    <main className="min-h-screen bg-white text-black">
      <HeroWithNav
        searchQuery={filters.searchQuery}
        setSearchQuery={(val) => dispatch({ type: "UPDATE_FILTER", filterName: "searchQuery", payload: val })}
        onCategorySelect={handleCategory}
        onApplyAdvancedFilters={(nf) => dispatch({ type: "SET_FILTERS", payload: nf })}
      />
      <section className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-12" ref={productsRef}>
        <header className="mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-2xl font-semibold">
              {loading
                ? "Загрузка товаров..."
                : filteredProducts.length
                ? `Найдено ${filteredProducts.length} товаров`
                : "Товары не найдены"}
            </h2>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <FilterButton onClick={() => setFiltersOpen(true)} activeFiltersCount={activeFiltersCount} />
              <SortDropdown value={filters.sortBy} onChange={(val) => dispatch({ type: "UPDATE_FILTER", filterName: "sortBy", payload: val })} />
              <ViewToggle view={viewMode} setView={setViewMode} />
            </div>
          </div>
          {activeFiltersCount > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {filters.selectedCategory !== "all" && (
                  <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-gray-100">
                    Категория: {filters.selectedCategory}
                  </span>
                )}
                {filters.selectedSubcategory && (
                  <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-gray-100">
                    Подкатегория: {filters.selectedSubcategory}
                  </span>
                )}
              </div>
              <button onClick={handleResetFilters} className="text-xs sm:text-sm text-gray-600 hover:text-black mt-2 sm:mt-0">
                Сбросить фильтры
              </button>
            </div>
          )}
        </header>
        {loading ? (
          <SkeletonGrid count={8} layout={viewMode} />
        ) : filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} view={viewMode} />
        ) : (
          <EmptyState query={debouncedSearch} resetFilters={handleResetFilters} />
        )}
      </section>
      <AnimatePresence>
        {isFiltersOpen && (
          <FilterModal
            onClose={() => setFiltersOpen(false)}
            onApplyFilters={(nf) => dispatch({ type: "SET_FILTERS", payload: nf })}
            initialFilters={filters}
          />
        )}
      </AnimatePresence>
      <ScrollToTopButton show={showButton} onClick={scrollToTop} />
    </main>
  );
};

export default Catalog;