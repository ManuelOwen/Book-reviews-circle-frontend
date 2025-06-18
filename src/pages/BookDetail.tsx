import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, BookOpen, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import StarRating from '@/components/StarRating';
import ReviewForm from '@/components/ReviewForm';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  cover_image_url?: string;
  coverUrl?: string;
  avgRating?: number;
  reviewCount?: number;
  tags?: Array<{ id: string; name: string } | string>;
  reviews?: Array<{
    id: string;
    rating: number;
    review_text: string;
    created_at: string;
    user: {
      id: string;
      full_name: string;
    };
  }>;
}

interface ReviewFormData {
  rating: number;
  review_text: string;
}

const BookDetail: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReview, setUserReview] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId]);

  const fetchBookDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/books/${bookId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch book details');
      }
      
      const result = await response.json();
      setBook(result.data || result);
      
      // Check if user has already reviewed this book
      if (user && result.data?.reviews) {
        const existingReview = result.data.reviews.find(
          (review: any) => review.user.id === user.id
        );
        setUserReview(existingReview);
      }
    } catch (err) {
      setError((err as Error).message);
      console.error('Error fetching book details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (reviewData: ReviewFormData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to submit a review');
        return;
      }

      const url = isEditing 
        ? `http://localhost:3000/reviews/${userReview.id}`
        : 'http://localhost:3000/reviews';
      
      const method = isEditing ? 'PATCH' : 'POST';
      const body = isEditing 
        ? { ...reviewData, book_id: bookId }
        : { ...reviewData, book_id: bookId };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      // Refresh book details to show the new review
      await fetchBookDetails();
      setShowReviewForm(false);
      setIsEditing(false);
      toast.success(isEditing ? 'Review updated successfully!' : 'Review submitted successfully!');
    } catch (error) {
      console.error('Review submission error:', error);
      toast.error('Failed to submit review. Please try again.');
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;
    
    if (!confirm('Are you sure you want to delete your review?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/reviews/${userReview.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      await fetchBookDetails();
      setUserReview(null);
      toast.success('Review deleted successfully!');
    } catch (error) {
      console.error('Review deletion error:', error);
      toast.error('Failed to delete review. Please try again.');
    }
  };

  const handleEditReview = () => {
    setIsEditing(true);
    setShowReviewForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p>Loading book details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-red-600">Error: {error || 'Book not found'}</p>
            <Button onClick={() => navigate('/browse')} className="mt-4">
              Back to Browse
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/browse')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Browse
        </Button>

        {showReviewForm ? (
          <ReviewForm
            bookId={book.id}
            bookTitle={book.title}
            onSubmit={handleSubmitReview}
            onCancel={() => {
              setShowReviewForm(false);
              setIsEditing(false);
            }}
            initialData={isEditing ? userReview : undefined}
            isEditing={isEditing}
          />
        ) : (
          <>
            {/* Book Header */}
            <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
              <div className="flex flex-col md:flex-row gap-8">
                <img
                  src={book.cover_image_url || book.coverUrl}
                  alt={book.title}
                  className="w-48 h-64 object-cover rounded-lg shadow-md"
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                  <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <StarRating
                      rating={book.avgRating || 0}
                      readonly
                      size="lg"
                      showLabel
                    />
                    <span className="text-gray-600">
                      {book.reviewCount || book.reviews?.length || 0} reviews
                    </span>
                  </div>

                  {book.description && (
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {book.description}
                    </p>
                  )}

                  {book.tags && book.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {book.tags.map(tag => (
                        <Badge key={typeof tag === 'string' ? tag : tag.id} variant="secondary">
                          {typeof tag === 'string' ? tag : tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {user && !userReview && (
                    <Button onClick={() => setShowReviewForm(true)}>
                      Write a Review
                    </Button>
                  )}

                  {userReview && (
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={handleEditReview}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Review
                      </Button>
                      <Button variant="outline" onClick={handleDeleteReview}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Review
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Reviews ({book.reviews?.length || 0})
                </h2>
              </div>

              {userReview && (
                <Card className="border-2 border-indigo-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-indigo-600" />
                        <span className="font-medium text-indigo-600">Your Review</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 mb-3">
                      <StarRating
                        rating={userReview.rating}
                        readonly
                        size="sm"
                      />
                      <span className="text-sm text-gray-500">
                        {new Date(userReview.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{userReview.review_text}</p>
                  </CardContent>
                </Card>
              )}

              {book.reviews && book.reviews.length > 0 ? (
                book.reviews
                  .filter(review => !userReview || review.id !== userReview.id)
                  .map(review => (
                    <Card key={review.id}>
                      <CardHeader>
                        <div className="flex items-center space-x-2">
                          <User className="h-5 w-5 text-gray-400" />
                          <span className="font-medium">{review.user.full_name}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-2 mb-3">
                          <StarRating
                            rating={review.rating}
                            readonly
                            size="sm"
                          />
                          <span className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.review_text}</p>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No reviews yet. Be the first to review this book!</p>
                    {user && (
                      <Button onClick={() => setShowReviewForm(true)} className="mt-4">
                        Write the First Review
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookDetail; 