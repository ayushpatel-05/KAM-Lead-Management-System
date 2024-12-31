import axios from 'axios';

const api = axios.create({
//   baseURL: process.env.REACT_APP_API_BASE_URL,
  baseURL: "http://localhost:3001",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;