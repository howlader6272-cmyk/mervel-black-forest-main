import { useNavigate } from "react-router-dom";
import { useCart, getCartKey } from "@/contexts/CartContext";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { productImages } from "@/data/productImages";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const CartDrawer = () => {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, subtotal, comboDiscount, comboDiscountAmount } =
    useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        className="bg-secondary border-l border-accent/20 w-full sm:max-w-md flex flex-col"
      >
        <SheetHeader className="border-b border-accent/10 pb-4">
          <SheetTitle className="font-serif text-xl text-foreground flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-accent" />
            Your Cart
          </SheetTitle>
          <SheetDescription className="text-muted-foreground text-sm">
            {items.length === 0
              ? "Your cart is empty"
              : `${items.length} item${items.length > 1 ? "s" : ""} in your cart`}
          </SheetDescription>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {items.map((item) => {
            const key = getCartKey(item);
            const thumbUrl = productImages[item.product.id];
            return (
              <div
                key={key}
                className="flex gap-4 p-3 bg-card/50 border border-accent/10 rounded-sm"
              >
                {/* Product Thumbnail */}
                <div className="w-16 h-20 bg-muted/20 rounded-sm border border-accent/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {thumbUrl ? (
                    <img src={thumbUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-serif text-accent/50 text-sm">M</span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-sm text-foreground truncate">
                    {item.product.name}
                  </h4>
                  <span className="text-accent text-[9px] uppercase tracking-[0.2em] font-sans">
                    Mervel
                  </span>
                  <p className="text-muted-foreground text-[10px] uppercase tracking-wider mt-0.5">
                    {item.variant.volume}
                  </p>
                  <p className="text-accent text-sm font-semibold mt-0.5">
                    BDT {item.variant.price.toLocaleString()}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(key, item.quantity - 1)}
                      className="w-7 h-7 border border-accent/20 rounded-sm flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/40 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-foreground text-sm w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(key, item.quantity + 1)}
                      className="w-7 h-7 border border-accent/20 rounded-sm flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/40 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(key)}
                  className="text-muted-foreground hover:text-destructive transition-colors self-start"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-accent/10 pt-4 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm uppercase tracking-wider">
                Subtotal
              </span>
              <span className={`font-serif text-accent font-semibold ${comboDiscountAmount > 0 ? "text-base line-through text-muted-foreground" : "text-xl"}`}>
                BDT {subtotal.toLocaleString()}
              </span>
            </div>
            {comboDiscountAmount > 0 && comboDiscount && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {comboDiscount.comboName} Combo ({Math.round(comboDiscount.discountPercent * 100)}% Off)
                  </span>
                  <span className="text-emerald-400 text-sm font-semibold">
                    -BDT {comboDiscountAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-muted-foreground text-sm uppercase tracking-wider">
                    Total
                  </span>
                  <span className="font-serif text-xl text-accent font-semibold">
                    BDT {(subtotal - comboDiscountAmount).toLocaleString()}
                  </span>
                </div>
              </>
            )}
          </div>
            <button
              onClick={handleCheckout}
              className="gold-shimmer w-full bg-accent text-accent-foreground py-3.5 text-sm uppercase tracking-[0.2em] font-bold hover:bg-accent/90 transition-all duration-400 rounded-sm"
            >
              Checkout
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;