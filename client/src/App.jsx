import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from './pages/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* <--- ADICIONAR A ROTA AQUI */}
        <Route path="/register" element={<RegisterPage />} /> 

        <Route element={<ProtectedRoute />}>
          <Route path="/meus-pedidos" element={<h1>Meus Pedidos (Em construção)</h1>} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<h1>Painel Admin (Em construção)</h1>} />
        </Route>

        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;