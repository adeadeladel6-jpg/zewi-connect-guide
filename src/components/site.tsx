import { Link } from "@tanstack/react-router";
import { MessageCircle, Phone, MapPin, Clock, BadgeCheck, Sparkles } from "lucide-react";
import {
  SUPPORT_MESSAGE,
  WHATSAPP_DISPLAY,
  waLink,
  type Listing,
} from "@/lib/directory";

export function SupportButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={waLink(SUPPORT_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2 text-sm font-bold text-whatsapp-foreground transition-transform hover:scale-[1.03] ${className}`}
    >
      <MessageCircle className="size-4" />
      دعم واتساب
    </a>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 glass">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:flex sm:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/15 ring-glow">
            <Sparkles className="size-5 text-primary" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-lg font-black leading-tight sm:text-xl">
              دليل زوي <span className="text-gradient-gold">الرقمي</span>
            </span>
            <span className="block truncate text-[11px] text-muted-foreground">
              بلدية أولاد رشاش — زوي
            </span>
          </span>
        </Link>
        <SupportButton />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-card/40 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-3">
        <div>
          <h3 className="text-lg font-black">
            دليل زوي <span className="text-gradient-gold">الرقمي</span>
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            منصة محلية تجمع كل محلات وحرفيي وخدمات منطقة زوي في مكان واحد.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold">روابط سريعة</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="/#listings" className="transition-colors hover:text-primary">
                دليل الخدمات
              </a>
            </li>
            <li>
              <a href="/#add" className="transition-colors hover:text-primary">
                أضف نشاطك التجاري
              </a>
            </li>
            <li>
              <Link to="/admin" className="transition-colors hover:text-primary">
                لوحة الإدارة
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold">تواصل معنا</h4>
          <a
            href={waLink(SUPPORT_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-whatsapp"
            dir="ltr"
          >
            <MessageCircle className="size-4" />
            {WHATSAPP_DISPLAY}
          </a>
          <p className="mt-4 text-xs text-muted-foreground">
            © {new Date().getFullYear()} دليل زوي الرقمي. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function ListingCard({ item }: { item: Listing }) {
  const msg = `مرحباً، وجدت "${item.name}" في دليل زوي الرقمي، لدي استفسار.`;
  return (
    <article className="group relative flex flex-col gap-4 rounded-3xl glass p-5 transition-all duration-300 hover:-translate-y-1 hover:ring-glow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-black">{item.name}</h3>
          <span className="mt-1 inline-block rounded-full bg-primary/12 px-3 py-1 text-[11px] font-bold text-primary">
            {item.category}
          </span>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {item.featured && (
            <span className="rounded-full bg-gold/15 px-2.5 py-1 text-[10px] font-black text-gold">
              مميّز
            </span>
          )}
          {item.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/12 px-2.5 py-1 text-[10px] font-black text-primary">
              <BadgeCheck className="size-3" /> موثوق
            </span>
          )}
        </div>
      </div>

      {item.description && (
        <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
      )}

      <ul className="space-y-2 text-sm text-muted-foreground">
        <li className="flex items-center gap-2">
          <MapPin className="size-4 shrink-0 text-primary" />
          <span className="min-w-0 truncate">{item.address}</span>
        </li>
        <li className="flex items-center gap-2">
          <Clock className="size-4 shrink-0 text-primary" />
          <span className="min-w-0 truncate">{item.hours}</span>
        </li>
        <li className="flex items-center gap-2">
          <Phone className="size-4 shrink-0 text-primary" />
          <span dir="ltr">{item.phone}</span>
        </li>
      </ul>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-1">
        <a
          href={`tel:${item.phone}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Phone className="size-4" /> اتصل الآن
        </a>
        <a
          href={waLink(msg)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-3 py-2.5 text-sm font-bold text-whatsapp-foreground transition-opacity hover:opacity-90"
        >
          <MessageCircle className="size-4" /> واتساب
        </a>
      </div>
    </article>
  );
}
