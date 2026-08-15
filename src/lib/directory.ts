export const WHATSAPP_NUMBER = "213674683259";
export const WHATSAPP_DISPLAY = "0674683259";
export const SUPPORT_MESSAGE = "مرحباً، لدي استفسار أو مشكلة في موقع دليل زوي";
export const ADMIN_PASSWORD = "Admin@0674";

export const waLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export type Listing = {
  id: string;
  name: string;
  category: string;
  phone: string;
  address: string;
  hours: string;
  description?: string;
  featured?: boolean;
  verified?: boolean;
};

export const DEFAULT_CATEGORIES = [
  "أطباء وصيدليات",
  "حرفيين وسباكة",
  "محلات وسوبيرات",
  "مطاعم ومقاهي",
  "نقل وتوصيل",
  "خدمات أخرى",
];

export const DEFAULT_LISTINGS: Listing[] = [
  {
    id: "l1",
    name: "صيدلية النور",
    category: "أطباء وصيدليات",
    phone: "0674683259",
    address: "الشارع الرئيسي، زوي",
    hours: "08:00 - 22:00 يومياً",
    description: "أدوية، مستلزمات طبية وقياس الضغط مجاناً.",
    verified: true,
    featured: true,
  },
  {
    id: "l2",
    name: "عيادة الدكتور بلقاسم",
    category: "أطباء وصيدليات",
    phone: "0674683259",
    address: "قرب المدرسة الابتدائية، زوي",
    hours: "السبت - الخميس: 09:00 - 17:00",
    description: "طب عام وفحوصات دورية.",
    verified: true,
  },
  {
    id: "l3",
    name: "ورشة الأمين للسباكة",
    category: "حرفيين وسباكة",
    phone: "0674683259",
    address: "حي 20 مسكن، زوي",
    hours: "متوفر 24/24 للطوارئ",
    description: "تركيب وإصلاح قنوات المياه والتسربات.",
    featured: true,
  },
  {
    id: "l4",
    name: "كهرباء عام - عمّار",
    category: "حرفيين وسباكة",
    phone: "0674683259",
    address: "وسط زوي",
    hours: "08:00 - 19:00",
    description: "تمديدات كهربائية منزلية وصيانة.",
  },
  {
    id: "l5",
    name: "سوبيرات البركة",
    category: "محلات وسوبيرات",
    phone: "0674683259",
    address: "مقابل المسجد، زوي",
    hours: "07:00 - 23:00",
    description: "مواد غذائية عامة ومنتجات طازجة.",
    verified: true,
  },
  {
    id: "l6",
    name: "مقهى ومطعم الواحة",
    category: "مطاعم ومقاهي",
    phone: "0674683259",
    address: "الطريق الوطني، زوي",
    hours: "06:00 - 00:00",
    description: "وجبات سريعة، شاي وقهوة، فضاء عائلي.",
    featured: true,
  },
  {
    id: "l7",
    name: "نقل ركاب وتوصيل - سامي",
    category: "نقل وتوصيل",
    phone: "0674683259",
    address: "محطة زوي",
    hours: "05:30 - 21:00",
    description: "نقل داخل البلدية ونحو أولاد رشاش.",
  },
  {
    id: "l8",
    name: "مكتب الخدمات الرقمية",
    category: "خدمات أخرى",
    phone: "0674683259",
    address: "بجانب البريد، زوي",
    hours: "08:30 - 16:30",
    description: "طباعة، سحب وثائق ومساعدة إدارية.",
    verified: true,
  },
];

const LISTINGS_KEY = "zoui_listings_v1";
const CATEGORIES_KEY = "zoui_categories_v1";
export const ADMIN_KEY = "zoui_admin_session";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export const loadListings = () => read<Listing[]>(LISTINGS_KEY, DEFAULT_LISTINGS);
export const saveListings = (l: Listing[]) => write(LISTINGS_KEY, l);
export const loadCategories = () => read<string[]>(CATEGORIES_KEY, DEFAULT_CATEGORIES);
export const saveCategories = (c: string[]) => write(CATEGORIES_KEY, c);
export const newId = () => `l_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
