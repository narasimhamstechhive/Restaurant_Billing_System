import api from './axios';

export const getActiveOrder = async (tableNo) => {
  const response = await api.get(`/bills/active/${tableNo}`);
  return response.data;
};

export const saveOrder = async (orderData) => {
  const response = await api.post('/bills/save', orderData);
  return response.data;
};

export const generateBill = async (id, billData) => {
  const response = await api.post(`/bills/generate/${id}`, billData);
  return response.data;
};

export const settleBill = async (id, paymentData) => {
  const response = await api.post(`/bills/settle/${id}`, paymentData);
  return response.data;
};

export const getOpenOrders = async () => {
  const response = await api.get('/bills/open');
  return response.data;
};

export const getBills = async () => {
  const response = await api.get('/bills');
  return response.data;
};

export const deleteBill = async (id) => {
  const response = await api.delete(`/bills/${id}`);
  return response.data;
};
