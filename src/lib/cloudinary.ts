
interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  format: string;
  bytes: number;
}

export const uploadToCloudinary = async (
  file: File,
  uploadPreset: string = 'bookclub_uploads'
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const result: CloudinaryUploadResult = await response.json();
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only JPEG and PNG files are allowed' };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: 'File size must be less than 5MB' };
  }

  return { isValid: true };
};
