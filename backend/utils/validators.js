// Input validation utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

export const validateUsername = (username) => {
  // 3-30 characters, alphanumeric, underscore, dot and hyphen
  const usernameRegex = /^[a-zA-Z0-9_.-]{3,30}$/;
  return usernameRegex.test(username);
};

export const validateOTP = (otp) => {
  // 6 digit number
  return /^\d{6}$/.test(otp);
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};
