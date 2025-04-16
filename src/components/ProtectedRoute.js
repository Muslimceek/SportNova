// src/components/ProtectedRoute.js
import React from "react";
import PropTypes from "prop-types";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ adminOnly = false, redirectPath = "/login" }) => {
  const { currentUser, isAdmin, loading, error } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error loading authentication</div>;

  if (!currentUser) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

ProtectedRoute.propTypes = {
  adminOnly: PropTypes.bool,
  redirectPath: PropTypes.string
};

export default ProtectedRoute;
