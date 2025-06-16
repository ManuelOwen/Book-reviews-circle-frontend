
// Environment configuration for Cloudinary
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: import.meta.env.dl2a09yib || '',
  UPLOAD_PRESET: import.meta.env.dl2a09yib || 'bookclub_uploads',
};

// Validate required environment variables
export const validateEnvironment = () => {
  if (!CLOUDINARY_CONFIG.CLOUD_NAME) {
    console.warn('VITE_CLOUDINARY_CLOUD_NAME is not set. Image uploads will not work.');
    return false;
  }
  return true;
};
