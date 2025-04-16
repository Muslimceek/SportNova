import React, { useState, useEffect, useCallback, useRef, lazy, Suspense, memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaBars, FaTimes, FaRegHeart, FaShoppingCart, FaSun, FaMoon } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from './TopBar';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useAuth } from '../../contexts/AuthContext';

const SearchOverlay = lazy(() => import('./SearchOverlay'));
const CartDropdown = lazy(() => import('./CartDropdown'));

const MAIN_NAV_LINKS = [
  { path: 'catalog', label: 'Каталог' },
  { path: 'about', label: 'О нас' },
  { path: 'blog', label: 'Блог' },
  { path: 'contacts', label: 'Контакты' },
  { path: 'profile', label: 'Профиль', pathResolver: isAdmin => (isAdmin ? '/admin' : '/user/profile') },
];

const IconButton = memo(({ icon, onClick, count = 0, label, darkMode }) => {
  return (
    <motion.button
      onClick={onClick}
      aria-label={label}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`p-2 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full overflow-hidden ${
        darkMode ? 'text-white' : 'text-black'
      }`}
    >
      {/* Background hover effect */}
      <span className={`absolute inset-0 rounded-full transition-opacity duration-300 opacity-0 hover:opacity-10 ${
        darkMode ? 'bg-white' : 'bg-black'
      }`} />
      
      {/* Icon with subtle hover rotation */}
      <motion.span 
        className="inline-block"
        whileHover={{ rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {icon}
      </motion.span>
      
      {/* Enhanced notification counter with animation */}
      {count > 0 && (
        <motion.span 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-xs text-white font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md`}
        >
          {count}
        </motion.span>
      )}
    </motion.button>
  );
});

const NavLink = memo(({ to, onClick, children, isActive, darkMode }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className="relative group py-1 px-0.5 overflow-hidden"
    >
      {/* Text with styling */}
      <span className={`text-base font-medium transition-all duration-300 ${
        darkMode && isActive
          ? 'text-white font-bold'
          : darkMode
          ? 'text-gray-300 group-hover:text-white'
          : isActive
          ? 'text-black font-bold'
          : 'text-gray-700 group-hover:text-black'
      }`}>
        {children}
      </span>
      
      {/* Animated underline */}
      <span 
        className={`absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100 ${
          isActive 
            ? darkMode ? 'bg-white scale-x-100' : 'bg-black scale-x-100' 
            : darkMode ? 'bg-white/70' : 'bg-black/70'
        }`} 
        aria-hidden="true"
      />
    </Link>
  );
});

const MobileMenu = memo(({ isOpen, onClose, darkMode }) => {
  const { pathname } = useLocation();
  const menuRef = useRef(null);
  
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKey = e => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };
  
  const menuVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: i => ({ opacity: 1, x: 0, transition: { delay: i * 0.1, duration: 0.3 } })
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-40 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={onClose} 
          aria-hidden="true"
        >
          <motion.div
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Навигационное меню"
            className={`fixed top-0 right-0 h-full w-4/5 max-w-xs p-6 shadow-xl ${
              darkMode ? 'bg-gray-900' : 'bg-white'
            }`}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            onClick={e => e.stopPropagation()}
          >
            {/* Premium gradient accent line */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" aria-hidden="true" />
            
            <div className="flex justify-between items-center mb-8">
              <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>Меню</span>
              <motion.button 
                onClick={onClose} 
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
                className={`p-2 rounded-full ${darkMode ? 'text-white hover:bg-gray-800' : 'text-black hover:bg-gray-100'}`}
                aria-label="Закрыть меню"
              >
                <FaTimes size={20} />
              </motion.button>
            </div>
            
            <nav className="mt-6 flex flex-col space-y-6">
              {MAIN_NAV_LINKS.map(({ path, label, pathResolver }, i) => (
                <motion.div
                  key={path}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={itemVariants}
                >
                  <NavLink
                    to={pathResolver ? pathResolver(false) : `/${path}`}
                    onClick={onClose}
                    isActive={pathname.includes(path)}
                    darkMode={darkMode}
                  >
                    {label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

const Navbar = () => {
  const { pathname } = useLocation();
  const { cartItems } = useCart();
  const { favorites } = useFavorites();
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const lastScrollY = useRef(0);
  const [scrollDirection, setScrollDirection] = useState("none");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  // Enhanced scroll detection for premium UX
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);
      
      if (currentScrollY > lastScrollY.current + 10) {
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY.current - 10) {
        setScrollDirection("up");
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const userRoute = useCallback(
    () => (currentUser ? (isAdmin ? '/admin' : '/user/profile') : '/login'),
    [currentUser, isAdmin]
  );

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const toggleSearch = useCallback(() => {
    setSearchOpen(prev => !prev);
  }, []);

  const toggleCart = useCallback(() => {
    setCartOpen(prev => !prev);
  }, []);

  const closeCart = useCallback(() => {
    setCartOpen(false);
  }, []);

  // Header animation variants
  const headerVariants = {
    visible: { y: 0, opacity: 1 },
    hidden: { y: -20, opacity: 0 }
  };

  return (
    <>
      <motion.header 
        className={`fixed w-full z-50 ${
          scrolled ? 'shadow-lg' : 'shadow-sm'
        } ${darkMode ? 'bg-black' : 'bg-white'}`}
        initial="visible"
        animate={scrollDirection === "down" && scrolled ? "hidden" : "visible"}
        variants={headerVariants}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {/* Premium gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" aria-hidden="true" />
        
        {pathname === '/' && <TopBar darkMode={darkMode} className="hidden sm:block" />}
        
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center">
            <motion.button
              className="mr-3 md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 p-2 rounded-md"
              onClick={toggleMobileMenu}
              whileTap={{ scale: 0.9 }}
              aria-label="Меню"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <FaBars size={20} className={`transition-transform ${darkMode ? 'text-white' : 'text-black'}`} />
            </motion.button>
            
            <Link 
              to="/" 
              className={`text-xl sm:text-2xl font-bold uppercase tracking-wider ${
                darkMode ? 'text-white' : 'text-black'
              } hover:opacity-90 transition-opacity relative group`}
            >
              SportNova
              {/* Premium brand accent */}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" aria-hidden="true" />
            </Link>
          </div>
          
          <nav className="hidden md:block" aria-label="Основная навигация">
            <div className="flex space-x-6">
              {MAIN_NAV_LINKS.map(({ path, label, pathResolver }) => (
                <NavLink
                  key={path}
                  to={pathResolver ? pathResolver(isAdmin) : `/${path}`}
                  isActive={pathname.includes(path)}
                  darkMode={darkMode}
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </nav>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <IconButton 
              icon={<FiSearch size={18} />} 
              onClick={toggleSearch} 
              darkMode={darkMode} 
              label="Поиск" 
            />
            <IconButton 
              icon={<FaRegHeart size={18} />} 
              onClick={() => navigate('/favorites')} 
              count={favorites.length} 
              darkMode={darkMode} 
              label="Избранное" 
            />
            <div className="relative">
              <IconButton 
                icon={<FaShoppingCart size={18} />} 
                onClick={toggleCart} 
                count={cartItems.length} 
                darkMode={darkMode} 
                label="Корзина" 
              />
              <Suspense fallback={null}>
                <CartDropdown isOpen={cartOpen} onClose={closeCart} darkMode={darkMode} />
              </Suspense>
            </div>
            <IconButton 
              icon={<FaUser size={18} />} 
              onClick={() => navigate(userRoute())} 
              darkMode={darkMode} 
              label="Профиль" 
            />
            
            <motion.button 
              onClick={toggleDarkMode} 
              whileHover={{ rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                darkMode ? 'text-white' : 'text-black'
              }`}
              aria-label={darkMode ? "Светлый режим" : "Темный режим"}
              aria-pressed={darkMode}
            >
              {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
            </motion.button>
          </div>
        </div>
      </motion.header>
      
      <Suspense fallback={null}>
        <SearchOverlay isOpen={searchOpen} onClose={toggleSearch} darkMode={darkMode} />
      </Suspense>
      
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={toggleMobileMenu} 
        darkMode={darkMode} 
      />
      
      {pathname === '/' && (
        <div className="block sm:hidden pt-16">
          <TopBar darkMode={darkMode} />
        </div>
      )}
    </>
  );
};

export default memo(Navbar);


