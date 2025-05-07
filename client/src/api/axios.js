// Criamos uma instância do axios com a URL base da API
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000', // URL base da API
});

// Adicionamos um interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // Obtém o token do localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Adiciona o token no cabeçalho da requisição
  }
  return config; // Retorna a configuração da requisição
}, error => Promise.reject(error)); // Retorna o erro caso ocorra

// Exportamos a instância do axios para ser utilizada em outros arquivos
export default api; // Exporta a instância do axios