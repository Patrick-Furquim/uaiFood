import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from './pages/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboard from './pages/AdminDashboard'; // <--- IMPORTANTE

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} /> 

        {/* Rotas para Clientes Logados */}
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>

        {/* Rotas EXCLUSIVAS para Admin */}
        <Route element={<AdminRoute />}>
          {/* Aqui carregamos o componente real do Dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        
        {/* Rota para 404 */}
        <Route path="*" element={<div style={{textAlign:'center', marginTop: 50}}><h2>404 - Página não encontrada</h2><a href="/">Voltar</a></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;