import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FiSearch, FiHeart, FiShoppingBag, FiMenu, FiUser, FiX } from "react-icons/fi";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useCart } from "../../contexts/CartContext";
import { useFavorites } from "../../contexts/FavoritesContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const useTheme = () => ({ themeVariables: { backgroundColor: "#fff", color: "#000" } });

const IconButton = ({ to, icon, count, ...props }) => (
  <Link to={to} {...props} className="relative inline-block">
    {icon}
    {count > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
        {count}
      </span>
    )}
  </Link>
);

const mobileMenuItemVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const Header = () => {
  const { cartItems } = useCart();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { themeVariables } = useTheme();

  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [focused, setFocused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef(null);
  const searchRef = useRef(null);

  // Fetch products from Firestore
  useEffect(() => {
    (async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const prods = [];
        snapshot.forEach(doc => prods.push({ id: doc.id, ...doc.data() }));
        setProducts(prods);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    })();
  }, []);

  // Filter products by name.ru or name.en
  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const lq = query.toLowerCase();
    return products.filter(p => {
      const ru = p.name?.ru?.toLowerCase() || "";
      const en = p.name?.en?.toLowerCase() || "";
      return ru.includes(lq) || en.includes(lq);
    });
  }, [query, products]);

  // Handle key events in search input
  const handleKey = useCallback(
    e => {
      if (e.key === "Escape") {
        setFocused(false);
        inputRef.current?.blur();
      }
      if (e.key === "Enter" && query.trim()) {
        navigate(`/shop?search=${encodeURIComponent(query)}`);
        setFocused(false);
      }
    },
    [query, navigate]
  );

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = e => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setFocused(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resultsVariants = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.1 } },
      };

  const renderResults = useCallback(
    () =>
      filtered.slice(0, 5).map(item => {
        const name = item.name?.ru || item.name?.en || "Без названия";
        return (
          <li key={item.id} role="option" aria-selected="false">
            <Link
              to={`/product/${item.id}`}
              className="block px-4 py-3 text-gray-800 text-sm hover:bg-gray-50"
              onClick={() => {
                setFocused(false);
                setQuery("");
              }}
              onKeyDown={e => e.key === "Enter" && setFocused(false)}
              tabIndex={0}
            >
              {name}
            </Link>
          </li>
        );
      }),
    [filtered]
  );

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md border-b border-gray-200/20"
      style={themeVariables}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={reduceMotion ? {} : { type: "spring", stiffness: 100, damping: 20 }}
    >
      <nav className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-2 md:py-4 flex flex-wrap md:flex-nowrap justify-between items-center gap-2 md:gap-0">
        <Link to="/" className="flex items-center gap-1 sm:gap-2 font-semibold text-gray-900 order-1" aria-label="SportNova Home">
          <picture>
            <source srcSet="https://i.ibb.co/3mvJzbrv/Frame-13.png" type="image/png" />
            <img className="h-6 sm:h-8 w-auto" src="https://i.ibb.co/3mvJzbrv/Frame-13.png" alt="SportNova" loading="lazy" />
          </picture>
          <span className="text-lg sm:text-xl md:text-2xl tracking-tight">SportNova</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 order-2 md:order-3">
          <IconButton to="/favorites" icon={<FiHeart className="w-5 h-5 sm:w-6 sm:h-6" />} count={favorites.length} aria-label={`Избранное (${favorites.length} товаров)`} />
          <IconButton to="/cart" icon={<FiShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />} count={cartItems.length} aria-label={`Корзина (${cartItems.length} товаров)`} />
          <IconButton to="/profile" icon={<FiUser className="w-5 h-5 sm:w-6 sm:h-6" />} className="hidden md:inline-block" aria-label="Профиль пользователя" />
          <button className="md:hidden text-gray-800 hover:text-gray-900" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}>
            {menuOpen ? <FiX className="w-5 h-5 sm:w-6 sm:h-6" /> : <FiMenu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>

        <div
          className="relative w-full md:w-96 lg:w-1/2 order-3 md:order-2 mt-2 md:mt-0 md:ml-8"
          ref={searchRef}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={focused}
          aria-controls="search-results-list"
        >
          <div className="flex items-center bg-gray-100 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 w-full shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-shadow duration-200 ease-in-out">
            <FiSearch className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Поиск товаров..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              onKeyDown={handleKey}
              className="bg-transparent ml-2 outline-none text-gray-800 w-full placeholder-gray-500 text-sm sm:text-base"
              aria-label="Поиск товара"
              aria-controls="search-results-list"
            />
          </div>
          <AnimatePresence initial={false}>
            {focused && (
              <motion.div
                className="absolute top-full left-0 mt-1 w-full bg-white rounded-md shadow-xl z-50 overflow-hidden border border-gray-200"
                variants={resultsVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                role="listbox"
                id="search-results-list"
              >
                {filtered.length ? (
                  <>
                    <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                      {renderResults()}
                    </ul>
                    {filtered.length > 5 && (
                      <div className="border-t border-gray-200">
                        <Link
                          to={`/shop?search=${encodeURIComponent(query)}`}
                          className="block px-4 py-2 sm:py-3 text-blue-600 text-xs sm:text-sm font-medium text-center hover:bg-gray-50"
                          onClick={() => setFocused(false)}
                          tabIndex={0}
                          role="option"
                          aria-selected="false"
                        >
                          Показать все результаты ({filtered.length})
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">
                    {query.trim() ? `Ничего не найдено по запросу "${query}"` : "Начните вводить запрос"}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            className="absolute top-full left-0 w-full bg-white shadow-md border-b border-gray-200 overflow-hidden md:hidden"
            variants={{
              initial: { opacity: 0, y: -20 },
              animate: { opacity: 1, y: 0, transition: { duration: 0.3, delayChildren: 0.2, staggerChildren: 0.05 } },
              exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ maxHeight: "70vh", overflowY: "auto" }}
          >
            <nav className="py-2 px-4 sm:px-6 flex flex-col space-y-1 sm:space-y-2">
              {["Home", "Shop", "Favorites", "Cart", "Profile"].map(item => (
                <motion.div key={item} variants={mobileMenuItemVariants}>
                  <NavLink
                    to={`/${item.toLowerCase()}`}
                    className={({ isActive }) =>
                      `block py-2 px-3 sm:px-4 rounded-md transition-colors duration-200 text-sm sm:text-base text-gray-800 ${
                        isActive ? "bg-gray-100 font-semibold" : "hover:bg-gray-100"
                      }`
                    }
                    onClick={() => setMenuOpen(false)}
                    tabIndex={menuOpen ? 0 : -1}
                  >
                    {item}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default React.memo(Header);
