import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Product } from "@/data/products";
import { productImages } from "@/data/productImages";
import { noteDescriptions } from "@/data/noteDescriptions";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/hooks/useProducts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { ArrowLeft, ShoppingBag, ChevronDown, MapPin, Sparkles, Heart } from "lucide-react";
import ImageLightbox from "@/components/ImageLightbox";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const product = products.find((p) => p.id === productId) ?? null;
  const imageUrl = product ? (product.image || productImages[product.id]) : undefined;
  const { addToCart } = useCart();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [expandedNote, setExpandedNote] = useState<string | null>(null);

  // Default to largest variant
  useEffect(() => {
    if (product) {
      setSelectedVariantIdx(product.variants.length - 1);
    }
  }, [product]);

  const selectedVariant = product?.variants[selectedVariantIdx] ?? null;

  const productUrl = `https://mervel-perfume.vercel.app/product/${productId}`;
  const productImageUrl = imageUrl?.startsWith("http") ? imageUrl : `https://mervel-perfume.vercel.app${imageUrl || ""}`;
  const metaDesc = product ? `Buy ${product.name} online from Mervel Perfume in Bangladesh. Premium fragrance, fast delivery, and 100% authentic.` : "";

  const jsonLd = useMemo(() => {
    if (!product || !selectedVariant) return null;
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "image": productImageUrl,
      "description": product.longDescription || product.description,
      "sku": product.id,
      "brand": { "@type": "Brand", "name": "Mervel Perfume" },
      "offers": {
        "@type": "Offer",
        "url": productUrl,
        "priceCurrency": "BDT",
        "price": selectedVariant.price,
        "availability": "https://schema.org/InStock"
      }
    };
  }, [product, selectedVariant, productUrl, productImageUrl]);

  if (loading) {
    return (
      <main className="min-h-screen bg-secondary">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] pt-24">
          <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-secondary">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 pt-24">
          <span className="font-serif text-6xl text-accent/40">M</span>
          <h1 className="font-serif text-2xl text-foreground">Product Not Found</h1>
          <p className="text-muted-foreground text-sm">
            The fragrance you're looking for doesn't exist.
          </p>
          <Link
            to="/#collection"
            className="text-accent text-sm uppercase tracking-widest hover:underline"
          >
            ← Back to Collection
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const activeVariant = product.variants[selectedVariantIdx];

  // Related products: same category, exclude current, max 4
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-secondary">
      {product && (
        <Helmet>
          <title>{product.name} | Mervel Perfume</title>
          <meta name="description" content={metaDesc} />
          <meta property="og:title" content={`${product.name} | Mervel Perfume`} />
          <meta property="og:description" content={metaDesc} />
          <meta property="og:image" content={productImageUrl} />
          <meta property="og:url" content={productUrl} />
          <meta property="og:type" content="product" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`${product.name} | Mervel Perfume`} />
          <meta name="twitter:description" content={metaDesc} />
          <meta name="twitter:image" content={productImageUrl} />
          {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
        </Helmet>
      )}
      <Navbar />
      <CartDrawer />
      <CartDrawer />

      <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-12 sm:pb-16">
        {/* Breadcrumb */}
        <Link
          to="/#collection"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent text-[10px] sm:text-xs uppercase tracking-widest transition-colors mb-6 sm:mb-10"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Back to Collection
        </Link>

        {/* Main two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16">
          {/* Left — Image */}
          <div className="relative bg-card border border-accent/10 rounded-sm overflow-hidden" style={{ aspectRatio: "3/4" }}>
            {imageUrl ? (
              <ImageLightbox src={imageUrl} alt={product.name}>
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </ImageLightbox>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-8xl text-accent/40">M</span>
              </div>
            )}
            {product.badge && (
              <div className="absolute top-4 left-4 z-10 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-sm">
                {product.badge}
              </div>
            )}
          </div>

          {/* Right — Details */}
          <div className="flex flex-col gap-6">
            {/* Name & Price */}
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-1">
                {product.name}
              </h1>
              <span className="text-accent text-[11px] uppercase tracking-[0.25em] font-sans block mb-2">
                by Mervel
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-muted-foreground text-xs uppercase tracking-wider">From</span>
                <span className="font-serif text-2xl text-accent font-semibold">
                  BDT {product.price.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="w-16 h-0.5 bg-accent/30" />

            {/* Long description */}
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              {product.longDescription}
            </p>

            {/* Size selector */}
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-foreground font-semibold mb-3 block">
                Size
              </span>
              <div className="flex gap-2 sm:gap-3 flex-wrap">
                {product.variants.map((v, i) => (
                  <button
                    key={v.volume}
                    onClick={() => setSelectedVariantIdx(i)}
                    className={`px-3 sm:px-5 py-2 sm:py-2.5 border rounded-sm text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
                      i === selectedVariantIdx
                        ? "bg-accent text-accent-foreground border-accent"
                        : "bg-transparent text-foreground border-accent/20 hover:border-accent/50"
                    }`}
                  >
                    {v.volume}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-accent font-serif text-lg font-semibold">
                BDT {selectedVariant.price.toLocaleString()}
              </p>
            </div>

            {/* Fragrance Notes — Expandable */}
            <FragranceNotesSection notes={product.notes} />

            {/* Longevity & Sillage */}
            <div className="flex flex-col gap-3">
              <RatingBar label="Longevity" value={product.longevity} />
              <RatingBar label="Sillage" value={product.sillage} />
            </div>

            {/* Add to Cart */}
            <button
              onClick={() => addToCart(product, selectedVariant)}
              className="gold-shimmer flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold hover:bg-accent/90 transition-all duration-400 rounded-sm mt-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart — {selectedVariant.volume}
            </button>
          </div>
        </div>

        {/* You May Also Like */}
        {related.length > 0 && (
          <section className="mt-24">
            <div className="text-center mb-12">
              <span className="text-accent text-xs uppercase tracking-[0.4em] font-sans font-semibold">
                Discover More
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-foreground mt-2">
                You May Also Like
              </h2>
              <div className="w-16 h-0.5 bg-accent mx-auto mt-3" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
              {related.map((p) => (
                <RelatedCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
};

/* ---- Fragrance Notes Expandable Section ---- */

function FragranceNotesSection({
  notes,
}: {
  notes: { top: string[]; heart: string[]; base: string[] };
}) {
  const [expandedNote, setExpandedNote] = useState<string | null>(null);

  const toggleNote = (note: string) => {
    setExpandedNote((prev) => (prev === note ? null : note));
  };

  return (
    <div>
      <span className="text-xs uppercase tracking-[0.3em] text-foreground font-semibold mb-3 block">
        Fragrance Notes
      </span>
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {(["top", "heart", "base"] as const).map((tier) => (
          <div
            key={tier}
            className="bg-card border border-accent/10 rounded-sm p-2.5 sm:p-4 text-center"
          >
            <span className="text-accent text-[10px] uppercase tracking-widest font-semibold block mb-2">
              {tier}
            </span>
            {notes[tier].map((note) => {
              const info = noteDescriptions[note];
              const isExpanded = expandedNote === note;

              return (
                <div key={note}>
                  <button
                    onClick={() => toggleNote(note)}
                    className={`text-sm font-serif w-full flex items-center justify-center gap-1 transition-colors duration-300 cursor-pointer py-0.5 ${
                      isExpanded
                        ? "text-accent"
                        : "text-foreground hover:text-accent"
                    }`}
                  >
                    {note}
                    {info && (
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Expanded Note Detail */}
      <div
        className={`grid transition-all duration-500 ease-out ${
          expandedNote && noteDescriptions[expandedNote]
            ? "grid-rows-[1fr] opacity-100 mt-3 sm:mt-4"
            : "grid-rows-[0fr] opacity-0 mt-0"
        }`}
      >
        <div className="overflow-hidden">
          {expandedNote && noteDescriptions[expandedNote] && (
            <div className="bg-card border border-accent/20 rounded-sm p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-accent" />
                <h4 className="font-serif text-base sm:text-lg text-foreground">
                  {expandedNote}
                </h4>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {noteDescriptions[expandedNote].character}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-accent uppercase tracking-wider text-[10px] font-semibold block mb-0.5">
                      Origin
                    </span>
                    <span className="text-muted-foreground">
                      {noteDescriptions[expandedNote].origin}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Heart className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-accent uppercase tracking-wider text-[10px] font-semibold block mb-0.5">
                      Pairs Well With
                    </span>
                    <span className="text-muted-foreground">
                      {noteDescriptions[expandedNote].pairsWell}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---- Small sub-components ---- */

function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-xs uppercase tracking-widest text-foreground font-semibold w-24">
        {label}
      </span>
      <div className="flex-1 h-1.5 bg-accent/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-700"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
      <span className="text-muted-foreground text-xs font-semibold">{value}/5</span>
    </div>
  );
}

function RelatedCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const imageUrl = product.image || productImages[product.id];

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="group cursor-pointer bg-card border border-accent/10 rounded-sm overflow-hidden hover:border-accent/40 transition-all duration-500"
    >
      <div className="relative w-full bg-muted/15 overflow-hidden" style={{ aspectRatio: "3/4" }}>
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-4xl text-accent/40">M</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-serif text-sm text-foreground group-hover:text-accent transition-colors line-clamp-1">
          {product.name}
        </h3>
        <span className="text-accent text-[9px] uppercase tracking-[0.2em] font-sans block">
          by Mervel
        </span>
        <span className="font-serif text-accent text-sm font-semibold">
          BDT {product.price.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default ProductDetail;
