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
              <a href="/track-order" className="text-muted-foreground hover:text-accent transition-colors duration-300 text-xs sm:text-sm tracking-wide">
                Track Order
              </a>
            </li>
            {["Shipping Policy", "Returns", "Contact"].map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-accent transition-colors duration-300 text-xs sm:text-sm tracking-wide"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
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
