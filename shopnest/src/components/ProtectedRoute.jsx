import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn, selectUserRole } from '../store/authSlice';

export const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

// Guests only (redirect logged-in users away)
export const GuestRoute = ({ children }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export const BuyerRoute = ({ children }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const role = useSelector(selectUserRole);
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (role && role !== 'buyer') {
    return <Navigate to="/" replace />;
  }
  return children;
};

export const SellerRoute = ({ children }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const role = useSelector(selectUserRole);
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (role !== 'seller') {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Admin role removed from ShopNest 2.0 — always redirects home
export const AdminRoute = ({ children }) => {
  return <Navigate to="/" replace />;
};
