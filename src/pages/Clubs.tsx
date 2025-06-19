
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import { Users, Plus, Crown, Shield, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

interface Club {
  id: string;
  name: string;
  description?: string;
  cover_image_url?: string;
  is_private: boolean;
  created_at: string;
  created_by: string;
  memberships?: Array<{
    id: string;
    role: string;
    user: {
      id: string;
      full_name: string;
    };
  }>;
}

const Clubs = () => {
  const { user, token } = useAuth();
  const [allClubs, setAllClubs] = useState<Club[]>([]);
  const [myClubs, setMyClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'https://backend-bookcircle-klee.onrender.com';

  useEffect(() => {
    fetchClubs();
    if (user && token) {
      fetchMyClubs();
    }
  }, [user, token]);

  const fetchClubs = async () => {
    try {
      const response = await fetch(`${API_URL}/clubs`);
      if (!response.ok) {
        throw new Error('Failed to fetch clubs');
      }
      const data = await response.json();
      setAllClubs(data);
    } catch (error) {
      console.error('Error fetching clubs:', error);
      toast.error('Failed to load clubs');
    }
  };

  const fetchMyClubs = async () => {
    try {
      const response = await fetch(`${API_URL}/clubs/my-clubs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch my clubs');
      }
      const data = await response.json();
      setMyClubs(data);
    } catch (error) {
      console.error('Error fetching my clubs:', error);
      toast.error('Failed to load your clubs');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4" />;
      case 'moderator':
        return <Shield className="h-4 w-4" />;
      default:
        return <UserIcon className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'moderator':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const ClubCard = ({ club, showRole = false }: { club: Club; showRole?: boolean }) => {
    const userMembership = club.memberships?.find(m => m.user.id === user?.id);
    
    return (
      <Card className="group hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-grow">
              <CardTitle className="text-lg">{club.name}</CardTitle>
              <CardDescription className="mt-2">
                {club.description}
              </CardDescription>
            </div>
            {club.cover_image_url && (
              <img
                src={club.cover_image_url}
                alt={club.name}
                className="w-16 h-16 object-cover rounded ml-4"
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-gray-600">
                <Users className="h-4 w-4" />
                <span className="text-sm">
                  {club.memberships?.length || 0} members
                </span>
              </div>
              {club.is_private && (
                <Badge variant="outline" className="text-xs">
                  Private
                </Badge>
              )}
              {showRole && userMembership && (
                <Badge className={`text-xs ${getRoleColor(userMembership.role)}`}>
                  <div className="flex items-center space-x-1">
                    {getRoleIcon(userMembership.role)}
                    <span className="capitalize">{userMembership.role}</span>
                  </div>
                </Badge>
              )}
            </div>
            <Button variant="outline" size="sm">
              {userMembership ? 'View Club' : 'Join Club'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Loading clubs...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book Clubs</h1>
            <p className="text-gray-600 mt-2">
              Join communities of readers and discover new perspectives
            </p>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create Club</span>
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">
              All Clubs ({allClubs.length})
            </TabsTrigger>
            <TabsTrigger value="my-clubs">
              My Clubs ({myClubs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {allClubs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No clubs available
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Be the first to create a book club in your community.
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Club
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allClubs.map((club) => (
                  <ClubCard key={club.id} club={club} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-clubs" className="space-y-4">
            {!user ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Sign in to view your clubs
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Join book clubs and connect with fellow readers.
                  </p>
                </CardContent>
              </Card>
            ) : myClubs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    You haven't joined any clubs yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Explore book clubs and find your reading community.
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Find Clubs to Join
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myClubs.map((club) => (
                  <ClubCard key={club.id} club={club} showRole={true} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Clubs;
