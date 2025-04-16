import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const MotionLink = motion.create(Link), MotionA = motion.a;
const footerVars = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
const itemVars = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } };

const DetailedFooter = () => {
  const [email, setEmail] = useState(""), [status, setStatus] = useState(null), [lang, setLang] = useState("ru");
  const social = [
    { name: 'Twitter', url: 'https://twitter.com/sportnova', icon: '/icons/twitter.svg' },
    { name: 'Instagram', url: 'https://instagram.com/sportnova', icon: '/icons/instagram.svg' },
    { name: 'Facebook', url: 'https://facebook.com/sportnova', icon: '/icons/facebook.svg' },
    { name: 'YouTube', url: 'https://youtube.com/sportnova', icon: '/icons/youtube.svg' }
  ];
  const navSections = [
    { title: 'Navigation', links: [{ name: 'New Arrivals', href: '/catalog/новинки-и-избранное' }, { name: 'Sale', href: '/catalog/скидки-и-акции' }, { name: 'Brands', href: '/brands' }, { name: 'Support', href: '/support' }] },
    { title: 'Help', links: [{ name: 'Order Status', href: '/track-order' }, { name: 'Shipping', href: '/shipping' }, { name: 'Returns', href: '/returns' }, { name: 'Size Guides', href: '/size-guides' }, { name: 'FAQ', href: '/faq' }] },
    { title: 'Company', links: [{ name: 'About', href: '/about' }, { name: 'Careers', href: '/careers' }, { name: 'Press', href: '/press' }, { name: 'Partnerships', href: '/partners' }, { name: 'Sustainability', href: '/sustainability' }] }
  ];
  // Removed the unused 'payment' array

  const subscribe = e => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) { setStatus({ success: false, message: "Please enter a valid email" }); return; }
    setTimeout(() => { setStatus({ success: true, message: "Thank you for subscribing!" }); setEmail(""); setTimeout(() => setStatus(null), 3000); }, 1000);
  };

  const Section = ({ title, links }) => (
    <motion.div variants={footerVars} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="space-y-3 sm:space-y-4">
      <motion.h4 variants={itemVars} className="text-xs font-bold uppercase tracking-wider text-white border-b border-gray-700 pb-1">{title}</motion.h4>
      <ul className="space-y-1.5 sm:space-y-2">
        {links.map((l, i) => (
          <motion.li key={i} variants={itemVars}>
            <MotionLink to={l.href} whileHover={{ scale: 1.05, color: "#fff", x: 5 }} className="text-[10px] sm:text-xs text-gray-300 transition-colors duration-300 flex items-center">
              <span className="opacity-0 group-hover:opacity-100 mr-1">›</span>{l.name}
            </MotionLink>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );

  return (
    <footer className="bg-gradient-to-b from-black/80 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 md:py-12 flex flex-col md:flex-row md:justify-between gap-6 sm:gap-8">
        <motion.div variants={footerVars} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="flex-1 space-y-4 sm:space-y-6">
          <motion.div variants={itemVars}>
            <MotionLink to="/" whileHover={{ scale: 1.05 }} className="text-2xl sm:text-3xl font-bold tracking-tight uppercase text-white">SportNova</MotionLink>
          </motion.div>
          <motion.p variants={itemVars} className="text-xs text-gray-300">Empowering movement. Your trusted partner in sports and active lifestyle.</motion.p>
          <motion.div variants={itemVars} className="flex space-x-3 sm:space-x-4">
            {social.map(s => (
              <MotionA key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1, y: -3 }} className="p-1.5 sm:p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-300">
                <img src={s.icon} alt={`${s.name} icon`} className="w-3 h-3 sm:w-4 sm:h-4" loading="lazy" />
              </MotionA>
            ))}
          </motion.div>
          <motion.div variants={itemVars} className="pt-3 sm:pt-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Language:</span>
              <select value={lang} onChange={e => setLang(e.target.value)} className="bg-gray-800 text-white text-xs border border-gray-700 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-white">
                <option value="ru">Русский</option>
                <option value="en">English</option>
                <option value="kz">Қазақша</option>
              </select>
            </div>
          </motion.div>
        </motion.div>

        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-8">
          {navSections.map((sec, i) => <Section key={i} title={sec.title} links={sec.links} />)}
        </div>

        <motion.div variants={footerVars} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="flex-1 space-y-4 sm:space-y-6">
          <motion.h4 variants={itemVars} className="text-xs font-bold uppercase tracking-wider text-white border-b border-gray-700 pb-1">Newsletter</motion.h4>
          <motion.form variants={itemVars} className="flex flex-col space-y-3 sm:space-y-4" onSubmit={subscribe}>
            <div className="relative">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-white text-xs text-white placeholder-gray-500 transition-colors duration-300" />
              <AnimatePresence>
                {status && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`absolute -bottom-6 left-0 text-[10px] ${status.success ? 'text-green-400' : 'text-red-400'}`}>{status.message}</motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full py-2 bg-white text-black rounded font-medium text-xs hover:bg-gray-200 transition-all duration-300">Subscribe</motion.button>
          </motion.form>
          {/* Removed the sections for Secure Payment, Eco Friendly, Fast Delivery, and Payment Methods */}
        </motion.div>
      </div>
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-[10px] text-gray-400">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>© {new Date().getFullYear()} SportNova. All Rights Reserved.</motion.p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {["/privacy", "/terms", "/cookies"].map((path, i) => (
              <MotionLink key={i} to={path} whileHover={{ scale: 1.05, color: "#fff" }} className="hover:text-white transition-colors">
                {path === "/privacy" ? "Privacy Policy" : path === "/terms" ? "Terms of Service" : "Cookie Policy"}
              </MotionLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

const SimpleFooter = () => {
  const location = useLocation(), path = location.pathname;
  const getBackLink = () => {
    if (path.startsWith('/product/')) return location.state?.from || '/catalog';
    if (path.startsWith('/catalog/')) { const seg = path.split('/').filter(Boolean); return seg.length > 2 ? `/catalog/${seg[1]}` : '/catalog'; }
    if (path.startsWith('/account/')) return '/account';
    if (path === '/checkout/shipping') return '/cart';
    if (path === '/checkout/payment') return '/checkout/shipping';
    if (path === '/checkout/review') return '/checkout/payment';
    const routes = { '/catalog': '/', '/cart': '/', '/login': '/', '/register': '/', '/account': '/', '/wishlist': '/', '/support': '/', '/about': '/', '/contact': '/' };
    return routes[path] || '/';
  };
  const getBackText = () => {
    if (path.startsWith('/product/')) return location.state?.fromCategory ? `Вернуться в ${location.state.categoryName || 'категорию'}` : 'Вернуться в каталог';
    if (path.startsWith('/catalog/')) { const seg = path.split('/').filter(Boolean); return seg.length > 2 ? 'Вернуться в категорию' : 'Вернуться в каталог'; }
    if (path === '/checkout/shipping') return 'Вернуться в корзину';
    if (path === '/checkout/payment') return 'Вернуться к доставке';
    if (path === '/checkout/review') return 'Вернуться к оплате';
    if (path.startsWith('/account/')) return 'Вернуться в личный кабинет';
    const names = { '/catalog': 'Вернуться на главную', '/cart': 'Продолжить покупки', '/login': 'Вернуться на главную', '/register': 'Вернуться на главную', '/account': 'Вернуться на главную', '/wishlist': 'Продолжить покупки', '/support': 'Вернуться на главную', '/about': 'Вернуться на главную', '/contact': 'Вернуться на главную' };
    return names[path] || 'Вернуться на главную';
  };
  const handleBack = e => { const back = getBackLink(); if (window.history.length > 2 && !back.startsWith('/checkout/')) { e.preventDefault(); window.history.back(); } };
  return (
    <footer className="bg-gradient-to-b from-black/90 to-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-center">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
          <Link to={getBackLink()} onClick={handleBack} className="flex items-center text-white hover:text-gray-300 transition-all group">
            <motion.svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" whileHover={{ x: -3 }} transition={{ type: "spring", stiffness: 400 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </motion.svg>
            <span className="text-base sm:text-lg group-hover:underline">{getBackText()}</span>
          </Link>
        </motion.div>
        <motion.div className="mt-3 sm:mt-0 flex items-center" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <Link to="/" className="mr-3 sm:mr-4"><img src="/logo-small.png" alt="SportNova" className="h-5 sm:h-6" /></Link>
          <p className="text-xs sm:text-sm text-gray-400">&copy; {new Date().getFullYear()} SportNova. Все права защищены.</p>
        </motion.div>
      </div>
    </footer>
  );
};

const Footer = () => {
  const { pathname } = useLocation();
  return pathname === "/" ? <DetailedFooter /> : <SimpleFooter />;
};

export default Footer;