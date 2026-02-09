import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import OlfactoryNotes from "@/components/OlfactoryNotes";
import CollectionShowcase from "@/components/CollectionShowcase";
import CollectionGrid from "@/components/CollectionGrid";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterNote, setFilterNote] = useState<string | null>(null);

  // Read filters from URL on mount / param change
  useEffect(() => {
    const cat = searchParams.get("category");
    const note = searchParams.get("note");
    setFilterCategory(cat);
    setFilterNote(note);

    // Auto-scroll to collection when a filter is active from URL
    if (cat || note) {
      setTimeout(() => {
        const el = document.getElementById("collection");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  }, [searchParams]);

  const handleCategoryClick = useCallback(
    (category: string) => {
      setFilterCategory(category);
      setFilterNote(null);
      setSearchParams({ category });
    },
    [setSearchParams]
  );

  const handleClearFilter = useCallback(() => {
    setFilterCategory(null);
    setFilterNote(null);
    setSearchParams({});
  }, [setSearchParams]);

  return (
    <main className="min-h-screen bg-secondary">
      <Navbar />
      <HeroSection />
      <OlfactoryNotes onCategoryClick={handleCategoryClick} />
      <CollectionShowcase />
      <CollectionGrid
        filterCategory={filterCategory}
        filterNote={filterNote}
        onClearFilter={handleClearFilter}
      />
      <AboutSection />
      <Footer />
      <CartDrawer />
    </main>
  );
};

export default Index;
