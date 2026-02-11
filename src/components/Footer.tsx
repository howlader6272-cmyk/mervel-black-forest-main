import { Facebook, Linkedin, BookOpen, HelpCircle } from "lucide-react";

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/mervelperfume", icon: Facebook },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/mervelperfume", icon: Linkedin },
  { label: "Medium", href: "https://medium.com/@mervelperfume", icon: BookOpen },
  { label: "Quora", href: "https://www.quora.com/profile/Mervel-Perfume", icon: HelpCircle },
];

const Footer = () => {
  return (
    <footer className="bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col items-center gap-5 sm:gap-8 md:flex-row md:justify-between">
          {/* Logo */}
          <h3 className="font-serif text-2xl sm:text-3xl text-accent font-bold tracking-[0.15em]">
            MERVEL
          </h3>

          {/* Links */}
          <ul className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            <li>
              <a href="/track-order" className="inline-flex items-center px-4 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-accent hover:bg-accent/15 hover:border-accent/50 transition-all duration-300 text-xs sm:text-sm tracking-wide font-medium">
                Track Order
              </a>
            </li>
            <li>
              <a href="/blog" className="inline-flex items-center px-4 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-accent hover:bg-accent/15 hover:border-accent/50 transition-all duration-300 text-xs sm:text-sm tracking-wide font-medium">
                Blog
              </a>
            </li>
            {["Shipping Policy", "Returns", "Contact"].map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="inline-flex items-center px-4 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-accent hover:bg-accent/15 hover:border-accent/50 transition-all duration-300 text-xs sm:text-sm tracking-wide font-medium"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-4 mt-6 sm:mt-8">
          {socialLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-9 h-9 rounded-full border border-accent/20 flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/60 transition-all duration-300"
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-accent/10 text-center">
          <p className="text-muted-foreground text-[10px] sm:text-xs tracking-wider">
            © 2026 Mervel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
