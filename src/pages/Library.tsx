import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import BookForm from '@/components/BookForm';
import { BookOpen, Plus, Clock, CheckCircle, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';

interface Book {
  id: string;
  title: string;
  author: string;
  cover_image_url?: string;
  genre?: string;
  page_count?: number;
}

interface PersonalLibraryEntry {
  id: string;
  book: Book;
  status: 'want_to_read' | 'currently_reading' | 'read';
  started_reading_at?: string;
  finished_reading_at?: string;
  added_at: string;
}

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

const Library = () => {
  const { user, loading } = useAuth();
  const [showAddBookDialog, setShowAddBookDialog] = useState(false);
  const [libraryEntries, setLibraryEntries] = useState<PersonalLibraryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLibrary = async () => {
      if (user) {
        try {
          const response = await api.personalLibrary.getAll();
          setLibraryEntries(response);
        } catch (error) {
          console.error('Error fetching library:', error);
          toast.error('Failed to load your library');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchLibrary();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'want_to_read':
        return <Heart className="h-4 w-4" />;
      case 'currently_reading':
        return <Clock className="h-4 w-4" />;
      case 'read':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'want_to_read':
        return 'bg-blue-100 text-blue-800';
      case 'currently_reading':
        return 'bg-yellow-100 text-yellow-800';
      case 'read':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'want_to_read':
        return 'Want to Read';
      case 'currently_reading':
        return 'Currently Reading';
      case 'read':
        return 'Read';
      default:
        return status;
    }
  };

  const filterByStatus = (status: string) => {
    return libraryEntries.filter(entry => entry.status === status);
  };

  const BookCard = ({ entry }: { entry: PersonalLibraryEntry }) => (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <img
              src={entry.book.cover_image_url || '/placeholder.svg'}
              alt={entry.book.title}
              className="w-16 h-24 object-cover rounded"
            />
          </div>
          <div className="flex-grow min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {entry.book.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              by {entry.book.author}
            </p>
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={`text-xs ${getStatusColor(entry.status)}`}>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(entry.status)}
                  <span>{getStatusLabel(entry.status)}</span>
                </div>
              </Badge>
              {entry.book.genre && (
                <Badge variant="outline" className="text-xs">
                  {entry.book.genre}
                </Badge>
              )}
            </div>
            {entry.book.page_count && (
              <p className="text-xs text-gray-500">
                {entry.book.page_count} pages
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const handleAddBook = async (bookData: BookFormData) => {
    try {
      // First create the book
      const createdBook = await api.books.create(bookData);
      
      // Then add it to personal library
      const newEntry = await api.personalLibrary.create({
        bookId: createdBook.id,
        status: 'want_to_read', // Default status when adding a new book
      });
      setLibraryEntries(prev => [...prev, newEntry]);
      setShowAddBookDialog(false);
      toast.success('Book created and added to your library successfully!');
    } catch (error) {
      console.error('Error adding book to personal library:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add book to library');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Please log in to view your personal library.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Loading your library...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const wantToRead = filterByStatus('want_to_read');
  const currentlyReading = filterByStatus('currently_reading');
  const read = filterByStatus('read');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Library</h1>
            <p className="text-gray-600 mt-2">
              Track your reading journey and discover new books
            </p>
          </div>
          <Dialog open={showAddBookDialog} onOpenChange={setShowAddBookDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Book</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <BookForm
                onSubmit={handleAddBook}
                onCancel={() => setShowAddBookDialog(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              All Books ({libraryEntries.length})
            </TabsTrigger>
            <TabsTrigger value="want_to_read">
              Want to Read ({wantToRead.length})
            </TabsTrigger>
            <TabsTrigger value="currently_reading">
              Currently Reading ({currentlyReading.length})
            </TabsTrigger>
            <TabsTrigger value="read">
              Read ({read.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {libraryEntries.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Your library is empty
                  </h3>
                  <p className="text-gray-500">
                    Start building your personal library by adding books you want to read.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {libraryEntries.map((entry) => (
                  <BookCard key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="want_to_read" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wantToRead.map((entry) => (
                <BookCard key={entry.id} entry={entry} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="currently_reading" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentlyReading.map((entry) => (
                <BookCard key={entry.id} entry={entry} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="read" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {read.map((entry) => (
                <BookCard key={entry.id} entry={entry} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Library;
