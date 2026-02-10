import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, User } from "lucide-react";

interface BlogPostFull {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string[] | null;
  author: string;
  published_at: string | null;
}

/** Very simple markdown-to-HTML (headings, bold, italic, links, lists, tables, hr) */
function renderMarkdown(md: string): string {
  return md
    .split("\n\n")
    .map((block) => {
      // Headings
      if (block.startsWith("### ")) return `<h3 class="font-serif text-lg sm:text-xl text-foreground mt-8 mb-3">${inline(block.slice(4))}</h3>`;
      if (block.startsWith("## ")) return `<h2 class="font-serif text-xl sm:text-2xl text-foreground mt-10 mb-4">${inline(block.slice(3))}</h2>`;
      if (block.startsWith("# ")) return `<h1 class="font-serif text-2xl sm:text-3xl text-foreground mt-10 mb-4">${inline(block.slice(2))}</h1>`;
      if (block.startsWith("---")) return `<hr class="border-accent/20 my-8" />`;

      // Table
      if (block.includes("|") && block.includes("---")) {
        const rows = block.split("\n").filter((r) => r.trim() && !r.match(/^\|[\s-|]+\|$/));
        const cells = rows.map((r) => r.split("|").filter(Boolean).map((c) => c.trim()));
        if (cells.length > 1) {
          const header = cells[0].map((c) => `<th class="text-left text-accent text-xs uppercase tracking-wider px-3 py-2 border-b border-accent/20">${c}</th>`).join("");
          const body = cells.slice(1).map((row) => `<tr>${row.map((c) => `<td class="text-muted-foreground text-sm px-3 py-2 border-b border-accent/5">${inline(c)}</td>`).join("")}</tr>`).join("");
          return `<div class="overflow-x-auto my-6"><table class="w-full"><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table></div>`;
        }
      }

      // Unordered list
      if (block.match(/^- /m)) {
        const items = block.split("\n").filter((l) => l.startsWith("- ")).map((l) => `<li class="text-muted-foreground text-sm leading-relaxed">${inline(l.slice(2))}</li>`);
        return `<ul class="list-disc list-inside space-y-1 my-4 ml-2">${items.join("")}</ul>`;
      }

      // Ordered list
      if (block.match(/^\d+\. /m)) {
        const items = block.split("\n").filter((l) => l.match(/^\d+\. /)).map((l) => `<li class="text-muted-foreground text-sm leading-relaxed">${inline(l.replace(/^\d+\.\s/, ""))}</li>`);
        return `<ol class="list-decimal list-inside space-y-1 my-4 ml-2">${items.join("")}</ol>`;
      }

      // Paragraph
      return `<p class="text-muted-foreground text-sm sm:text-base leading-relaxed my-4">${inline(block.replace(/\n/g, " "))}</p>`;
    })
    .join("");
}

function inline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-accent hover:underline">$1</a>');
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostFull | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      setPost(data);
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  const contentHtml = useMemo(() => (post ? renderMarkdown(post.content) : ""), [post]);

  const jsonLd = useMemo(() => {
    if (!post) return null;
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.meta_description || post.excerpt,
      "author": { "@type": "Person", "name": post.author },
      "publisher": { "@type": "Organization", "name": "Mervel Perfume" },
      "datePublished": post.published_at,
      "url": `https://mervel-perfume.vercel.app/blog/${post.slug}`,
      ...(post.keywords && { "keywords": post.keywords.join(", ") }),
    };
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] pt-24">
          <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 pt-24">
          <span className="font-serif text-6xl text-accent/40">M</span>
          <h1 className="font-serif text-2xl text-foreground">Post Not Found</h1>
          <Link to="/blog" className="text-accent text-sm uppercase tracking-widest hover:underline">
            ← Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>{post.meta_title || `${post.title} | Mervel Perfume`}</title>
        <meta name="description" content={post.meta_description || post.excerpt || ""} />
        {post.keywords && <meta name="keywords" content={post.keywords.join(", ")} />}
        <meta property="og:title" content={post.meta_title || post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt || ""} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://mervel-perfume.vercel.app/blog/${post.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.meta_title || post.title} />
        <meta name="twitter:description" content={post.meta_description || post.excerpt || ""} />
        {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
      </Helmet>
      <Navbar />

      <main className="flex-1 pt-20 sm:pt-28 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent text-xs uppercase tracking-widest transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Blog
          </Link>

          {/* Post Header */}
          <header className="mb-10">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-foreground leading-tight mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground text-xs">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {post.author}
              </span>
              {post.published_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.published_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
            <div className="w-16 h-0.5 bg-accent/30 mt-6" />
          </header>

          {/* Content */}
          <article
            className="prose-mervel"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* Keywords */}
          {post.keywords && post.keywords.length > 0 && (
            <div className="mt-12 pt-6 border-t border-accent/10">
              <span className="text-xs uppercase tracking-widest text-muted-foreground block mb-3">Tags</span>
              <div className="flex flex-wrap gap-2">
                {post.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-xs text-accent/70 border border-accent/20 px-3 py-1 rounded-sm"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
