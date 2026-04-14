// Sectors API utility functions
import { API_BASE_URL } from '../config';
const SECTORS_API_URL = `${API_BASE_URL}/sectors`;

export const updateCompanySectors = async (sectors) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${SECTORS_API_URL}/update-sectors`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ sectors }),
    });

    if (!response.ok) {
      throw new Error('Failed to update sectors');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating sectors:', error);
    throw error;
  }
};

export const getCompaniesBySector = async (sectorName) => {
  try {
    const response = await fetch(`${SECTORS_API_URL}/by-sector/${encodeURIComponent(sectorName)}`);

    if (!response.ok) {
      throw new Error('Failed to fetch companies');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching companies by sector:', error);
    throw error;
  }
};

export const getAllSectors = async () => {
  try {
    const response = await fetch(`${SECTORS_API_URL}/all-sectors`);

    if (!response.ok) {
      throw new Error('Failed to fetch sectors');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching all sectors:', error);
    throw error;
  }
};

export const getUserSectors = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${SECTORS_API_URL}/my-sectors`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user sectors');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user sectors:', error);
    throw error;
  }
};
