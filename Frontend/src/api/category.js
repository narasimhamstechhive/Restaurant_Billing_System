import api from './axios';

// Simple cache
let categoryCache = null;
let categoryCacheTimestamp = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for categories

export const getCategories = async (forceRefresh = false) => {
  const now = Date.now();

  if (!forceRefresh && categoryCache && (now - categoryCacheTimestamp) < CACHE_DURATION) {
    return categoryCache;
  }

  const response = await api.get('/categories');
  categoryCache = response.data;
  categoryCacheTimestamp = now;
  return response.data;
};

export const getAllCategories = async () => {
  const response = await api.get('/categories/admin');
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await api.post('/categories', categoryData);
  categoryCache = null; // Clear cache
  return response.data;
};

export const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/categories/${id}`, categoryData);
  categoryCache = null; // Clear cache
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  categoryCache = null; // Clear cache
  return response.data;
};