import collectionGroup1 from "@/assets/collection-group-1.jpg";
import collectionGroup2 from "@/assets/collection-group-2.jpg";

export interface CollectionCombo {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  productIds: string[];
}

export const collectionCombos: CollectionCombo[] = [
  {
    id: "dark-elegance",
    name: "Dark Elegance",
    subtitle: "Signature Series",
    description:
      "A regal harmony of three deep, mysterious fragrances. The damp cedar of ancient pine forests, the dark roses of midnight, and the freshness of moonlit dew — together they create an unforgettable experience.",
    image: collectionGroup1,
    productIds: ["midnight-fern", "velvet-rose", "forest-rain"],
  },
  {
    id: "golden-opulence",
    name: "Golden Opulence",
    subtitle: "Premium Collection",
    description:
      "The ultimate expression of luxury — a golden anthology of three premium fragrances. Rare oriental agarwood, sacred incense, and royal saffron blend together to form this exquisite collection.",
    image: collectionGroup2,
    productIds: ["oud-mystique", "gold-resin", "silk-saffron"],
  },
];
