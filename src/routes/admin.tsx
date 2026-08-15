import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { LogOut, Plus, Pencil, Trash2, Star, Lock, ArrowRight, X } from "lucide-react";
import {
  ADMIN_KEY,
  ADMIN_PASSWORD,
  DEFAULT_CATEGORIES,
  DEFAULT_LISTINGS,
  loadCategories,
  loadListings,
  newId,
  saveCategories,
  saveListings,
  type Listing,
} from "@/lib/directory";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة الإدارة | دليل زوي الرقمي" },
      { name: "description", content: "لوحة تحكم إدارة بطاقات وتصنيفات دليل زوي الرقمي." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "لوحة الإدارة | دليل زوي الرقمي" },
      { property: "og:description", content: "إدارة بطاقات وتصنيفات دليل زوي الرقمي." },
    ],
  }),
  component: AdminPage,
});

const empty = (category: string): Listing => ({
  id: "",
  name: "",
  category,
  phone: "",
  address: "",
  hours: "",
  description: "",
  featured: false,
  verified: false,
});

function AdminPage() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [listings, setListings] = useState<Listing[]>(DEFAULT_LISTINGS);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [draft, setDraft] = useState<Listing | null>(null);
  const [newCat, setNewCat] = useState("");

  useEffect(() => {
    setAuthed(window.localStorage.getItem(ADMIN_KEY) === "true");
    setListings(loadListings());
    setCategories(loadCategories());
    setReady(true);
  }, []);

  const stats = useMemo(
    () => ({
      total: listings.length,
      featured: listings.filter((l) => l.featured).length,
      cats: categories.length,
    }),
    [listings, categories],
  );

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (password.trim() === ADMIN_PASSWORD) {
      window.localStorage.setItem(ADMIN_KEY, "true");
      setError("");
      setPassword("");
      setAuthed(true);
      return;
    }
    setError("كلمة السر غير صحيحة، حاول مرة أخرى.");
  }

  function logout() {
    window.localStorage.removeItem(ADMIN_KEY);
    setAuthed(false);
  }

  function persist(next: Listing[]) {
    setListings(next);
    saveListings(next);
  }

  function persistCats(next: string[]) {
    setCategories(next);
    saveCategories(next);
  }

  function submitDraft(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    const clean: Listing = {
      ...draft,
      name: draft.name.trim(),
      phone: draft.phone.trim(),
      address: draft.address.trim(),
      hours: draft.hours.trim(),
      description: (draft.description ?? "").trim(),
    };
    if (!clean.name) return;
    if (clean.id) {
      persist(listings.map((l) => (l.id === clean.id ? clean : l)));
    } else {
      persist([{ ...clean, id: newId() }, ...listings]);
    }
    setDraft(null);
  }

  if (!ready) return <div className="min-h-screen" />;

  if (!authed) {
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <form onSubmit={login} className="w-full max-w-sm rounded-3xl glass p-8 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/15 ring-glow">
            <Lock className="size-6 text-primary" />
          </span>
          <h1 className="mt-5 text-2xl font-black">لوحة الإدارة</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            أدخل كلمة السر للوصول إلى إدارة دليل زوي الرقمي.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            placeholder="كلمة السر"
            autoFocus
            className="mt-6 w-full rounded-xl bg-input/40 px-4 py-3 text-center outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
          />
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            className="mt-5 w-full rounded-xl bg-primary py-3 font-black text-primary-foreground transition-opacity hover:opacity-90"
          >
            دخول
          </button>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
          >
            العودة للموقع <ArrowRight className="size-3" />
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 glass">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:flex sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-black">لوحة تحكم دليل زوي</h1>
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary">
              عرض الموقع
            </Link>
          </div>
          <button
            onClick={logout}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-destructive/15 px-4 py-2 text-sm font-bold text-destructive"
          >
            <LogOut className="size-4" /> تسجيل الخروج
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "إجمالي البطاقات", value: stats.total },
            { label: "بطاقات مميّزة", value: stats.featured },
            { label: "التصنيفات", value: stats.cats },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl glass p-5">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-3xl font-black text-primary">{s.value}</p>
            </div>
          ))}
        </div>

        <section className="rounded-3xl glass p-6">
          <h2 className="text-lg font-black">إدارة التصنيفات</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm font-bold"
              >
                {c}
                <button
                  onClick={() => persistCats(categories.filter((x) => x !== c))}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label={`حذف ${c}`}
                >
                  <X className="size-3.5" />
                </button>
              </span>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const v = newCat.trim();
              if (!v || categories.includes(v)) return;
              persistCats([...categories, v]);
              setNewCat("");
            }}
            className="mt-4 flex gap-2"
          >
            <input
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="تصنيف جديد"
              className="min-w-0 flex-1 rounded-xl bg-input/40 px-4 py-2.5 outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
            />
            <button className="shrink-0 rounded-xl bg-primary px-5 py-2.5 font-bold text-primary-foreground">
              إضافة
            </button>
          </form>
        </section>

        <section className="rounded-3xl glass p-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <h2 className="truncate text-lg font-black">البطاقات</h2>
            <button
              onClick={() => setDraft(empty(categories[0] ?? "خدمات أخرى"))}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
            >
              <Plus className="size-4" /> بطاقة جديدة
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {listings.map((l) => (
              <div
                key={l.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-secondary/50 p-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-bold">
                    {l.name}
                    {l.featured && <span className="ms-2 text-xs text-gold">★ مميّز</span>}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {l.category} · <span dir="ltr">{l.phone}</span> · {l.address}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button
                    onClick={() =>
                      persist(
                        listings.map((x) =>
                          x.id === l.id ? { ...x, featured: !x.featured } : x,
                        ),
                      )
                    }
                    aria-label="تفعيل مميز"
                    className={`grid size-9 place-items-center rounded-xl ${l.featured ? "bg-gold/20 text-gold" : "bg-accent text-muted-foreground"}`}
                  >
                    <Star className="size-4" />
                  </button>
                  <button
                    onClick={() => setDraft(l)}
                    aria-label="تعديل"
                    className="grid size-9 place-items-center rounded-xl bg-accent text-primary"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    onClick={() => persist(listings.filter((x) => x.id !== l.id))}
                    aria-label="حذف"
                    className="grid size-9 place-items-center rounded-xl bg-destructive/15 text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {draft && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur">
          <form
            onSubmit={submitDraft}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl glass p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black">
                {draft.id ? "تعديل البطاقة" : "بطاقة جديدة"}
              </h3>
              <button type="button" onClick={() => setDraft(null)} aria-label="إغلاق">
                <X className="size-5 text-muted-foreground" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {(
                [
                  ["name", "اسم النشاط"],
                  ["phone", "رقم الهاتف"],
                  ["address", "العنوان في زوي"],
                  ["hours", "أوقات العمل"],
                  ["description", "وصف مختصر"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="block">
                  <span className="text-xs font-bold text-muted-foreground">{label}</span>
                  <input
                    value={(draft[key] as string) ?? ""}
                    onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                    className="mt-1 w-full rounded-xl bg-input/40 px-4 py-2.5 outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
                  />
                </label>
              ))}

              <label className="block">
                <span className="text-xs font-bold text-muted-foreground">التصنيف</span>
                <select
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                  className="mt-1 w-full rounded-xl bg-input/40 px-4 py-2.5 outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-popover">
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 text-sm font-bold">
                  <input
                    type="checkbox"
                    checked={!!draft.featured}
                    onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
                  />
                  مميّز
                </label>
                <label className="flex items-center gap-2 text-sm font-bold">
                  <input
                    type="checkbox"
                    checked={!!draft.verified}
                    onChange={(e) => setDraft({ ...draft, verified: e.target.checked })}
                  />
                  موثوق
                </label>
              </div>
            </div>

            <button className="mt-6 w-full rounded-xl bg-primary py-3 font-black text-primary-foreground">
              حفظ
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
