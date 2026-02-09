import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

interface ProductImageUploadProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
}

const ProductImageUpload = ({ imageUrl, onImageChange }: ProductImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(imageUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("শুধুমাত্র JPG, PNG, WebP ফরম্যাট সাপোর্টেড");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ইমেজ সাইজ ৫MB এর কম হতে হবে");
      return;
    }

    setUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      setPreview(publicUrl);
      onImageChange(publicUrl);
      toast.success("ইমেজ আপলোড সফল!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("আপলোড ব্যর্থ: " + (error.message || "Unknown error"));
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setPreview("");
    onImageChange("");
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs uppercase tracking-wider text-muted-foreground">
        Product Image
      </label>

      {preview ? (
        <div className="relative group w-full aspect-square max-w-[200px] rounded-sm overflow-hidden border border-accent/10 bg-muted/20">
          <img
            src={preview}
            alt="Product preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="p-2 bg-accent/80 text-accent-foreground rounded-sm hover:bg-accent transition-colors"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={uploading}
              className="p-2 bg-destructive/80 text-destructive-foreground rounded-sm hover:bg-destructive transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full max-w-[200px] aspect-square rounded-sm border-2 border-dashed border-accent/20 hover:border-accent/40 bg-muted/10 flex flex-col items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          ) : (
            <>
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                ইমেজ আপলোড করুন
              </span>
              <span className="text-[10px] text-muted-foreground/60">
                JPG, PNG, WebP • Max 5MB
              </span>
            </>
          )}
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Manual URL input as fallback */}
      <input
        value={preview}
        onChange={(e) => {
          setPreview(e.target.value);
          onImageChange(e.target.value);
        }}
        placeholder="অথবা ইমেজ URL পেস্ট করুন"
        className="w-full bg-input border border-accent/10 rounded-sm px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
};

export default ProductImageUpload;
