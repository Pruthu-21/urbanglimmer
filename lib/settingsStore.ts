export type StoreSettings = {
  storeName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  whatsappNumber: string;
  address: string;
  gstin: string;
  currency: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  expressShippingFee: number;
  returnWindowDays: number;
  cookieConsentEnabled: boolean;
};

export type CookiePreferences = {
  responded: boolean;
  essential: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
};

export type AuditLogEntry = {
  id: string;
  timestamp: string;
  adminName: string;
  action: string;
  target: string;
  details: string;
};

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'Urban Glimmer',
  tagline: 'Modern Luxury Jewellery & Festive Heirloom Pieces',
  supportEmail: 'concierge@urbanglimmer.com',
  supportPhone: '+91 (0) 22 6842 9900',
  whatsappNumber: '+91 98200 12345',
  address: 'Studio 4, Heritage Goldsmiths Quarter, Jaipur & Mumbai, India',
  gstin: '08AAFCU1234F1Z8',
  currency: 'INR',
  freeShippingThreshold: 1999,
  standardShippingFee: 99,
  expressShippingFee: 199,
  returnWindowDays: 15,
  cookieConsentEnabled: true,
};

export const DEFAULT_COOKIE_PREFS: CookiePreferences = {
  responded: false,
  essential: true,
  analytics: false,
  marketing: false,
  timestamp: '',
};

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'LOG-1',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    adminName: 'Aarav Rathore',
    action: 'STATUS_UPDATE',
    target: 'Order #UG-89412',
    details: 'Changed status to In Production (Jaipur Atelier)',
  },
  {
    id: 'LOG-2',
    timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    adminName: 'Kavita Iyer',
    action: 'INVENTORY_RESTOCK',
    target: 'The Solara Sculpted Hoops (UG-EAR-001)',
    details: 'Adjusted stock +12 units after BIS Hallmark batch verification',
  },
  {
    id: 'LOG-3',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    adminName: 'Tara Singhania',
    action: 'CAMPAIGN_UPDATE',
    target: 'Festive Modal (FESTIVE15)',
    details: 'Enabled seasonal privilege modal for Autumn festive season',
  },
];

const SETTINGS_KEY = 'ug_store_settings_v1';
const COOKIES_KEY = 'ug_cookie_consent_v1';
const AUDIT_KEY = 'ug_audit_logs_v1';

export function getStoreSettings(): StoreSettings {
  if (typeof window === 'undefined') return DEFAULT_STORE_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_STORE_SETTINGS;
    return { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STORE_SETTINGS;
  }
}

export function saveStoreSettings(settings: Partial<StoreSettings>): StoreSettings {
  const current = getStoreSettings();
  const updated = { ...current, ...settings };
  if (typeof window !== 'undefined') {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('ug_settings_updated'));
  }
  return updated;
}

export function getCookiePreferences(): CookiePreferences {
  if (typeof window === 'undefined') return DEFAULT_COOKIE_PREFS;
  try {
    const raw = localStorage.getItem(COOKIES_KEY);
    if (!raw) return DEFAULT_COOKIE_PREFS;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_COOKIE_PREFS;
  }
}

export function saveCookiePreferences(prefs: Partial<CookiePreferences>): CookiePreferences {
  const current = getCookiePreferences();
  const updated: CookiePreferences = {
    ...current,
    ...prefs,
    essential: true, // Always locked to true
    responded: true,
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(COOKIES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('ug_cookie_consent_updated'));
  }
  return updated;
}

export function getAuditLogs(): AuditLogEntry[] {
  if (typeof window === 'undefined') return INITIAL_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(AUDIT_KEY);
    if (!raw) return INITIAL_AUDIT_LOGS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_AUDIT_LOGS;
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
}

export function logAdminAction(adminName: string, action: string, target: string, details: string): void {
  const current = getAuditLogs();
  const newEntry: AuditLogEntry = {
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toISOString(),
    adminName,
    action,
    target,
    details,
  };
  const updated = [newEntry, ...current].slice(0, 100);
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUDIT_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('ug_audit_logs_updated'));
  }
}
