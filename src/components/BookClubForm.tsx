import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import ImageUpload from './ImageUpload';
import { toast } from 'sonner';

interface BookClubFormData {
  name: string;
  description: string;
  cover_image_url?: string;
  is_private: boolean;
}

interface BookClubFormProps {
  initialData?: BookClubFormData;
  onSubmit: (data: BookClubFormData) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
}

const BookClubForm: React.FC<BookClubFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<BookClubFormData>({
    name: '',
    description: '',
    cover_image_url: '',
    is_private: false,
    ...initialData
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof BookClubFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, cover_image_url: imageUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Club name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      toast.success(isEditing ? 'Book club updated successfully!' : 'Book club created successfully!');
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to save book club. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Book Club' : 'Create New Book Club'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <ImageUpload
            label="Club Cover Image"
            currentImage={formData.cover_image_url}
            onImageUpload={handleImageUpload}
          />

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Club Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_private"
                checked={formData.is_private}
                onCheckedChange={(checked) => handleInputChange('is_private', checked)}
              />
              <Label htmlFor="is_private">Private Club</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Club' : 'Create Club'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookClubForm; 