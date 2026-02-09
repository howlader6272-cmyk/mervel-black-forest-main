import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart, getCartKey } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Package, Truck, Banknote } from "lucide-react";
import { productImages } from "@/data/productImages";

const SHIPPING_FEE = 120;
const FREE_SHIPPING_THRESHOLD = 8000;

const Checkout = () => {
  const { items, subtotal, clearCart, comboDiscount, comboDiscountAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  const adjustedSubtotal = subtotal - comboDiscountAmount;
  const shippingCost = adjustedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = adjustedSubtotal + shippingCost;

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        name: item.product.name,
        volume: item.variant.volume,
        price: item.variant.price,
        quantity: item.quantity,
      }));

      const shippingAddress = `${formData.address}, ${formData.city} ${formData.postalCode}`;

      // Generate order ID client-side to avoid needing SELECT permission after INSERT
      const orderId = crypto.randomUUID();

      const { error } = await supabase.from("orders").insert({
        id: orderId,
        user_id: user?.id || null,
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: shippingAddress,
        notes: formData.notes || null,
        items: orderItems as any,
        subtotal: subtotal,
        discount: comboDiscountAmount,
        total: total,
        status: "pending",
      });

      if (error) {
        console.error("Order insert error:", error);
        toast.error("Order place করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        setIsSubmitting(false);
        return;
      }

      const orderState = {
        orderId: orderId,
        items: [...items],
        total,
        subtotal,
        comboDiscount,
        comboDiscountAmount,
        shippingCost,
      };

      clearCart();
      toast.success("Order সফলভাবে place হয়েছে!");
      navigate("/thank-you", { state: orderState });
    } catch (err) {
      console.error("Order error:", err);
      toast.error("কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      setIsSubmitting(false);
    }
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-6">
            <Package className="w-16 h-16 text-accent mx-auto" />
            <h1 className="font-serif text-3xl text-foreground">Your Cart is Empty</h1>
            <p className="text-muted-foreground max-w-md">
              Looks like you haven't added any fragrances yet. Explore our collection and find your signature scent.
            </p>
            <Link
              to="/"
              className="gold-shimmer inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3 text-sm uppercase tracking-[0.2em] font-bold hover:bg-accent/90 transition-all rounded-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Shop
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 sm:pt-28 pb-10 sm:pb-16 px-3 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-6 sm:mb-12">
            <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl text-foreground tracking-wide">
              CHECKOUT
            </h1>
            <div className="w-16 sm:w-20 h-[2px] bg-accent mx-auto mt-3 sm:mt-4" />
          </div>

          {/* Back to Shop */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors text-xs sm:text-sm uppercase tracking-wider mb-5 sm:mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Continue Shopping
          </Link>

          <form onSubmit={handlePlaceOrder}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-8 lg:gap-12">
              {/* Left Column — Shipping Form */}
              <div className="lg:col-span-3 space-y-8">
                {/* Shipping Information */}
                <section className="bg-card/50 border border-accent/10 rounded-sm p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                  <h2 className="font-serif text-xl text-foreground flex items-center gap-3">
                    <Truck className="w-5 h-5 text-accent" />
                    Shipping Information
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={100}
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => updateField("fullName", e.target.value)}
                        className="w-full bg-input border border-accent/10 rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        maxLength={255}
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="w-full bg-input border border-accent/10 rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={20}
                        placeholder="+880 1XXX-XXXXXX"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className="w-full bg-input border border-accent/10 rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={200}
                        placeholder="House, Road, Area"
                        value={formData.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        className="w-full bg-input border border-accent/10 rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={100}
                        placeholder="Dhaka"
                        value={formData.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        className="w-full bg-input border border-accent/10 rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={10}
                        placeholder="1200"
                        value={formData.postalCode}
                        onChange={(e) => updateField("postalCode", e.target.value)}
                        className="w-full bg-input border border-accent/10 rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        maxLength={500}
                        placeholder="Any special instructions..."
                        rows={2}
                        value={formData.notes}
                        onChange={(e) => updateField("notes", e.target.value)}
                        className="w-full bg-input border border-accent/10 rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm resize-none"
                      />
                    </div>
                  </div>
                </section>

                {/* Payment Method */}
                <section className="bg-card/50 border border-accent/10 rounded-sm p-4 sm:p-6 md:p-8 space-y-4">
                  <h2 className="font-serif text-xl text-foreground flex items-center gap-3">
                    <Banknote className="w-5 h-5 text-accent" />
                    Payment Method
                  </h2>

                  <div className="border-2 border-accent/30 bg-accent/5 rounded-sm p-4 flex items-center gap-4 cursor-default">
                    <div className="w-5 h-5 rounded-full border-2 border-accent flex items-center justify-center flex-shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                    </div>
                    <div>
                      <p className="text-foreground font-semibold text-sm">Cash on Delivery</p>
                      <p className="text-muted-foreground text-xs mt-0.5">
                        Pay when your order arrives at your doorstep
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column — Order Summary */}
              <div className="lg:col-span-2">
                <div className="bg-card/50 border border-accent/10 rounded-sm p-4 sm:p-6 md:p-8 sticky top-20 sm:top-28 space-y-4 sm:space-y-6">
                  <h2 className="font-serif text-xl text-foreground">
                    Order Summary
                  </h2>

                  {/* Item list */}
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {items.map((item) => {
                      const thumbUrl = productImages[item.product.id];
                      return (
                        <div
                          key={getCartKey(item)}
                          className="flex justify-between items-start gap-3 pb-4 border-b border-accent/10 last:border-0 last:pb-0"
                        >
                          {/* Thumbnail */}
                          <div className="w-12 h-14 bg-muted/20 rounded-sm border border-accent/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {thumbUrl ? (
                              <img src={thumbUrl} alt={item.product.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="font-serif text-accent/40 text-xs">M</span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-serif text-sm text-foreground truncate">
                              {item.product.name}
                            </p>
                            <span className="text-accent text-[9px] uppercase tracking-[0.15em] font-sans">
                              Mervel
                            </span>
                            <p className="text-muted-foreground text-xs mt-0.5">
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
                  <div className="border-t border-accent/10 pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">BDT {subtotal.toLocaleString()}</span>
                    </div>
                    {comboDiscountAmount > 0 && comboDiscount && (
                      <div className="flex justify-between text-sm">
                        <span className="text-emerald-400 flex items-center gap-1.5">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {comboDiscount.comboName} Combo ({Math.round(comboDiscount.discountPercent * 100)}% Off)
                        </span>
                        <span className="text-emerald-400 font-semibold">
                          -BDT {comboDiscountAmount.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-foreground">
                        {shippingCost === 0 ? (
                          <span className="text-accent">Free</span>
                        ) : (
                          `BDT ${shippingCost.toLocaleString()}`
                        )}
                      </span>
                    </div>
                    {shippingCost > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Free shipping on orders over BDT {FREE_SHIPPING_THRESHOLD.toLocaleString()}
                      </p>
                    )}
                    <div className="border-t border-accent/10 pt-4 flex justify-between items-center">
                      <span className="text-sm uppercase tracking-wider text-muted-foreground">
                        Total
                      </span>
                      <span className="font-serif text-2xl text-accent font-semibold">
                        BDT {total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="gold-shimmer w-full bg-accent text-accent-foreground py-4 text-sm uppercase tracking-[0.2em] font-bold hover:bg-accent/90 transition-all duration-400 rounded-sm disabled:opacity-60 disabled:pointer-events-none"
                  >
                    {isSubmitting ? "Processing..." : "Place Order"}
                  </button>

                  <Link
                    to="/"
                    className="block text-center text-muted-foreground hover:text-accent transition-colors text-xs uppercase tracking-wider"
                  >
                    ← Back to Shop
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
