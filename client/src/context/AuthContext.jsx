import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Efeito para carregar o token do localStorage quando o app inicia
  useEffect(() => {
    const storedToken = localStorage.getItem('uaifood-token');
    const storedUser = localStorage.getItem('uaifood-user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Função de Login
  async function login(phone, password) {
    try {
      const response = await api.post('/auth/login', { phone, password });
      
      const { token, user } = response.data;

      // 1. Armazena no LocalStorage
      localStorage.setItem('uaifood-token', token);
      localStorage.setItem('uaifood-user', JSON.stringify(user));

      // 2. Atualiza o estado global
      setToken(token);
      setUser(user);
      
      return true; // Sucesso
    } catch (error) {
      console.error("Erro no login:", error.response.data);
      return false; // Falha
    }
  }

  // Função de Logout
  function logout() {
    localStorage.removeItem('uaifood-token');
    localStorage.removeItem('uaifood-user');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ 
        isAuthenticated: !!token, 
        token, 
        user, 
        login, 
        logout 
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;