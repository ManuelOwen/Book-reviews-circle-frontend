import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Star, User, BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import StarRating from "@/components/StarRating";

const Browse = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError("");
      try {
        let url = "http://localhost:3000/books";
        if (searchTerm) {
          url += `?search=${encodeURIComponent(searchTerm)}`;
        }
        const token = localStorage.getItem('token');
        const response = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!response.ok) throw new Error("Failed to fetch books");
        const result = await response.json();
        setBooks(result.data || []);
      } catch (err) {
        setError((err as Error).message);
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [searchTerm]);

  const allTags = ["thriller", "psychology", "mystery", "self-help", "productivity", "habits", "fiction", "romance", "hollywood"];

  const filteredBooks = Array.isArray(books) ? books.filter(book => {
    const matchesSearch = book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || book.tags?.some(tag => 
      (typeof tag === 'string' ? tag : tag.name) === selectedTag
    );
    const matchesRating = (book.avgRating || 0) >= minRating;
    
    return matchesSearch && matchesTag && matchesRating;
  }) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p>Loading books...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse Books & Reviews</h2>
          <p className="text-gray-600">Discover what the community is reading and sharing</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Search Books</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tag Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Filter by Tag</label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Minimum Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={0}>Any Rating</option>
                <option value={3}>3+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredBooks.map(book => (
            <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/book/${book.id}`)}>
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <img 
                    src={book.cover_image_url || book.coverUrl} 
                    alt={book.title}
                    className="w-20 h-28 object-cover rounded-md bg-gray-200"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-lg">{book.title}</CardTitle>
                    <p className="text-gray-600 mb-2">by {book.author}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-2">
                      <StarRating 
                        rating={book.avgRating || 0}
                        readonly
                        size="sm"
                      />
                      <span className="text-sm text-gray-600">
                        {(book.avgRating || 0).toFixed(1)} ({book.reviewCount || book.reviews?.length || 0} reviews)
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {(book.tags || []).map(tag => (
                        <Badge key={tag.id || tag} variant="secondary" className="text-xs">
                          {tag.name || tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Recent Reviews</h4>
                  {(book.reviews || book.recentReviews || []).slice(0, 2).map((review, index) => (
                    <div key={review.id || index} className="border-l-4 border-indigo-200 pl-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">{review.user?.full_name || review.user}</span>
                        <StarRating 
                          rating={review.rating}
                          readonly
                          size="sm"
                        />
                      </div>
                      <p className="text-sm text-gray-600">{review.review_text || review.text}</p>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/book/${book.id}`);
                    }}
                  >
                    View All Reviews
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBooks.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or browse all books.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
