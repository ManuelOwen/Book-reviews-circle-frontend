
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image } from 'lucide-react';
import { uploadToCloudinary, validateImageFile } from '@/lib/cloudinary';
import { toast } from 'sonner';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
  label: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  currentImage,
  label,
  className = ''
}) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    setUploading(true);

    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(file);
      onImageUpload(imageUrl);
      
      // Clean up preview URL and update with Cloudinary URL
      URL.revokeObjectURL(previewUrl);
      setPreview(imageUrl);
      
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label htmlFor="image-upload">{label}</Label>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-w-full max-h-48 mx-auto rounded-lg object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemoveImage}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Image className="h-12 w-12 mx-auto text-gray-400" />
            <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-400">JPEG, PNG up to 5MB</p>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Input
          id="image-upload"
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleFileSelect}
          ref={fileInputRef}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center space-x-2"
        >
          <Upload className="h-4 w-4" />
          <span>{uploading ? 'Uploading...' : 'Select Image'}</span>
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
