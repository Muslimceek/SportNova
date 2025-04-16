import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ProductCard from "../../components/ProductCard";
axios.defaults.baseURL = process.env.REACT_APP_API_URL || "http://localhost:4000";

// Animation variants (shortened names)
const anim = {
  h: { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.3 } },
  fi: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.4 } },
  hv: { whileHover: { x: 10 } },
  dd: { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, exit: { opacity: 0, height: 0 } }
};

// API functions (renamed keys)
const api = {
  cat: async () => (await axios.get("/api/categories")).data,
  search: async q => (await axios.get(`/api/products?search=${q}`)).data
};

// Generic skeleton component for reuse
const Skel = ({ count, className }) => (
  <>{Array.from({ length: count }, (_, i) => <div key={i} className={`animate-pulse ${className}`} />)}</>
);
const CategorySkel = () => <div className="space-y-4"><Skel count={5} className="h-10 bg-white/10 rounded-md w-3/4" /></div>;
const SearchSkel = () => <div className="grid grid-cols-2 gap-4"><Skel count={4} className="bg-white/10 rounded-xl h-48" /></div>;

const Hero = ({ searchQuery, setSearchQuery, onCategorySelect }) => {
  const [openCat, setOpenCat] = useState(null);
  const [hover, setHover] = useState(null);

  const { data: cats = [], isLoading: lCats, isError: eCats, error: errCats } = useQuery({
    queryKey: ["categories"],
    queryFn: api.cat,
    staleTime: 300000
  });
  const { data: sRes = [], isLoading: lSearch, isError: eSearch, error: errSearch } = useQuery({
    queryKey: ["searchResults", searchQuery],
    queryFn: () => api.search(searchQuery),
    enabled: !!searchQuery,
    keepPreviousData: true
  });

  const getPrice = useCallback(
    p => p?.pricing ? `${p.pricing.discounted || p.pricing.basePrice || p.pricing.minPrice} ${p.pricing.currency || "RUB"}` : "",
    []
  );
  const handleCat = useCallback(
    cat =>
      cat.subcategories?.length
        ? setOpenCat(prev => (prev === cat.id ? null : cat.id))
        : onCategorySelect({ category: cat.id, subcategory: "" }),
    [onCategorySelect]
  );

  const CatList = useMemo(() => {
    if (lCats) return <CategorySkel />;
    if (eCats)
      return (
        <div className="p-4 bg-red-500/20 rounded-lg">
          <p className="text-red-300">Failed to load categories: {errCats?.message || "Unknown error"}</p>
          <button className="mt-2 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-md text-sm transition-colors" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      );
    return (
      <>
        <motion.div {...anim.hv} onClick={() => onCategorySelect({ category: "all", subcategory: "" })} className="group flex items-center py-4 cursor-pointer">
          <span className="text-xl font-medium text-white/60 group-hover:text-cyan-400 transition-all">Все товары</span>
        </motion.div>
        {cats.map(cat => (
          <div key={cat.id} className="relative">
            <motion.div {...anim.hv} onClick={() => handleCat(cat)} className="group flex items-center py-4 cursor-pointer">
              <span className="text-xl font-medium text-white/60 group-hover:text-cyan-400 transition-all">{cat.name?.ru}</span>
              {cat.subcategories?.length > 0 && (
                <ChevronDown className={`ml-2 w-5 h-5 transform transition-transform ${openCat === cat.id ? "rotate-0" : "-rotate-90"}`} />
              )}
            </motion.div>
            <AnimatePresence>
              {openCat === cat.id && cat.subcategories?.length > 0 && (
                <motion.div {...anim.dd} className="pl-6 border-l border-white/20">
                  {cat.subcategories.map(sub => (
                    <motion.div key={sub.id} {...anim.hv} onClick={() => onCategorySelect({ category: cat.id, subcategory: sub.id })} className="py-2 cursor-pointer text-lg text-white/70 hover:text-cyan-400 transition-all">
                      {sub.name?.ru}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </>
    );
  }, [cats, lCats, eCats, errCats, openCat, handleCat, onCategorySelect]);

  const SearchResults = useMemo(() => {
    if (!searchQuery) return null;
    if (lSearch) return <SearchSkel />;
    if (eSearch)
      return (
        <div className="p-4 bg-red-500/20 rounded-lg">
          <p className="text-red-300">Search error: {errSearch?.message || "Failed to fetch results"}</p>
        </div>
      );
    if (sRes.length === 0)
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-white/70 text-center">No products found for "{searchQuery}"</p>
        </div>
      );
    return (
      <div className="grid grid-cols-2 gap-4">
        {sRes.map(p => (
          <motion.div key={p.id} className="transform scale-95 transition-transform duration-200 hover:scale-100" onMouseEnter={() => setHover(p)} onMouseLeave={() => setHover(null)}>
            <ProductCard product={p} />
          </motion.div>
        ))}
      </div>
    );
  }, [searchQuery, sRes, lSearch, eSearch, errSearch]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        <video autoPlay muted loop className="w-full h-full object-cover opacity-40" poster="https://niketunes.b-cdn.net/wp-content/uploads/2023/05/nike-tech-phoenix-fleece-collection.jpg">
          <source src="/hero-video.mp4" type="video/mp4" />
          <img src="https://niketunes.b-cdn.net/wp-content/uploads/2023/05/nike-tech-phoenix-fleece-collection.jpg" alt="Sports collection" className="w-full h-full object-cover" />
        </video>
      </div>
      <main className="relative z-10 container mx-auto px-4 pt-24 h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 w-full">
          <section className="flex flex-col justify-center space-y-6 md:space-y-8">
            <div className="min-h-[100px] md:min-h-[120px] flex items-center">
              <AnimatePresence mode="wait">
                {searchQuery && hover ? (
                  <motion.div key="hp" {...anim.h} className="flex flex-col">
                    <h1 className="text-4xl md:text-5xl font-semibold leading-tight truncate">{hover.name?.ru}</h1>
                    <p className="text-cyan-400 text-2xl md:text-3xl mt-1">{getPrice(hover)}</p>
                  </motion.div>
                ) : (
                  <motion.h1 key="dh" {...anim.h} className="text-4xl md:text-6xl font-bold leading-tight">
                    Движение и Стиль
                  </motion.h1>
                )}
              </AnimatePresence>
            </div>
            <motion.div {...anim.fi} className="relative max-w-xl">
              <input
                type="text"
                aria-label="Поиск товаров"
                placeholder="Искать товары..."
                className="w-full px-4 md:px-8 py-3 md:py-5 bg-white/5 backdrop-blur-lg rounded-xl border border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all outline-none text-sm md:text-lg"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <FiSearch className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 w-5 md:w-6 h-5" />
            </motion.div>
          </section>
          <aside className="hidden lg:flex flex-col justify-start border-l border-white/10 max-h-[80vh] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {searchQuery ? SearchResults : CatList}
          </aside>
        </div>
      </main>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <div className="w-px h-16 bg-gradient-to-t from-white/50 to-transparent" />
        <span className="mt-4 text-xs md:text-sm">Прокрутите вниз, чтобы просмотреть каталог</span>
      </motion.div>
    </div>
  );
};

export default Hero;