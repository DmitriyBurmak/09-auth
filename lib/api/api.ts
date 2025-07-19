import axios from 'axios';

let API_BASE_URL: string;

if (typeof window === 'undefined') {
  API_BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`
    : 'http://localhost:3000/api';
} else {
  API_BASE_URL = '/api';
}

if (!API_BASE_URL) {
  console.error('API base URL is not configured!');
  throw new Error('API base URL is not configured.');
}

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default instance;
