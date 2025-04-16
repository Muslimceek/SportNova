import React, { useReducer, useEffect, useCallback, useState, useMemo } from "react";
import { motion } from "framer-motion"; // Удалён AnimatePresence
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { XMarkIcon } from "@heroicons/react/24/outline";

const initialState = {
  selectedCategory: "all",
  selectedSubcategory: "",
  selectedBrand: "",
  selectedColor: "",
  selectedSize: "",
  minPrice: "",
  maxPrice: "",
  minDiscount: "",
  inStockOnly: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
    case "SET_ALL":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const FilterField = ({ id, label, children, className = "" }) => (
  <div className={`mb-4 ${className}`}>
    <label htmlFor={id} className="block mb-1 text-sm font-medium text-gray-700">
      {label}
    </label>
    {children}
  </div>
);

const InputStyles =
  "w-full p-2.5 rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 shadow-sm";

const FilterModal = ({ onClose, onApplyFilters, initialFilters = {} }) => {
  const db = getFirestore();
  const [state, dispatch] = useReducer(reducer, { ...initialState, ...initialFilters });
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    subcategories: [],
    brands: [],
    colors: [],
    sizes: [],
    loading: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem("productFilters");
    if (saved) {
      try {
        dispatch({ type: "SET_ALL", payload: JSON.parse(saved) });
      } catch (e) {
        console.error("Saved filters error:", e);
        localStorage.removeItem("productFilters");
      }
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = e => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const cats = new Set(), subs = new Set(), brands = new Set(), colors = new Set(), sizes = new Set();
        snapshot.forEach(doc => {
          const p = doc.data();
          if (p.category?.id) cats.add(p.category.id);
          if (p.subcategory?.id) subs.add(p.subcategory.id);
          if (p.brand) brands.add(p.brand);
          p.options?.colors?.forEach(c => colors.add(c));
          p.pricing?.variants?.forEach(v => v.size && sizes.add(v.size));
        });
        setFilterOptions({
          categories: Array.from(cats).sort(),
          subcategories: Array.from(subs).sort(),
          brands: Array.from(brands).sort(),
          colors: Array.from(colors).sort(),
          sizes: Array.from(sizes).sort(),
          loading: false,
        });
      } catch (error) {
        console.error("Fetch options error:", error);
        setFilterOptions(prev => ({ ...prev, loading: false }));
      }
    };
    fetchOptions();
  }, [db]);

  const handleChange = useCallback((field, value) => dispatch({ type: "SET_FIELD", field, value }), []);

  const handleApply = () => {
    localStorage.setItem("productFilters", JSON.stringify(state));
    onApplyFilters?.(state);
    onClose();
  };

  const handleReset = () => {
    dispatch({ type: "RESET" });
    localStorage.removeItem("productFilters");
    onApplyFilters?.(initialState);
    onClose();
  };

  const modalVariants = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
    exit: { x: "100%", transition: { duration: 0.2 } },
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
  };

  const itemVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

  const filterFields = useMemo(() => [
    { id: "category", label: "Категория", type: "select", value: state.selectedCategory, options: filterOptions.categories, placeholder: "Все категории", defaultValue: "all" },
    { id: "subcategory", label: "Подкатегория", type: "select", value: state.selectedSubcategory, options: filterOptions.subcategories, placeholder: "Все подкатегории", defaultValue: "" },
    { id: "brand", label: "Бренд", type: "select", value: state.selectedBrand, options: filterOptions.brands, placeholder: "Все бренды", defaultValue: "" },
    { id: "color", label: "Цвет", type: "select", value: state.selectedColor, options: filterOptions.colors, placeholder: "Любой цвет", defaultValue: "" },
    { id: "size", label: "Размер", type: "select", value: state.selectedSize, options: filterOptions.sizes, placeholder: "Любой размер", defaultValue: "" },
  ], [filterOptions, state]);

  const fieldMap = { category: "selectedCategory", subcategory: "selectedSubcategory", brand: "selectedBrand", color: "selectedColor", size: "selectedSize" };

  return (
    <motion.div className="fixed inset-0 z-50 flex justify-end overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-labelledby="filter-modal-title">
      <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.div className="relative w-full max-w-md h-full bg-white shadow-xl flex flex-col overflow-hidden" variants={modalVariants} initial="hidden" animate="visible" exit="exit">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h2 id="filter-modal-title" className="text-xl font-bold text-gray-900">Фильтры</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close">
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {filterOptions.loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600">Загрузка фильтров...</p>
            </div>
          ) : (
            <motion.div variants={formVariants} initial="hidden" animate="visible" className="space-y-5">
              {filterFields.map(field => (
                <motion.div key={field.id} variants={itemVariants}>
                  <FilterField id={`filter-${field.id}`} label={field.label}>
                    <select id={`filter-${field.id}`} value={field.value} onChange={e => handleChange(fieldMap[field.id], e.target.value)} className={InputStyles}>
                      <option value={field.defaultValue}>{field.placeholder}</option>
                      {field.options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </FilterField>
                </motion.div>
              ))}
              <motion.div variants={itemVariants}>
                <div className="grid grid-cols-2 gap-4">
                  <FilterField id="filter-min-price" label="Цена от">
                    <input id="filter-min-price" type="number" placeholder="Мин. цена" value={state.minPrice} onChange={e => handleChange("minPrice", e.target.value)} className={InputStyles} />
                  </FilterField>
                  <FilterField id="filter-max-price" label="Цена до">
                    <input id="filter-max-price" type="number" placeholder="Макс. цена" value={state.maxPrice} onChange={e => handleChange("maxPrice", e.target.value)} className={InputStyles} />
                  </FilterField>
                </div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <FilterField id="filter-min-discount" label="Минимальная скидка (%)">
                  <input id="filter-min-discount" type="number" placeholder="Например, 10" value={state.minDiscount} onChange={e => handleChange("minDiscount", e.target.value)} className={InputStyles} />
                </FilterField>
              </motion.div>
              <motion.div variants={itemVariants}>
                <div className="flex items-center">
                  <input id="filter-in-stock" type="checkbox" checked={state.inStockOnly} onChange={e => handleChange("inStockOnly", e.target.checked)} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                  <label htmlFor="filter-in-stock" className="ml-2 text-sm font-medium text-gray-700">Только в наличии</label>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
        <div className="p-5 border-t border-gray-200 flex justify-between bg-gray-50">
          <motion.button onClick={handleReset} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Сбросить
          </motion.button>
          <motion.button onClick={handleApply} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Применить
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FilterModal;