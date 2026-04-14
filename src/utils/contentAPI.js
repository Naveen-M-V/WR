import { API_BASE_URL } from '../config';

/**
 * Fetch dynamic content for a specific section from the backend.
 * @param {string} section - The identifier for the section (e.g., 'advertisement', 'home-news')
 * @returns {Promise<Array>} The content array for the section
 */
export const getContent = async (section) => {
    try {
        const response = await fetch(`${API_BASE_URL}/content/${section}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch content for ${section}`);
        }

        const result = await response.json();
        return result.success && result.data ? result.data : [];
    } catch (error) {
        console.error(`Error fetching content for ${section}:`, error);
        return [];
    }
};

/**
 * Fetch all dynamic content sections from the backend.
 * @returns {Promise<Object>} An object containing all content sections
 */
export const getAllContent = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/content`);

        if (!response.ok) {
            throw new Error(`Failed to fetch all content`);
        }

        const result = await response.json();
        return result.success && result.data ? result.data : {};
    } catch (error) {
        console.error(`Error fetching all content:`, error);
        return {};
    }
};

/**
 * Update dynamic content for a specific section.
 * @param {string} section - The identifier for the section
 * @param {Array} data - The array containing the updated content items
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export const updateContent = async (section, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/content/${section}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Failed to update content for ${section}`);
        }

        const result = await response.json();
        return result.success === true;
    } catch (error) {
        console.error(`Error updating content for ${section}:`, error);
        return false;
    }
};

/**
 * Fetch all newsletter subscribers from the backend.
 * @returns {Promise<Array>} The array of subscribers
 */
export const getNewsletterSubscribers = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/contact/newsletter`);

        if (!response.ok) {
            throw new Error(`Failed to fetch newsletter subscribers`);
        }

        const result = await response.json();
        return result.success && result.data ? result.data : [];
    } catch (error) {
        console.error(`Error fetching newsletter subscribers:`, error);
        return [];
    }
};
