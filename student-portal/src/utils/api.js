import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    // No withCredentials — using Bearer token instead of cookies
});

// Attach JWT from localStorage to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('studentToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
