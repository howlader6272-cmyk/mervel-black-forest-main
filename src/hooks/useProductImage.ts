import { useState, useEffect, useRef, useCallback } from "react";
import { Product } from "@/data/products";
import { generateImagePrompt } from "@/lib/imagePrompts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Track if we already showed a payment/rate limit toast to avoid spamming
let paymentToastShown = false;
let rateLimitToastShown = false;

// Bump version to force regeneration when prompts change
const CACHE_PREFIX = "mervel-img-v4-";
const MAX_CONCURRENT = 4;

let activeRequests = 0;
const pendingQueue: Array<() => void> = [];

function enqueue(): Promise<void> {
  if (activeRequests < MAX_CONCURRENT) {
    activeRequests++;
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    pendingQueue.push(() => {
      activeRequests++;
      resolve();
    });
  });
}

function dequeue() {
  activeRequests--;
  if (pendingQueue.length > 0) {
    const next = pendingQueue.shift();
    next?.();
  }
}

function getCached(productId: string): string | null {
  try {
    return localStorage.getItem(CACHE_PREFIX + productId);
  } catch {
    return null;
  }
}

function setCache(productId: string, dataUrl: string) {
  try {
    localStorage.setItem(CACHE_PREFIX + productId, dataUrl);
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

async function generateImage(product: Product): Promise<string> {
  const prompt = generateImagePrompt(product);

  const { data, error } = await supabase.functions.invoke("generate-image", {
    body: { prompt },
  });

  if (error) {
    // Check if the error message contains payment/rate limit info
    const msg = error.message || "";
    if (msg.includes("402") || msg.toLowerCase().includes("payment")) {
      throw new Error("PAYMENT_REQUIRED");
    }
    if (msg.includes("429") || msg.toLowerCase().includes("rate limit")) {
      throw new Error("RATE_LIMITED");
    }
    throw new Error(`Image generation failed: ${msg}`);
  }

  if (!data?.imageUrl) {
    const serverError = data?.error || "";
    if (serverError.toLowerCase().includes("payment")) {
      throw new Error("PAYMENT_REQUIRED");
    }
    if (serverError.toLowerCase().includes("rate limit")) {
      throw new Error("RATE_LIMITED");
    }
    throw new Error(serverError || "No image returned from API");
  }

  return data.imageUrl;
}

export function useProductImage(product: Product | null, shouldLoad: boolean = true) {
  const [imageUrl, setImageUrl] = useState<string | null>(() =>
    product ? getCached(product.id) : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const attemptedRef = useRef(false);

  const generate = useCallback(async () => {
    if (!product || attemptedRef.current || imageUrl) return;
    attemptedRef.current = true;
    setIsLoading(true);

    try {
      await enqueue();
      // Re-check cache in case another component generated it
      const cached = getCached(product.id);
      if (cached) {
        setImageUrl(cached);
        setIsLoading(false);
        dequeue();
        return;
      }

      const url = await generateImage(product);
      setCache(product.id, url);
      setImageUrl(url);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg === "PAYMENT_REQUIRED" && !paymentToastShown) {
        paymentToastShown = true;
        toast.error("AI credits exhausted. Please add credits to generate product images.", { duration: 10000 });
      } else if (msg === "RATE_LIMITED" && !rateLimitToastShown) {
        rateLimitToastShown = true;
        toast.error("Rate limit reached. Images will generate shortly.", { duration: 5000 });
      }
      console.error(`Failed to generate image for ${product.name}:`, msg);
      setHasError(true);
    } finally {
      setIsLoading(false);
      dequeue();
    }
  }, [product, imageUrl]);

  useEffect(() => {
    if (shouldLoad && !imageUrl && !attemptedRef.current) {
      generate();
    }
  }, [shouldLoad, generate, imageUrl]);

  return { imageUrl, isLoading, hasError };
}

/**
 * Hook that triggers loading only when the element is visible in viewport.
 */
export function useLazyProductImage(product: Product) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { imageUrl, isLoading, hasError } = useProductImage(product, isVisible);

  return { containerRef, imageUrl, isLoading, hasError };
}

/**
 * Hook that eagerly pre-generates images for all products on mount.
 * Respects the concurrency queue (max 4 at a time).
 * Cached images are skipped.
 */
export function usePreloadAllImages(productList: Product[]) {
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (attemptedRef.current) return;
    attemptedRef.current = true;

    for (const product of productList) {
      if (getCached(product.id)) continue;

      (async () => {
        await enqueue();
        try {
          // Re-check cache in case another request completed it
          const cached = getCached(product.id);
          if (cached) {
            dequeue();
            return;
          }
          const url = await generateImage(product);
          setCache(product.id, url);
        } catch (err) {
          console.error(`Preload failed for ${product.name}:`, err);
        } finally {
          dequeue();
        }
      })();
    }
  }, [productList]);
}
