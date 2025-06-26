import config from '../config/config';

class ProductService {
  async getAllProducts() {
    try {
      const response = await fetch(`${config.apiUrl}/api/shop`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProduct(id) {
    try {
      const response = await fetch(`${config.apiUrl}/api/shop/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async createProduct(formData) {
    try {
      const response = await fetch(`${config.apiUrl}/api/shop`, {
        method: 'POST',
        body: formData, // FormData for multipart/form-data
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(id, formData) {
    try {
      const response = await fetch(`${config.apiUrl}/api/shop/${id}`, {
        method: 'PUT',
        body: formData, // FormData for multipart/form-data
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const response = await fetch(`${config.apiUrl}/api/shop/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}

export default new ProductService(); 