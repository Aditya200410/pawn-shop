import axios from 'axios';
import config from '../config/config';

const API_BASE_URL = config.API_BASE_URL;

class HistoryService {
  // Withdrawal History
  async getWithdrawalHistory(params = {}) {
    try {
      const token = localStorage.getItem('seller_jwt');
      console.log('Getting withdrawal history with token:', token ? 'Token exists' : 'No token');
      
      const response = await axios.get(`${API_BASE_URL}/api/withdrawal/history`, {
        params,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get withdrawal history error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw new Error(error.response?.data?.message || 'Failed to fetch withdrawal history');
    }
  }

  async getWithdrawalDetails(withdrawalId) {
    try {
      const token = localStorage.getItem('seller_jwt');
      const response = await axios.get(`${API_BASE_URL}/api/withdrawal/details/${withdrawalId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get withdrawal details error:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to fetch withdrawal details');
    }
  }

  async cancelWithdrawal(withdrawalId) {
    try {
      const token = localStorage.getItem('seller_jwt');
      const response = await axios.put(`${API_BASE_URL}/api/withdrawal/cancel/${withdrawalId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Cancel withdrawal error:', error);
      throw new Error(error.response?.data?.message || 'Failed to cancel withdrawal');
    }
  }

  // Commission History
  async getCommissionHistory(params = {}) {
    try {
      const token = localStorage.getItem('seller_jwt');
      console.log('Getting commission history with token:', token ? 'Token exists' : 'No token');
      console.log('API URL:', `${API_BASE_URL}/api/commission/history`);
      console.log('Params:', params);
      
      const response = await axios.get(`${API_BASE_URL}/api/commission/history`, {
        params,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Commission history response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get commission history error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error config:', error.config);
      throw new Error(error.response?.data?.message || 'Failed to fetch commission history');
    }
  }

  async getCommissionDetails(commissionId) {
    try {
      const token = localStorage.getItem('seller_jwt');
      const response = await axios.get(`${API_BASE_URL}/api/commission/details/${commissionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get commission details error:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to fetch commission details');
    }
  }

  async getCommissionSummary() {
    try {
      const token = localStorage.getItem('seller_jwt');
      console.log('Getting commission summary with token:', token ? 'Token exists' : 'No token');
      
      const response = await axios.get(`${API_BASE_URL}/api/commission/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Commission summary response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get commission summary error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw new Error(error.response?.data?.message || 'Failed to fetch commission summary');
    }
  }

  // Helper methods for formatting
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatAmount(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  }

  getStatusColor(status) {
    const statusColors = {
      pending: 'text-yellow-600 bg-yellow-100',
      approved: 'text-blue-600 bg-blue-100',
      completed: 'text-green-600 bg-green-100',
      rejected: 'text-red-600 bg-red-100',
      cancelled: 'text-gray-600 bg-gray-100',
      confirmed: 'text-green-600 bg-green-100',
      failed: 'text-red-600 bg-red-100'
    };
    return statusColors[status] || 'text-gray-600 bg-gray-100';
  }

  getTypeColor(type) {
    const typeColors = {
      earned: 'text-green-600 bg-green-100',
      deducted: 'text-red-600 bg-red-100',
      withdrawn: 'text-orange-600 bg-orange-100',
      adjusted: 'text-blue-600 bg-blue-100',
      refunded: 'text-purple-600 bg-purple-100',
      bonus: 'text-pink-600 bg-pink-100'
    };
    return typeColors[type] || 'text-gray-600 bg-gray-100';
  }
}

export default new HistoryService(); 