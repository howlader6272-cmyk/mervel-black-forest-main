import { useLocation, Link } from "react-router-dom";
import { CheckCircle2, Copy, Search } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { productImages } from "@/data/productImages";

interface OrderItem {
  product: { id: string; name: string };
  variant: { volume: string; price: number };
  quantity: number;
}

interface OrderState {
  orderId: string | null;
  items: OrderItem[];
  total: number;
  subtotal: number;
  comboDiscount: { comboName: string; discountPercent: number } | null;
  comboDiscountAmount: number;
  shippingCost: number;
}

const ThankYou = () => {
  const location = useLocation();
  const orderData = location.state as OrderState | null;

  const copyOrderId = () => {
    if (orderData?.orderId) {
      navigator.clipboard.writeText(orderData.orderId);
      toast.success("Order ID copied!");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center animate-fade-in">
          {/* Animated Checkmark */}
          <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-6 sm:mb-8">
            <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping" style={{ animationDuration: "1.5s", animationIterationCount: "2" }} />
            <div className="relative flex items-center justify-center w-full h-full rounded-full bg-accent/10 border-2 border-accent">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-accent" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground tracking-wide mb-3">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto mb-4">
            Thank you for shopping with Mervel. Your order is being processed and will be delivered soon.
          </p>

          {/* Order ID */}
          {orderData?.orderId && (
            <div className="bg-card/50 border border-accent/10 rounded-sm p-4 mb-8 inline-block">
              <p className="text-muted-foreground text-[10px] uppercase tracking-widest mb-1">Your Order ID</p>
              <div className="flex items-center gap-2 justify-center">
                <code className="font-mono text-accent text-sm sm:text-base font-semibold">
                  {orderData.orderId.slice(0, 8).toUpperCase()}
                </code>
                <button
                  onClick={copyOrderId}
                  className="p-1.5 text-muted-foreground hover:text-accent transition-colors"
                  title="Copy full Order ID"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-muted-foreground text-[10px] mt-2">
                এই ID দিয়ে আপনার order track করতে পারবেন
              </p>
            </div>
          )}

          {/* Order Summary */}
          {orderData && orderData.items.length > 0 && (
            <div className="bg-card/50 border border-accent/10 rounded-sm p-5 sm:p-8 text-left space-y-5 mb-8 sm:mb-10">
              <h2 className="font-serif text-lg sm:text-xl text-foreground text-center">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {orderData.items.map((item, i) => {
                  const thumbUrl = productImages[item.product.id];
                  return (
                    <div
                      key={i}
                      className="flex justify-between items-center gap-3 pb-3 border-b border-accent/10 last:border-0 last:pb-0"
                    >
                      <div className="w-10 h-12 bg-muted/20 rounded-sm border border-accent/10 flex-shrink-0 overflow-hidden">
                        {thumbUrl ? (
                          <img src={thumbUrl} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="flex items-center justify-center h-full font-serif text-accent/40 text-xs">M</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-serif text-sm text-foreground truncate">
                          {item.product.name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {item.variant.volume} · Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-foreground text-sm font-semibold whitespace-nowrap">
                        BDT {(item.variant.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="border-t border-accent/10 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">BDT {orderData.subtotal.toLocaleString()}</span>
                </div>

                {orderData.comboDiscountAmount > 0 && orderData.comboDiscount && (
                  <div className="flex justify-between">
                    <span className="text-emerald-400">
                      {orderData.comboDiscount.comboName} ({Math.round(orderData.comboDiscount.discountPercent * 100)}% Off)
                    </span>
                    <span className="text-emerald-400 font-semibold">
                      -BDT {orderData.comboDiscountAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {orderData.shippingCost === 0 ? (
                      <span className="text-accent">Free</span>
                    ) : (
                      `BDT ${orderData.shippingCost.toLocaleString()}`
                    )}
                  </span>
                </div>

                <div className="border-t border-accent/10 pt-3 flex justify-between items-center">
                  <span className="uppercase tracking-wider text-muted-foreground text-xs">Total</span>
                  <span className="font-serif text-xl sm:text-2xl text-accent font-semibold">
                    BDT {orderData.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/track-order"
              className="inline-flex items-center gap-2 border border-accent/20 text-foreground hover:text-accent px-8 py-3 text-sm uppercase tracking-[0.15em] font-semibold transition-all rounded-sm"
            >
              <Search className="w-4 h-4" />
              Track Order
            </Link>
            <Link
              to="/"
              className="gold-shimmer inline-flex items-center gap-2 bg-accent text-accent-foreground px-10 py-3.5 text-sm uppercase tracking-[0.2em] font-bold hover:bg-accent/90 transition-all rounded-sm"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ThankYou;
