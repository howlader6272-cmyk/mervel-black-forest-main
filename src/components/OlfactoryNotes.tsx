import { useScrollReveal } from "@/hooks/useScrollReveal";
import { TreePine, Flame, Flower2, Wind } from "lucide-react";

const notes = [
  {
    id: "woody",
    name: "Woody",
    description: "Deep, grounding essences of ancient timber and bark.",
    icon: TreePine,
  },
  {
    id: "spicy",
    name: "Spicy",
    description: "Bold, warm accords of exotic spices and aromatics.",
    icon: Flame,
  },
  {
    id: "floral",
    name: "Floral",
    description: "Elegant bouquets of rare, night-blooming flowers.",
    icon: Flower2,
  },
  {
    id: "musk",
    name: "Musk",
    description: "Intimate, skin-close scents of ethereal softness.",
    icon: Wind,
  },
];

interface OlfactoryNotesProps {
  onCategoryClick?: (category: string) => void;
}

const OlfactoryNotes = ({ onCategoryClick }: OlfactoryNotesProps) => {
  const { ref, isVisible } = useScrollReveal(0.1);

  const handleClick = (categoryId: string) => {
    onCategoryClick?.(categoryId);

    // Smooth scroll to collection section
    setTimeout(() => {
      const el = document.getElementById("collection");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  return (
    <section className="relative py-14 sm:py-24 md:py-32 bg-background">
      {/* Subtle purple glow overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, hsla(43, 60%, 50%, 0.12) 0%, transparent 60%)",
          animation: "purple-glow-drift 18s ease-in-out infinite",
        }}
      />

      <div className="relative container mx-auto px-4 sm:px-6" ref={ref}>
        {/* Section Header */}
        <div
          className={`text-center mb-6 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-accent text-xs uppercase tracking-[0.4em] font-sans font-semibold">
            Explore
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl text-foreground mt-2 sm:mt-3 mb-3 sm:mb-4">
            Olfactory Notes
          </h2>
          <div className="w-16 sm:w-20 h-0.5 bg-accent mx-auto mb-3 sm:mb-5" />
          <p className="text-foreground font-serif text-sm sm:text-base md:text-lg italic max-w-lg mx-auto">
            Crafted from the deepest secrets of the Black Forest
          </p>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8 md:gap-12 mt-8 sm:mt-14">
          {notes.map((note, index) => {
            const Icon = note.icon;
            return (
              <div
                key={note.id}
                onClick={() => handleClick(note.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClick(note.id);
                  }
                }}
                className={`group flex flex-col items-center text-center cursor-pointer transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 150 + 200}ms` }}
              >
                {/* Gold-bordered circle */}
                <div className="relative mb-3 sm:mb-6">
                  <div className="absolute -inset-2 rounded-full bg-accent/0 group-hover:bg-accent/5 transition-all duration-500 blur-xl" />
                  <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border border-accent/60 group-hover:border-accent/80 bg-background flex items-center justify-center transition-all duration-500 group-hover:shadow-[0_0_25px_-5px_hsla(43,74%,49%,0.25)] group-hover:scale-105">
                    <Icon
                      className="text-accent transition-transform duration-500 group-hover:scale-110"
                      size={24}
                      strokeWidth={1.2}
                    />
                  </div>
                </div>

                <h3 className="font-serif text-base sm:text-xl md:text-2xl text-foreground mb-1 sm:mb-2 tracking-wide group-hover:text-accent transition-colors duration-300">
                  {note.name}
                </h3>
                <p className="text-foreground text-[10px] sm:text-xs md:text-sm leading-relaxed max-w-[160px] sm:max-w-[180px]">
                  {note.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OlfactoryNotes;
