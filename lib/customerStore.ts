export type Address = {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault: boolean;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'Silver' | 'Gold' | 'Royal Gold';
  totalSpent: number;
  ordersCount: number;
  addresses: Address[];
  notes?: string;
  createdAt: string;
};

export type AdminRole = 'Super Admin' | 'Store Manager' | 'Product Manager' | 'Order Manager';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
  lastLogin: string;
};

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-101',
    name: 'Meera Sharma',
    email: 'meera.s@example.com',
    phone: '+91 98201 44821',
    tier: 'Royal Gold',
    totalSpent: 12450,
    ordersCount: 4,
    addresses: [
      {
        id: 'ADDR-1',
        fullName: 'Meera Sharma',
        phone: '+91 98201 44821',
        street: 'Flat 402, Lotus Residency, Worli Sea Face',
        landmark: 'Opp. Sea View Club',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400018',
        isDefault: true,
      },
    ],
    notes: 'Prefers 18k Gold Vermeil earrings. High lifetime value customer.',
    createdAt: '2025-11-14T10:00:00.000Z',
  },
  {
    id: 'CUST-102',
    name: 'Ananya Desai',
    email: 'ananya.desai@gmail.com',
    phone: '+91 99302 55192',
    tier: 'Gold',
    totalSpent: 6890,
    ordersCount: 2,
    addresses: [
      {
        id: 'ADDR-2',
        fullName: 'Ananya Desai',
        phone: '+91 99302 55192',
        street: 'House 14, 5th Main, Indiranagar',
        landmark: 'Near Metro Station',
        city: 'Bengaluru',
        state: 'Karnataka',
        pinCode: '560038',
        isDefault: true,
      },
    ],
    notes: 'Loves layered necklaces and delicate pendants.',
    createdAt: '2026-01-20T14:30:00.000Z',
  },
  {
    id: 'CUST-103',
    name: 'Rohan Varma',
    email: 'rohan.v@outlook.com',
    phone: '+91 98112 00392',
    tier: 'Gold',
    totalSpent: 8500,
    ordersCount: 3,
    addresses: [
      {
        id: 'ADDR-3',
        fullName: 'Rohan Varma',
        phone: '+91 98112 00392',
        street: 'B-12 Defence Colony',
        landmark: 'Main Market Road',
        city: 'New Delhi',
        state: 'Delhi',
        pinCode: '110024',
        isDefault: true,
      },
    ],
    notes: 'Gifts cuffs and bracelets for anniversaries.',
    createdAt: '2026-03-05T09:15:00.000Z',
  },
];

export const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 'ADM-1',
    name: 'Aarav Rathore',
    email: 'aarav@urbanglimmer.com',
    role: 'Super Admin',
    lastLogin: 'Today at 01:05 AM',
  },
  {
    id: 'ADM-2',
    name: 'Tara Singhania',
    email: 'tara.s@urbanglimmer.com',
    role: 'Store Manager',
    lastLogin: 'Yesterday at 04:30 PM',
  },
  {
    id: 'ADM-3',
    name: 'Kavita Iyer',
    email: 'kavita@urbanglimmer.com',
    role: 'Product Manager',
    lastLogin: 'Oct 27, 2026',
  },
  {
    id: 'ADM-4',
    name: 'Dev Malhotra',
    email: 'dev@urbanglimmer.com',
    role: 'Order Manager',
    lastLogin: 'Oct 28, 2026',
  },
];

const CUSTOMERS_KEY = 'ug_customers_v1';
const CURRENT_USER_KEY = 'ug_active_user_v1';
const ADMIN_SESSION_KEY = 'ug_admin_session_v1';
const ADMINS_KEY = 'ug_admins_list_v1';

export function getStoredCustomers(): Customer[] {
  if (typeof window === 'undefined') return INITIAL_CUSTOMERS;
  try {
    const raw = localStorage.getItem(CUSTOMERS_KEY);
    if (!raw) return INITIAL_CUSTOMERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CUSTOMERS;
  } catch {
    return INITIAL_CUSTOMERS;
  }
}

export function saveStoredCustomers(customers: Customer[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
}

export function getActiveCustomer(): Customer | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) {
      // Default to Meera Sharma as demo signed-in user
      const defaultUser = INITIAL_CUSTOMERS[0];
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(defaultUser));
      return defaultUser;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setActiveCustomer(customer: Customer | null): void {
  if (typeof window === 'undefined') return;
  if (!customer) {
    localStorage.removeItem(CURRENT_USER_KEY);
  } else {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(customer));
  }
  window.dispatchEvent(new Event('ug_customer_auth_changed'));
}

export function getStoredAdmins(): AdminUser[] {
  if (typeof window === 'undefined') return INITIAL_ADMINS;
  try {
    const raw = localStorage.getItem(ADMINS_KEY);
    if (!raw) return INITIAL_ADMINS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ADMINS;
  } catch {
    return INITIAL_ADMINS;
  }
}

export function saveStoredAdmins(admins: AdminUser[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
}

export function getAdminSession(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) {
      // Provide default authenticated session for development/demo
      const defaultAdmin = INITIAL_ADMINS[0];
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(defaultAdmin));
      return defaultAdmin;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAdminSession(admin: AdminUser | null): void {
  if (typeof window === 'undefined') return;
  if (!admin) {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  } else {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(admin));
  }
  window.dispatchEvent(new Event('ug_admin_auth_changed'));
}
