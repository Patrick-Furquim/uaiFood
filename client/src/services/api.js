import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api' // A URL base da sua API
});

// "Interceptador": Antes de *qualquer* requisição, execute isso
api.interceptors.request.use(async (config) => {
  // Pega o token do localStorage (onde vamos guardá-lo)
  const token = localStorage.getItem('uaifood-token');
  
  if (token) {
    // Se o token existir, adiciona-o ao cabeçalho Authorization
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;