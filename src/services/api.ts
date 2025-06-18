import { toast } from 'sonner';

const API_URL = 'http://localhost:3000';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  console.log('API Service - Retrieved token:', token);
  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }
  return { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const handleAuthError = (error: any) => {
  if (error.message === 'No authentication token found. Please log in.') {
    toast.error('Please log in to continue');
    return;
  }
  throw error;
};

export const api = {
  // Book operations
  books: {
    create: async (bookData: any) => {
      try {
        const response = await fetch(`${API_URL}/books`, {
          method: 'POST',
          headers: getAuthHeader(),
          credentials: 'include',
          body: JSON.stringify(bookData),
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication required: Session expired or invalid token.');
          }
          const error = await response.json();
          throw new Error(error.message || 'Failed to create book');
        }

        const result = await response.json();
        return result.data;
      } catch (error) {
        handleAuthError(error);
        console.error('Error creating book:', error);
        throw error;
      }
    },

    getAll: async () => {
      try {
        const response = await fetch(`${API_URL}/books`, {
          headers: getAuthHeader(),
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication required: Session expired or invalid token.');
          }
          const error = await response.json();
          throw new Error(error.message || 'Failed to fetch books');
        }

        const result = await response.json();
        return result.data;
      } catch (error) {
        handleAuthError(error);
        console.error('Error fetching books:', error);
        throw error;
      }
    },
  },

  // Tags operations
  tags: {
    getAll: async () => {
      try {
        const response = await fetch(`${API_URL}/tags`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to fetch tags');
        }

        const result = await response.json();
        return result;
      } catch (error) {
        console.error('Error fetching tags:', error);
        throw error;
      }
    },
  },

  // Personal Library operations
  personalLibrary: {
    getAll: async () => {
      try {
        const response = await fetch(`${API_URL}/personal-library`, {
          headers: getAuthHeader(),
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication required: Session expired or invalid token.');
          }
          const error = await response.json();
          throw new Error(error.message || 'Failed to fetch personal library');
        }

        const result = await response.json();
        return result;
      } catch (error) {
        handleAuthError(error);
        console.error('Error fetching personal library:', error);
        throw error;
      }
    },

    create: async (personalLibraryEntryData: { bookId: string; status: string }) => {
      try {
        const response = await fetch(`${API_URL}/personal-library`, {
          method: 'POST',
          headers: getAuthHeader(),
          credentials: 'include',
          body: JSON.stringify(personalLibraryEntryData),
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication required: Session expired or invalid token.');
          }
          const error = await response.json();
          throw new Error(error.message || 'Failed to add book to personal library');
        }

        const result = await response.json();
        return result;
      } catch (error) {
        handleAuthError(error);
        console.error('Error adding book to personal library:', error);
        throw error;
      }
    },
  },

  // Book club operations
  clubs: {
    create: async (clubData: any) => {
      try {
        const response = await fetch(`${API_URL}/clubs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          credentials: 'include',
          body: JSON.stringify(clubData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to create book club');
        }

        return await response.json();
      } catch (error) {
        console.error('Error creating book club:', error);
        throw error;
      }
    },

    getAll: async () => {
      try {
        const response = await fetch(`${API_URL}/clubs`, {
          headers: getAuthHeader(),
          credentials: 'include',
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to fetch book clubs');
        }

        return await response.json();
      } catch (error) {
        console.error('Error fetching book clubs:', error);
        throw error;
      }
    },
  },
}; 