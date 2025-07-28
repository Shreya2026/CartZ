import api from './api';

const productsAPI = {
  // Get all products with filtering and pagination
  getProducts: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add all params to query string
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    const url = queryString ? `/products?${queryString}` : '/products';
    
    const response = await api.get(url);
    return response.data;
  },

  // Get single product by ID
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async (limit = 8) => {
    const response = await api.get(`/products?featured=true&limit=${limit}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category, params = {}) => {
    const queryParams = new URLSearchParams({
      category,
      ...params
    });
    
    const response = await api.get(`/products?${queryParams.toString()}`);
    return response.data;
  },

  // Search products
  searchProducts: async (keyword, params = {}) => {
    const queryParams = new URLSearchParams({
      keyword,
      ...params
    });
    
    const response = await api.get(`/products?${queryParams.toString()}`);
    return response.data;
  },

  // Get product categories
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Get brands
  getBrands: async () => {
    const response = await api.get('/products/brands');
    return response.data;
  }
};

export default productsAPI;
