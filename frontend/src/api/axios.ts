import axios from 'axios';

const isLoopbackHost = (hostname: string): boolean => {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname.endsWith('.localhost')
  );
};

const validateApiUrl = (urlStr: string): boolean => {
  try {
    const parsed = new URL(urlStr, window.location.origin);
    if (parsed.protocol === 'http:' && !isLoopbackHost(parsed.hostname)) {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
};

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Validate API URL before attaching JWT token
api.interceptors.request.use(
  (config) => {
    const fullUrl = config.url
      ? new URL(config.url, config.baseURL || window.location.origin).href
      : config.baseURL;

    if (fullUrl && !validateApiUrl(fullUrl)) {
      return Promise.reject(new Error('Insecure HTTP request rejected for non-loopback host.'));
    }

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Global handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
