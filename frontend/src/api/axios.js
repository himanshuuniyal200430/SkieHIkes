import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://trekking-backend-3za9.onrender.com/api',
  withCredentials: true, // sends httpOnly cookie automatically
});

export default API;
