// Environment configuration for Cloudinary
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: 'dl2a09yib',
  UPLOAD_PRESET: 'owenKibet',
};

// Validate required environment variables
export const validateEnvironment = () => {
  if (!CLOUDINARY_CONFIG.CLOUD_NAME) {
    console.warn('VITE_CLOUDINARY_CLOUD_NAME is not set. Image uploads will not work.');
    return false;
  }
  if (!CLOUDINARY_CONFIG.UPLOAD_PRESET) {
    console.warn('VITE_CLOUDINARY_UPLOAD_PRESET is not set. Image uploads will not work.');
    return false;
  }
  return true;
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://backend-bookcircle-klee.onrender.com',
};