import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import StarRating from './StarRating';
import { toast } from 'sonner';

interface ReviewFormData {
  rating: number;
  review_text: string;
}

interface ReviewFormProps {
  bookId: string;
  bookTitle: string;
  onSubmit: (data: ReviewFormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: ReviewFormData;
  isEditing?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  bookId,
  bookTitle,
  onSubmit,
  onCancel,
  initialData,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: initialData?.rating || 0,
    review_text: initialData?.review_text || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, review_text: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!formData.review_text.trim()) {
      toast.error('Please write a review');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      toast.success(isEditing ? 'Review updated successfully!' : 'Review submitted successfully!');
    } catch (error) {
      console.error('Review submission error:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit Review' : 'Write a Review'}
        </CardTitle>
        <p className="text-sm text-gray-600">
          {isEditing ? 'Editing review for' : 'Reviewing'}: <span className="font-medium">{bookTitle}</span>
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="rating">Rating *</Label>
            <div className="mt-2">
              <StarRating
                rating={formData.rating}
                onRatingChange={handleRatingChange}
                size="lg"
                showLabel
              />
            </div>
            {formData.rating > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                You selected {formData.rating} star{formData.rating !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="review_text">Review *</Label>
            <Textarea
              id="review_text"
              placeholder="Share your thoughts about this book..."
              value={formData.review_text}
              onChange={handleTextChange}
              rows={6}
              className="mt-2"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.review_text.length} characters
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting || formData.rating === 0}>
              {isSubmitting ? 'Submitting...' : isEditing ? 'Update Review' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm; 