import api from './api';

const CATEGORIES_URL = '/api/categories';

const categoryService = {
  getAll: () => api.get(CATEGORIES_URL),

  getById: (id) => api.get(`${CATEGORIES_URL}/${id}`),

  create: (data) => api.post(CATEGORIES_URL, data),

  update: (id, data) => api.put(`${CATEGORIES_URL}/${id}`, data),

  delete: (id) => api.delete(`${CATEGORIES_URL}/${id}`),
};

export default categoryService;
