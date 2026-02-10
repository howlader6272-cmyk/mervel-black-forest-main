import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  author: string;
  published_at: string | null;
  keywords: string[] | null;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image, author, published_at, keywords")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      setPosts(data ?? []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Blog | Mervel Perfume</title>
        <meta name="description" content="Read expert fragrance tips, perfume buying guides, and luxury perfume reviews from Mervel Perfume Bangladesh." />
        <meta property="og:title" content="Blog | Mervel Perfume" />
        <meta property="og:description" content="Expert fragrance tips and luxury perfume guides from Mervel Perfume." />
      </Helmet>
      <Navbar />

      <main className="flex-1 pt-20 sm:pt-28 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-accent text-xs uppercase tracking-[0.4em] font-sans font-semibold">
              Fragrance Journal
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mt-3 mb-4 tracking-wide">
              The Mervel Blog
            </h1>
            <div className="w-16 sm:w-20 h-[2px] bg-accent mx-auto mb-4 sm:mb-6" />
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Expert tips, guides, and insights into the world of luxury fragrances
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-muted-foreground">No blog posts yet. Check back soon!</p>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group block bg-card/50 border border-accent/10 rounded-sm p-6 sm:p-8 hover:border-accent/30 transition-all duration-500 hover:shadow-lg hover:shadow-accent/5"
                >
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Draft"}
                    <span className="text-accent/50">·</span>
                    <span>{post.author}</span>
                  </div>

                  <h2 className="font-serif text-xl sm:text-2xl text-foreground group-hover:text-accent transition-colors duration-300 mb-3">
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}

                  {post.keywords && post.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {post.keywords.slice(0, 4).map((kw) => (
                        <span
                          key={kw}
                          className="text-[10px] text-accent/70 border border-accent/20 px-2 py-0.5 rounded-sm"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}

                  <span className="inline-flex items-center gap-1.5 text-accent text-xs uppercase tracking-widest font-semibold group-hover:gap-2.5 transition-all duration-300">
                    Read More <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
