import api from './axios';

export const getAnalytics = async (month = null, year = null, days = null) => {
  let url = '/analytics?';
  if (month && year) {
    url += `month=${month}&year=${year}`;
  } else if (days) {
    url += `days=${days}`;
  }
  const response = await api.get(url);
  return response.data;
};

