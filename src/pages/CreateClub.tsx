import React from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import BookClubForm from '@/components/BookClubForm';
import Navbar from '@/components/Navbar';

const CreateClub = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    try {
      await api.clubs.create(data);
      navigate('/clubs'); // Redirect to clubs list after creation
    } catch (error) {
      console.error('Error creating club:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Book Club</h1>
        <BookClubForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/clubs')}
        />
      </div>
    </div>
  );
};

export default CreateClub; 