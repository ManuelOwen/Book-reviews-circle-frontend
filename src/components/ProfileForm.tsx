
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ImageUpload from './ImageUpload';
import { toast } from 'sonner';

interface ProfileFormData {
  full_name: string;
  bio?: string;
  avatar_url?: string;
  organization?: string;
  favorite_genres?: string[];
}

interface ProfileFormProps {
  initialData?: ProfileFormData;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  onCancel?: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    bio: '',
    avatar_url: '',
    organization: '',
    favorite_genres: [],
    ...initialData
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ProfileFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, avatar_url: imageUrl }));
  };

  const handleGenresChange = (value: string) => {
    const genres = value.split(',').map(genre => genre.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, favorite_genres: genres }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name.trim()) {
      toast.error('Full name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.avatar_url} />
              <AvatarFallback>
                {formData.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <ImageUpload
                label="Profile Picture"
                currentImage={formData.avatar_url}
                onImageUpload={handleAvatarUpload}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                value={formData.organization}
                onChange={(e) => handleInputChange('organization', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={3}
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <Label htmlFor="favorite_genres">Favorite Genres</Label>
            <Input
              id="favorite_genres"
              value={formData.favorite_genres?.join(', ') || ''}
              onChange={(e) => handleGenresChange(e.target.value)}
              placeholder="Science Fiction, Fantasy, Mystery (comma separated)"
            />
          </div>

          <div className="flex justify-end space-x-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
