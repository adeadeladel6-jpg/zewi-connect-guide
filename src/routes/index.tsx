import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  MessageCircle,
  Store,
  ArrowLeft,
  SlidersHorizontal,
  Check,
  CheckCircle2,
} from "lucide-react";
import { ListingCard, SiteFooter, SiteHeader } from "@/components/site";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_LISTINGS,
  isValidPhone,
  loadCategories,
  loadListings,
  loadPending,
  newId,
  normalizePhone,
  savePending,
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type FormState = {
  name: string;
  category: string;
  phone: string;
  address: string;
  hours: string;
  description: string;
};

const emptyForm = (category: string): FormState => ({
  name: "",
  category,
  phone: "",
  address: "",
  hours: "",
  description: "",
});

function Index() {
  const [listings, setListings] = useState<Listing[]>(DEFAULT_LISTINGS);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("الكل");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [form, setForm] = useState<FormState>(emptyForm(DEFAULT_CATEGORIES[0] ?? "خدمات أخرى"));
  const [formError, setFormError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const cats = loadCategories();
    setListings(loadListings());
    setCategories(cats);
    setForm((f) => ({ ...f, category: cats[0] ?? f.category }));
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

  function pickCategory(c: string) {
    setActive(c);
    setFiltersOpen(false);
  }

  function submitRequest(e: React.FormEvent) {
    e.preventDefault();
    const clean = {
      name: form.name.trim().replace(/\s+/g, " "),
      category: form.category,
      phone: normalizePhone(form.phone),
      address: form.address.trim().replace(/\s+/g, " "),
      hours: form.hours.trim().replace(/\s+/g, " "),
      description: form.description.trim(),
    };
    if (clean.name.length < 2) {
      setFormError("يرجى إدخال اسم النشاط بشكل صحيح.");
      return;
    }
    if (!isValidPhone(clean.phone)) {
      setFormError("رقم الهاتف يجب أن يتكون من 10 أرقام ويبدأ بـ 0.");
      return;
    }
    if (clean.address.length < 3) {
      setFormError("يرجى إدخال العنوان داخل زوي.");
      return;
    }
    const entry: Listing = {
      id: newId(),
      ...clean,
      hours: clean.hours || "غير محدد",
      featured: false,
      verified: false,
    };
    savePending([entry, ...loadPending()]);
    setFormError("");
    setSent(true);
    setForm(emptyForm(categories[0] ?? "خدمات أخرى"));
  }

  const fields = [
    ["name", "اسم النشاط *", "مثال: مخبزة النخيل"],
    ["phone", "رقم الهاتف (10 أرقام) *", "0674683259"],
    ["address", "العنوان في زوي *", "الشارع الرئيسي، زوي"],
    ["hours", "أوقات العمل", "08:00 - 20:00"],
    ["description", "وصف مختصر", "ما الخدمات التي تقدمها؟"],
  ] as const;

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        <section className="mx-auto max-w-6xl px-4 pb-10 pt-12 text-center sm:pt-20">
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

          {/* Mobile: collapsible filters that close on选择 */}
          <div className="mt-5 sm:hidden">
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              aria-expanded={filtersOpen}
              className="inline-flex w-full items-center justify-between gap-2 rounded-2xl glass px-4 py-3.5 text-sm font-bold"
            >
              <span className="inline-flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-primary" />
                التصنيف
              </span>
              <span className="text-primary">{active}</span>
            </button>
            {filtersOpen && (
              <div className="mt-2 space-y-1 rounded-2xl glass p-2 text-right">
                {["الكل", ...categories].map((c) => (
                  <button
                    key={c}
                    onClick={() => pickCategory(c)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold ${
                      active === c ? "bg-primary/15 text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {c}
                    {active === c && <Check className="size-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 hidden flex-wrap justify-center gap-2 sm:flex">
            {["الكل", ...categories].map((c) => (
              <button
                key={c}
                onClick={() => pickCategory(c)}
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

        <section id="add" className="mx-auto max-w-3xl px-4 py-14">
          <div className="overflow-hidden rounded-[2rem] glass p-6 sm:p-10">
            <div className="text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-gold/15">
                <Store className="size-6 text-gold" />
              </span>
              <h2 className="mt-5 text-3xl font-black sm:text-4xl">أضف نشاطك التجاري</h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                أرسل بيانات نشاطك وسيتم نشره بعد مراجعته من طرف الإدارة لضمان دقة الدليل.
              </p>
            </div>

            {sent ? (
              <div className="mt-8 rounded-2xl bg-primary/10 p-6 text-center">
                <CheckCircle2 className="mx-auto size-9 text-primary" />
                <p className="mt-3 text-lg font-black">تم إرسال طلبك بنجاح</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  طلبك الآن قيد المراجعة، سيظهر في الدليل بعد موافقة الإدارة.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-5 rounded-xl bg-primary px-6 py-3 text-sm font-black text-primary-foreground"
                >
                  إرسال طلب آخر
                </button>
              </div>
            ) : (
              <form onSubmit={submitRequest} className="mt-8 grid gap-3 sm:grid-cols-2">
                {fields.map(([key, label, ph]) => (
                  <label key={key} className={key === "description" ? "sm:col-span-2" : ""}>
                    <span className="text-xs font-bold text-muted-foreground">{label}</span>
                    <input
                      value={form[key]}
                      inputMode={key === "phone" ? "numeric" : "text"}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [key]:
                            key === "phone" ? normalizePhone(e.target.value) : e.target.value,
                        })
                      }
                      placeholder={ph}
                      dir={key === "phone" ? "ltr" : undefined}
                      className="mt-1 w-full rounded-xl bg-input/40 px-4 py-3 text-base outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
                    />
                  </label>
                ))}

                <label className="sm:col-span-2">
                  <span className="text-xs font-bold text-muted-foreground">التصنيف</span>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="mt-1 w-full rounded-xl bg-input/40 px-4 py-3 text-base outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c} className="bg-popover">
                        {c}
                      </option>
                    ))}
                  </select>
                </label>

                {formError && (
                  <p className="text-sm font-bold text-destructive sm:col-span-2">{formError}</p>
                )}

                <button
                  type="submit"
                  className="mt-2 w-full rounded-xl bg-primary py-4 text-base font-black text-primary-foreground transition-opacity hover:opacity-90 sm:col-span-2"
                >
                  إرسال الطلب للمراجعة
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <a
                href={waLink(addMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3.5 text-sm font-black text-whatsapp-foreground transition-transform hover:scale-[1.03]"
              >
                <MessageCircle className="size-5" />
                أو تواصل معنا عبر الواتساب
                <ArrowLeft className="size-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
