import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageUpload from './ImageUpload';
import { toast } from 'sonner';

interface BookFormData {
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  cover_image_url?: string;
  published_date?: string;
  genre?: string;
  page_count?: number;
}

interface BookFormProps {
  initialData?: BookFormData;
  onSubmit: (data: BookFormData) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
}

const BookForm: React.FC<BookFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    isbn: '',
    description: '',
    cover_image_url: '',
    published_date: '',
    genre: '',
    page_count: undefined,
    ...initialData
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Static list of genres matching the filter options
  const genres = [
    'Psychology',
    'Mystery',
    'Self-Help',
    'Productivity',
    'Habits',
    'Fiction',
    'Romance',
    'Hollywood',
    'Thriller',
    'Science Fiction',
    'Fantasy',
    'Biography',
    'History',
    'Business',
    'Finance',
    'Economics',
    'Memoir',
    'Literary Fiction',
    'Young Adult',
    'Horror',
    'Historical Fiction'
  ];

  const handleInputChange = (field: keyof BookFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, cover_image_url: imageUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.author.trim()) {
      toast.error('Title and author are required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      toast.success(isEditing ? 'Book updated successfully!' : 'Book created successfully!');
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to save book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Book' : 'Add New Book'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <ImageUpload
            label="Book Cover"
            currentImage={formData.cover_image_url}
            onImageUpload={handleImageUpload}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                value={formData.isbn}
                onChange={(e) => handleInputChange('isbn', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="genre">Genre</Label>
              <Select 
                value={formData.genre} 
                onValueChange={(value) => handleInputChange('genre', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="published_date">Published Date</Label>
              <Input
                id="published_date"
                type="date"
                value={formData.published_date}
                onChange={(e) => handleInputChange('published_date', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="page_count">Page Count</Label>
              <Input
                id="page_count"
                type="number"
                value={formData.page_count || ''}
                onChange={(e) => handleInputChange('page_count', parseInt(e.target.value) || undefined)}
              />
            </div>
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

          <div className="flex justify-end space-x-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Book' : 'Create Book'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookForm;
