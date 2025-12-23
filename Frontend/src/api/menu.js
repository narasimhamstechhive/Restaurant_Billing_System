import api from './axios';

export const getMenuItems = async () => {
  const response = await api.get('/menu');
  return response.data;
};

export const addMenuItem = async (itemData) => {
  const response = await api.post('/menu', itemData);
  return response.data;
};

export const updateMenuItem = async (id, itemData) => {
  const response = await api.put(`/menu/${id}`, itemData);
  return response.data;
};

export const deleteMenuItem = async (id) => {
  const response = await api.delete(`/menu/${id}`);
  return response.data;
};
