import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Sparkles, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";

const PAGE_META: Record<string, { title: string; description: string }> = {
  "shipping-policy": {
    title: "Shipping Policy | MERVEL",
    description: "Learn about MERVEL's shipping policy, delivery times, and packaging for luxury perfumes.",
  },
  returns: {
    title: "Returns & Refunds | MERVEL",
    description: "MERVEL's return and refund policy for luxury perfume purchases.",
  },
  contact: {
    title: "Contact Us | MERVEL",
    description: "Get in touch with MERVEL luxury perfumes. We'd love to hear from you.",
  },
};

const CACHE_PREFIX = "mervel-page-v1-";

const AIContentPage = () => {
  const { pageType } = useParams<{ pageType: string }>();
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const meta = PAGE_META[pageType || ""] || {
    title: "MERVEL",
    description: "MERVEL luxury perfumes.",
  };

  const fetchContent = async (forceRefresh = false) => {
    if (!pageType) return;

    const cacheKey = CACHE_PREFIX + pageType;

    if (!forceRefresh) {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          setContent(cached);
          setIsLoading(false);
          return;
        }
      } catch {}
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("generate-page-content", {
        body: { pageType },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);
      if (!data?.content) throw new Error("No content returned");

      setContent(data.content);
      try {
        localStorage.setItem(cacheKey, data.content);
      } catch {}
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load content");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [pageType]);

  return (
    <main className="min-h-screen bg-secondary">
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
      </Helmet>
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 py-24 sm:py-32 max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-accent animate-pulse" />
            </div>
            <p className="text-muted-foreground text-sm animate-pulse">
              AI generating content...
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-destructive mb-4">{error}</p>
            <Button variant="outline" onClick={() => fetchContent(true)}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        )}

        {content && !isLoading && (
          <div className="relative">
            <div className="absolute -top-2 right-0 flex items-center gap-1.5 text-accent/50 text-[10px] tracking-wider">
              <Sparkles className="w-3 h-3" />
              AI Generated
            </div>
            <article className="prose prose-invert prose-sm sm:prose-base max-w-none prose-headings:font-serif prose-headings:text-accent prose-headings:tracking-wide prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground prose-a:text-accent prose-hr:border-accent/10">
              <ReactMarkdown>{content}</ReactMarkdown>
            </article>
            <div className="mt-10 flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchContent(true)}
                className="text-muted-foreground hover:text-accent text-xs"
              >
                <RefreshCw className="w-3 h-3 mr-1.5" />
                Regenerate Content
              </Button>
            </div>
          </div>
        )}
      </div>

      <Footer />
      <CartDrawer />
    </main>
  );
};

export default AIContentPage;
