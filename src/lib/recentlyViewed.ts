export function getRecentlyViewed(): string[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem('sparkpicks_recent') || '[]'); }
  catch { return []; }
}

export function addRecentlyViewed(slug: string): void {
  if (typeof window === 'undefined') return;
  const recent = getRecentlyViewed().filter(s => s !== slug);
  recent.unshift(slug);
  localStorage.setItem('sparkpicks_recent', JSON.stringify(recent.slice(0, 10)));
}

export function clearRecentlyViewed(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sparkpicks_recent', '[]');
}
