import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const PAGES: Record<string, { title: string; metaDesc: string; content: React.ReactNode }> = {
  "shipping-policy": {
    title: "Shipping Policy | MERVEL",
    metaDesc: "Learn about MERVEL's shipping policy, delivery times, and packaging for luxury perfumes.",
    content: (
      <>
        <h1>Shipping Policy</h1>
        <p>At <strong>MERVEL</strong>, we ensure your luxury fragrance reaches you safely and promptly.</p>

        <h2>Delivery Areas</h2>
        <p>We currently deliver across <strong>Bangladesh</strong>. International shipping is coming soon.</p>

        <h2>Processing Time</h2>
        <p>All orders are processed within <strong>24–48 hours</strong> after confirmation.</p>

        <h2>Delivery Time</h2>
        <ul>
          <li><strong>Inside Dhaka:</strong> 1–2 business days</li>
          <li><strong>Outside Dhaka:</strong> 3–5 business days</li>
        </ul>

        <h2>Shipping Charges</h2>
        <ul>
          <li><strong>Inside Dhaka:</strong> ৳60</li>
          <li><strong>Outside Dhaka:</strong> ৳120</li>
          <li><strong>Free shipping</strong> on orders above ৳3,000</li>
        </ul>

        <h2>Packaging</h2>
        <p>Every MERVEL perfume is carefully packaged in a premium gift box with protective wrapping to ensure it arrives in perfect condition.</p>

        <h2>Order Tracking</h2>
        <p>Once your order is shipped, you will receive a tracking number via SMS or email. You can also track your order on our <a href="/track-order">Track Order</a> page.</p>

        <h2>Questions?</h2>
        <p>For any shipping-related queries, contact us at <strong>01300317979</strong>.</p>
      </>
    ),
  },
  returns: {
    title: "Returns & Refunds | MERVEL",
    metaDesc: "MERVEL's return and refund policy for luxury perfume purchases.",
    content: (
      <>
        <h1>Returns & Refund Policy</h1>
        <p>Your satisfaction is our priority at <strong>MERVEL</strong>.</p>

        <h2>Return Eligibility</h2>
        <ul>
          <li>Items must be returned within <strong>3 days</strong> of delivery.</li>
          <li>The product must be <strong>unused, unopened, and in original packaging</strong>.</li>
          <li>Damaged or defective items can be returned at any time within the return window.</li>
        </ul>

        <h2>Non-Returnable Items</h2>
        <ul>
          <li>Opened or used perfume bottles</li>
          <li>Products without original packaging</li>
          <li>Items purchased during clearance sales</li>
        </ul>

        <h2>How to Initiate a Return</h2>
        <ol>
          <li>Call us at <strong>01300317979</strong> with your order ID.</li>
          <li>Our team will guide you through the return process.</li>
          <li>Ship the product back to us (return shipping may apply).</li>
        </ol>

        <h2>Refund Process</h2>
        <p>Once we receive and inspect the returned item, your refund will be processed within <strong>5–7 business days</strong> via the original payment method.</p>

        <h2>Exchange</h2>
        <p>We offer exchanges for damaged or defective products. Contact us at <strong>01300317979</strong> to arrange an exchange.</p>
      </>
    ),
  },
  contact: {
    title: "Contact Us | MERVEL",
    metaDesc: "Get in touch with MERVEL luxury perfumes. We'd love to hear from you.",
    content: (
      <>
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Reach out to <strong>MERVEL</strong> for any questions, feedback, or support.</p>

        <h2>Phone</h2>
        <p>
          <a href="tel:01300317979" className="text-accent hover:underline font-semibold text-lg">
            📞 01300317979
          </a>
        </p>

        <h2>Business Hours</h2>
        <ul>
          <li><strong>Saturday – Thursday:</strong> 10:00 AM – 8:00 PM</li>
          <li><strong>Friday:</strong> Closed</li>
        </ul>

        <h2>Social Media</h2>
        <ul>
          <li><a href="https://www.facebook.com/mervelperfume" target="_blank" rel="noopener noreferrer">Facebook</a></li>
          <li><a href="https://www.linkedin.com/company/mervelperfume" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          <li><a href="https://medium.com/@mervelperfume" target="_blank" rel="noopener noreferrer">Medium</a></li>
          <li><a href="https://www.quora.com/profile/Mervel-Perfume" target="_blank" rel="noopener noreferrer">Quora</a></li>
        </ul>

        <h2>Address</h2>
        <p>Dhaka, Bangladesh</p>
      </>
    ),
  },
};

const AIContentPage = () => {
  const { pageType } = useParams<{ pageType: string }>();
  const page = PAGES[pageType || ""];

  if (!page) {
    return (
      <main className="min-h-screen bg-secondary">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-serif text-accent mb-4">Page Not Found</h1>
          <Link to="/" className="text-muted-foreground hover:text-accent transition-colors text-sm">
            ← Back to Home
          </Link>
        </div>
        <Footer />
        <CartDrawer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-secondary">
      <Helmet>
        <title>{page.title}</title>
        <meta name="description" content={page.metaDesc} />
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

        <article className="prose prose-invert prose-sm sm:prose-base max-w-none prose-headings:font-serif prose-headings:text-accent prose-headings:tracking-wide prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground prose-a:text-accent prose-hr:border-accent/10">
          {page.content}
        </article>
      </div>

      <Footer />
      <CartDrawer />
    </main>
  );
};

export default AIContentPage;
