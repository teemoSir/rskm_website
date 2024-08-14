// src/utils/http.js
import axios from 'axios';
 
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 使用环境变量作为基础URL
  timeout: 10000, // 请求超时时间
});
 
export default http;