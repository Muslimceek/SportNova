import React, { useState, useMemo, useCallback, memo } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUser, FiPackage, FiHeart, FiMapPin, FiCreditCard, FiGift,
  FiHelpCircle, FiSettings, FiLogOut, FiMenu, FiX 
} from "react-icons/fi";

// Centralized animation variants for cleaner code
const fadeSlide = {
  hidden: { opacity: 0, x: -300 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -300 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.5 },
  exit: { opacity: 0 },
};

// Memoized component for displaying user info
const UserInfo = memo(({ user }) => (
  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100 mb-6">
    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
      {user.displayName ? user.displayName[0].toUpperCase() : "U"}
    </div>
    <div className="overflow-hidden">
      <p className="font-semibold truncate">{user.displayName || user.email}</p>
      {user.displayName && <p className="text-sm text-gray-500 truncate">{user.email}</p>}
    </div>
  </div>
));

// Memoized menu list to prevent unnecessary re-renders
const MenuList = memo(({ items, currentPath, onItemClick }) => (
  <ul className="space-y-2">
    {items.map(({ path, label, icon }) => {
      const isActive = currentPath === path.replace("/", "");
      return (
        <li key={path}>
          <Link
            to={path}
            onClick={onItemClick}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive 
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md transform scale-102" 
                : "text-gray-700 hover:bg-gray-100 hover:scale-102"
            }`}
          >
            <div className={`${isActive ? "text-white" : "text-blue-500"}`}>
              {icon}
            </div>
            <span className="font-medium">{label}</span>
            {isActive && (
              <div className="ml-auto w-2 h-2 rounded-full bg-white"></div>
            )}
          </Link>
        </li>
      );
    })}
  </ul>
));

const UserPanel = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [logoutError, setLogoutError] = useState(null);
  const currentPath = pathname.split('/').pop();

  const toggleMobile = useCallback(() => setMobileOpen(prev => !prev), []);
  const openLogoutModal = useCallback(() => setLogoutModal(true), []);

  const menuItems = useMemo(() => [
    { path: "profile", label: "Профиль", icon: <FiUser className="w-5 h-5" /> },
    { path: "orders", label: "История заказов", icon: <FiPackage className="w-5 h-5" /> },
    { path: "/favorites", label: "Избранное", icon: <FiHeart className="w-5 h-5" /> },
    { path: "addresses", label: "Адреса доставки", icon: <FiMapPin className="w-5 h-5" /> },
    { path: "payment-methods", label: "Способы оплаты", icon: <FiCreditCard className="w-5 h-5" /> },
    { path: "coupons", label: "Купоны и скидки", icon: <FiGift className="w-5 h-5" /> },
    { path: "support", label: "Поддержка", icon: <FiHelpCircle className="w-5 h-5" /> },
    { path: "settings", label: "Настройки", icon: <FiSettings className="w-5 h-5" /> },
  ], []);

  const handleLogout = async () => {
    try {
      setLogoutError(null);
      await logout();
      setLogoutModal(false);
      navigate("/login");
    } catch (error) {
      setLogoutError("Не удалось выйти из аккаунта. Пожалуйста, попробуйте снова.");
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-montserrat">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Личный кабинет</h1>
        <button onClick={toggleMobile} className="p-2 rounded-full hover:bg-gray-100" aria-label={isMobileOpen ? "Закрыть меню" : "Открыть меню"}>
          {isMobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
      </header>
      
      <div className="container mx-auto p-4 flex flex-col lg:flex-row">
        {/* Sidebar for Desktop */}
        <aside className="hidden lg:block w-72 mr-6 flex-shrink-0">
          <nav className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-4">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Личный кабинет</h2>
            {currentUser && <UserInfo user={currentUser} />}
            <MenuList items={menuItems} currentPath={currentPath} onItemClick={() => {}} />
            <button 
              onClick={openLogoutModal} 
              className="mt-8 w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-50 to-red-100 text-red-600 px-4 py-3 rounded-lg hover:from-red-100 hover:to-red-200 transition-all duration-300 border border-red-200"
            >
              <FiLogOut className="w-5 h-5" /><span className="font-medium">Выйти из аккаунта</span>
            </button>
          </nav>
        </aside>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.aside
              initial="hidden" animate="visible" exit="exit" variants={fadeSlide}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed inset-0 z-50 bg-white shadow-xl w-4/5 max-w-sm"
            >
              <div className="p-6 h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Меню</h2>
                  <button onClick={toggleMobile} className="p-2 rounded-full hover:bg-gray-100">
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
                {currentUser && <UserInfo user={currentUser} />}
                <MenuList items={menuItems} currentPath={currentPath} onItemClick={toggleMobile} />
                <button 
                  onClick={openLogoutModal} 
                  className="mt-8 w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-50 to-red-100 text-red-600 px-4 py-3 rounded-lg hover:from-red-100 hover:to-red-200 transition-all duration-300 border border-red-200"
                >
                  <FiLogOut className="w-5 h-5" /><span className="font-medium">Выйти из аккаунта</span>
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
        
        {/* Mobile Backdrop */}
        {isMobileOpen && (
          <AnimatePresence>
            <motion.div
              initial="hidden" animate="visible" exit="exit" variants={backdropVariants}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed inset-0 z-40 bg-black"
              onClick={toggleMobile}
            />
          </AnimatePresence>
        )}
        
        {/* Main Content */}
        <main className="flex-1 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <Outlet />
        </main>
      </div>
      
      {/* Logout Modal */}
      <AnimatePresence>
        {logoutModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial="hidden" animate="visible" exit="exit" variants={modalVariants}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-4">Выход из аккаунта</h3>
              <p className="text-gray-600 mb-6">Вы уверены, что хотите выйти из своего аккаунта?</p>
              {logoutError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-100">
                  {logoutError}
                </div>
              )}
              <div className="flex space-x-3">
                <button onClick={() => setLogoutModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Отмена
                </button>
                <button onClick={handleLogout} className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-colors shadow-md">
                  Выйти
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserPanel;

