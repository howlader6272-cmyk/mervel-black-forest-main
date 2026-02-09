import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collectionCombos } from "@/data/collections";
import { useProducts } from "@/hooks/useProducts";

// Per-product tag colors matched to bottle liquid colors
const productTagColors: Record<string, { border: string; text: string; bg: string }> = {
  "midnight-fern":  { border: "border-emerald-500/50", text: "text-emerald-300",  bg: "bg-emerald-500/10" },
  "velvet-rose":    { border: "border-red-400/50",     text: "text-red-300",      bg: "bg-red-400/10" },
  "forest-rain":    { border: "border-green-400/50",   text: "text-green-300",    bg: "bg-green-400/10" },
  "oud-mystique":   { border: "border-amber-500/50",   text: "text-amber-300",    bg: "bg-amber-500/10" },
  "gold-resin":     { border: "border-yellow-400/50",  text: "text-yellow-300",   bg: "bg-yellow-400/10" },
  "silk-saffron":   { border: "border-orange-400/50",  text: "text-orange-300",   bg: "bg-orange-400/10" },
};

const defaultTagColor = { border: "border-primary-foreground/30", text: "text-primary-foreground/80", bg: "bg-white/5" };

const CollectionShowcase = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { products } = useProducts();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 bg-primary/95">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section heading */}
        <div
          className={`text-center mb-10 sm:mb-16 transition-all duration-1000 ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-accent text-[10px] sm:text-[11px] uppercase tracking-[0.4em] font-sans font-semibold">
            Curated Sets
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl text-primary-foreground mt-3 sm:mt-4">
            Crafted for the{" "}
            <span className="text-accent italic">Connoisseur</span>
          </h2>
        </div>

        {/* Image grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {collectionCombos.map((combo, idx) => {
            const comboProducts = combo.productIds
              .map((id) => products.find((p) => p.id === id))
              .filter(Boolean);

            return (
              <Link
                key={combo.id}
                to={`/collection/${combo.id}`}
                className={`relative overflow-hidden rounded-sm group transition-all duration-1000 ease-out cursor-pointer block ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${200 + idx * 200}ms` }}
              >
                <img
                  src={combo.image}
                  alt={`Mervel ${combo.name} collection`}
                  className="w-full h-[240px] sm:h-[320px] md:h-[380px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                  <p className="text-accent text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-sans font-semibold mb-1">
                    {combo.subtitle}
                  </p>
                  <p className="text-primary-foreground font-serif text-lg sm:text-xl mb-2.5">
                    {combo.name}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {comboProducts.map((p) => {
                      const colors = productTagColors[p!.id] || defaultTagColor;
                      return (
                        <span
                          key={p!.id}
                          className={`text-[9px] sm:text-[10px] font-sans border backdrop-blur-sm px-2.5 py-0.5 rounded-sm ${colors.border} ${colors.text} ${colors.bg}`}
                        >
                          {p!.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CollectionShowcase;
