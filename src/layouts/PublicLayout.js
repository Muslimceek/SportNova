import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../pages/footer/Footer";

const PublicLayout = () => {
  const location = useLocation();
  const showNavbar = !location.pathname.startsWith("/login") && !location.pathname.startsWith("/register");

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {showNavbar && <Navbar />}
      <main className="flex-grow"><Outlet /></main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
