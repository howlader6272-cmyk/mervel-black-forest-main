import { useScrollReveal } from "@/hooks/useScrollReveal";
import aboutModel from "@/assets/about-model.jpg";
import ImageLightbox from "@/components/ImageLightbox";

const AboutSection = () => {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section id="about" className="relative py-16 sm:py-24 md:py-32 bg-background overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, hsla(43, 60%, 50%, 0.15) 0%, transparent 60%)",
        }}
      />

      <div
        ref={ref}
        className="relative container mx-auto px-4 sm:px-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-20 items-center">
          {/* Left — Image */}
          <div
            className={`relative transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <div className="relative max-w-md mx-auto lg:mx-0">
              {/* Gold border accent */}
              <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-full h-full border border-accent/30 rounded-sm" />
              <div className="relative rounded-sm overflow-hidden" style={{ aspectRatio: "4/5" }}>
                <ImageLightbox src={aboutModel} alt="Mervel luxury fragrance model">
                  <img
                    src={aboutModel}
                    alt="Mervel luxury fragrance model"
                    className="w-full h-full object-cover"
                  />
                </ImageLightbox>
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-accent text-accent-foreground px-4 sm:px-6 py-2 sm:py-3 rounded-sm shadow-lg">
                <span className="font-serif text-lg sm:text-2xl font-bold">Est. 2024</span>
              </div>
            </div>
          </div>

          {/* Right — Content */}
          <div
            className={`transition-all duration-1000 delay-400 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <span className="text-accent text-xs uppercase tracking-[0.4em] font-sans font-semibold">
              Our Story
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mt-3 mb-4 sm:mb-6 tracking-wide leading-tight">
              Born from the Deepest Essence of Nature
            </h2>
            <div className="w-16 h-0.5 bg-accent mb-6 sm:mb-8" />

            <div className="space-y-4 sm:space-y-5 text-muted-foreground text-sm sm:text-base leading-relaxed">
              <p>
                Mervel was born from a singular obsession — to capture the raw, untamed beauty of 
                nature's most guarded secrets and transform them into wearable art. Every bottle 
                holds a story written in the language of rare woods, sacred resins, and midnight blooms.
              </p>
              <p>
                Our master perfumers travel to the world's most remote corners — from the misty 
                forests of Assam for precious agarwood, to the sun-drenched fields of Grasse for 
                heritage roses — sourcing only the finest, ethically harvested ingredients.
              </p>
              <p>
                Each fragrance is a meditation on contrasts: light and shadow, strength and 
                vulnerability, tradition and modernity. We don't follow trends. We create legacies 
                that linger on the skin and in memory.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-accent/10">
              {[
                { value: "20+", label: "Unique Fragrances" },
                { value: "50+", label: "Rare Ingredients" },
                { value: "100%", label: "Ethically Sourced" },
              ].map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <span className="font-serif text-2xl sm:text-3xl text-accent font-bold block">
                    {stat.value}
                  </span>
                  <span className="text-muted-foreground text-[10px] sm:text-xs uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
