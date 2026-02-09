import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Save, Search } from "lucide-react";
import ProductImageUpload from "@/components/admin/ProductImageUpload";
import { productImages } from "@/data/productImages";

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  long_description: string | null;
  category: string;
  default_volume: string | null;
  variants: { volume: string; price: number }[];
  notes: { top: string[]; heart: string[]; base: string[] };
  longevity: number | null;
  sillage: number | null;
  image_url: string | null;
  badge: string | null;
  stock: number;
  is_active: boolean;
  created_at: string;
}

const emptyProduct: Omit<ProductRow, "id" | "created_at"> = {
  slug: "",
  name: "",
  description: "",
  long_description: "",
  category: "woody",
  default_volume: "100ml",
  variants: [{ volume: "10ml", price: 1000 }],
  notes: { top: [], heart: [], base: [] },
  longevity: 3,
  sillage: 3,
  image_url: "",
  badge: "",
  stock: 0,
  is_active: true,
};

const Products = () => {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);

  // Variant helpers
  const [variantVolume, setVariantVolume] = useState("");
  const [variantPrice, setVariantPrice] = useState("");

  // Notes helpers
  const [noteType, setNoteType] = useState<"top" | "heart" | "base">("top");
  const [noteValue, setNoteValue] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load products");
      console.error(error);
    } else {
      setProducts(
        (data || []).map((p: any) => ({
          ...p,
          variants: Array.isArray(p.variants) ? p.variants : [],
          notes: p.notes && typeof p.notes === "object" ? p.notes : { top: [], heart: [], base: [] },
        }))
      );
    }
    setLoading(false);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyProduct);
    setShowForm(true);
  };

  const openEdit = (product: ProductRow) => {
    setEditingId(product.id);
    setForm({
      slug: product.slug,
      name: product.name,
      description: product.description || "",
      long_description: product.long_description || "",
      category: product.category,
      default_volume: product.default_volume || "100ml",
      variants: product.variants,
      notes: product.notes,
      longevity: product.longevity,
      sillage: product.sillage,
      image_url: product.image_url || "",
      badge: product.badge || "",
      stock: product.stock,
      is_active: product.is_active,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.slug) {
      toast.error("Name and Slug are required");
      return;
    }
    setSaving(true);

    const payload = {
      slug: form.slug,
      name: form.name,
      description: form.description || null,
      long_description: form.long_description || null,
      category: form.category,
      default_volume: form.default_volume,
      variants: form.variants as any,
      notes: form.notes as any,
      longevity: form.longevity,
      sillage: form.sillage,
      image_url: form.image_url || null,
      badge: form.badge || null,
      stock: form.stock,
      is_active: form.is_active,
    };

    if (editingId) {
      const { error } = await supabase.from("products").update(payload).eq("id", editingId);
      if (error) {
        toast.error("Update failed: " + error.message);
      } else {
        toast.success("Product updated!");
        setShowForm(false);
        fetchProducts();
      }
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) {
        toast.error("Create failed: " + error.message);
      } else {
        toast.success("Product created!");
        setShowForm(false);
        fetchProducts();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast.error("Delete failed: " + error.message);
    } else {
      toast.success("Product deleted");
      fetchProducts();
    }
  };

  const addVariant = () => {
    if (!variantVolume || !variantPrice) return;
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { volume: variantVolume, price: Number(variantPrice) }],
    }));
    setVariantVolume("");
    setVariantPrice("");
  };

  const removeVariant = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== idx),
    }));
  };

  const addNote = () => {
    if (!noteValue.trim()) return;
    setForm((prev) => ({
      ...prev,
      notes: { ...prev.notes, [noteType]: [...(prev.notes[noteType] || []), noteValue.trim()] },
    }));
    setNoteValue("");
  };

  const removeNote = (type: "top" | "heart" | "base", idx: number) => {
    setForm((prev) => ({
      ...prev,
      notes: { ...prev.notes, [type]: prev.notes[type].filter((_, i) => i !== idx) },
    }));
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-foreground">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">{products.length} products total</p>
        </div>
        <button
          onClick={openCreate}
          className="gold-shimmer flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 text-sm uppercase tracking-wider font-bold rounded-sm hover:bg-accent/90 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-card border border-accent/10 rounded-sm pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Product List */}
      <div className="grid gap-3">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="bg-card border border-accent/10 rounded-sm p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-accent/20 transition-all"
          >
            <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
              {/* Thumbnail */}
              <div className="w-12 h-14 bg-muted/20 rounded-sm border border-accent/10 flex-shrink-0 overflow-hidden">
                {(p.image_url || productImages[p.slug]) ? (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="flex items-center justify-center h-full font-serif text-accent/30 text-xs">
                    No img
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif text-foreground">{p.name}</h3>
                  {p.badge && (
                    <span className="text-[9px] bg-accent/15 text-accent px-2 py-0.5 rounded-sm uppercase tracking-wider font-bold">
                      {p.badge}
                    </span>
                  )}
                  {!p.is_active && (
                    <span className="text-[9px] bg-destructive/15 text-destructive px-2 py-0.5 rounded-sm uppercase tracking-wider">
                      Inactive
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-xs text-muted-foreground capitalize">{p.category}</span>
                  <span className="text-xs text-muted-foreground">Stock: {p.stock}</span>
                  <span className="text-xs text-accent font-semibold">
                    ৳{p.variants[0]?.price?.toLocaleString() || "N/A"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(p)}
                className="p-2 text-muted-foreground hover:text-accent transition-colors bg-muted/30 rounded-sm"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(p.id, p.name)}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors bg-muted/30 rounded-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-accent/15 rounded-sm w-full max-w-2xl my-8 p-5 sm:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-foreground">
                {editingId ? "Edit Product" : "New Product"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-input border border-accent/10 rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Slug *</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. midnight-fern"
                  className="w-full bg-input border border-accent/10 rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Short Description</label>
                <input
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-input border border-accent/10 rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Long Description</label>
                <textarea
                  value={form.long_description || ""}
                  onChange={(e) => setForm({ ...form, long_description: e.target.value })}
                  rows={3}
                  className="w-full bg-input border border-accent/10 rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-input border border-accent/10 rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="woody">Woody</option>
                  <option value="spicy">Spicy</option>
                  <option value="floral">Floral</option>
                  <option value="musk">Musk</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Badge</label>
                <input
                  value={form.badge || ""}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  placeholder="e.g. Best Seller, New, Premium"
                  className="w-full bg-input border border-accent/10 rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Stock</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                  className="w-full bg-input border border-accent/10 rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Active</label>
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 accent-accent"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Longevity (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={form.longevity || 3}
                  onChange={(e) => setForm({ ...form, longevity: Number(e.target.value) })}
                  className="w-full bg-input border border-accent/10 rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Sillage (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={form.sillage || 3}
                  onChange={(e) => setForm({ ...form, sillage: Number(e.target.value) })}
                  className="w-full bg-input border border-accent/10 rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Image Upload */}
            <ProductImageUpload
              imageUrl={form.image_url || ""}
              onImageChange={(url) => setForm({ ...form, image_url: url })}
            />

            {/* Variants */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Variants</label>
              <div className="space-y-2 mb-2">
                {form.variants.map((v, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-foreground">{v.volume}</span>
                    <span className="text-accent">৳{v.price.toLocaleString()}</span>
                    <button onClick={() => removeVariant(i)} className="text-destructive hover:text-destructive/80 ml-auto">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={variantVolume}
                  onChange={(e) => setVariantVolume(e.target.value)}
                  placeholder="Volume (e.g. 10ml)"
                  className="flex-1 bg-input border border-accent/10 rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  type="number"
                  value={variantPrice}
                  onChange={(e) => setVariantPrice(e.target.value)}
                  placeholder="Price"
                  className="w-24 bg-input border border-accent/10 rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  onClick={addVariant}
                  className="px-3 py-2 bg-accent/15 text-accent text-sm rounded-sm hover:bg-accent/25 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Fragrance Notes</label>
              <div className="flex flex-wrap gap-1 mb-2">
                {(["top", "heart", "base"] as const).map((t) =>
                  (form.notes[t] || []).map((n, i) => (
                    <span key={`${t}-${i}`} className="inline-flex items-center gap-1 bg-accent/10 text-accent text-xs px-2 py-1 rounded-sm">
                      <span className="capitalize text-muted-foreground">{t}:</span> {n}
                      <button onClick={() => removeNote(t, i)} className="hover:text-destructive">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <select
                  value={noteType}
                  onChange={(e) => setNoteType(e.target.value as any)}
                  className="bg-input border border-accent/10 rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="top">Top</option>
                  <option value="heart">Heart</option>
                  <option value="base">Base</option>
                </select>
                <input
                  value={noteValue}
                  onChange={(e) => setNoteValue(e.target.value)}
                  placeholder="Note name"
                  className="flex-1 bg-input border border-accent/10 rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  onClick={addNote}
                  className="px-3 py-2 bg-accent/15 text-accent text-sm rounded-sm hover:bg-accent/25 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="gold-shimmer flex items-center gap-2 bg-accent text-accent-foreground px-6 py-2.5 text-sm uppercase tracking-wider font-bold rounded-sm hover:bg-accent/90 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 text-sm text-muted-foreground hover:text-foreground border border-accent/10 rounded-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
