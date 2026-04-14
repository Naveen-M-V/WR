import { API_BASE_URL, API_HOST } from '../config';

const normalizeUrlJoin = (base, path) => {
  const b = String(base || '').replace(/\/+$/, '');
  const p = String(path || '').replace(/^\/+/, '');
  return `${b}/${p}`;
};

// Canonical companies API base. Prefer API_HOST to avoid accidental double `/api` segments.
// Fallback to API_BASE_URL for backwards compatibility.
const COMPANIES_API_URL = API_HOST
  ? normalizeUrlJoin(API_HOST, 'api/companies')
  : normalizeUrlJoin(API_BASE_URL, 'companies');

export const getAllCompanies = async (includeArchived = false) => {
  try {
    const url = includeArchived
      ? `${COMPANIES_API_URL}?includeArchived=true`
      : `${COMPANIES_API_URL}`;
    const response = await fetch(url);
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

export const getSpotlightCompanies = async () => {
  try {
    const response = await fetch(`${COMPANIES_API_URL}/spotlight`);
    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error fetching spotlight companies',
      details: err.message,
    };
  }
};

export const getSpotlightProductsServices = async () => {
  try {
    const response = await fetch(`${COMPANIES_API_URL}/spotlight-products-services`);
    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error fetching spotlight products/services',
      details: err.message,
    };
  }
};

export const getProductsServicesByCategory = async (category, subtopic = null, topic = null) => {
  try {
    let url = `${COMPANIES_API_URL}/products-services/by-category/${category}`;
    const params = new URLSearchParams();
    if (subtopic) params.append('subtopic', subtopic);
    if (topic) params.append('topic', topic);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error fetching products/services by category',
      details: err.message,
    };
  }
};

export const addProductServiceToSpotlight = async (companyId, itemId) => {
  try {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${COMPANIES_API_URL}/${companyId}/products-services/${itemId}/spotlight`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error adding product/service to spotlight',
      details: err.message,
    };
  }
};

export const removeProductServiceFromSpotlight = async (companyId, itemId) => {
  try {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${COMPANIES_API_URL}/${companyId}/products-services/${itemId}/spotlight`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error removing product/service from spotlight',
      details: err.message,
    };
  }
};

export const addCompanyToSpotlight = async (companyId) => {
  try {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${COMPANIES_API_URL}/${companyId}/spotlight`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error adding company to spotlight',
      details: err.message,
    };
  }
};

export const removeCompanyFromSpotlight = async (companyId) => {
  try {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${COMPANIES_API_URL}/${companyId}/spotlight`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error removing company from spotlight',
      details: err.message,
    };
  }
};

export const addCompanyProductService = async (companyId, itemData) => {
  try {
    const token = localStorage.getItem('authToken');

    const sector = itemData.sector || (Array.isArray(itemData.sectors) ? itemData.sectors[0] : '') || '';
    const subsector = itemData.subsector || (Array.isArray(itemData.subsectors) ? itemData.subsectors[0] : '') || '';
    const serviceCategory = itemData.serviceCategory || (Array.isArray(itemData.serviceCategories) ? itemData.serviceCategories[0] : '') || '';

    const formData = new FormData();
    formData.append('type', itemData.type);
    formData.append('title', itemData.title);
    formData.append('description', itemData.description);
    formData.append('features', JSON.stringify(itemData.features || []));
    formData.append('sector', sector);
    formData.append('subsector', subsector);
    formData.append('serviceCategory', serviceCategory);
    formData.append('sectors', JSON.stringify(itemData.sectors || (sector ? [sector] : [])));
    formData.append('subsectors', JSON.stringify(itemData.subsectors || (subsector ? [subsector] : [])));
    formData.append('serviceCategories', JSON.stringify(itemData.serviceCategories || (serviceCategory ? [serviceCategory] : [])));

    (itemData.images || []).forEach((file) => {
      formData.append('images', file);
    });

    const response = await fetch(`${COMPANIES_API_URL}/${companyId}/products-services`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error adding product/service',
      details: err.message,
    };
  }
};

export const deleteCompanyProductService = async (companyId, itemId) => {
  try {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${COMPANIES_API_URL}/${companyId}/products-services/${itemId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error deleting product/service',
      details: err.message,
    };
  }
};

export const updateCompanyStatus = async (companyId, status) => {
  try {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${COMPANIES_API_URL}/${companyId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error updating company status',
      details: err.message,
    };
  }
};


export const updateCompanyProductService = async (companyId, itemId, itemData) => {
  try {
    const token = localStorage.getItem('authToken');

    const sector = itemData.sector || (Array.isArray(itemData.sectors) ? itemData.sectors[0] : '') || '';
    const subsector = itemData.subsector || (Array.isArray(itemData.subsectors) ? itemData.subsectors[0] : '') || '';
    const serviceCategory = itemData.serviceCategory || (Array.isArray(itemData.serviceCategories) ? itemData.serviceCategories[0] : '') || '';

    const formData = new FormData();
    formData.append('type', itemData.type);
    formData.append('title', itemData.title);
    formData.append('description', itemData.description);
    formData.append('features', JSON.stringify(itemData.features || []));
    formData.append('sector', sector);
    formData.append('subsector', subsector);
    formData.append('serviceCategory', serviceCategory);
    formData.append('sectors', JSON.stringify(itemData.sectors || (sector ? [sector] : [])));
    formData.append('subsectors', JSON.stringify(itemData.subsectors || (subsector ? [subsector] : [])));
    formData.append('serviceCategories', JSON.stringify(itemData.serviceCategories || (serviceCategory ? [serviceCategory] : [])));

    (itemData.images || []).forEach((file) => {
      if (file instanceof File) {
        formData.append('images', file);
      }
    });

    formData.append('existingImages', JSON.stringify(itemData.existingImages || []));

    const response = await fetch(`${COMPANIES_API_URL}/${companyId}/products-services/${itemId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error updating product/service',
      details: err.message,
    };
  }
};

export const addCompanyProject = async (companyId, projectData) => {
  try {
    const token = localStorage.getItem('authToken');
    const formData = new FormData();

    formData.append('title', projectData.title || '');
    formData.append('description', projectData.description || '');
    formData.append('workDelivered', projectData.workDelivered || '');
    formData.append('outcome', projectData.outcome || '');
    formData.append('descriptionVisibility', projectData.descriptionVisibility || 'public');
    formData.append('clientName', projectData.clientName || '');
    formData.append('projectDate', projectData.projectDate || '');
    formData.append('projectValue', projectData.projectValue || '');
    formData.append('location', projectData.location || '');
    formData.append('url', projectData.url || '');
    formData.append('keyFeatures', JSON.stringify(projectData.keyFeatures || []));
    formData.append('existingImages', JSON.stringify(projectData.existingImages || []));

    (projectData.images || []).forEach((file) => {
      if (file instanceof File) {
        formData.append('images', file);
      }
    });

    const response = await fetch(`${COMPANIES_API_URL}/${companyId}/projects`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error adding project',
      details: err.message,
    };
  }
};

export const updateCompanyProject = async (companyId, projectId, projectData) => {
  try {
    const token = localStorage.getItem('authToken');
    const formData = new FormData();

    formData.append('title', projectData.title || '');
    formData.append('description', projectData.description || '');
    formData.append('workDelivered', projectData.workDelivered || '');
    formData.append('outcome', projectData.outcome || '');
    formData.append('descriptionVisibility', projectData.descriptionVisibility || 'public');
    formData.append('clientName', projectData.clientName || '');
    formData.append('projectDate', projectData.projectDate || '');
    formData.append('projectValue', projectData.projectValue || '');
    formData.append('location', projectData.location || '');
    formData.append('url', projectData.url || '');
    formData.append('keyFeatures', JSON.stringify(projectData.keyFeatures || []));
    formData.append('existingImages', JSON.stringify(projectData.existingImages || []));

    (projectData.images || []).forEach((file) => {
      if (file instanceof File) {
        formData.append('images', file);
      }
    });

    const response = await fetch(`${COMPANIES_API_URL}/${companyId}/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error updating project',
      details: err.message,
    };
  }
};

export const archiveCompanyProject = async (companyId, projectId, archived) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${COMPANIES_API_URL}/${companyId}/projects/${projectId}/archive`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ archived }),
    });
    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error archiving project',
      details: err.message,
    };
  }
};

export const deleteCompanyProject = async (companyId, projectId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${COMPANIES_API_URL}/${companyId}/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error deleting project',
      details: err.message,
    };
  }
};

export const addCompanyAward = async (companyId, awardData) => {
  try {
    const token = localStorage.getItem('authToken');
    const formData = new FormData();

    formData.append('title', awardData.title || '');
    formData.append('description', awardData.description || '');
    formData.append('awardDate', awardData.awardDate || '');
    formData.append('awardingBody', awardData.awardingBody || '');
    formData.append('category', awardData.category || '');
    formData.append('location', awardData.location || '');
    formData.append('url', awardData.url || '');
    formData.append('keyHighlights', JSON.stringify(awardData.keyHighlights || []));
    formData.append('existingImages', JSON.stringify(awardData.existingImages || []));

    (awardData.images || []).forEach((file) => {
      if (file instanceof File) {
        formData.append('images', file);
      }
    });

    const response = await fetch(`${COMPANIES_API_URL}/${companyId}/awards`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error adding award',
      details: err.message,
    };
  }
};

export const updateCompanyAward = async (companyId, awardId, awardData) => {
  try {
    const token = localStorage.getItem('authToken');
    const formData = new FormData();

    formData.append('title', awardData.title || '');
    formData.append('description', awardData.description || '');
    formData.append('awardDate', awardData.awardDate || '');
    formData.append('awardingBody', awardData.awardingBody || '');
    formData.append('category', awardData.category || '');
    formData.append('location', awardData.location || '');
    formData.append('url', awardData.url || '');
    formData.append('keyHighlights', JSON.stringify(awardData.keyHighlights || []));
    formData.append('existingImages', JSON.stringify(awardData.existingImages || []));

    (awardData.images || []).forEach((file) => {
      if (file instanceof File) {
        formData.append('images', file);
      }
    });

    const response = await fetch(`${COMPANIES_API_URL}/${companyId}/awards/${awardId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error updating award',
      details: err.message,
    };
  }
};

export const archiveCompanyAward = async (companyId, awardId, archived) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${COMPANIES_API_URL}/${companyId}/awards/${awardId}/archive`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ archived }),
    });
    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error archiving award',
      details: err.message,
    };
  }
};

export const deleteCompanyAward = async (companyId, awardId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${COMPANIES_API_URL}/${companyId}/awards/${awardId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error deleting award',
      details: err.message,
    };
  }
};

// Certification API functions
export const addCompanyCertification = async (companyId, certificationData) => {
  try {
    const token = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('title', certificationData.title);
    formData.append('description', certificationData.description);
    formData.append('issueDate', certificationData.issueDate);
    formData.append('expiryDate', certificationData.expiryDate || '');
    formData.append('issuingBody', certificationData.issuingBody);
    formData.append('category', certificationData.category || '');
    formData.append('certificationNumber', certificationData.certificationNumber || '');
    formData.append('existingImages', JSON.stringify(certificationData.existingImages || []));

    (certificationData.images || []).forEach((file) => {
      formData.append('images', file);
    });

    if (certificationData.certificateFile) {
      formData.append('certificateFile', certificationData.certificateFile);
    }

    const endpoints = [
      `${COMPANIES_API_URL}/${companyId}/certifications`,
      `${COMPANIES_API_URL}/${companyId}/certificates`,
    ];

    let lastData = null;
    for (const endpoint of endpoints) {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      lastData = data;
      if (response.ok) {
        return { success: true, data, error: data.error || data.message };
      }
      if (response.status !== 404) {
        return { success: false, data, error: data.error || data.message };
      }
    }

    return {
      success: false,
      data: lastData,
      error: lastData?.error || lastData?.message || 'Certification upload route not found',
    };
  } catch (err) {
    return {
      success: false,
      error: 'Error adding certification',
      details: err.message,
    };
  }
};

export const updateCompanyCertification = async (companyId, certificationId, certificationData) => {
  try {
    const token = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('title', certificationData.title);
    formData.append('description', certificationData.description);
    formData.append('issueDate', certificationData.issueDate);
    formData.append('expiryDate', certificationData.expiryDate || '');
    formData.append('issuingBody', certificationData.issuingBody);
    formData.append('category', certificationData.category || '');
    formData.append('certificationNumber', certificationData.certificationNumber || '');
    formData.append('existingImages', JSON.stringify(certificationData.existingImages || []));

    (certificationData.images || []).forEach((file) => {
      if (file instanceof File) {
        formData.append('images', file);
      }
    });

    if (certificationData.certificateFile) {
      formData.append('certificateFile', certificationData.certificateFile);
    }

    const endpoints = [
      `${COMPANIES_API_URL}/${companyId}/certifications/${certificationId}`,
      `${COMPANIES_API_URL}/${companyId}/certificates/${certificationId}`,
    ];

    let lastData = null;
    for (const endpoint of endpoints) {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      lastData = data;
      if (response.ok) {
        return { success: true, data, error: data.error || data.message };
      }
      if (response.status !== 404) {
        return { success: false, data, error: data.error || data.message };
      }
    }

    return {
      success: false,
      data: lastData,
      error: lastData?.error || lastData?.message || 'Certification update route not found',
    };
  } catch (err) {
    return {
      success: false,
      error: 'Error updating certification',
      details: err.message,
    };
  }
};

export const archiveCompanyCertification = async (companyId, certificationId, archived) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${COMPANIES_API_URL}/${companyId}/certifications/${certificationId}/archive`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ archived }),
    });
    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error archiving certification',
      details: err.message,
    };
  }
};

export const deleteCompanyCertification = async (companyId, certificationId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${COMPANIES_API_URL}/${companyId}/certifications/${certificationId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error deleting certification',
      details: err.message,
    };
  }
};

export const getCompaniesByCategory = async (category, subtopic = null, topic = null) => {
  try {
    let url = `${COMPANIES_API_URL}/by-category/${category}`;
    const params = new URLSearchParams();

    if (subtopic) params.append('subtopic', subtopic);
    if (topic) params.append('topic', topic);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error fetching companies by category',
      details: err.message,
    };
  }
};

export const getCompaniesByHierarchicalCategory = async (category, subtopic = null, topic = null) => {
  try {
    let url = `${COMPANIES_API_URL}/by-hierarchical-category/${category}`;
    const params = new URLSearchParams();

    if (subtopic) params.append('subtopic', subtopic);
    if (topic) params.append('topic', topic);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error fetching companies by hierarchical category',
      details: err.message,
    };
  }
};

export const getCompaniesByCategories = async (categories) => {
  try {
    const response = await fetch(`${COMPANIES_API_URL}/by-categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categories }),
    });
    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error fetching companies by categories',
      details: err.message,
    };
  }
};

export const getCompanyById = async (companyId) => {
  try {
    const response = await fetch(`${COMPANIES_API_URL}/${companyId}`);
    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error fetching company by ID',
      details: err.message,
    };
  }
};

export const userOnboardCompany = async (companyData) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${COMPANIES_API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(companyData),
    });

    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error onboarding company',
      details: err.message,
    };
  }
};

export const adminOnboardCompany = async (formData) => {
  try {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${COMPANIES_API_URL}/admin-onboard`, {
      method: 'POST',
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
      error: 'Error onboarding company',
      details: err.message,
    };
  }
};

export const onboardCompany = async (companyData) => {
  try {
    const token = localStorage.getItem('authToken');

    // Create FormData for file uploads
    const formData = new FormData();

    // Add all text fields
    Object.keys(companyData).forEach(key => {
      if (key !== 'companyLogo' && key !== 'productImages') {
        if (key === 'hierarchicalProductsServices' || Array.isArray(companyData[key])) {
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

    const response = await fetch(`${COMPANIES_API_URL}/onboard`, {
      method: 'POST',
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
      error: 'Error onboarding company',
      details: err.message,
    };
  }
};

// Add product/service to company
export const addCompanyCaseStudy = async (companyId, studyData) => {
  try {
    const token = localStorage.getItem('authToken');

    const formData = new FormData();
    formData.append('title', studyData.title);
    formData.append('client', studyData.client);
    formData.append('location', studyData.location);
    formData.append('year', studyData.year || '');
    formData.append('overview', studyData.overview);
    formData.append('keyFeatures', JSON.stringify(studyData.keyFeatures || []));
    formData.append('challenges', studyData.challenges || '');
    formData.append('solution', studyData.solution || '');
    formData.append('outcome', studyData.outcome || '');
    formData.append('url', studyData.url || '');

    (studyData.images || []).forEach((file) => {
      formData.append('images', file);
    });

    const response = await fetch(`${COMPANIES_API_URL}/${companyId}/case-studies`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error adding case study',
      details: err.message,
    };
  }
};

export const updateCompanyCaseStudy = async (companyId, studyId, studyData) => {
  try {
    const token = localStorage.getItem('authToken');

    const formData = new FormData();
    formData.append('title', studyData.title);
    formData.append('client', studyData.client);
    formData.append('location', studyData.location);
    formData.append('year', studyData.year || '');
    formData.append('overview', studyData.overview);
    formData.append('keyFeatures', JSON.stringify(studyData.keyFeatures || []));
    formData.append('challenges', studyData.challenges || '');
    formData.append('solution', studyData.solution || '');
    formData.append('outcome', studyData.outcome || '');
    formData.append('url', studyData.url || '');

    (studyData.images || []).forEach((file) => {
      if (file instanceof File) {
        formData.append('images', file);
      }
    });

    if (studyData.existingImages) {
        formData.append('existingImages', JSON.stringify(studyData.existingImages));
    }

    const response = await fetch(`${COMPANIES_API_URL}/${companyId}/case-studies/${studyId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error updating case study',
      details: err.message,
    };
  }
};

export const deleteCompanyCaseStudy = async (companyId, studyId) => {
  try {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${COMPANIES_API_URL}/${companyId}/case-studies/${studyId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error deleting case study',
      details: err.message,
    };
  }
};
export const addCompanyProduct = async (companyId, productData) => {
  try {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${COMPANIES_API_URL}/${companyId}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error adding product',
      details: err.message,
    };
  }
};

// Delete product from company
export const deleteCompanyProduct = async (companyId, productId) => {
  try {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${COMPANIES_API_URL}/${companyId}/products/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return {
      success: false,
      error: 'Error deleting product',
      details: err.message,
    };
  }
};

export const updateCompany = async (companyId, companyData, logoFile) => {
  try {
    const token = localStorage.getItem('authToken');
    const fd = new FormData();
    
    Object.keys(companyData).forEach(key => {
      if (key === 'companyLogo') return;
      const val = companyData[key];
      if (val !== null && val !== undefined) {
        if (Array.isArray(val)) {
          fd.append(key, JSON.stringify(val));
        } else if (typeof val === 'object') {
          fd.append(key, JSON.stringify(val));
        } else {
          fd.append(key, val);
        }
      }
    });

    if (logoFile instanceof File) {
      fd.append('companyLogo', logoFile);
    } else if (companyData.companyLogo && !companyData.companyLogo.startsWith('data:')) {
      fd.append('companyLogo', companyData.companyLogo);
    }

    const response = await fetch(`${COMPANIES_API_URL}/${companyId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

    const data = await response.json();
    return { success: response.ok, data, error: data.error || data.message };
  } catch (err) {
    return { success: false, error: 'Error updating company', details: err.message };
  }
};
