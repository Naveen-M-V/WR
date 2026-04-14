// Authentication API functions

import { API_BASE_URL } from '../config';


export const requestOTP = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    const error = data?.details ? `${data.error} (${data.details})` : data?.error;
    return { success: response.ok, data, error };
  } catch (err) {
    return {
      success: false,
      error: 'Backend not running on http://localhost:5006',
      details: err.message
    };
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    const data = await response.json();
    return { success: response.ok, data, error: data.error };
  } catch (err) {
    return {
      success: false,
      error: 'Error verifying OTP',
      details: err.message
    };
  }
};

export const registerUser = async (email, password, otp) => {
  try {
    // Generate username from email (part before @) since backend requires it
    const username = email.split('@')[0] || email;
    
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, otp, username })
    });
    const data = await response.json();

    if (response.ok && data.data?.token) {
      // Store token in localStorage
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('userId', data.data.userId);
      localStorage.setItem('email', data.data.email);
      if (data.data.role) {
        localStorage.setItem('role', data.data.role);
      }
    }

    return { success: response.ok, data, error: data.error };
  } catch (err) {
    return {
      success: false,
      error: 'Error registering user',
      details: err.message
    };
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();

    if (response.ok && data.data?.token) {
      // Store token in localStorage
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('userId', data.data.userId);
      localStorage.setItem('email', data.data.email);
      if (data.data.role) {
        localStorage.setItem('role', data.data.role);
      }
    }

    return { success: response.ok, data, error: data.error };
  } catch (err) {
    return {
      success: false,
      error: 'Error logging in',
      details: err.message
    };
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    return { success: response.ok, data, error: data.error };
  } catch (err) {
    return {
      success: false,
      error: 'Error requesting password reset',
      details: err.message
    };
  }
};

export const resetPasswordWithToken = async (token, newPassword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    });
    const data = await response.json();
    return { success: response.ok, data, error: data.error };
  } catch (err) {
    return {
      success: false,
      error: 'Error resetting password',
      details: err.message
    };
  }
};

export const requestPasswordResetOTP = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    return { success: response.ok, data, error: data.error };
  } catch (err) {
    return {
      success: false,
      error: 'Error requesting OTP',
      details: err.message
    };
  }
};

export const verifyPasswordResetOTP = async (email, otp) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-password-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    const data = await response.json();
    return { success: response.ok, data, error: data.error };
  } catch (err) {
    return {
      success: false,
      error: 'Error verifying OTP',
      details: err.message
    };
  }
};

export const checkUserExists = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/check-user-exists?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return { success: response.ok, exists: data.exists, error: data.error };
  } catch (err) {
    return {
      success: false,
      exists: false,
      error: 'Error checking user existence',
      details: err.message
    };
  }
};

export const resetPasswordWithOTP = async (email, otp, newPassword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword })
    });
    const data = await response.json();
    return { success: response.ok, data, error: data.error };
  } catch (err) {
    return {
      success: false,
      error: 'Error resetting password',
      details: err.message
    };
  }
};

// SR#199 - Resend OTP
export const resendOTP = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    return { success: response.ok, data, error: data.error };
  } catch (err) {
    return { success: false, error: 'Error resending OTP', details: err.message };
  }
};
