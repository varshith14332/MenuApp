import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { MOCK_RESTAURANTS, MOCK_MENU_ITEMS } from "@/data/mockData";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Star } from "lucide-react";
import { Restaurant } from "@/types/restaurant";

const RestaurantDetails = () => {
    const { id } = useParams();
    const { addToCart } = useCart();

    const { data: restaurant, isLoading } = useQuery<Restaurant>({
        queryKey: ["restaurant", id],
        queryFn: async () => {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));

            const found = MOCK_RESTAURANTS.find(r => r.id === id);
            if (!found) throw new Error("Restaurant not found");
            return found;
        },
        enabled: !!id,
    });

    const menuItems = MOCK_MENU_ITEMS;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Restaurant not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Restaurant Header */}
            <div className="relative h-64 md:h-80 w-full">
                <img
                    src={restaurant.cover_image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                    <div className="container mx-auto">
                        <h1 className="text-3xl md:text-5xl font-bold mb-2">{restaurant.name}</h1>
                        <p className="text-lg opacity-90 mb-2">{restaurant.cuisine_primary} • {restaurant.type}</p>
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            <span className="font-semibold">{restaurant.is_verified ? "Verified" : "Unverified"}</span>
                            <span className="mx-2">•</span>
                            <span>{restaurant.address}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Section */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold mb-8 text-gray-800">Menu</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                            <div className="h-48 overflow-hidden relative">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                {item.is_veg ? (
                                    <span className="absolute top-3 left-3 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">VEG</span>
                                ) : (
                                    <span className="absolute top-3 left-3 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">NON-VEG</span>
                                )}
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                                    <span className="font-bold text-purple-600">₹{item.price}</span>
                                </div>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{item.description}</p>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        addToCart(item);
                                    }}
                                    className="w-full text-purple-600 border-purple-600 hover:bg-purple-50"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Add to Cart
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RestaurantDetails;
