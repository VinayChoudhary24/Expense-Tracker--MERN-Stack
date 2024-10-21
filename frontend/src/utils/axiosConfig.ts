// axiosConfig.ts
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api', // Replace with your API base URL
});

const activeToastId: string = 'server-error-toast';

// Attach a request interceptor
axiosInstance.interceptors.request.use(
  config => {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    if (token) {
      if (!config.headers) {
        config.headers = {}; // Initialize headers if undefined
      }
      console.log("Token-Attached")
      // Attach the token to the request headers
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    // Handle request error here
    return Promise.reject(error);
  }
);
// const navigate = useNavigate();
// Response interceptor to handle errors centrally
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        
      if (error.response && error.response.status === 401) {
        console.log("Token-Error", error?.response?.message)
        // toast.error(error?.response?.message || "Access denied. No token provided.");
        if (!toast.isActive(activeToastId)) {
            toast.error(error?.response?.message || "Access denied. No token provided.", {
              toastId: activeToastId
            });
          }
        // Token is missing or invalid - redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setTimeout(() => {
            window.location.href = '/login';
        }, 1500);
        
        // navigate('/login');
      }
      return Promise.reject(error);
    }
  );

export default axiosInstance;