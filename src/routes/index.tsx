import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, MessageCircle, Store, ArrowLeft } from "lucide-react";
import { ListingCard, SiteFooter, SiteHeader } from "@/components/site";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_LISTINGS,
  loadCategories,
  loadListings,
  waLink,
  type Listing,
} from "@/lib/directory";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "دليل زوي الرقمي | محلات وحرفيو أولاد رشاش" },
      {
        name: "description",
        content:
          "ابحث عن الأطباء، الحرفيين، المحلات، المطاعم وخدمات النقل في منطقة زوي ببلدية أولاد رشاش، واتصل بهم مباشرة.",
      },
      { property: "og:title", content: "دليل زوي الرقمي | محلات وحرفيو أولاد رشاش" },
      {
        property: "og:description",
        content: "كل خدمات منطقة زوي في منصة واحدة: اتصال مباشر وواتساب فوري.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [listings, setListings] = useState<Listing[]>(DEFAULT_LISTINGS);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("الكل");

  useEffect(() => {
    setListings(loadListings());
    setCategories(loadCategories());
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings
      .filter((l) => (active === "الكل" ? true : l.category === active))
      .filter((l) =>
        q
          ? [l.name, l.category, l.address, l.description ?? "", l.phone]
              .join(" ")
              .toLowerCase()
              .includes(q)
          : true,
      )
      .sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  }, [listings, query, active]);

  const addMsg = "مرحباً، أرغب في إضافة نشاطي التجاري إلى دليل زوي الرقمي.";

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        <section className="mx-auto max-w-6xl px-4 pb-10 pt-14 text-center sm:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-bold text-muted-foreground">
            منصة محلية · بلدية أولاد رشاش
          </span>
          <h1 className="mt-6 text-4xl font-black leading-[1.2] sm:text-6xl">
            كل خدمات <span className="text-gradient-gold">زوي</span>
            <br />
            بين يديك في ثوانٍ
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            ابحث عن الطبيب، الحرفي، المحل أو خدمة النقل الأقرب إليك، واتصل مباشرة أو راسل
            عبر الواتساب.
          </p>

          <div className="mx-auto mt-8 max-w-2xl">
            <div className="flex items-center gap-3 rounded-2xl glass px-4 py-3">
              <Search className="size-5 shrink-0 text-primary" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث بالاسم، الخدمة أو الموقع..."
                className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["الكل", ...categories].map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                  active === c
                    ? "bg-primary text-primary-foreground ring-glow"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        <section id="listings" className="mx-auto max-w-6xl px-4 py-6">
          <div className="mb-6 flex items-baseline justify-between gap-3">
            <h2 className="text-2xl font-black">دليل الخدمات</h2>
            <span className="text-sm text-muted-foreground">{results.length} نتيجة</span>
          </div>

          {results.length === 0 ? (
            <div className="rounded-3xl glass p-10 text-center text-muted-foreground">
              لا توجد نتائج مطابقة. جرّب كلمة بحث أخرى أو تصنيفاً مختلفاً.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((item) => (
                <ListingCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        <section id="add" className="mx-auto max-w-6xl px-4 py-16">
          <div className="overflow-hidden rounded-[2rem] glass p-8 text-center sm:p-12">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-gold/15">
              <Store className="size-6 text-gold" />
            </span>
            <h2 className="mt-5 text-3xl font-black sm:text-4xl">أضف نشاطك التجاري</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              صاحب محل أو حرفي في زوي؟ أضف خدمتك مجاناً ليصل إليك سكان المنطقة بسهولة.
              أرسل لنا اسم النشاط، التصنيف، رقم الهاتف والعنوان عبر الواتساب.
            </p>
            <a
              href={waLink(addMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-whatsapp px-7 py-3.5 text-base font-black text-whatsapp-foreground transition-transform hover:scale-[1.03]"
            >
              <MessageCircle className="size-5" />
              أضف نشاطك عبر الواتساب
              <ArrowLeft className="size-4" />
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
