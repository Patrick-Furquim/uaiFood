import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// 1. Segurança para Usuários LOGADOS (CLIENT ou ADMIN)
export const ProtectedRoute = () => {
  const { isAuthenticated } = useContext(AuthContext);
  
  if (!isAuthenticated) {
    // Se não estiver logado, manda para a página de login
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />; // Se estiver logado, exibe a página
};

// 2. Segurança Apenas para ADMINS
export const AdminRoute = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.Usertype !== 'ADMIN') {
    // Se estiver logado mas NÃO for ADMIN, manda para a home
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // Se for ADMIN, exibe a página
};