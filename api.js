import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || '';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export async function fetchArticles() {
  const response = await api.get('/api/articles');
  return response.data;
}

export async function fetchCategories() {
  // This would normally be an API call but for demo purposes we're hardcoding
  return [
    { id: 1, name: 'Cardiology' },
    { id: 2, name: 'Mental Health' },
    { id: 3, name: 'Nutrition' },
    { id: 4, name: 'Neurology' },
    { id: 5, name: 'Dermatology' },
    { id: 6, name: 'Pain Management' },
    { id: 7, name: 'Preventive Care' },
    { id: 8, name: 'Wellness' },
  ];
}

export default api;
