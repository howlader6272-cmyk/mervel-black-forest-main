// Detailed descriptions for individual fragrance note ingredients
export const noteDescriptions: Record<string, { origin: string; character: string; pairsWell: string }> = {
  // Woody notes
  "Pine": {
    origin: "Northern European conifer forests",
    character: "Fresh, resinous, and deeply green — like walking through a frost-kissed forest at dawn.",
    pairsWell: "Cedar, Moss, Vetiver",
  },
  "Cedar": {
    origin: "Atlas Mountains, Morocco",
    character: "Warm, dry, and pencil-shaving woody — a timeless backbone of masculine fragrance.",
    pairsWell: "Pine, Sandalwood, Amber",
  },
  "Moss": {
    origin: "European old-growth forests",
    character: "Earthy, damp, and velvety — the scent of ancient forest floors after rain.",
    pairsWell: "Vetiver, Cedar, Oakmoss",
  },
  "Agarwood": {
    origin: "Southeast Asia, Assam",
    character: "Complex, animalic, and smoky — one of the most precious raw materials in perfumery.",
    pairsWell: "Rose, Saffron, Amber",
  },
  "Amber": {
    origin: "Resin blends, Middle East",
    character: "Warm, honeyed, and slightly powdery — a golden embrace of sweetness and depth.",
    pairsWell: "Vanilla, Oud, Musk",
  },
  "Vanilla": {
    origin: "Madagascar, Comoros Islands",
    character: "Rich, creamy, and comforting — the heart of gourmand luxury.",
    pairsWell: "Amber, Tonka Bean, Sandalwood",
  },
  "Petrichor": {
    origin: "Mineral-rich earth after rainfall",
    character: "Ozonic, mineral, and refreshing — the intoxicating scent of the first monsoon rain.",
    pairsWell: "Green Leaf, Vetiver, Citrus",
  },
  "Green Leaf": {
    origin: "Fresh-cut foliage",
    character: "Crisp, dewy, and vibrantly alive — pure photosynthesis captured in a bottle.",
    pairsWell: "Petrichor, Citrus, Moss",
  },
  "Citrus": {
    origin: "Mediterranean groves",
    character: "Bright, sparkling, and effervescent — an instant burst of sunlit energy.",
    pairsWell: "Green Leaf, Bergamot, Ginger",
  },
  "Blackberry": {
    origin: "Wild hedgerows, Europe",
    character: "Dark, juicy, and slightly tart — a brooding fruitiness with depth.",
    pairsWell: "Bay Leaf, Vetiver, Musk",
  },
  "Bay Leaf": {
    origin: "Mediterranean basin",
    character: "Aromatic, herbal, and slightly spicy — culinary elegance in perfumery.",
    pairsWell: "Blackberry, Vetiver, Juniper",
  },
  "Vetiver": {
    origin: "Haiti, Java, Réunion",
    character: "Smoky, earthy, and deeply rooted — the ultimate grounding note.",
    pairsWell: "Cedar, Ginger, Sandalwood",
  },
  "Bergamot": {
    origin: "Calabria, Italy",
    character: "Citrusy, slightly bitter, and aristocratic — the opening note of countless classics.",
    pairsWell: "Black Oud, Tea, Lavender",
  },
  "Black Oud": {
    origin: "Aged agarwood, Southeast Asia",
    character: "Dense, resinous, and almost leathery — oud at its most intense and mysterious.",
    pairsWell: "Bergamot, Rose, Smoky Birch",
  },
  "Smoky Birch": {
    origin: "Russian birch tar distillation",
    character: "Campfire-like, leathery, and raw — a primal connection to fire and forest.",
    pairsWell: "Black Oud, Bergamot, Leather",
  },
  "Juniper": {
    origin: "Northern hemisphere woodlands",
    character: "Gin-like, fresh, and slightly piney — aromatic and invigorating.",
    pairsWell: "Guaiac Wood, Dry Amber, Citrus",
  },
  "Guaiac Wood": {
    origin: "Paraguay, Argentina",
    character: "Creamy, smoky, and slightly sweet — like smoldering incense in warm wood.",
    pairsWell: "Juniper, Vetiver, Amber",
  },
  "Dry Amber": {
    origin: "Synthetic amber accords",
    character: "Powdery, warm, and gossamer — amber stripped to its lightest, most ethereal form.",
    pairsWell: "Guaiac Wood, Musk, Sandalwood",
  },
  "Elemi": {
    origin: "Philippines",
    character: "Bright, lemony, and resinous — a fresh twist on traditional resins.",
    pairsWell: "Frankincense, Leather, Citrus",
  },
  "Aged Leather": {
    origin: "Traditional leather accord",
    character: "Rich, animalic, and supple — the scent of a vintage library armchair.",
    pairsWell: "Elemi, Dark Musk, Tobacco",
  },
  "Dark Musk": {
    origin: "Synthetic musk accords",
    character: "Deep, animalic, and magnetic — musk at its most primal and seductive.",
    pairsWell: "Aged Leather, Oud, Amber",
  },

  // Spicy notes
  "Frankincense": {
    origin: "Oman, Somalia",
    character: "Sacred, lemony-resinous, and transcendent — the scent of ancient temples.",
    pairsWell: "Myrrh, Honey, Saffron",
  },
  "Myrrh": {
    origin: "Horn of Africa, Arabian Peninsula",
    character: "Warm, balsamic, and slightly medicinal — smoky sweetness with biblical roots.",
    pairsWell: "Frankincense, Amber, Oud",
  },
  "Honey": {
    origin: "Wild bee harvests",
    character: "Golden, waxy, and naturally sweet — rich without being cloying.",
    pairsWell: "Myrrh, Tobacco, Benzoin",
  },
  "Ambergris": {
    origin: "Oceanic origin, synthetic recreations",
    character: "Salty, warm, and animalic — an oceanic depth that adds longevity and texture.",
    pairsWell: "Tobacco, Leather, Musk",
  },
  "Tobacco": {
    origin: "Virginia, Turkey",
    character: "Sweet, slightly spicy, and addictive — dried leaves with a honeyed warmth.",
    pairsWell: "Ambergris, Leather, Vanilla",
  },
  "Leather": {
    origin: "Traditional leather accord",
    character: "Raw, smoky, and animalistic — rugged luxury in olfactory form.",
    pairsWell: "Tobacco, Oud, Birch",
  },
  "Ginger": {
    origin: "South & Southeast Asia",
    character: "Sharp, fiery, and crystalline — a zesty spice that electrifies any composition.",
    pairsWell: "Vetiver, Earth, Citrus",
  },
  "Earth": {
    origin: "Rain-soaked soil",
    character: "Raw, mineral, and primordial — the most grounding note in existence.",
    pairsWell: "Vetiver, Ginger, Patchouli",
  },
  "Saffron": {
    origin: "Kashmir, Iran",
    character: "Metallic, honeyed, and luxuriously warm — liquid gold of the spice world.",
    pairsWell: "Rose Absolute, Oud, Leather",
  },
  "Rose Absolute": {
    origin: "Grasse, France & Bulgaria",
    character: "Rich, jammy, and deeply romantic — the most concentrated form of rose.",
    pairsWell: "Saffron, Suede, Oud",
  },
  "Suede": {
    origin: "Soft leather accord",
    character: "Velvety, powdery, and sensual — like brushing your hand across fine fabric.",
    pairsWell: "Saffron, Rose, Musk",
  },
  "Pink Pepper": {
    origin: "Brazilian pepper tree",
    character: "Sparkling, rosy, and mildly spicy — a sophisticated, modern spice note.",
    pairsWell: "Cinnamon, Oud, Rose",
  },
  "Cinnamon Bark": {
    origin: "Sri Lanka",
    character: "Warm, sweet, and intensely aromatic — a fiery heart that radiates warmth.",
    pairsWell: "Pink Pepper, Oud Wood, Vanilla",
  },
  "Oud Wood": {
    origin: "Cultivated agarwood plantations",
    character: "Refined, slightly smoky, and sophisticated — a polished take on raw oud.",
    pairsWell: "Cinnamon, Rose, Sandalwood",
  },
  "Cardamom": {
    origin: "Guatemala, India",
    character: "Cool, aromatic, and slightly eucalyptus-like — the queen of spices.",
    pairsWell: "Incense, Labdanum, Coffee",
  },
  "Incense": {
    origin: "Sacred resin blends",
    character: "Smoky, mystical, and meditative — the scent of spiritual transcendence.",
    pairsWell: "Cardamom, Labdanum, Myrrh",
  },
  "Labdanum": {
    origin: "Mediterranean cistus shrub",
    character: "Honeyed, ambery, and leathery — a warm, sticky sweetness with depth.",
    pairsWell: "Incense, Amber, Vanilla",
  },

  // Floral notes
  "Black Rose": {
    origin: "Hybrid cultivars, Turkey",
    character: "Dark, velvety, and brooding — a rose stripped of innocence and draped in shadow.",
    pairsWell: "Patchouli, Oud, Black Pepper",
  },
  "Patchouli": {
    origin: "Indonesia, Philippines",
    character: "Earthy, chocolatey, and deeply bohemian — both hippie relic and haute couture staple.",
    pairsWell: "Rose, Vanilla, Vetiver",
  },
  "Pepper": {
    origin: "Malabar Coast, India",
    character: "Sharp, biting, and invigorating — a crackling spark that ignites compositions.",
    pairsWell: "Rose, Patchouli, Leather",
  },
  "Jasmine Sambac": {
    origin: "India, Southeast Asia",
    character: "Intensely sweet, narcotic, and indolic — jasmine at its most intoxicating.",
    pairsWell: "Tuberose, Sandalwood, Musk",
  },
  "Tuberose": {
    origin: "Mexico, India",
    character: "Creamy, heady, and almost buttery — the diva of night-blooming flowers.",
    pairsWell: "Jasmine, Vanilla, Coconut",
  },
  "Clove": {
    origin: "Zanzibar, Madagascar",
    character: "Warm, spicy-sweet, and slightly numbing — an ancient spice with medicinal roots.",
    pairsWell: "Jasmine, Rose, Cinnamon",
  },
  "Blood Orange": {
    origin: "Sicily, Italy",
    character: "Juicy, ruby-red, and bittersweet — citrus with a dark, dramatic twist.",
    pairsWell: "Dark Orchid, Saffron, Benzoin",
  },
  "Dark Orchid": {
    origin: "Tropical orchid accords",
    character: "Mysterious, powdery, and seductive — velvet petals concealing hidden depth.",
    pairsWell: "Blood Orange, Vanilla, Benzoin",
  },
  "Benzoin": {
    origin: "Sumatra, Thailand",
    character: "Warm, balsamic, and slightly vanillic — like caramelized resin glowing in amber light.",
    pairsWell: "Dark Orchid, Myrrh, Vanilla",
  },
  "White Tea": {
    origin: "Fujian Province, China",
    character: "Delicate, clean, and subtly sweet — the quietest whisper of refinement.",
    pairsWell: "Lotus, Cedarwood, Bergamot",
  },
  "Lotus": {
    origin: "Sacred lakes of Asia",
    character: "Aquatic, ethereal, and spiritually pure — the sacred flower of enlightenment.",
    pairsWell: "White Tea, Cedarwood, Musk",
  },
  "Cedarwood": {
    origin: "Virginia, Texas",
    character: "Pencil-sharp, clean, and warmly woody — a comforting, familiar warmth.",
    pairsWell: "Lotus, Vetiver, Amber",
  },
  "Magnolia": {
    origin: "Southern United States, China",
    character: "Lemony, creamy, and champagne-like — floral effervescence at its finest.",
    pairsWell: "Ylang-Ylang, White Amber, Peony",
  },
  "Ylang-Ylang": {
    origin: "Comoros Islands, Madagascar",
    character: "Sweet, narcotic, and banana-like — a tropical flower of exotic intensity.",
    pairsWell: "Magnolia, Jasmine, Sandalwood",
  },
  "White Amber": {
    origin: "Synthetic amber accords",
    character: "Luminous, clean, and crystalline — amber reimagined as moonlight on skin.",
    pairsWell: "Magnolia, Musk, Iris",
  },

  // Musk notes
  "White Musk": {
    origin: "Synthetic musk molecules",
    character: "Clean, cottony, and skin-like — the scent of freshly laundered warmth.",
    pairsWell: "Sandalwood, Iris, Cashmere Wood",
  },
  "Sandalwood": {
    origin: "Mysore, India & Australia",
    character: "Creamy, milky, and meditatively warm — the most sacred wood in perfumery.",
    pairsWell: "Musk, Vanilla, Rose",
  },
  "Cashmere Wood": {
    origin: "Synthetic wood accords",
    character: "Soft, powdery, and enveloping — like being wrapped in the finest cashmere.",
    pairsWell: "White Musk, Sandalwood, Iris",
  },
  "Black Currant": {
    origin: "Northern Europe",
    character: "Tart, juicy, and slightly catty — a vibrant burst of dark berry sophistication.",
    pairsWell: "Iris, Tonka Bean, Rose",
  },
  "Iris": {
    origin: "Florence, Italy",
    character: "Powdery, violet-like, and aristocratic — the most expensive floral note.",
    pairsWell: "Black Currant, Tonka Bean, Musk",
  },
  "Tonka Bean": {
    origin: "Venezuela, Brazil",
    character: "Warm, hay-like, and almond-sweet — a cozy, addictive base note.",
    pairsWell: "Iris, Vanilla, Amber",
  },
};
