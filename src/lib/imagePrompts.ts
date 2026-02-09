import { Product } from "@/data/products";

// Category-based liquid color directions
const categoryPalettes: Record<string, string> = {
  woody: "deep emerald green or dark amber liquid",
  spicy: "rich amber-gold or fiery warm cognac liquid",
  floral: "vibrant magenta-pink or deep rose-ruby liquid",
  musk: "pale silver or soft frosted lavender liquid",
};

// Per-product liquid color & minimal accent props
const productAccents: Record<string, string> = {
  "midnight-fern": "deep emerald-green liquid, a single fern leaf beside the bottle",
  "oud-mystique": "rich dark amber-gold liquid, a tiny curl of oud wood shaving nearby",
  "velvet-rose": "deep ruby-magenta liquid, one dark rose petal resting on the glossy surface",
  "shadow-musk": "pale frosted silver liquid, soft light haze around the bottle",
  "gold-resin": "warm golden-honey liquid, a small piece of amber resin beside the bottle",
  "forest-rain": "translucent pale green liquid, a single dew-covered leaf nearby",
  "dark-amber": "deep cognac-brown liquid, a small tobacco leaf accent",
  "eclipse": "dark violet-plum liquid, a few scattered blackberries",
  "savage-root": "earracotta-amber liquid, a raw ginger root fragment nearby",
  "noir-jasmine": "pale champagne-gold liquid, a single white jasmine bloom",
  "crimson-veil": "deep crimson-red liquid, a dark orchid petal on the surface",
  "obsidian-night": "jet-black liquid with subtle blue reflections, a curl of bergamot peel",
  "silk-saffron": "rich saffron-gold liquid, a few saffron threads scattered nearby",
  "phantom-wood": "smoky translucent grey-green liquid, a few juniper berries",
  "velvet-noir": "deep purple-black liquid, a single iris bloom beside the bottle",
  "ember-crown": "fiery amber-orange liquid, a cinnamon stick and pink peppercorns",
  "jade-lotus": "pale jade-green liquid, a floating lotus petal nearby",
  "serpent-smoke": "dark smoky-grey liquid, wisps of incense smoke curling upward",
  "lunar-bloom": "luminous pearl-white liquid with soft iridescence, a magnolia bloom",
  "abyssal-leather": "deep dark brown liquid, a strip of aged leather beside the bottle",
};

/**
 * Generates a professional perfume product photo prompt matching the reference style:
 * clear glass bottle, vibrant liquid, chrome cap, dark purple background, glossy surface.
 */
export function generateImagePrompt(product: Product): string {
  const liquidColor = categoryPalettes[product.category] || categoryPalettes.woody;
  const accent = productAccents[product.id] || liquidColor;

  return `A high-quality, realistic perfume product photograph of a tall rectangular clear glass bottle containing ${accent}. The bottle has a polished chrome silver metallic cap. Product is fully in frame, centered. Clean, light soft white-to-ivory gradient background. Natural studio lighting with soft diffused shadows and subtle reflections on the glossy white surface beneath the bottle. Highlight the bottle's transparency, liquid color, and glass details clearly. Professional, premium photoshoot style. Ultra high resolution, sharp focus. Portrait orientation 3:4 aspect ratio. No text, no labels, no branding on the bottle.`;
}
