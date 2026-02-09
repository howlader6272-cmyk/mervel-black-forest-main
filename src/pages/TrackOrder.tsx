import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrderTrackCard from "@/components/OrderTrackCard";
import { Search, XCircle, ArrowLeft, Loader2 } from "lucide-react";

interface TrackedOrder {
  id: string;
  short_id: string;
  customer_name: string;
  items: { product_id?: string; name: string; volume: string; quantity: number; image: string | null }[];
  subtotal: number;
  discount: number;
  total: number;
  status: string;
  shipping_address: string | null;
  created_at: string;
}

const TrackOrder = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<TrackedOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || query.trim().length < 4) {
      setError("কমপক্ষে ৪ অক্ষর দিন");
      return;
    }

    setLoading(true);
    setError(null);
    setOrders([]);
    setSelectedOrder(null);
    setSearched(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("track-order", {
        body: { query: query.trim() },
      });

      if (fnError) {
        setError("Order খুঁজে পাওয়া যায়নি। আবার চেষ্টা করুন।");
      } else if (data?.error) {
        setError(data.error);
      } else if (data?.orders && data.orders.length > 0) {
        setOrders(data.orders);
        // If only one order, auto-select it
        if (data.orders.length === 1) {
          setSelectedOrder(data.orders[0]);
        }
      } else if (data?.order) {
        // Backward compat
        setOrders([data.order]);
        setSelectedOrder(data.order);
      }
    } catch {
      setError("কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-xl mx-auto">
          {/* Back */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors text-xs uppercase tracking-wider mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Shop
          </Link>

          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-5">
              <Search className="w-7 h-7 text-accent" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-foreground tracking-wide">
              Track Your Order
            </h1>
            <p className="text-muted-foreground text-sm mt-2 max-w-sm mx-auto">
              Order ID অথবা Phone Number দিয়ে আপনার order track করুন
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleTrack} className="mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Order ID বা Phone Number"
                maxLength={50}
                className="flex-1 bg-input border border-accent/10 rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="gold-shimmer bg-accent text-accent-foreground px-6 py-3 text-sm uppercase tracking-widest font-bold hover:bg-accent/90 transition-all rounded-sm disabled:opacity-60 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Track
              </button>
            </div>
          </form>

          {/* Error */}
          {error && searched && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-sm p-4 text-center mb-6 animate-fade-in">
              <XCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {/* Multiple Orders List */}
          {orders.length > 1 && !selectedOrder && (
            <div className="animate-fade-in space-y-3">
              <p className="text-muted-foreground text-sm text-center mb-4">
                {orders.length}টি order পাওয়া গেছে। যেকোনো একটিতে ক্লিক করুন।
              </p>
              {orders.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setSelectedOrder(o)}
                  className="w-full text-left bg-card/50 border border-accent/10 hover:border-accent/30 rounded-sm p-4 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* First item thumbnail */}
                      <div className="w-10 h-12 bg-muted/20 rounded-sm border border-accent/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {o.items[0]?.image ? (
                          <img src={o.items[0].image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-serif text-accent/40 text-[10px]">M</span>
                        )}
                      </div>
                      <div>
                        <p className="font-serif text-sm text-accent font-semibold group-hover:text-accent/80">
                          #{o.short_id}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {o.items.map((it) => it.name).join(", ")}
                        </p>
                        <p className="text-muted-foreground text-[10px] mt-0.5">
                          {new Date(o.created_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-serif text-accent font-semibold text-sm">৳{o.total.toLocaleString()}</p>
                      <span className={`text-[10px] uppercase tracking-wider font-semibold ${
                        o.status === "delivered" ? "text-emerald-400" :
                        o.status === "cancelled" ? "text-destructive" :
                        o.status === "shipped" ? "text-purple-400" :
                        "text-amber-400"
                      }`}>
                        {o.status}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Selected Order Detail */}
          {selectedOrder && (
            <div className="animate-fade-in">
              {orders.length > 1 && (
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors text-xs uppercase tracking-wider mb-4"
                >
                  <ArrowLeft className="w-3 h-3" />
                  সব orders দেখুন
                </button>
              )}
              <OrderTrackCard order={selectedOrder} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TrackOrder;
