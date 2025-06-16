import { toast } from 'sonner';

const API_URL = 'http://localhost:3000';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return { Authorization: `Bearer ${token}` };
};

export const api = {
  // Book operations
  books: {
    create: async (bookData: any) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_URL}/books`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify(bookData),
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            throw new Error('Session expired. Please log in again.');
          }
          const error = await response.json();
          throw new Error(error.message || 'Failed to create book');
        }

        const result = await response.json();
        return result.data;
      } catch (error) {
        console.error('Error creating book:', error);
        throw error;
      }
    },

    getAll: async () => {
      try {
        const response = await fetch(`${API_URL}/books`, {
          headers: {
            ...getAuthHeader(),
          },
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            throw new Error('Session expired. Please log in again.');
          }
          const error = await response.json();
          throw new Error(error.message || 'Failed to fetch books');
        }

        return await response.json();
      } catch (error) {
        console.error('Error fetching books:', error);
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