import axios from 'axios';

const httpClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Token management
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

// Request interceptor
httpClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeAuthToken();
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export { httpClient, setAuthToken, removeAuthToken };
export default httpClient;