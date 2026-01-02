export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: string[];
  skinType: string[];
  ingredients: string[];
  image: string;
  isNew?: boolean;
  isBestSeller?: boolean;
};

export const products: Product[] = [
  {
    id: 1,
    name: 'Vitamin C Brightening Serum',
    description: 'Advanced formula for even-toned skin',
    price: 89.00,
    rating: 4.8,
    reviewCount: 124,
    category: ['Skincare'],
    skinType: ['Normal', 'Combination', 'Dry'],
    ingredients: ['Vitamin C', 'Hyaluronic Acid'],
    image: '/images/f1.png',
    isBestSeller: true
  },
  {
    id: 2,
    name: 'Hyaluronic Acid Moisturizer',
    description: 'Intense hydration for all skin types',
    price: 65.00,
    rating: 4.7,
    reviewCount: 98,
    category: ['Skincare'],
    skinType: ['Dry', 'Sensitive'],
    ingredients: ['Hyaluronic Acid', 'Niacinamide'],
    image: '/images/f2.png',
    isNew: true
  },
  {
    id: 3,
    name: 'Retinol Night Cream',
    description: 'Anti-aging treatment for youthful skin',
    price: 78.00,
    rating: 4.9,
    reviewCount: 156,
    category: ['Skincare'],
    skinType: ['Normal', 'Dry', 'Combination'],
    ingredients: ['Retinol', 'Peptides'],
    image: '/images/f3.png',
    isBestSeller: true
  },
  {
    id: 4,
    name: 'Niacinamide + Zinc',
    description: 'Reduces blemishes and balances skin',
    price: 45.00,
    rating: 4.6,
    reviewCount: 87,
    category: ['Skincare'],
    skinType: ['Oily', 'Combination'],
    ingredients: ['Niacinamide', 'Zinc'],
    image: '/images/f4.png'
  },
  {
    id: 5,
    name: 'Peptide Complex',
    description: 'Firming and plumping serum',
    price: 95.00,
    rating: 4.8,
    reviewCount: 112,
    category: ['Skincare'],
    skinType: ['Normal', 'Dry', 'Mature'],
    ingredients: ['Peptides', 'Hyaluronic Acid'],
    image: '/images/f5.png',
    isNew: true
  },
  {
    id: 6,
    name: 'Vitamin C Eye Cream',
    description: 'Brightens and reduces dark circles',
    price: 58.00,
    rating: 4.5,
    reviewCount: 76,
    category: ['Skincare'],
    skinType: ['All'],
    ingredients: ['Vitamin C', 'Caffeine'],
    image: '/images/f6.png'
  },
  {
    id: 7,
    name: 'AHA/BHA Exfoliating Toner',
    description: 'Gentle chemical exfoliation',
    price: 42.00,
    rating: 4.7,
    reviewCount: 94,
    category: ['Skincare'],
    skinType: ['Oily', 'Combination', 'Normal'],
    ingredients: ['AHA', 'BHA', 'Hyaluronic Acid'],
    image: '/images/f7.png'
  },
  {
    id: 8,
    name: 'Ceramide Moisture Barrier',
    description: 'Repairs and protects skin barrier',
    price: 72.00,
    rating: 4.9,
    reviewCount: 134,
    category: ['Skincare'],
    skinType: ['Dry', 'Sensitive'],
    ingredients: ['Ceramides', 'Cholesterol', 'Fatty Acids'],
    image: '/images/f1.png',
    isBestSeller: true
  },
  {
    id: 9,
    name: 'Niacinamide + Zinc Serum',
    description: 'Reduces redness and blemishes',
    price: 49.00,
    rating: 4.6,
    reviewCount: 88,
    category: ['Skincare'],
    skinType: ['Oily', 'Combination', 'Acne-Prone'],
    ingredients: ['Niacinamide', 'Zinc'],
    image: '/images/f2.png'
  },
  {
    id: 10,
    name: 'Hyaluronic Acid Serum',
    description: 'Ultra-hydrating plumping serum',
    price: 62.00,
    rating: 4.8,
    reviewCount: 156,
    category: ['Skincare'],
    skinType: ['Dry', 'Normal', 'Sensitive'],
    ingredients: ['Hyaluronic Acid', 'Vitamin B5'],
    image: '/images/f3.png'
  },
  {
    id: 11,
    name: 'Retinol + Bakuchiol',
    description: 'Gentle anti-aging treatment',
    price: 85.00,
    rating: 4.7,
    reviewCount: 102,
    category: ['Skincare'],
    skinType: ['Normal', 'Dry', 'Mature'],
    ingredients: ['Retinol', 'Bakuchiol', 'Niacinamide'],
    image: '/images/f4.png',
    isNew: true
  },
  {
    id: 12,
    name: 'Vitamin C + E + Ferulic Acid',
    description: 'Potent antioxidant protection',
    price: 92.00,
    rating: 4.9,
    reviewCount: 178,
    category: ['Skincare'],
    skinType: ['All'],
    ingredients: ['Vitamin C', 'Vitamin E', 'Ferulic Acid'],
    image: '/images/f5.png',
    isBestSeller: true
  }
];
