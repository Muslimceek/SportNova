// src/pages/Admin/AdminRoutes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import Dashboard from "./Dashboard";
import ProductsList from "./Products/ProductsList";
import ProductForm from "./Products/ProductForm";
import OrdersList from "./Orders/OrdersList";
import AdminReviews from "./AdminReviews";
import ContactMessages from "./Contacts/ContactMessages";

// New imports based on server routes
import UsersList from "./Users/UsersList";
import UserForm from "./Users/UserForm";
import CategoriesList from "./Categories/CategoriesList";
import CategoryForm from "./Categories/CategoryForm";
import PromotionsList from "./Promotions/PromotionsList";
import PromotionForm from "./Promotions/PromotionForm";
import Reports from "./Reports/Reports";
import AdminLogs from "./Logs/AdminLogs";
import OrderDetails from "./Orders/OrderDetails";

const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Products Management */}
        <Route path="/products" element={<ProductsList />} />
        <Route path="/products/new" element={<ProductForm />} />
        <Route path="/products/edit/:docId" element={<ProductForm />} />
        
        {/* Orders Management */}
        <Route path="/orders" element={<OrdersList />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
        
        {/* Reviews Management */}
        <Route path="/reviews" element={<AdminReviews />} />
        <Route path="/reviews/pending" element={<AdminReviews pending={true} />} />
        <Route path="/reviews/product/:productId" element={<AdminReviews />} />
        
        {/* Contact Management */}
        <Route path="/contacts" element={<ContactMessages />} />
        <Route path="/contacts/:contactId" element={<ContactMessages />} />
        
        {/* User Management */}
        <Route path="/users" element={<UsersList />} />
        <Route path="/users/new" element={<UserForm />} />
        <Route path="/users/edit/:userId" element={<UserForm />} />
        
        {/* Category Management */}
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/categories/new" element={<CategoryForm />} />
        <Route path="/categories/edit/:categoryId" element={<CategoryForm />} />
        
        {/* Promotions Management */}
        <Route path="/promotions" element={<PromotionsList />} />
        <Route path="/promotions/new" element={<PromotionForm />} />
        <Route path="/promotions/edit/:promotionId" element={<PromotionForm />} />
        
        {/* Reports */}
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports/sales" element={<Reports type="sales" />} />
        <Route path="/reports/inventory" element={<Reports type="inventory" />} />
        <Route path="/reports/customers" element={<Reports type="customers" />} />
        
        {/* Admin Logs */}
        <Route path="/logs" element={<AdminLogs />} />
        <Route path="/logs/user/:userId" element={<AdminLogs />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;