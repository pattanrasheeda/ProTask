// src/components/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // If token exists, allow access to the protected route
  if (token) {
    return children;
  }

  // Otherwise, redirect to login
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
