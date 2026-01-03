// Header.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChefHat, Menu, X } from "lucide-react";
import { CartSheet } from "./CartSheet";
import { InstallPrompt } from "./InstallPrompt";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // ✅ Check auth session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(!!data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-purple-100 shadow-sm animate-slide-down">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">
              MenuPrice
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection("hero")}>Home</button>
            <button onClick={() => scrollToSection("restaurants")}>Restaurants</button>
            <button onClick={() => scrollToSection("about")}>About</button>
            <InstallPrompt />
            <CartSheet />

            {!isAuthenticated ? (
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold"
              >
                Logout
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <InstallPrompt />
            <CartSheet />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-3">
            <button onClick={() => scrollToSection("hero")} className="block w-full text-left">
              Home
            </button>
            <button onClick={() => scrollToSection("restaurants")} className="block w-full text-left">
              Restaurants
            </button>
            <button onClick={() => scrollToSection("about")} className="block w-full text-left">
              About
            </button>

            {!isAuthenticated ? (
              <button
                onClick={() => navigate("/login")}
                className="w-full px-6 py-2 bg-purple-600 text-white rounded-lg"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full px-6 py-2 bg-purple-600 text-white rounded-lg"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};
