import { useState } from "react";
import { Product, ProductVariant } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { X, ShoppingBag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { productImages } from "@/data/productImages";

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

const RatingBar = ({ value, max = 5, label }: { value: number; max?: number; label: string }) => (
  <div className="flex items-center gap-3">
    <span className="text-muted-foreground text-xs uppercase tracking-wider w-20">{label}</span>
    <div className="flex-1 flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            i < value ? "bg-accent" : "bg-muted/30"
          }`}
        />
      ))}
    </div>
    <span className="text-accent text-xs font-semibold">{value}/{max}</span>
  </div>
);

const ProductDetailModal = ({ product, open, onClose }: ProductDetailModalProps) => {
  const { addToCart } = useCart();
  const imageUrl = product ? productImages[product.id] : undefined;

  // Default to the largest variant (last in array)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number | null>(null);

  if (!product) return null;

  const variants = product.variants;
  // Default to largest variant when modal opens
  const activeIndex = selectedVariantIndex !== null ? selectedVariantIndex : variants.length - 1;
  const activeVariant = variants[activeIndex];

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setSelectedVariantIndex(null);
          onClose();
        }
      }}
    >
      <DialogContent className="bg-secondary border border-accent/20 max-w-3xl p-0 overflow-hidden rounded-sm">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left — Image */}
          <div className="bg-muted/10 flex items-center justify-center min-h-[350px] md:min-h-[500px] relative overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <span className="font-serif text-7xl text-accent/40">M</span>
                <p className="text-muted-foreground text-xs mt-2 tracking-wider uppercase">{product.volume}</p>
              </div>
            )}
            {product.badge && (
              <div className="absolute top-4 left-4 bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-sm z-10">
                {product.badge}
              </div>
            )}
          </div>

          {/* Right — Details */}
          <div className="p-6 md:p-8 flex flex-col">
            <DialogTitle className="font-serif text-2xl md:text-3xl text-foreground mb-0.5">
              {product.name}
            </DialogTitle>
            <span className="text-accent text-[10px] uppercase tracking-[0.25em] font-sans block mb-2">
              by Mervel
            </span>
            <DialogDescription className="text-accent font-serif text-xl font-semibold mb-4">
              BDT {activeVariant.price.toLocaleString()}
            </DialogDescription>

            <p className="text-muted-foreground text-sm leading-relaxed mb-5">
              {product.longDescription}
            </p>

            {/* Size Variant Selector */}
            <div className="mb-6">
              <h4 className="font-serif text-sm text-foreground uppercase tracking-wider mb-3">
                Size
              </h4>
              <div className="flex gap-2">
                {variants.map((variant, idx) => (
                  <button
                    key={variant.volume}
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`flex-1 border rounded-sm py-2.5 px-3 text-center transition-all duration-200 ${
                      idx === activeIndex
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-accent/20 text-muted-foreground hover:border-accent/40 hover:text-foreground"
                    }`}
                  >
                    <span className="block text-sm font-semibold">{variant.volume}</span>
                    <span className="block text-xs mt-0.5">BDT {variant.price.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fragrance Notes */}
            <div className="mb-6 space-y-3">
              <h4 className="font-serif text-sm text-foreground uppercase tracking-wider mb-2">
                Fragrance Notes
              </h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-accent text-xs font-semibold uppercase tracking-wider w-14 mt-0.5">Top</span>
                  <span className="text-muted-foreground text-sm">{product.notes.top.join(", ")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-accent text-xs font-semibold uppercase tracking-wider w-14 mt-0.5">Heart</span>
                  <span className="text-muted-foreground text-sm">{product.notes.heart.join(", ")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-accent text-xs font-semibold uppercase tracking-wider w-14 mt-0.5">Base</span>
                  <span className="text-muted-foreground text-sm">{product.notes.base.join(", ")}</span>
                </div>
              </div>
            </div>

            {/* Longevity & Sillage */}
            <div className="mb-8 space-y-3">
              <RatingBar label="Longevity" value={product.longevity} />
              <RatingBar label="Sillage" value={product.sillage} />
            </div>

            {/* Add to Cart */}
            <button
              onClick={() => {
                addToCart(product, activeVariant);
                onClose();
              }}
              className="gold-shimmer w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground py-3.5 text-sm uppercase tracking-[0.2em] font-bold hover:bg-accent/90 transition-all duration-400 rounded-sm mt-auto"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart — {activeVariant.volume} · BDT {activeVariant.price.toLocaleString()}
            </button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;