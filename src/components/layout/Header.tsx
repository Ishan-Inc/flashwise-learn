
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Lightbulb, Moon, Plus } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", authRequired: true },
    { name: "Study", path: "/study", authRequired: true },
    { name: "About", path: "/about", authRequired: false },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ${
        isScrolled
          ? "glass shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 text-foreground"
        >
          <Lightbulb className="h-7 w-7 text-primary" />
          <span className="font-semibold text-lg tracking-tight">FlashWise</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => 
            (!link.authRequired || (link.authRequired && user)) ? (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.path ? "text-primary" : "text-foreground/80"
                }`}
              >
                {link.name}
              </Link>
            ) : null
          )}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          
          {user ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={logout}
              >
                Logout
              </Button>
              <Link to="/create">
                <Button size="sm" className="rounded-full">
                  <Plus className="h-4 w-4 mr-1" />
                  Create Card
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm" className="rounded-full">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="rounded-full">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass shadow-md animate-fade-in p-4">
          <nav className="flex flex-col space-y-4 py-4">
            {navLinks.map((link) => 
              (!link.authRequired || (link.authRequired && user)) ? (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-4 py-2 text-foreground/80 hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ) : null
            )}
            <div className="pt-4 border-t border-border mt-2">
              {user ? (
                <>
                  <Link
                    to="/create"
                    className="px-4 py-2 w-full inline-flex items-center justify-center text-primary"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Create Card
                  </Link>
                  <Button
                    variant="outline"
                    className="mt-2 w-full"
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" className="mb-2 w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
