import ProductCard from "./ProductCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useProducts } from "@/hooks/useProducts";
import { X } from "lucide-react";

interface CollectionGridProps {
  filterCategory?: string | null;
  filterNote?: string | null;
  onClearFilter?: () => void;
}

const CollectionGrid = ({ filterCategory, filterNote, onClearFilter }: CollectionGridProps) => {
  const { ref, isVisible } = useScrollReveal(0.05);
  const { products, loading } = useProducts();

  // Filter products based on active filter
  const filteredProducts = products.filter((product) => {
    if (filterCategory) {
      return product.category.toLowerCase() === filterCategory.toLowerCase();
    }
    if (filterNote) {
      const allNotes = [
        ...product.notes.top,
        ...product.notes.heart,
        ...product.notes.base,
      ];
      return allNotes.some(
        (n) => n.toLowerCase() === filterNote.toLowerCase()
      );
    }
    return true;
  });

  const activeFilter = filterCategory || filterNote;

  return (
    <section id="collection" className="relative py-12 sm:py-24 md:py-32 bg-secondary overflow-hidden">
      {/* Large outlined MERVEL text overlay — hidden on small screens for performance */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0 hidden sm:flex">
        <h2
          className="font-serif text-[12rem] md:text-[20rem] lg:text-[28rem] font-bold leading-none tracking-tighter whitespace-nowrap"
          style={{
            color: "transparent",
            WebkitTextStroke: "2px hsla(43, 74%, 49%, 0.08)",
          }}
          aria-hidden="true"
        >
          MERVEL
        </h2>
      </div>

      <div className="container mx-auto px-3 sm:px-6 relative z-10" ref={ref}>
        {/* Section Header */}
        <div
          className={`text-center mb-8 sm:mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-accent text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] font-sans font-semibold">
            The Collection
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl text-foreground mt-2 sm:mt-3 mb-3 sm:mb-4">
            Our Fragrances
          </h2>
          <div className="w-16 sm:w-20 h-0.5 bg-accent mx-auto" />
        </div>

        {/* Active Filter Chip */}
        {activeFilter && (
          <div
            className={`flex justify-center mb-6 sm:mb-10 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <button
              onClick={onClearFilter}
              className="group inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full text-foreground text-xs sm:text-sm uppercase tracking-widest font-semibold hover:bg-accent/20 hover:border-accent/50 transition-all duration-300"
            >
              <span>
                {filterCategory ? `Category: ${filterCategory}` : `Note: ${filterNote}`}
              </span>
              <X className="w-3.5 h-3.5 text-accent group-hover:scale-110 transition-transform" />
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Product grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4 md:gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`transition-all duration-700 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 80 + 200}ms` }}
                >
                  <ProductCard product={product} index={index} />
                </div>
              ))}
            </div>

            {/* No results message */}
            {filteredProducts.length === 0 && activeFilter && (
              <div className="text-center py-16">
                <p className="text-muted-foreground font-serif text-lg">
                  No fragrances found for "{activeFilter}"
                </p>
                <button
                  onClick={onClearFilter}
                  className="mt-4 text-accent text-xs uppercase tracking-widest hover:underline transition-all"
                >
                  Show all fragrances
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default CollectionGrid;
