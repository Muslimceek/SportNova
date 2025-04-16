import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Footer from "../pages/footer/Footer";

const Layout = ({ children }) => {
  const location = useLocation();

  // Скрываем Navbar на определённых страницах
  const hideNavbarOn = ["/login", "/register","/product", "/admin", "/forgot-password"];
  const shouldShowNavbar = !hideNavbarOn.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {shouldShowNavbar && <Navbar />}
      
      {/* Добавляем отступ сверху, если Navbar виден */}
      <main className={`flex-grow ${shouldShowNavbar ? "pt-20" : ""}`}>
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout; ///product