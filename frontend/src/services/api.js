import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  const hostname = window.location.hostname || 'localhost';
  return `http://${hostname}:5001/api`;
};

const API = axios.create({
  baseURL: getBaseURL(),
});

export const getImageUrl = (url) => {
  if (!url) {
    return 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80';
  }
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // If it's a localhost/127.0.0.1 absolute URL, adapt it to the current hostname in case they access via IP
    const pageHostname = window.location.hostname;
    if (pageHostname && pageHostname !== 'localhost' && pageHostname !== '127.0.0.1') {
      return url.replace('localhost', pageHostname).replace('127.0.0.1', pageHostname);
    }
    return url;
  }

  const pageHostname = window.location.hostname || 'localhost';
  let base = `http://${pageHostname}:5001`;

  if (import.meta.env.VITE_API_URL) {
    base = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
  }

  // Clean trailing slashes from base
  base = base.replace(/\/+$/, '');

  // Clean leading slashes from url to avoid double slashes and ensure exactly one separator slash
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;

  return `${base}${cleanUrl}`;
};

// Add interceptor to automatically attach authorization token
API.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('userToken');
    
    // Prefer adminToken for requests if it exists
    const token = adminToken || userToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
