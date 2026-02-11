import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "./components/ScrollToTop";

// Lazy-loaded pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const Checkout = lazy(() => import("./pages/Checkout"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const CollectionDetail = lazy(() => import("./pages/CollectionDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const ShopByCategory = lazy(() => import("./pages/ShopByCategory"));
const Auth = lazy(() => import("./pages/Auth"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const AIContentPage = lazy(() => import("./pages/AIContentPage"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Products = lazy(() => import("./pages/admin/Products"));
const Orders = lazy(() => import("./pages/admin/Orders"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/categories" element={<ShopByCategory />} />
                  <Route path="/" element={<Index />} />
                  <Route path="/product/:productId" element={<ProductDetail />} />
                  <Route path="/collection/:collectionId" element={<CollectionDetail />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/thank-you" element={<ThankYou />} />
                  <Route path="/track-order" element={<TrackOrder />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/page/:pageType" element={<AIContentPage />} />
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="analytics" element={<Analytics />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
