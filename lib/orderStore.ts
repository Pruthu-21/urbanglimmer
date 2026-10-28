import { Product } from './productStore';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'In Production'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type OrderItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  deliveryAddress: string;
  city: string;
  pinCode: string;
  paymentMethod: 'cod' | 'upi' | 'card';
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  grandTotal: number;
  status: OrderStatus;
  trackingNumber?: string;
  carrier?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

const ORDERS_KEY = 'urban_glimmer_orders_v1';

export const INITIAL_SAMPLE_ORDERS: Order[] = [
  {
    id: 'UG-89412',
    customerName: 'Meera Sharma',
    customerEmail: 'meera.s@example.com',
    customerPhone: '+91 98201 44821',
    deliveryAddress: 'Flat 402, Lotus Residency, Worli Sea Face',
    city: 'Mumbai',
    pinCode: '400018',
    paymentMethod: 'upi',
    items: [
      {
        product: {
          id: 1,
          name: 'The Solara Sculpted Hoops',
          category: 'Earrings',
          price: 1499,
          image: 'photo-1630019852942-f89202989a59',
          lifestyleImage: 'photo-1617038220319-276d3cfab638',
          color: '18k Gold Vermeil',
          material: 'Thick 18k gold over recycled sterling silver',
          dimensions: '22mm diameter',
          description: 'Sculptural hoops.',
          rating: '4.9',
          reviewsCount: 84,
        },
        quantity: 1,
      },
      {
        product: {
          id: 5,
          name: 'Solstice Sculpted Signet Ring',
          category: 'Rings',
          price: 1199,
          image: 'photo-1605100804763-247f67b3557e',
          lifestyleImage: 'photo-1603561591411-07134e71a2a9',
          color: '18k Gold Tone',
          material: 'Solid brass with high-polish 18k gold',
          dimensions: 'Size US 7',
          description: 'A confident signet ring.',
          rating: '4.8',
          reviewsCount: 53,
        },
        quantity: 1,
      },
    ],
    subtotal: 2698,
    discount: 270,
    shipping: 0,
    grandTotal: 2428,
    status: 'In Production',
    carrier: 'BlueDart Luxury Express',
    trackingNumber: 'BD-8839102-IN',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: 'UG-77290',
    customerName: 'Ananya Desai',
    customerEmail: 'ananya.desai@gmail.com',
    customerPhone: '+91 99302 55192',
    deliveryAddress: 'House 14, 5th Main, Indiranagar',
    city: 'Bengaluru',
    pinCode: '560038',
    paymentMethod: 'cod',
    items: [
      {
        product: {
          id: 2,
          name: 'Amara Layered Pendant Chain',
          category: 'Necklaces',
          price: 1899,
          image: 'photo-1599643478518-a784e5dc4c8f',
          lifestyleImage: 'photo-1611652022419-a9419f74343d',
          color: '18k Gold Plated',
          material: 'Triple-coated 18k yellow gold',
          dimensions: '40cm + 5cm',
          description: 'Dual-layered look.',
          rating: '4.8',
          reviewsCount: 62,
        },
        quantity: 1,
      },
    ],
    subtotal: 1899,
    discount: 0,
    shipping: 99,
    grandTotal: 1998,
    status: 'Shipped',
    carrier: 'Delhivery Surface',
    trackingNumber: 'DLV-30491823',
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'UG-62914',
    customerName: 'Rohan Varma',
    customerEmail: 'rohan.v@outlook.com',
    customerPhone: '+91 98112 00392',
    deliveryAddress: 'B-12 Defence Colony',
    city: 'New Delhi',
    pinCode: '110024',
    paymentMethod: 'upi',
    items: [
      {
        product: {
          id: 3,
          name: 'Aurelia Polished Ribbed Cuff',
          category: 'Bracelets',
          price: 1699,
          image: 'photo-1611591437281-460bfbe1220a',
          lifestyleImage: 'photo-1573408301185-9146fe634ad0',
          color: 'Polished Gold',
          material: 'Hypoallergenic brass dipped in 18k gold',
          dimensions: '60mm adjustable',
          description: 'Sculptural cuff.',
          rating: '4.9',
          reviewsCount: 47,
        },
        quantity: 2,
      },
    ],
    subtotal: 3398,
    discount: 509,
    shipping: 0,
    grandTotal: 2889,
    status: 'Delivered',
    carrier: 'BlueDart Express',
    trackingNumber: 'BD-1994012-IN',
    createdAt: new Date(Date.now() - 140 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
];

export function getStoredOrders(): Order[] {
  if (typeof window === 'undefined') return INITIAL_SAMPLE_ORDERS;
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return INITIAL_SAMPLE_ORDERS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to parse stored orders:', err);
  }
  return INITIAL_SAMPLE_ORDERS;
}

export function saveStoredOrders(orders: Order[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event('urban_glimmer_orders_updated'));
  } catch (err) {
    console.error('Failed to save orders:', err);
  }
}

export function createNewOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Order {
  const current = getStoredOrders();
  const randomSuffix = Math.floor(10000 + Math.random() * 89999);
  const newOrder: Order = {
    ...orderData,
    id: `UG-${randomSuffix}`,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [newOrder, ...current];
  saveStoredOrders(updated);
  return newOrder;
}

export function updateOrderStatus(orderId: string, newStatus: OrderStatus, carrier?: string, trackingNumber?: string): Order | null {
  const current = getStoredOrders();
  const idx = current.findIndex((o) => o.id === orderId);
  if (idx === -1) return null;

  const order = current[idx];
  const updatedOrder: Order = {
    ...order,
    status: newStatus,
    carrier: carrier || order.carrier,
    trackingNumber: trackingNumber || order.trackingNumber,
    updatedAt: new Date().toISOString(),
  };

  const updated = [...current];
  updated[idx] = updatedOrder;
  saveStoredOrders(updated);
  return updatedOrder;
}

export function deleteOrder(orderId: string): boolean {
  const current = getStoredOrders();
  const filtered = current.filter((o) => o.id !== orderId);
  if (filtered.length === current.length) return false;
  saveStoredOrders(filtered);
  return true;
}

/**
 * Generates ready-to-send Customer Reply message for WhatsApp / SMS / Email
 */
export function generateStatusReplyTemplate(order: Order): string {
  const itemNames = order.items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ');

  switch (order.status) {
    case 'Pending':
      return `Hi ${order.customerName}! ✨ Thank you for ordering from Urban Glimmer. Your order #${order.id} for ${itemNames} has been received and is being prepared by our artisan studio. We will update you as soon as crafting begins!`;
    case 'Confirmed':
      return `Hello ${order.customerName}! 🌟 Your Urban Glimmer order #${order.id} is confirmed! Our goldsmiths have queued your piece(s) for final inspection and gift packaging.`;
    case 'In Production':
      return `Hi ${order.customerName}! ⚒️ Great news: your jewelry order #${order.id} (${itemNames}) is currently being finished and hand-polished at the Urban Glimmer studio. It will be securely packed in our velvet gift box shortly.`;
    case 'Shipped':
      return `Hello ${order.customerName}! 📦 Your Urban Glimmer order #${order.id} has been dispatched via ${order.carrier || 'Express Courier'}${order.trackingNumber ? ` (Tracking: ${order.trackingNumber})` : ''}. It is on its way to ${order.city}!`;
    case 'Delivered':
      return `Hi ${order.customerName}! 💖 Your Urban Glimmer package #${order.id} has been delivered. We hope these pieces bring lasting glow to your everyday. Tag us on Instagram @urbanglimmer!`;
    case 'Cancelled':
      return `Dear ${order.customerName}, your Urban Glimmer order #${order.id} has been cancelled as requested. Any applicable refund has been initiated. If you have questions, please reply directly.`;
    default:
      return `Hi ${order.customerName}, your Urban Glimmer order #${order.id} status is: ${order.status}.`;
  }
}
