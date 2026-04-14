// Extended companies API functions for edit and delete operations

import { API_BASE_URL } from '../config';
const COMPANIES_API_URL = `${API_BASE_URL}/companies`;

export const getAllCompanies = async () => {
  try {
    const response = await fetch(`${COMPANIES_API_URL}`);
    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Backend not running on http://localhost:5006',
      details: err.message,
    };
  }
};

export const updateCompany = async (companyId, companyData) => {
  try {
    const token = localStorage.getItem('authToken');
    
    // Create FormData for file uploads
    const formData = new FormData();
    
    // Add all text fields
    Object.keys(companyData).forEach(key => {
      if (key !== 'companyLogo' && key !== 'productImages') {
        if (Array.isArray(companyData[key])) {
          formData.append(key, JSON.stringify(companyData[key]));
        } else {
          formData.append(key, companyData[key]);
        }
      }
    });
    
    // Add files if they exist
    if (companyData.companyLogo) {
      formData.append('companyLogo', companyData.companyLogo);
    }
    
    if (companyData.productImages && companyData.productImages.length > 0) {
      companyData.productImages.forEach(file => {
        formData.append('productImages', file);
      });
    }
    
    const response = await fetch(`${COMPANIES_API_URL}/${companyId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type header for FormData - let browser set it with boundary
      },
      body: formData,
    });
    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error updating company',
      details: err.message,
    };
  }
};

export const deleteCompany = async (companyId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${COMPANIES_API_URL}/${companyId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error deleting company',
      details: err.message,
    };
  }
};
