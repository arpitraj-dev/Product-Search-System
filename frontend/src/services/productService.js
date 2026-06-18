import api from './api';

const PRODUCTS_URL = '/api/products';

const productService = {
  getAll: () => api.get(PRODUCTS_URL),

  getById: (id) => api.get(`${PRODUCTS_URL}/${id}`),

  create: (data) => api.post(PRODUCTS_URL, data),

  update: (id, data) => api.put(`${PRODUCTS_URL}/${id}`, data),

  delete: (id) => api.delete(`${PRODUCTS_URL}/${id}`),

  search: (params) => {
    const query = {};
    if (params.keyword) query.keyword = params.keyword;
    if (params.categoryId) query.categoryId = params.categoryId;
    if (params.page !== undefined) query.page = params.page;
    if (params.size) query.size = params.size;
    if (params.sortBy) query.sortBy = params.sortBy;
    if (params.direction) query.direction = params.direction;
    return api.get(`${PRODUCTS_URL}/search`, { params: query });
  },
};

export default productService;
