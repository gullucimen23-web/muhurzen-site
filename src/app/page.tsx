"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Intent = "iliski" | "bereket" | "enerji";

const intents = {
  iliski: {
    emoji: "❤️",
    title: "İlişki ve Uyum Niyeti",
    short: "İlişki & Uyum",
    description:
      "İlişkilerinde uyum, anlayış ve bağ hissine odaklanmak isteyenler için kişisel tasarım seçeneği.",
  },
  bereket: {
    emoji: "💰",
    title: "Bereket ve Motivasyon Niyeti",
    short: "Bereket & Motivasyon",
    description:
      "İş, kariyer, hedefler ve yaşam motivasyonuna odaklanan kişisel tasarım seçeneği.",
  },
  enerji: {
    emoji: "✨",
    title: "Enerji ve Odak Niyeti",
    short: "Enerji & Odak",
    description:
      "Son dönemde kendini düşük, kararsız veya dağınık hissedenler için odak ve yenilenme hissine yönelik tasarım seçeneği.",
  },
};

const relationStatuses = ["Evli", "Nişanlı", "Sevgili", "Flört", "Uzak Mesafe", "Ayrı / Görüşmüyor"];
const moneyFocus = ["İş Hayatı", "Kariyer", "Maddi Hedefler", "Yeni Başlangıç", "Genel Motivasyon"];
const energyFocus = ["Motivasyon Eksikliği", "Odak Sorunu", "Kararsızlık", "Yeni Dönem", "Kendimi Düşük Hissediyorum"];

export default function Home() {
  const [intent, setIntent] = useState<Intent>("iliski");
  const [answers, setAnswers] = useState({ q1: "", q2: "", q3: "" });
  const [form, setForm] = useState({
    name: "",
    motherName: "",
    birthDate: "",
    partnerName: "",
    partnerMotherName: "",
    partnerBirthDate: "",
    relationStatus: relationStatuses[0],
    focus: moneyFocus[0],
    energyState: energyFocus[0],
    note: "",
  });

  const quizResult = useMemo<Intent>(() => {
    const text = `${answers.q1} ${answers.q2} ${answers.q3}`.toLowerCase();
    if (text.includes("ilişki") || text.includes("uyum") || text.includes("eş") || text.includes("partner")) return "iliski";
    if (text.includes("iş") || text.includes("kariyer") || text.includes("maddi") || text.includes("hedef")) return "bereket";
    if (text.includes("düşük") || text.includes("odak") || text.includes("kararsız") || text.includes("enerji")) return "enerji";
    return intent;
  }, [answers, intent]);

  const selected = intents[intent];

  const whatsappMessage = encodeURIComponent(
    `Merhaba, MuhurZen Bakır Mühür Bilekliği siparişi vermek istiyorum.\n\n` +
      `Seçilen Niyet: ${selected.title}\n` +
      `Ad Soyad: ${form.name}\n` +
      `Anne Adı: ${form.motherName}\n` +
      `Doğum Tarihi: ${form.birthDate}\n` +
      (intent === "iliski"
        ? `\nEş/Partner Adı: ${form.partnerName}\nEş/Partner Anne Adı: ${form.partnerMotherName}\nEş/Partner Doğum Tarihi: ${form.partnerBirthDate}\nİlişki Durumu: ${form.relationStatus}`
        : "") +
      (intent === "bereket" ? `\nOdak Alanı: ${form.focus}` : "") +
      (intent === "enerji" ? `\nSon Dönem Hissi: ${form.energyState}` : "") +
      `\nEk Not: ${form.note}`
  );

  function updateForm(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function updateAnswer(name: string, value: string) {
    const next = { ...answers, [name]: value };
    setAnswers(next);
    const text = `${next.q1} ${next.q2} ${next.q3}`.toLowerCase();
    if (text.includes("ilişki") || text.includes("uyum") || text.includes("eş") || text.includes("partner")) setIntent("iliski");
    else if (text.includes("iş") || text.includes("kariyer") || text.includes("maddi") || text.includes("hedef")) setIntent("bereket");
    else if (text.includes("düşük") || text.includes("odak") || text.includes("kararsız") || text.includes("enerji")) setIntent("enerji");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-black/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <a href="#hero" className="text-xl font-black tracking-tight">Muhur<span className="text-amber-400">Zen</span></a>
          <nav className="hidden items-center gap-7 text-sm text-zinc-300 md:flex">
            <a href="#quiz" className="hover:text-white">Mini Test</a>
            <a href="#siparis" className="hover:text-white">Sipariş</a>
            <a href="#sss" className="hover:text-white">SSS</a>
          </nav>
          <a href="#siparis" className="rounded-full bg-amber-500 px-5 py-2 text-sm font-bold text-black hover:bg-amber-400">Bilekliğini Oluştur</a>
        </div>
      </header>

      <section id="hero" className="container mx-auto px-6 py-20 md:py-28">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <span className="rounded-full border border-amber-500/30 px-4 py-2 text-sm text-amber-300">MuhurZen® Kişiye Özel Tasarım</span>
            <h1 className="mt-8 text-5xl font-black leading-tight md:text-7xl">Kişiye Özel<br />Bakır Mühür<br />Bilekliği</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-300">Geleneksel sembollerden ilham alan, kişisel kullanım ve hediye amaçlı hazırlanan özel tasarım bakır bileklik.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Kişiye Özel Hazırlık", "Bakır İşçilik", "Özel Kutu", "Türkiye Geneli Gönderim"].map((item) => (
                <div key={item} className="rounded-full bg-zinc-900 px-4 py-2 text-sm">✓ {item}</div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#siparis" className="rounded-full bg-amber-500 px-8 py-4 font-bold text-black transition hover:bg-amber-400">Siparişe Başla</a>
              <a href="#quiz" className="rounded-full border border-zinc-700 px-8 py-4 font-semibold transition hover:bg-zinc-900">Sana Uygun Niyeti Bul</a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
              <Image src="/images/bileklik-1.jpg" alt="MuhurZen kişiye özel bakır mühür bilekliği" width={900} height={900} className="rounded-3xl" priority />
              <div className="mt-6 flex items-center justify-between gap-4">
                <div><p className="text-sm text-zinc-400">Kişiye Özel Hazırlanır</p><h3 className="text-2xl font-black">MuhurZen Bilekliği</h3></div>
                <div className="text-right"><p className="text-sm text-zinc-400">Tanışma Fiyatı</p><p className="text-3xl font-black text-amber-400">₺1490</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <div className="grid gap-5 md:grid-cols-4">
          {[
            ["01", "Bilgilerini Gönder", "Ad, anne adı ve doğum tarihi bilgilerini sipariş formuna ekle."],
            ["02", "Niyetini Seç", "İlişki, bereket veya enerji odağından sana uygun olanı seç."],
            ["03", "Özel Hazırlansın", "Bilekliğin kişisel hazırlık sürecine alınır."],
            ["04", "Kutulanıp Gönderilsin", "Özel kutusunda kargoya teslim edilir."],
          ].map(([no, title, text]) => (
            <div key={title} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <p className="text-sm font-black text-amber-400">{no}</p>
              <h3 className="mt-4 text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="quiz" className="container mx-auto px-6 py-16">
        <div className="rounded-[32px] border border-zinc-800 bg-zinc-950 p-6 md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-400">Mini Test</p>
          <h2 className="mt-4 text-4xl font-black">Sana uygun niyet alanını keşfet.</h2>
          <p className="mt-4 max-w-3xl text-zinc-400">Bu mini test kesin değerlendirme sunmaz; yalnızca ilgi alanına göre hangi tasarım seçeneğinin sana daha yakın olabileceğini gösterir.</p>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <QuizSelect label="Son dönemde en çok hangi konuya odaklanıyorsun?" value={answers.q1} onChange={(v) => updateAnswer("q1", v)} options={["İlişki ve uyum", "İş ve kariyer", "Maddi hedefler", "Enerji ve odak"]} />
            <QuizSelect label="Kendini daha çok nasıl hissediyorsun?" value={answers.q2} onChange={(v) => updateAnswer("q2", v)} options={["Uyum arıyorum", "Motivasyon arıyorum", "Kendimi düşük hissediyorum", "Yeni başlangıç istiyorum"]} />
            <QuizSelect label="Bilekliği hangi amaçla düşünüyorsun?" value={answers.q3} onChange={(v) => updateAnswer("q3", v)} options={["Kendim için", "Eş/partner odağıyla", "Hedeflerim için", "Anlamlı hediye olarak"]} />
          </div>
          <div className="mt-8 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6">
            <p className="text-sm text-amber-200">Önerilen seçenek</p>
            <h3 className="mt-2 text-2xl font-black">{intents[quizResult].emoji} {intents[quizResult].title}</h3>
            <p className="mt-2 text-zinc-300">{intents[quizResult].description}</p>
            <button onClick={() => setIntent(quizResult)} className="mt-5 rounded-full bg-amber-500 px-6 py-3 font-bold text-black hover:bg-amber-400">Bu Niyetle Devam Et</button>
          </div>
        </div>
      </section>

      <section id="detaylar" className="container mx-auto px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-400">Ürün Detayları</p>
            <h2 className="mt-4 text-4xl font-black">Anlam taşıyan özel tasarım aksesuar.</h2>
            <p className="mt-5 leading-8 text-zinc-400">MuhurZen bilekliği, bakır malzeme üzerine geleneksel motiflerden ilham alan işleme detaylarıyla hazırlanır. Sipariş sırasında verdiğiniz bilgiler kişisel tasarım süreci için alınır.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {["Bakır bileklik", "Geleneksel motif işleme", "Kişisel hazırlık süreci", "Özel paketleme"].map((item) => <div key={item} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">✓ {item}</div>)}
            </div>
          </div>
          <Image src="/images/bileklik-2.jpg" alt="Bakır bileklik dış yüzey detayı" width={900} height={900} className="rounded-[32px] border border-zinc-800" />
        </div>
      </section>

      <section id="siparis" className="container mx-auto px-6 py-16">
        <div className="mx-auto max-w-6xl rounded-[32px] border border-zinc-800 bg-zinc-950 p-6 md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-400">Sipariş Formu</p>
          <h2 className="mt-4 text-4xl font-black">Niyetini seç, bilgilerini ekle.</h2>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {(Object.keys(intents) as Intent[]).map((key) => (
              <button key={key} onClick={() => setIntent(key)} className={`rounded-3xl border p-6 text-left transition ${intent === key ? "border-amber-500 bg-amber-500/10" : "border-zinc-800 bg-black hover:bg-zinc-900"}`}>
                <p className="text-3xl">{intents[key].emoji}</p>
                <h3 className="mt-4 text-xl font-black">{intents[key].short}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{intents[key].description}</p>
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-zinc-800 bg-black p-6">
            <h3 className="text-2xl font-black">{selected.emoji} {selected.title}</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Input placeholder="Ad Soyad" value={form.name} onChange={(v) => updateForm("name", v)} />
              <Input placeholder="Anne Adı" value={form.motherName} onChange={(v) => updateForm("motherName", v)} />
              <Input type="date" value={form.birthDate} onChange={(v) => updateForm("birthDate", v)} />
            </div>

            {intent === "iliski" && (
              <div className="mt-6">
                <p className="mb-4 font-bold text-amber-300">Eş / Partner Bilgileri</p>
                <div className="grid gap-4 md:grid-cols-3">
                  <Input placeholder="Eş / Partner Adı" value={form.partnerName} onChange={(v) => updateForm("partnerName", v)} />
                  <Input placeholder="Eş / Partner Anne Adı (opsiyonel)" value={form.partnerMotherName} onChange={(v) => updateForm("partnerMotherName", v)} />
                  <Input type="date" value={form.partnerBirthDate} onChange={(v) => updateForm("partnerBirthDate", v)} />
                </div>
                <Select className="mt-4" value={form.relationStatus} onChange={(v) => updateForm("relationStatus", v)} options={relationStatuses} />
              </div>
            )}

            {intent === "bereket" && <Select className="mt-6" value={form.focus} onChange={(v) => updateForm("focus", v)} options={moneyFocus} />}
            {intent === "enerji" && <Select className="mt-6" value={form.energyState} onChange={(v) => updateForm("energyState", v)} options={energyFocus} />}

            <textarea value={form.note} onChange={(e) => updateForm("note", e.target.value)} placeholder="Eklemek istediğiniz not..." className="mt-4 min-h-32 w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 outline-none focus:border-amber-500" />

            <div className="mt-6 rounded-2xl bg-amber-500/10 p-5 text-sm leading-6 text-amber-100">Bu ürün dekoratif ve kişisel kullanım amaçlı özel tasarım bir aksesuardır. Tıbbi, psikolojik, finansal veya manevi sonuç garantisi sunmaz.</div>

            <a href={`https://wa.me/905000000000?text=${whatsappMessage}`} className="mt-6 inline-flex w-full justify-center rounded-full bg-amber-500 px-8 py-4 font-black text-black transition hover:bg-amber-400">WhatsApp ile Siparişe Devam Et</a>
          </div>
        </div>
      </section>

      <section id="sss" className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-black">Sık Sorulan Sorular</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {[
            ["Bileklik nasıl hazırlanıyor?", "Sipariş sırasında verdiğiniz bilgiler doğrultusunda kişisel hazırlık süreci başlatılır."],
            ["Eş / partner bilgisi zorunlu mu?", "İlişki ve Uyum seçeneğinde partner adı önerilir; anne adı ve doğum tarihi opsiyonel bırakılabilir."],
            ["Kargo süresi nedir?", "Hazırlık sürecinden sonra genellikle 1-3 iş günü içinde kargoya teslim edilir."],
            ["Sonuç garantisi veriyor musunuz?", "Hayır. Ürün kişisel kullanım ve hediye amaçlı tasarlanmış sembolik bir aksesuardır."],
          ].map(([q, a]) => <div key={q} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6"><h3 className="font-black">{q}</h3><p className="mt-3 leading-7 text-zinc-400">{a}</p></div>)}
        </div>
      </section>

      <footer className="border-t border-zinc-900 px-6 py-10 text-center text-sm text-zinc-500">
        <div className="mb-4 flex flex-wrap justify-center gap-4">
          <a href="/hakkimizda">Hakkımızda</a><a href="/kvkk">KVKK</a><a href="/gizlilik-politikasi">Gizlilik</a><a href="/mesafeli-satis-sozlesmesi">Mesafeli Satış</a><a href="/iade-politikasi">İade</a><a href="/iletisim">İletişim</a>
        </div>
        © 2026 MuhurZen. Kişisel kullanım ve hediye amaçlı özel tasarım aksesuar.
      </footer>
    </main>
  );
}

function Input({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 outline-none focus:border-amber-500" />;
}

function Select({ value, onChange, options, className = "" }: { value: string; onChange: (value: string) => void; options: string[]; className?: string }) {
  return <select value={value} onChange={(e) => onChange(e.target.value)} className={`w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 outline-none focus:border-amber-500 ${className}`}>{options.map((option) => <option key={option}>{option}</option>)}</select>;
}

function QuizSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <label className="grid gap-3"><span className="font-bold">{label}</span><select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-2xl border border-zinc-800 bg-black px-5 py-4 outline-none focus:border-amber-500"><option value="">Seçiniz</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}
