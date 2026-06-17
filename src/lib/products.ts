import productsData from '@/data/products.json';

export const CATEGORIES = [
  'Electronics', 'Smartphones', 'Computers', 'Audio', 'Wearables',
  'Photography', 'Gaming', 'TV & Video', 'Footwear', 'Apparel', 'Watches',
  'Jewelry', 'Bags & Luggage', 'Beauty', 'Health', 'Kitchen', 'Home',
  'Garden & Outdoor', 'Furniture', 'Sports & Fitness', 'Cycling', 'Eyewear',
  'Automotive', 'Toys & Games', 'Baby', 'Books', 'Music', 'Movies & TV',
  'Pet Supplies', 'Office', 'Tools', 'Safety', 'Accessories', 'Grocery',
];

export interface Product {
  id: string;
  slug: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  status: 'published' | 'draft';
  heroPlacement: boolean;
  featured: boolean;
  rating: number;
  reviewCount: number;
  description: string;
  curatorNote: string;
  features: string[];
  externalUrl: string;
  images: string[];
  tags: string[];
}

let products: Product[] = productsData as Product[];

// Get from localStorage on client side (for admin edits)
function getProductsFromStorage(): Product[] {
  if (typeof window === 'undefined') return products;
  try {
    const stored = localStorage.getItem('sparkpicks_products');
    if (stored) return JSON.parse(stored);
  } catch {}
  return products;
}

export function saveProductsToStorage(prods: Product[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sparkpicks_products', JSON.stringify(prods));
}

export function getAllProducts(): Product[] {
  return getProductsFromStorage();
}

export function getPublishedProducts(): Product[] {
  return getProductsFromStorage().filter(p => p.status === 'published');
}

export function getFeaturedProducts(): Product[] {
  return getProductsFromStorage().filter(p => p.featured && p.status === 'published');
}

export function getHeroProduct(): Product | undefined {
  return getProductsFromStorage().find(p => p.heroPlacement && p.status === 'published');
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProductsFromStorage().find(p => p.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return getProductsFromStorage()
    .filter(p => p.slug !== product.slug && p.status === 'published')
    .slice(0, limit);
}

export function getStats() {
  const all = getProductsFromStorage();
  const categories = new Set(all.map(p => p.category));
  return {
    total: all.length,
    featured: all.filter(p => p.featured).length,
    categories: categories.size,
  };
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function getDiscount(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100);
}

export function saveProduct(product: Product) {
  const all = getProductsFromStorage();
  const idx = all.findIndex(p => p.id === product.id);
  if (idx >= 0) {
    all[idx] = product;
  } else {
    all.unshift(product);
  }
  saveProductsToStorage(all);
  return all;
}

export function deleteProduct(id: string) {
  const all = getProductsFromStorage().filter(p => p.id !== id);
  saveProductsToStorage(all);
  return all;
}

export function createEmptyProduct(): Product {
  return {
    id: Date.now().toString(),
    slug: '',
    title: '',
    brand: '',
    category: '',
    price: 0,
    originalPrice: 0,
    status: 'draft',
    heroPlacement: false,
    featured: false,
    rating: 0,
    reviewCount: 0,
    description: '',
    curatorNote: '',
    features: [],
    externalUrl: '',
    images: [],
    tags: [],
  };
}
