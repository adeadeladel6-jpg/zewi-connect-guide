import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "تحديث المنصة - دليل زوي الرقمي" },
      {
        name: "description",
        content: "تم إيقاف هذه النسخة من دليل زوي الرقمي. توجّه إلى الموقع الجديد أو تواصل معنا عبر واتساب.",
      },
      { property: "og:title", content: "تحديث المنصة - دليل زوي الرقمي" },
      {
        property: "og:description",
        content: "تم إيقاف هذه النسخة من دليل زوي الرقمي. توجّه إلى الموقع الجديد أو تواصل معنا عبر واتساب.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DisabledPage,
});

function DisabledPage() {
  const [code, setCode] = useState("");
  const [showError, setShowError] = useState(false);

  const checkCode = () => {
    if (!code.trim()) {
      setShowError(true);
      return;
    }
    setShowError(false);
    alert("جاري التحقق من الكود...");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-xl">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-amber-50 text-3xl text-amber-600 shadow-inner">
          ⚠️
        </div>

        <h1 className="mb-2 text-2xl font-bold text-slate-800">عذراً، هذا الموقع معطل حالياً</h1>
        <p className="mb-6 text-sm leading-relaxed text-slate-600">
          تم إيقاف هذه النسخة. يرجى إدخال كود التحقق أدناه أو التوجه مباشرة إلى الموقع الجديد.
        </p>

        <div className="mb-6 text-right">
          <label htmlFor="verifyCode" className="mb-2 block text-xs font-semibold text-slate-500">
            أدخل كود التحقق:
          </label>
          <div className="flex gap-2">
            <input
              id="verifyCode"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && checkCode()}
              placeholder="أدخل الكود هنا..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition focus:border-blue-600 focus:outline-none"
            />
            <button
              onClick={checkCode}
              className="rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-900"
            >
              تأكيد
            </button>
          </div>
          {showError && <p className="mt-1 text-xs text-red-500">الرجاء إدخال الكود الصحيح</p>}
        </div>

        <hr className="mb-6 border-slate-100" />

        <div className="space-y-3">
          <a
            href="https://zoui-directory-hub-0a2d96a9.vercel.app/"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            <span>🌐 التوجه إلى الموقع الجديد</span>
          </a>

          <a
            href="https://wa.me/213674683259"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
          >
            <span>💬 تواصل معنا عبر واتساب</span>
          </a>
        </div>

        <p className="mt-8 text-xs text-slate-400">جميع الحقوق محفوظة © دليل زوي الرقمي 2026</p>
      </div>
    </main>
  );
}
