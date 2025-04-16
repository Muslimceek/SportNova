import React, { useState, useCallback, memo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSignInAlt, FaUserPlus, FaRegUser, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";

// Enhanced link data with icons for visual hierarchy
const TOP_BAR_LINKS = [
  { label: "Условия использования", href: "/terms" },
  { label: "Категории", href: "#categories" },
  { label: "Избранные", href: "#featured-products" },
  { label: "Преимущества", href: "#benefits" },
  { label: "Акции", href: "#promotions", highlight: true },
  { label: "Отзывы", href: "#testimonials" },
  { label: "Новости", href: "#latest-news" },
];

// Enhanced NavLink with premium hover effect
const NavLink = memo(({ href, children, darkMode, highlight }) => {
  const linkRef = useRef(null);
  
  return (
    <a 
      ref={linkRef}
      href={href}
      className={`relative py-1 px-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all duration-300 group overflow-hidden ${
        highlight 
          ? darkMode ? 'text-amber-300 font-medium' : 'text-amber-600 font-medium' 
          : darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
      }`}
    >
      <span className="relative z-10">{children}</span>
      
      {/* Premium animated underline effect */}
      <span 
        className={`absolute bottom-0 left-0 w-0 h-0.5 ${
          highlight 
            ? 'bg-amber-400' 
            : darkMode ? 'bg-white' : 'bg-black'
        } transition-all duration-300 ease-out group-hover:w-full`} 
        aria-hidden="true"
      />
      
      {/* Subtle background hover effect */}
      <span 
        className={`absolute inset-0 w-full h-full ${
          darkMode ? 'bg-white' : 'bg-black'
        } opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-sm`}
        aria-hidden="true"
      />
    </a>
  );
});

// Enhanced IconButton with premium interaction
const IconButton = memo(({ icon, onClick, label, darkMode, className = "", isActive = false }) => (
  <button
    onClick={onClick}
    aria-label={label}
    aria-pressed={isActive}
    className={`p-1.5 sm:p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all duration-200 relative overflow-hidden ${
      darkMode 
        ? 'text-gray-200 border-zinc-600 hover:bg-zinc-700 active:bg-zinc-600' 
        : 'text-gray-700 border-gray-300 hover:bg-gray-100 active:bg-gray-200'
    } ${isActive ? (darkMode ? 'bg-zinc-700' : 'bg-gray-100') : ''} ${className}`}
  >
    <span className="relative z-10">{icon}</span>
    
    {/* Premium ripple effect on click */}
    <motion.span 
      className={`absolute inset-0 ${darkMode ? 'bg-white' : 'bg-black'} opacity-0`}
      initial={{ scale: 0, opacity: 0 }}
      whileTap={{ scale: 2, opacity: 0.1, transition: { duration: 0.5 } }}
      aria-hidden="true"
    />
  </button>
));

const TopBar = ({ extraLinks = [], darkMode, className = "" }) => {
  const { currentUser } = useAuth();
  const links = extraLinks.length ? extraLinks : TOP_BAR_LINKS;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("none");
  const lastScrollY = useRef(0);
  
  // Enhanced scroll direction detection for premium UX
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current + 10) {
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY.current - 10) {
        setScrollDirection("up");
      }
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
    if (!mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.nav
        className={`bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700 text-sm select-none ${className}`}
        aria-label="Верхняя панель навигации"
        initial={{ opacity: 1, y: 0 }}
        animate={{ 
          opacity: scrollDirection === "down" ? 0.95 : 1,
          y: scrollDirection === "down" ? -5 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
          {/* Premium gradient accent line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" aria-hidden="true" />
          
          <ul className="hidden sm:flex flex-wrap gap-x-5 text-gray-600 dark:text-gray-300">
            {links.map((link) => (
              <li key={link.href}>
                <NavLink href={link.href} darkMode={darkMode} highlight={link.highlight}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          
          <div className="sm:hidden">
            <IconButton
              icon={mobileMenuOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
              onClick={toggleMobileMenu}
              label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
              darkMode={darkMode}
              isActive={mobileMenuOpen}
              className="border"
            />
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            {!currentUser ? (
              <>
                <Link
                  to="/login"
                  className={`p-1.5 sm:p-2 border rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all duration-200 relative overflow-hidden ${
                    darkMode 
                      ? 'border-zinc-600 text-gray-200 hover:bg-zinc-700 active:bg-zinc-600' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                  }`}
                  aria-label="Войти в аккаунт"
                >
                  <FaSignInAlt size={16} />
                </Link>
                <Link
                  to="/register"
                  className={`p-1.5 sm:p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all duration-200 relative overflow-hidden ${
                    darkMode
                      ? 'bg-white text-black hover:bg-gray-200 active:bg-gray-300'
                      : 'bg-black text-white hover:bg-gray-800 active:bg-gray-700'
                  }`}
                  aria-label="Зарегистрироваться"
                >
                  <FaUserPlus size={16} />
                  
                  {/* Premium subtle glow effect */}
                  <span 
                    className={`absolute inset-0 ${darkMode ? 'bg-white' : 'bg-blue-400'} opacity-0 hover:opacity-20 transition-opacity duration-300 blur-md`}
                    aria-hidden="true"
                  />
                </Link>
              </>
            ) : (
              <Link
                to="/user/profile"
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md p-1 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-zinc-800 group"
              >
                <span className="hidden sm:inline font-medium relative">
                  Привет,&nbsp;
                  <strong className="font-semibold relative">
                    {currentUser.displayName?.split(" ")[0] ||
                      currentUser.email.split("@")[0]}
                    
                    {/* Premium text highlight effect */}
                    <span 
                      className={`absolute bottom-0 left-0 w-0 h-0.5 ${darkMode ? 'bg-blue-400' : 'bg-blue-500'} transition-all duration-300 ease-out group-hover:w-full`}
                      aria-hidden="true" 
                    />
                  </strong>
                  !
                </span>
                
                {/* Enhanced profile image with premium animation */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Фото профиля пользователя"
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 dark:border-zinc-600 object-cover shadow-sm"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 dark:border-zinc-600 flex items-center justify-center bg-white dark:bg-zinc-800 shadow-sm">
                      <FaRegUser size={14} className="text-gray-700 dark:text-white" />
                    </div>
                  )}
                </motion.div>
              </Link>
            )}
          </div>
        </div>
      </motion.nav>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="sm:hidden fixed inset-0 z-30 bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={toggleMobileMenu}
          >
            <motion.div 
              className="absolute top-10 left-0 right-0 bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700 shadow-lg"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Premium gradient accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" aria-hidden="true" />
              
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-zinc-700">
                <h3 className="font-medium text-gray-800 dark:text-white">Навигация</h3>
                <IconButton
                  icon={<FaTimes size={16} />}
                  onClick={toggleMobileMenu}
                  label="Закрыть меню"
                  darkMode={darkMode}
                />
              </div>
              <ul className="px-4 py-3 space-y-3 text-gray-600 dark:text-gray-300 max-h-[60vh] overflow-y-auto">
                {links.map((link, index) => (
                  <motion.li 
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.1 + index * 0.05 }}
                  >
                    <a 
                      href={link.href} 
                      className={`block py-2 px-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all duration-200 ${
                        link.highlight 
                          ? darkMode ? 'text-amber-300 font-medium' : 'text-amber-600 font-medium' 
                          : ''
                      }`}
                      onClick={toggleMobileMenu}
                    >
                      {link.label}
                      
                      {/* Premium indicator for highlighted items */}
                      {link.highlight && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                          Акция
                        </span>
                      )}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(TopBar);
