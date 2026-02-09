import { products as hardcodedProducts } from "@/data/products";
import { productImages } from "@/data/productImages";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Use product.image (from DB image_url) first, then fall back to hardcoded productImages map
  const imageUrl = product.image || productImages[product.id];

  const smallestVariant = product.variants[0];

  const goToDetail = () => navigate(`/product/${product.id}`);

  return (
    <div
      className="group relative h-full bg-card border border-accent/10 rounded-sm overflow-hidden transition-all duration-500 hover:border-accent/40 hover:shadow-[0_0_30px_-5px_hsla(43,74%,49%,0.15)]"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {product.badge && (
        <div className="absolute top-3 left-3 z-10 bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-sm">
          {product.badge}
        </div>
      )}

      <div
        className="relative w-full bg-muted/15 overflow-hidden cursor-pointer"
        style={{ aspectRatio: "3/4" }}
        onClick={goToDetail}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="font-serif text-4xl text-accent/40">M</span>
              <p className="text-muted-foreground text-[10px] mt-1 tracking-wider uppercase">
                {product.volume}
              </p>
            </div>
          </div>
        )}
        {imageUrl && (
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-card/80 to-transparent pointer-events-none" />
        )}
        <div
          className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-all duration-500 flex items-center justify-center pointer-events-none"
        >
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-accent text-xs uppercase tracking-[0.2em] font-semibold border border-accent/40 px-4 py-2 rounded-sm backdrop-blur-sm">
            View Details
          </span>
        </div>
      </div>

      <div className="p-2.5 sm:p-4 cursor-pointer" onClick={goToDetail}>
        <h3
          className="font-serif text-xs sm:text-sm md:text-base text-foreground mb-0.5 line-clamp-1 hover:text-accent transition-colors"
        >
          {product.name}
        </h3>
        <span className="text-accent text-[8px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-sans block mb-0.5 sm:mb-1">
          by Mervel
        </span>
        <p className="text-muted-foreground text-[10px] sm:text-xs mb-2 sm:mb-3 line-clamp-2 hidden sm:block">{product.description}</p>
        <div className="flex items-center justify-between gap-1">
          <div className="min-w-0">
            <span className="text-foreground text-[8px] sm:text-[10px] uppercase tracking-wider hidden sm:inline">From </span>
            <span className="font-serif text-sm sm:text-lg text-accent font-semibold">BDT {product.price.toLocaleString()}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, smallestVariant);
            }}
            className="gold-shimmer flex items-center gap-1 sm:gap-1.5 bg-accent/10 border border-accent/30 text-accent px-2 sm:px-3 py-1.5 text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold hover:bg-accent hover:text-accent-foreground transition-all duration-400 rounded-sm flex-shrink-0"
          >
            <ShoppingBag className="w-3 h-3" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
