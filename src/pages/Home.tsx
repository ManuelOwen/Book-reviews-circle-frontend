import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Star, User, Search, Sparkles, Heart, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-indigo-200 rounded-full opacity-25 animate-pulse delay-700"></div>
        <div className="absolute bottom-40 right-1/3 w-20 h-20 bg-pink-200 rounded-full opacity-20 animate-bounce delay-1000"></div>
      </div>

      {/* Header with Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="animate-fade-in">
            <h2 className="text-5xl font-bold text-gray-900 sm:text-7xl mb-6">
              Discover Your Next
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                {" "}Great Read
              </span>
            </h2>
            <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto animate-fade-in delay-200">
              Join our vibrant community of book lovers. Build your personal library, share thoughtful reviews, 
              and discover your next favorite book through the power of social reading.
            </p>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-x-6 animate-fade-in delay-400">
            {user ? (
              <Link to="/browse">
                <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Continue Reading
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Start Your Journey
                  </Button>
                </Link>
                <Link to="/browse">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-4 rounded-xl border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300 hover:scale-105">
                    <Search className="mr-2 h-5 w-5" />
                    Explore Books
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why BookClub?</h3>
            <p className="text-gray-600 text-lg">Everything you need for your reading journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:scale-105 transition-all duration-300 border-0 shadow-lg hover:shadow-2xl bg-gradient-to-br from-white to-purple-50">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Personal Library</CardTitle>
                <CardDescription className="text-base">
                  Organize your books beautifully and track your reading progress with style.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:scale-105 transition-all duration-300 border-0 shadow-lg hover:shadow-2xl bg-gradient-to-br from-white to-yellow-50">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Reviews & Ratings</CardTitle>
                <CardDescription className="text-base">
                  Share your thoughts and discover what the community thinks about every book.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:scale-105 transition-all duration-300 border-0 shadow-lg hover:shadow-2xl bg-gradient-to-br from-white to-green-50">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <User className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Book Community</CardTitle>
                <CardDescription className="text-base">
                  Connect with fellow readers and get personalized recommendations.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Enhanced Community Reviews */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              What Our Community Is Reading
            </h3>
            <p className="text-gray-600 text-lg">Real reviews from real readers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:scale-105 transition-all duration-300 border-0 shadow-lg hover:shadow-2xl bg-gradient-to-br from-white to-blue-50 overflow-hidden">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold">JS</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Jane Smith</p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      2 hours ago
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="font-bold text-lg text-gray-900 mb-1">The Silent Patient</h4>
                <p className="text-sm text-gray-600 mb-3">by Alex Michaelides</p>
                <div className="flex items-center mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400 animate-pulse" style={{animationDelay: `${star * 100}ms`}} />
                  ))}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  "A psychological thriller that kept me guessing until the very end. Absolutely brilliant!"
                </p>
                <div className="flex items-center mt-3 text-xs text-gray-500">
                  <Heart className="h-3 w-3 mr-1 text-red-400" />
                  24 likes
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:scale-105 transition-all duration-300 border-0 shadow-lg hover:shadow-2xl bg-gradient-to-br from-white to-green-50 overflow-hidden">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold">MD</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Mike Davis</p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      5 hours ago
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="font-bold text-lg text-gray-900 mb-1">Atomic Habits</h4>
                <p className="text-sm text-gray-600 mb-3">by James Clear</p>
                <div className="flex items-center mb-3">
                  {[1, 2, 3, 4].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400 animate-pulse" style={{animationDelay: `${star * 100}ms`}} />
                  ))}
                  <Star className="h-4 w-4 text-gray-300" />
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  "Practical and actionable advice for building better habits. Life-changing!"
                </p>
                <div className="flex items-center mt-3 text-xs text-gray-500">
                  <Heart className="h-3 w-3 mr-1 text-red-400" />
                  18 likes
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:scale-105 transition-all duration-300 border-0 shadow-lg hover:shadow-2xl bg-gradient-to-br from-white to-pink-50 overflow-hidden">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold">AL</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Alice Johnson</p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      1 day ago
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="font-bold text-lg text-gray-900 mb-1">The Seven Husbands of Evelyn Hugo</h4>
                <p className="text-sm text-gray-600 mb-3">by Taylor Jenkins Reid</p>
                <div className="flex items-center mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400 animate-pulse" style={{animationDelay: `${star * 100}ms`}} />
                  ))}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  "An absolutely captivating story that I couldn't put down. Brilliant storytelling!"
                </p>
                <div className="flex items-center mt-3 text-xs text-gray-500">
                  <Heart className="h-3 w-3 mr-1 text-red-400" />
                  42 likes
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/browse">
              <Button variant="outline" size="lg" className="hover:scale-105 transition-all duration-300 border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 text-lg px-8 py-4 rounded-xl">
                <Search className="mr-2 h-5 w-5" />
                Explore More Reviews
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <BookOpen className="h-8 w-8 text-indigo-300 mr-2" />
              <h3 className="text-2xl font-bold">BookClub</h3>
              <Sparkles className="h-5 w-5 text-yellow-400 ml-2 animate-ping" />
            </div>
            <p className="text-indigo-200 text-lg mb-6">
              Join thousands of readers sharing their passion for books
            </p>
            <p className="text-indigo-300">
              &copy; 2024 BookClub. Built for book lovers, by book lovers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
