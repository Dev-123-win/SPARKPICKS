export function getWishlist(): string[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem('sparkpicks_wishlist') || '[]'); }
  catch { return []; }
}

export function toggleWishlist(slug: string): { wishlisted: boolean } {
  const list = getWishlist();
  const idx = list.indexOf(slug);
  if (idx >= 0) list.splice(idx, 1);
  else list.unshift(slug);
  localStorage.setItem('sparkpicks_wishlist', JSON.stringify(list));
  window.dispatchEvent(new Event('wishlist-updated'));
  return { wishlisted: idx < 0 };
}

export function isWishlisted(slug: string): boolean {
  return getWishlist().includes(slug);
}

export function getWishlistCount(): number {
  return getWishlist().length;
}
