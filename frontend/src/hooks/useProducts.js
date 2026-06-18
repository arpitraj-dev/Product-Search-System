import { useState, useEffect, useCallback } from 'react';
import productService from '../services/productService';
import { DEFAULT_PAGE_SIZE } from '../utils/constants';

export default function useProducts() {
  const [searchResult, setSearchResult] = useState({
    products: [],
    currentPage: 0,
    pageSize: DEFAULT_PAGE_SIZE,
    totalPages: 0,
    totalElements: 0,
  });
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productService.getAll();
      setAllProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await productService.search({
        page: 0,
        size: DEFAULT_PAGE_SIZE,
        sortBy: 'createdAt',
        direction: 'desc',
        ...params,
      });
      setSearchResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search products');
    } finally {
      setLoading(false);
    }
  }, []);

  return { searchResult, allProducts, loading, error, fetchAll, search };
}
