import { useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { TreePine, Flame, Flower2, Wind } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Product } from "@/data/products";
import { productImages } from "@/data/productImages";
import { useProducts } from "@/hooks/useProducts";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// Category banner images
import woodyBanner from "@/assets/categories/woody-banner.jpg";
import spicyBanner from "@/assets/categories/spicy-banner.jpg";
import floralBanner from "@/assets/categories/floral-banner.jpg";
import muskBanner from "@/assets/categories/musk-banner.jpg";

interface CategoryData {
  id: string;
  name: string;
  bengaliName: string;
  icon: React.ElementType;
  description: string;
  longDescription: string;
  banner: string;
}

const categories: CategoryData[] = [
  {
    id: "woody",
    name: "Woody",
    bengaliName: "Ancient Timber",
    icon: TreePine,
    description: "Deep, grounding essences of ancient timber, bark, and resins.",
    longDescription:
      "The Woody family draws from the heart of ancient forests — sun-warmed cedar, smoky birch, and sacred oud. These fragrances ground you in nature's timeless embrace, evoking midnight walks beneath towering canopies and the quiet strength of petrified wood.",
    banner: woodyBanner,
  },
  {
    id: "spicy",
    name: "Spicy",
    bengaliName: "Exotic Warmth",
    icon: Flame,
    description: "Bold, warm accords of exotic spices and smoky aromatics.",
    longDescription:
      "The Spicy family ignites the senses with cardamom fire, saffron threads, and sacred frankincense smoke. These compositions are for those who leave a lasting impression — bold, unapologetic, and steeped in the warmth of ancient spice routes.",
    banner: spicyBanner,
  },
  {
    id: "floral",
    name: "Floral",
    bengaliName: "Night Blooms",
    icon: Flower2,
    description: "Elegant bouquets of rare and precious night-blooming flowers.",
    longDescription:
      "The Floral family captures blossoms that reveal their secrets only after dark. Midnight jasmine, black rose, and sacred lotus — these are not delicate florals but powerful, intoxicating bouquets that command presence and evoke deep emotion.",
    banner: floralBanner,
  },
  {
    id: "musk",
    name: "Musk",
    bengaliName: "Skin Scents",
    icon: Wind,
    description: "Intimate, skin-close scents of ethereal musks and soft woods.",
    longDescription:
      "The Musk family is the art of whispered luxury. Ethereal white musk, powdery iris, and addictive tonka bean create fragrances that feel like a second skin — intimate, personal, and magnetically alluring to those who come close.",
    banner: muskBanner,
  },
];

const CategorySection = ({
  category,
  categoryProducts,
  index,
}: {
  category: CategoryData;
  categoryProducts: Product[];
  index: number;
}) => {
  const { ref, isVisible } = useScrollReveal(0.05);
  const Icon = category.icon;

  return (
    <section
      ref={ref}
      id={category.id}
      className={`transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      {/* Hero Banner */}
      <div className="relative rounded-sm overflow-hidden mb-6 sm:mb-8">
        <div className="aspect-[21/9] sm:aspect-[3/1] relative">
          <img
            src={category.banner}
            alt={`${category.name} fragrance family`}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-background/40" />
          <div className="absolute inset-0 flex items-center px-5 sm:px-8 md:px-12">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-2 sm:mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-accent/60 flex items-center justify-center bg-background/40 backdrop-blur-sm">
                  <Icon className="text-accent" size={20} strokeWidth={1.2} />
                </div>
                <span className="text-accent text-xs sm:text-sm font-sans uppercase tracking-[0.2em] font-semibold">
                  {category.bengaliName}
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground tracking-wide mb-2 sm:mb-3 drop-shadow-sm">
                {category.name}
              </h2>
              <p className="text-foreground/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-md line-clamp-3 sm:line-clamp-none">
                {category.longDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {categoryProducts.map((product) => {
          const imageUrl = product.image || productImages[product.id];
          return (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group bg-card/50 border border-accent/10 rounded-sm overflow-hidden hover:border-accent/30 transition-all duration-500 hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="relative aspect-[3/4] bg-muted/20 overflow-hidden">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="font-serif text-accent/30 text-3xl">M</span>
                  </div>
                )}
                {product.badge && (
                  <span className="absolute top-2 right-2 bg-accent text-accent-foreground text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm">
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="p-3 sm:p-4">
                <p className="text-accent text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-sans font-semibold mb-1">
                  Mervel
                </p>
                <h3 className="font-serif text-sm sm:text-base text-foreground group-hover:text-accent transition-colors duration-300 truncate">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-[10px] sm:text-xs mt-1 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
                <div className="mt-2 sm:mt-3 flex items-baseline gap-1.5">
                  <span className="text-foreground font-semibold text-sm">
                    BDT {product.price.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground text-[10px]">from</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {[...product.notes.top, ...product.notes.heart].slice(0, 3).map((note) => (
                    <span
                      key={note}
                      className="text-[9px] sm:text-[10px] text-accent/80 border border-accent/20 px-1.5 py-0.5 rounded-sm"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

const ShopByCategory = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal(0.1);
  const { products, loading } = useProducts();

  // Group products by category
  const groupedProducts = categories.map((cat) => ({
    category: cat,
    products: products.filter((p) => p.category.toLowerCase() === cat.id),
  }));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Perfume Categories | Mervel Perfume</title>
        <meta name="description" content="Explore our perfume collections by category at Mervel Perfume. Woody, Spicy, Floral & Musk luxury fragrances with fast delivery in Bangladesh." />
        <meta property="og:title" content="Perfume Categories | Mervel Perfume" />
        <meta property="og:description" content="Explore our perfume collections by category at Mervel Perfume. Luxury fragrances with fast delivery in Bangladesh." />
      </Helmet>
      <Navbar />

      <main className="flex-1 pt-20 sm:pt-28 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div
            ref={headerRef}
            className={`text-center mb-10 sm:mb-16 transition-all duration-1000 ${
              headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <span className="text-accent text-xs uppercase tracking-[0.4em] font-sans font-semibold">
              Explore by Family
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mt-3 mb-4 tracking-wide">
              Shop by Category
            </h1>
            <div className="w-16 sm:w-20 h-[2px] bg-accent mx-auto mb-4 sm:mb-6" />
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Dive deep into each fragrance family — discover nature's most hidden scents
            </p>

            {/* Quick nav pills */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <a
                    key={cat.id}
                    href={`#${cat.id}`}
                    className="inline-flex items-center gap-2 border border-accent/30 hover:border-accent hover:bg-accent/5 text-foreground hover:text-accent px-4 py-2 rounded-sm text-xs sm:text-sm uppercase tracking-wider transition-all duration-300"
                  >
                    <Icon size={14} strokeWidth={1.5} />
                    {cat.name}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-16 sm:space-y-24">
              {groupedProducts.map(({ category, products: catProducts }, index) => (
                <CategorySection
                  key={category.id}
                  category={category}
                  categoryProducts={catProducts}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShopByCategory;
