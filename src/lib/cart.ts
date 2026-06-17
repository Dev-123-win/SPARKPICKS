export interface CartItem {
  productId: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  size: string;
  quantity: number;
}

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem('sparkpicks_cart') || '[]'); }
  catch { return []; }
}

export function addToCart(item: CartItem): CartItem[] {
  const cart = getCart();
  const idx = cart.findIndex(i => i.productId === item.productId && i.size === item.size);
  if (idx >= 0) {
    cart[idx].quantity += item.quantity;
  } else {
    cart.unshift(item);
  }
  localStorage.setItem('sparkpicks_cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
  return cart;
}

export function removeFromCart(productId: string, size: string): CartItem[] {
  const cart = getCart().filter(i => !(i.productId === productId && i.size === size));
  localStorage.setItem('sparkpicks_cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
  return cart;
}

export function updateQty(productId: string, size: string, quantity: number): CartItem[] {
  const cart = getCart().map(i =>
    i.productId === productId && i.size === size ? { ...i, quantity } : i
  );
  localStorage.setItem('sparkpicks_cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
  return cart;
}

export function clearCart(): CartItem[] {
  localStorage.setItem('sparkpicks_cart', '[]');
  window.dispatchEvent(new Event('cart-updated'));
  return [];
}

export function getCartCount(): number {
  return getCart().reduce((sum, i) => sum + i.quantity, 0);
}

export function getCartTotal(): number {
  return getCart().reduce((sum, i) => sum + i.price * i.quantity, 0);
}
