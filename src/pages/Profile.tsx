
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import ProfileForm from '@/components/ProfileForm';
import Navbar from '@/components/Navbar';
import { User, Edit, Calendar, Building2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface ExtendedUser {
  id: string;
  email: string;
  full_name: string;
  organization?: string;
  role: string;
  bio?: string;
  avatar_url?: string;
  favorite_genres?: string[];
  created_at: string;
  updated_at: string;
}

const Profile = () => {
  const { user, token } = useAuth();
  const [userProfile, setUserProfile] = useState<ExtendedUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:3000';

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user || !token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const profileData = await response.json();
      setUserProfile(profileData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (formData: any) => {
    if (!user || !token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      setUserProfile(updatedProfile);
      setIsEditing(false);
      
      // Update the auth context with the new user data
      await fetchUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Please log in to view your profile.</p>
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
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Loading profile...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ProfileForm
            initialData={userProfile || undefined}
            onSubmit={handleProfileUpdate}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userProfile?.avatar_url} />
                  <AvatarFallback className="text-lg">
                    {userProfile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">
                    {userProfile?.full_name || 'User Profile'}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {userProfile?.email}
                  </CardDescription>
                  <Badge variant="secondary" className="mt-2">
                    {userProfile?.role}
                  </Badge>
                </div>
              </div>
              <Button onClick={() => setIsEditing(true)} className="flex items-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-gray-900">{userProfile?.full_name || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{userProfile?.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Role</label>
                <p className="text-gray-900 capitalize">{userProfile?.role}</p>
              </div>

              {userProfile?.organization && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Organization</label>
                  <p className="text-gray-900 flex items-center space-x-2">
                    <Building2 className="h-4 w-4" />
                    <span>{userProfile.organization}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Member Since</label>
                <p className="text-gray-900">
                  {userProfile?.created_at ? formatDate(userProfile.created_at) : 'Unknown'}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-gray-900">
                  {userProfile?.updated_at ? formatDate(userProfile.updated_at) : 'Unknown'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bio Section */}
        {userProfile?.bio && (
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{userProfile.bio}</p>
            </CardContent>
          </Card>
        )}

        {/* Favorite Genres */}
        {userProfile?.favorite_genres && userProfile.favorite_genres.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Favorite Genres</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userProfile.favorite_genres.map((genre, index) => (
                  <Badge key={index} variant="outline">
                    {genre}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
