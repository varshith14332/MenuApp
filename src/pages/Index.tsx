import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { RestaurantCard } from "@/components/RestaurantCard";
import { TrendingUp, Loader2, CheckCircle, Clock, DollarSign } from "lucide-react";
import type { Restaurant } from "@/types/restaurant";
import { MOCK_RESTAURANTS } from "@/data/mockData";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // ✅ AUTH GUARD
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate("/login");
      }
    });
  }, [navigate]);

  const { data: restaurants, isLoading } = useQuery<Restaurant[]>({
    queryKey: ["restaurants"],
    queryFn: async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_RESTAURANTS;
    },
  });

  // ✅ NULL-SAFE FILTER
  const filteredRestaurants = useMemo(() => {
    if (!restaurants) return [];
    if (!searchQuery.trim()) return restaurants;

    const query = searchQuery.toLowerCase();
    return restaurants.filter(
      (r) =>
        r.name?.toLowerCase().includes(query) ||
        r.cuisine_primary?.toLowerCase().includes(query) ||
        r.type?.toLowerCase().includes(query)
    );
  }, [restaurants, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <Header />

      {/* Hero Section */}
      <section id="hero" className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-100/50 to-transparent" />

        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full blur-xl opacity-20 animate-float" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full blur-xl opacity-20 animate-float" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-200 rounded-full blur-xl opacity-20 animate-float" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Discover Menu Prices
              <span className="block mt-2 gradient-text">Before You Dine</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              Browse menus from your favorite restaurants and cloud kitchens.
            </p>
          </div>

          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </section>

      {/* Restaurants */}
      <section id="restaurants" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-900">
              {searchQuery ? "Search Results" : "Trending Restaurants"}
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
            </div>
          ) : filteredRestaurants.length === 0 ? (
            <p className="text-center text-gray-600 py-20">
              No restaurants found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  id={restaurant.id}
                  name={restaurant.name}
                  slug={restaurant.slug}
                  type={restaurant.type}
                  cuisinePrimary={restaurant.cuisine_primary}
                  priceRange={restaurant.price_range}
                  coverImage={restaurant.cover_image}
                  logo={restaurant.logo}
                  address={restaurant.address}
                  isVerified={restaurant.is_verified}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <DollarSign className="mx-auto w-10 h-10 text-purple-600" />
            <h3 className="font-bold mt-4">Transparent Pricing</h3>
          </div>
          <div className="text-center">
            <CheckCircle className="mx-auto w-10 h-10 text-purple-600" />
            <h3 className="font-bold mt-4">Verified Information</h3>
          </div>
          <div className="text-center">
            <Clock className="mx-auto w-10 h-10 text-purple-600" />
            <h3 className="font-bold mt-4">Save Time</h3>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center border-t">
        © {new Date().getFullYear()} MenuPrice
      </footer>
    </div>
  );
};

export default Index;
