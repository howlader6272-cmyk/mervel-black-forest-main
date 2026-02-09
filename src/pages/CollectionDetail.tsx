import { useParams, Link } from "react-router-dom";
import { collectionCombos } from "@/data/collections";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import { ArrowLeft, ShoppingBag, Percent } from "lucide-react";
import { toast } from "sonner";

const COMBO_DISCOUNT = 0.1; // 10%

const CollectionDetail = () => {
  const { collectionId } = useParams();
  const { addCombo } = useCart();
  const collection = collectionCombos.find((c) => c.id === collectionId);

  if (!collection) {
    return (
      <main className="min-h-screen bg-secondary">
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="font-serif text-3xl text-foreground mb-4">
            Collection Not Found
          </h1>
          <Link to="/" className="text-accent underline">
            ← Back to Home
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const collectionProducts = collection.productIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  // Calculate combo pricing (using smallest variant / 10ml for combo)
  const totalOriginal = collectionProducts.reduce(
    (sum, p) => sum + p.variants[0].price,
    0
  );
  const discountAmount = Math.round(totalOriginal * COMBO_DISCOUNT);
  const comboPrice = totalOriginal - discountAmount;

  const handleBuyCombo = () => {
    addCombo(
      {
        comboId: collection.id,
        comboName: collection.name,
        discountPercent: COMBO_DISCOUNT,
        productIds: collection.productIds,
      },
      collectionProducts.map((product) => ({
        product,
        variant: product.variants[0],
      }))
    );
    toast.success(`${collection.name} combo added to cart! 10% discount applied`);
  };

  return (
    <main className="min-h-screen bg-secondary">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${collection.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex flex-col justify-end pb-10 sm:pb-16 container mx-auto px-4 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-accent transition-colors text-sm font-sans mb-4 w-fit"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <span className="text-accent text-[10px] sm:text-[11px] uppercase tracking-[0.4em] font-sans font-semibold mb-2">
            {collection.subtitle}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-primary-foreground font-bold">
            {collection.name}
          </h1>
        </div>
      </section>

      {/* Description */}
      <section className="py-12 sm:py-16 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed text-center font-sans">
            {collection.description}
          </p>
        </div>
      </section>

      {/* Combo Buy Section */}
      <section className="pb-10 sm:pb-14 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
          <div className="relative border border-accent/30 rounded-sm bg-primary/5 p-6 sm:p-8 text-center overflow-hidden">
            {/* Discount badge */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-accent text-accent-foreground text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-sm flex items-center gap-1">
              <Percent size={12} />
              10% Off
            </div>

            <h3 className="font-serif text-lg sm:text-2xl text-foreground mb-2">
              Combo Offer
            </h3>
            <p className="text-muted-foreground text-xs sm:text-sm font-sans mb-5">
              Buy all three fragrances together and get a special discount
            </p>

            {/* Product names */}
            <div className="flex flex-wrap justify-center gap-2 mb-5">
              {collectionProducts.map((p) => (
                <span
                  key={p.id}
                  className="text-[11px] sm:text-xs font-sans text-muted-foreground border border-border px-3 py-1 rounded-sm"
                >
                  {p.name}
                </span>
              ))}
            </div>

            {/* Pricing */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6">
               <span className="text-muted-foreground line-through text-sm sm:text-base font-sans">
                BDT {totalOriginal.toLocaleString()}
              </span>
              <span className="text-accent font-serif text-2xl sm:text-3xl font-bold">
                BDT {comboPrice.toLocaleString()}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground font-sans">
                (Save BDT {discountAmount.toLocaleString()})
              </span>
            </div>

            <p className="text-muted-foreground text-[10px] sm:text-xs font-sans mb-5">
              Each in 10ml size · All added to cart together
            </p>

            {/* Buy Combo Button */}
            <button
              onClick={handleBuyCombo}
              className="gold-shimmer inline-flex items-center gap-2 border-2 border-accent bg-accent text-accent-foreground px-8 sm:px-12 py-3 sm:py-3.5 text-[11px] sm:text-[13px] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold hover:bg-transparent hover:text-accent transition-all duration-500 rounded-sm"
            >
              <ShoppingBag size={16} />
              Buy Combo
            </button>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="pb-16 sm:pb-24 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-xl sm:text-2xl text-foreground text-center mb-8 sm:mb-12">
            Fragrances in this <span className="text-accent">Collection</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {collectionProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <CartDrawer />
    </main>
  );
};

export default CollectionDetail;
