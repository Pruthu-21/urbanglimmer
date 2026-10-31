export type Review = {
  id: string;
  productId: number;
  productName: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  date: string;
  status: 'approved' | 'pending' | 'hidden';
  adminReply?: string;
};

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'REV-1',
    productId: 1,
    productName: 'The Solara Sculpted Hoops',
    author: 'Pooja Kulkarni',
    rating: 5,
    title: 'Exquisite weight and luminous polish',
    comment: 'Wore these for my sister’s sangeet and couldn’t feel them on my ears even after 8 hours. The 18k vermeil finish has not tarnished at all. Beautifully crafted.',
    verifiedPurchase: true,
    date: '2026-10-12',
    status: 'approved',
    adminReply: 'Thank you Pooja! The hollow interior architecture was specially engineered for effortless festive wear.',
  },
  {
    id: 'REV-2',
    productId: 2,
    productName: 'Amara Layered Pendant Chain',
    author: 'Simran Chadha',
    rating: 5,
    title: 'Heirloom quality in modern silhouette',
    comment: 'The layering sits completely flat without tangling. The gold has that warm, authentic Indian hue rather than brassy yellow. Love the packaging too.',
    verifiedPurchase: true,
    date: '2026-10-18',
    status: 'approved',
  },
  {
    id: 'REV-3',
    productId: 3,
    productName: 'Aurelia Polished Ribbed Cuff',
    author: 'Nandini Sen',
    rating: 5,
    title: 'Statement piece that elevates every outfit',
    comment: 'A magnificent architectural cuff. Looks remarkably heavy and luxurious yet adjusts gently to the wrist. I get compliments every time I wear it.',
    verifiedPurchase: true,
    date: '2026-10-22',
    status: 'approved',
  },
  {
    id: 'REV-4',
    productId: 4,
    productName: 'Luna Luminous Pearl Drops',
    author: 'Dia Mehta',
    rating: 4,
    title: 'Stunning organic pearls',
    comment: 'The pearls have a natural, irregular luster that feels very authentic and bespoke. Clasp is secure.',
    verifiedPurchase: true,
    date: '2026-10-25',
    status: 'approved',
  },
];

const REVIEWS_KEY = 'ug_reviews_v1';

export function getStoredReviews(): Review[] {
  if (typeof window === 'undefined') return INITIAL_REVIEWS;
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    if (!raw) return INITIAL_REVIEWS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_REVIEWS;
  } catch {
    return INITIAL_REVIEWS;
  }
}

export function saveStoredReviews(reviews: Review[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  window.dispatchEvent(new Event('ug_reviews_updated'));
}

export function getProductReviews(productId: number): Review[] {
  const all = getStoredReviews();
  return all.filter((r) => r.productId === productId && r.status === 'approved');
}

export function addReview(review: Omit<Review, 'id' | 'date' | 'status'>): Review {
  const current = getStoredReviews();
  const newReview: Review = {
    ...review,
    id: `REV-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    status: 'approved',
  };
  const updated = [newReview, ...current];
  saveStoredReviews(updated);
  return newReview;
}

export function updateReviewStatus(id: string, status: 'approved' | 'pending' | 'hidden'): boolean {
  const current = getStoredReviews();
  const idx = current.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  current[idx].status = status;
  saveStoredReviews([...current]);
  return true;
}

export function replyToReview(id: string, replyText: string): boolean {
  const current = getStoredReviews();
  const idx = current.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  current[idx].adminReply = replyText;
  saveStoredReviews([...current]);
  return true;
}
