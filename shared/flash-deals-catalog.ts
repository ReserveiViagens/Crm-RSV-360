/** Catálogo base de Flash Deals — S1 CRM (overlays CMS sobrescrevem campos) */

export type FlashDealCatalogItem = {
  id: number;
  title: string;
  location: string;
  originalPrice: number;
  price: number;
  discount: number;
  soldPercent: number;
  timeLeft: string;
  roomsLeft: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  tags: string[];
  description?: string;
  hotelKey?: string;
};

export const FLASH_DEALS_CATALOG: FlashDealCatalogItem[] = [
  {
    id: 1,
    title: "Resort Termas Paradise",
    location: "Caldas Novas",
    originalPrice: 1899,
    price: 569,
    discount: 70,
    soldPercent: 92,
    timeLeft: "02:32:18",
    roomsLeft: 2,
    rating: 4.9,
    reviews: 856,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/termas-paradise-Np6Qr8Ts2Uf4Xv7Zy1Bw3Dc5Eg9Hj.jpg",
    category: "natureza",
    tags: ["família", "spa", "piscinas termais"],
  },
  {
    id: 2,
    title: "Hot Park - Passe Família",
    location: "Rio Quente",
    originalPrice: 799,
    price: 349,
    discount: 56,
    soldPercent: 75,
    timeLeft: "06:45:33",
    roomsLeft: 5,
    rating: 4.8,
    reviews: 2341,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hot-park-Jm2Xy9K8RfqL3vN5wT1pA6sD4hB7eC.jpg",
    category: "parques",
    tags: ["família", "aventura", "parque aquático"],
  },
  {
    id: 3,
    title: "DiRoma Internacional",
    location: "Caldas Novas",
    originalPrice: 1299,
    price: 649,
    discount: 50,
    soldPercent: 62,
    timeLeft: "12:15:45",
    roomsLeft: 8,
    rating: 4.7,
    reviews: 1654,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/diroma-Kp4Mn7Hs8Qf2Lw6Rv3Jx5Bt1Yd9Gc.jpg",
    category: "natureza",
    tags: ["casal", "spa", "resort"],
  },
  {
    id: 4,
    title: "Lagoa Quente Flat",
    location: "Caldas Novas",
    originalPrice: 989,
    price: 449,
    discount: 55,
    soldPercent: 45,
    timeLeft: "23:00:00",
    roomsLeft: 12,
    rating: 4.6,
    reviews: 987,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/water-park-Lq8Rs2Ut4Wv6Xy9Ab1Cd3Ef5Gh7Ij.jpg",
    category: "natureza",
    tags: ["família", "econômico", "flat"],
  },
  {
    id: 5,
    title: "Pousada do Rio Quente",
    location: "Rio Quente",
    originalPrice: 1450,
    price: 580,
    discount: 60,
    soldPercent: 88,
    timeLeft: "03:20:10",
    roomsLeft: 3,
    rating: 4.8,
    reviews: 1122,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/termas-paradise-Np6Qr8Ts2Uf4Xv7Zy1Bw3Dc5Eg9Hj.jpg",
    category: "natureza",
    tags: ["casal", "romântico", "spa"],
  },
  {
    id: 6,
    title: "Náutico Praia Clube",
    location: "Caldas Novas",
    originalPrice: 1199,
    price: 479,
    discount: 60,
    soldPercent: 70,
    timeLeft: "08:50:25",
    roomsLeft: 6,
    rating: 4.5,
    reviews: 743,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hot-park-Jm2Xy9K8RfqL3vN5wT1pA6sD4hB7eC.jpg",
    category: "parques",
    tags: ["família", "amigos", "esportes"],
  },
];
