import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import Blog from "../pages/Blog";
import BlogPost from "../pages/BlogPost";

// Публичные страницы
import Home from "../components/Home/Home";
import Catalog from "../pages/Catalog/Catalog";
import ProductPage from "../pages/ProductPage/ProductPage";
import Cart from "../pages/Cart/Cart";
import FavoritesPage from "../pages/Favorites/FavoritesPage";
import Privacy from "../pages/footer/Privacy";
import Terms from "../pages/footer/Terms";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import OrderSuccess from "../pages/Cart/OrderSuccess";
import HeroSection from "../components/HeroSection";
import About from "../pages/About";
import Contact from "../pages/Contact";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import OrderDetail from "../pages/UserPanel/OrderDetail";

// Админские страницы
import AdminRoutes from "../pages/Admin/AdminRoutes";

// Страницы личного кабинета
import UserPanel from "../pages/UserPanel/UserPanel";
import Profile from "../pages/UserPanel/Profile";
import OrderHistory from "../pages/UserPanel/OrderHistory";
import FavoritesUserPanel from "../pages/UserPanel/FavoritesUserPanel";
import UserAddresses from "../pages/UserPanel/UserAddresses";
import UserPaymentMethods from "../pages/UserPanel/UserPaymentMethods";


const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <h2 className="text-4xl font-bold text-gray-700">404 - Страница не найдена</h2>
    <p className="text-gray-500 mt-4 mb-6">
      Запрошенная страница не существует или была перемещена.
    </p>
    <div className="flex gap-4">
      <a 
        href="/" 
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        На главную
      </a>
      <button 
        onClick={() => window.history.back()} 
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
      >
        Назад
      </button>
    </div>
  </div>
);

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router basename="/">
        <Layout>
          <Routes>
            {/* Главная страница */}
            <Route
              path="/"
              element={
                <>
                  <HeroSection />
                  <Home />
                </>
              }
            />

            {/* Публичные маршруты */}
            <Route path="/catalog/:category?" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/order" element={<OrderSuccess />} />
            <Route path="/about" element={<About />} />
            <Route path="/contacts" element={<Contact />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />

            {/* Защищённые маршруты для админа */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/admin/*" element={<AdminRoutes />} />
            </Route>

            {/* Защищённые маршруты для пользователя */}
            <Route element={<ProtectedRoute />}>
              <Route path="/user" element={<UserPanel />}>
                {/* Индексный маршрут: Profile */}
                <Route index element={<Profile />} />
                <Route path="profile" element={<Profile />} />
                <Route path="orders" element={<OrderHistory />} />
                <Route path="orders/:orderId" element={<OrderDetail />} />
                <Route path="favorites" element={<FavoritesUserPanel />} />
                <Route path="addresses" element={<UserAddresses />} /> 
                <Route path="payment-methods" element={<UserPaymentMethods />} />
              </Route>
            </Route>

            {/* Не найдено */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
};

export default AppRoutes;
