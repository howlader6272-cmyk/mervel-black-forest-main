import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductVariant } from "@/data/products";

/**
 * Fetches products from the database and maps them to the frontend Product interface.
 * Falls back to empty array on error.
 */
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch products:", error);
        setLoading(false);
        return;
      }

      const mapped: Product[] = (data || []).map((p: any) => {
        const variants: ProductVariant[] = Array.isArray(p.variants) ? p.variants : [];
        const lowestPrice = variants.length > 0
          ? Math.min(...variants.map((v: ProductVariant) => v.price))
          : 0;

        const notes = p.notes && typeof p.notes === "object"
          ? { top: p.notes.top || [], heart: p.notes.heart || [], base: p.notes.base || [] }
          : { top: [], heart: [], base: [] };

        return {
          id: p.slug,
          dbId: p.id,
          name: p.name,
          price: lowestPrice,
          description: p.description || "",
          longDescription: p.long_description || "",
          category: p.category,
          volume: p.default_volume || "100ml",
          variants,
          notes,
          longevity: p.longevity || 3,
          sillage: p.sillage || 3,
          image: p.image_url || "",
          badge: p.badge || undefined,
        };
      });

      setProducts(mapped);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  return { products, loading };
};
