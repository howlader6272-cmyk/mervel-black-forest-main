import { ShoppingBag, Search, Menu, X, Shield } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const { totalItems, toggleCart } = useCart();
  const { user, isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (hash: string) => {
    setMobileOpen(false);
    if (location.pathname !== "/") {
      navigate("/" + hash);
    } else {
      const el = document.querySelector(hash);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks: { label: string; hash?: string; href?: string }[] = [
    { label: "Shop", hash: "#collection" },
    { label: "Categories", href: "/categories" },
    { label: "Blog", href: "/blog" },
    { label: "Track Order", href: "/track-order" },
    { label: "About", hash: "#about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-secondary/90 backdrop-blur-md border-b border-accent/20 shadow-lg shadow-accent/5"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Logo */}
        <Link to="/" className="font-serif text-xl sm:text-2xl md:text-3xl font-bold tracking-wider text-accent">
          MERVEL
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              {link.href ? (
                <Link
                  to={link.href}
                  className="text-sm uppercase tracking-widest text-foreground hover:text-accent transition-colors duration-300 px-4 py-1.5 border border-accent/10 hover:border-accent/30 bg-accent/5 hover:bg-accent/10"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  onClick={() => scrollToSection(link.hash!)}
                  className="text-sm uppercase tracking-widest text-foreground hover:text-accent transition-colors duration-300 px-4 py-1.5 border border-accent/10 hover:border-accent/30 bg-accent/5 hover:bg-accent/10"
                >
                  {link.label}
                </button>
              )}
            </li>
          ))}
          {isAdmin && (
            <li>
              <Link
                to="/admin"
                className="text-sm uppercase tracking-widest text-accent hover:text-accent/80 transition-colors duration-300 flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </Link>
            </li>
          )}
        </ul>

        {/* Right — Search, Cart, Auth, Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            className="p-2 text-foreground hover:text-accent transition-colors duration-300"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={toggleCart}
            className="relative p-2 text-foreground hover:text-accent transition-colors duration-300"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {!user && (
            <Link
              to="/auth"
              className="hidden md:inline-flex text-xs uppercase tracking-widest text-foreground hover:text-accent transition-colors px-3 py-1.5 border border-accent/20 rounded-sm"
            >
              Login
            </Link>
          )}

          <button
            className="md:hidden p-2 text-foreground hover:text-accent transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-secondary/95 backdrop-blur-md border-t border-accent/10">
          <ul className="flex flex-col items-center gap-6 py-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.href ? (
                  <Link
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm uppercase tracking-widest text-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => scrollToSection(link.hash!)}
                    className="text-sm uppercase tracking-widest text-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                  </button>
                )}
              </li>
            ))}
            {isAdmin && (
              <li>
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm uppercase tracking-widest text-accent flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </Link>
              </li>
            )}
            {!user && (
              <li>
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm uppercase tracking-widest text-foreground hover:text-accent transition-colors"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
