"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Flow = "iliski" | "enerji" | "bereket";
type Step = "form" | "payment" | "done";

type FormState = {
  intent: Flow;
  name: string;
  motherName: string;
  birthDate: string;
  phone: string;
  city: string;
  address: string;
  partnerName: string;
  partnerMotherName: string;
  partnerBirthDate: string;
  relationshipStatus: string;
  focusArea: string;
  q1: string;
  q2: string;
  q3: string;
  note: string;
};

const ibanInfo = {
  bank: "Deniz Bankası",
  iban: "TR17 0013 4000 0262 2803 7000 01",
  owner: "Derya Çimen",
};

const intents = {
  iliski: {
    label: "İlişki & Uyum",
    eyebrow: "İlişki niyeti",
    title: "İlişki ve Uyum Niyeti",
    desc: "İlişkilerinde uyum, anlayış ve bağ hissine odaklanmak isteyenler için kişisel hazırlık seçeneği.",
  },
  enerji: {
    label: "Enerji & Odak",
    eyebrow: "Mini test",
    title: "Enerji ve Odak Niyeti",
    desc: "Son dönemde kendini yorgun, dağınık veya motivasyonsuz hissedenler için kişisel anlam taşıyan tasarım.",
  },
  bereket: {
    label: "Bereket & Motivasyon",
    eyebrow: "Hedef niyeti",
    title: "Bereket ve Motivasyon Niyeti",
    desc: "İş, kariyer, hedef ve yaşam motivasyonuna odaklanan kişisel tasarım seçeneği.",
  },
};

const initialForm: FormState = {
  intent: "iliski",
  name: "",
  motherName: "",
  birthDate: "",
  phone: "",
  city: "",
  address: "",
  partnerName: "",
  partnerMotherName: "",
  partnerBirthDate: "",
  relationshipStatus: "",
  focusArea: "",
  q1: "",
  q2: "",
  q3: "",
  note: "",
};

export default function Home() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [showResult, setShowResult] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selected = intents[form.intent];

  const resultText = useMemo(() => {
    if (form.intent === "iliski") {
      return "Yanıtlarınıza göre İlişki & Uyum niyeti sizin talebinize daha yakın görünüyor. Bu seçenek, kişiye özel bilgiler ve partner bilgileriyle hazırlık sürecine alınır.";
    }
    if (form.intent === "enerji") {
      return "Yanıtlarınıza göre Enerji & Odak niyeti sizin talebinize daha yakın görünüyor. Bu seçenek, günlük motivasyon, odak ve kişisel denge hissine yönelik sembolik bir aksesuar olarak hazırlanır.";
    }
    return "Yanıtlarınıza göre Bereket & Motivasyon niyeti sizin talebinize daha yakın görünüyor. Bu seçenek, hedefler, iş hayatı ve yeni başlangıçlara odaklanan kişisel tasarım olarak hazırlanır.";
  }, [form.intent]);

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setShowResult(false);
    setError("");
  };

  const createOrder = async () => {
    if (!form.name || !form.motherName || !form.birthDate || !form.phone || !form.city || !form.address) {
      setError("Lütfen ad soyad, anne adı, doğum tarihi, telefon, şehir ve adres alanlarını doldurun.");
      return;
    }

    if (form.intent === "iliski" && !form.partnerName) {
      setError("İlişki & Uyum niyeti için partner adını ekleyin.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const ref = await addDoc(collection(db, "orders"), {
        ...form,
        intentTitle: selected.title,
        productName: "MuhurZen Bakır Mühür Bilekliği",
        amount: 1490,
        currency: "TRY",
        paymentStatus: "bekliyor",
        orderStatus: "odeme_bekliyor",
        paymentMethod: "iban",
        ibanInfo,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setOrderId(ref.id);
      setStep("payment");
      window.location.hash = "odeme";
    } catch (err) {
      console.error(err);
      setError("Sipariş oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const notifyPaid = async () => {
    if (!orderId) return;

    setLoading(true);
    setError("");

    try {
      await updateDoc(doc(db, "orders", orderId), {
        paymentStatus: "odeme_bildirildi",
        orderStatus: "odeme_kontrol",
        paidNotifiedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setStep("done");
      window.location.hash = "tamamlandi";
    } catch (err) {
      console.error(err);
      setError("Ödeme bildirimi alınamadı. Lütfen WhatsApp üzerinden bize ulaşın.");
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `MuhurZen sipariş destek talebi\n\nSipariş No: ${orderId || "-"}\nNiyet: ${selected.title}\nAd Soyad: ${form.name}\nTelefon: ${form.phone}\nÜrün: MuhurZen Bakır Mühür Bilekliği\nFiyat: 1490 TL`
  );

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#" className="text-xl font-black tracking-tight">
            Muhur<span className="text-amber-400">Zen</span>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
            <a href="#test" className="hover:text-white">Mini Test</a>
            <a href="#hazirlik" className="hover:text-white">Hazırlık</a>
            <a href="#sss" className="hover:text-white">SSS</a>
            <a href="/admin" className="hover:text-white">Admin</a>
          </nav>
          <a href="#siparis" className="rounded-full bg-amber-500 px-5 py-2 text-sm font-bold text-black hover:bg-amber-400">
            Bilekliğini Oluştur
          </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <div className="inline-flex rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300">
            MuhurZen® kişiye özel hazırlık
          </div>
          <h1 className="mt-7 text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
            İsme Özel Hazırlanan Bakır Mühür Bilekliği
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-300">
            Geleneksel sembollerden ilham alan, ad ve doğum bilgilerine göre kişisel anlam taşıyacak şekilde hazırlanan özel tasarım bakır aksesuar.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {["Kişiye özel hazırlanır", "Partner bilgisi eklenebilir", "Özel kutu ile gönderilir", "Ücretsiz kargo seçeneği"].map((item) => (
              <div key={item} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-200">✓ {item}</div>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#test" className="rounded-full bg-amber-500 px-8 py-4 font-black text-black hover:bg-amber-400">Sana Uygun Niyeti Bul</a>
            <a href="#siparis" className="rounded-full border border-zinc-700 px-8 py-4 font-bold hover:bg-zinc-900">Sipariş Formu</a>
          </div>
          <div className="mt-7 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
            Bugün özel hazırlık kontenjanı: <b>7 / 15</b> sipariş kaldı.
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950 p-5 shadow-2xl">
            <Image src="/images/bileklik-1.jpg" alt="MuhurZen bakır mühür bilekliği" width={900} height={900} className="rounded-[1.5rem]" priority />
            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-400">Özel hazırlık dahil</p>
                <h2 className="text-2xl font-black">MuhurZen Bilekliği</h2>
                <p className="mt-1 text-xs text-zinc-500">Özel kutu + ücretsiz kargo seçeneği</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-zinc-400 line-through">₺1990</p>
                <p className="text-3xl font-black text-amber-400">₺1490</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid gap-4 md:grid-cols-4">
          {["500+ hazırlık talebi", "Türkiye geneli gönderim", "Gizli bilgi işleme", "WhatsApp destek hattı"].map((item) => (
            <div key={item} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 font-bold">✓ {item}</div>
          ))}
        </div>
      </section>

      <section id="test" className="mx-auto max-w-7xl px-5 py-16">
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-400">Mini Test</p>
          <h2 className="mt-3 text-4xl font-black">Sana uygun niyet alanını keşfet.</h2>
          <p className="mt-4 max-w-2xl text-zinc-400">Bu test kesin bir tespit sunmaz; verdiğiniz yanıtlara göre size en yakın kişisel tasarım seçeneğini önerir.</p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {Object.entries(intents).map(([key, item]) => (
              <button
                key={key}
                onClick={() => update("intent", key as Flow)}
                className={`rounded-3xl border p-5 text-left transition ${form.intent === key ? "border-amber-500 bg-amber-500/10" : "border-zinc-800 bg-black hover:border-zinc-600"}`}
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">{item.eyebrow}</p>
                <h3 className="mt-2 text-xl font-black">{item.label}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{item.desc}</p>
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <select value={form.q1} onChange={(e) => update("q1", e.target.value)} className="rounded-2xl border border-zinc-800 bg-black px-4 py-4 outline-none focus:border-amber-500">
              <option value="">Son dönemde neye odaklanıyorsun?</option>
              <option>İlişkilerimde uyum arıyorum</option>
              <option>İş ve para konularında tıkanıklık hissediyorum</option>
              <option>Kendimi yorgun ve dağınık hissediyorum</option>
            </select>
            <select value={form.q2} onChange={(e) => update("q2", e.target.value)} className="rounded-2xl border border-zinc-800 bg-black px-4 py-4 outline-none focus:border-amber-500">
              <option value="">Son günlerde nasıl hissediyorsun?</option>
              <option>Uzaklaşma ve uyumsuzluk hissi</option>
              <option>Motivasyon eksikliği</option>
              <option>Yeni başlangıç ihtiyacı</option>
            </select>
            <select value={form.q3} onChange={(e) => update("q3", e.target.value)} className="rounded-2xl border border-zinc-800 bg-black px-4 py-4 outline-none focus:border-amber-500">
              <option value="">Bilekliği hangi amaçla düşünüyorsun?</option>
              <option>Kendim için</option>
              <option>İlişkim için</option>
              <option>Anlamlı bir hediye olarak</option>
            </select>
          </div>

          <div className="mt-6 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-400">Önerilen Alan</p>
            <h3 className="mt-2 text-2xl font-black">{selected.title}</h3>
            <p className="mt-3 max-w-3xl text-zinc-300">{resultText}</p>
            <a href="#siparis" className="mt-5 inline-flex rounded-full bg-amber-500 px-6 py-3 font-black text-black hover:bg-amber-400">Bu Niyetle Devam Et</a>
          </div>
        </div>
      </section>

      <section id="hazirlik" className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-400">Nasıl Hazırlanıyor?</p>
            <h2 className="mt-3 text-4xl font-black">Seri üretim değil, kişiye özel hazırlık.</h2>
            <div className="mt-8 grid gap-4">
              {["Bilgilerini ve niyet alanını gönderirsin.", "Hazırlık süreci kişisel bilgilerle başlatılır.", "Bileklik özel kutusunda paketlenir.", "Kargo bilgisi WhatsApp üzerinden paylaşılır."].map((item, i) => (
                <div key={item} className="flex gap-4 rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 font-black text-black">{i + 1}</div>
                  <p className="pt-2 text-zinc-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <Image src="/images/bileklik-2.jpg" alt="MuhurZen bileklik dış yüzey detayı" width={900} height={900} className="rounded-[2rem] border border-zinc-800 object-cover" />
        </div>
      </section>

      <section id="siparis" className="mx-auto max-w-7xl px-5 py-16">
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-400">Sipariş Formu</p>
          <h2 className="mt-3 text-4xl font-black">Bilgilerini ekle, hazırlık talebini oluştur.</h2>

          {step === "form" && (
            <>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {Object.entries(intents).map(([key, item]) => (
                  <button key={key} onClick={() => update("intent", key as Flow)} className={`rounded-3xl border p-5 text-left ${form.intent === key ? "border-amber-500 bg-amber-500/10" : "border-zinc-800 bg-black"}`}>
                    <h3 className="text-lg font-black">{item.label}</h3>
                    <p className="mt-2 text-sm text-zinc-400">{item.desc}</p>
                  </button>
                ))}
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Ad Soyad" className="rounded-2xl border border-zinc-800 bg-black px-5 py-4 outline-none focus:border-amber-500" />
                <input value={form.motherName} onChange={(e) => update("motherName", e.target.value)} placeholder="Anne Adı" className="rounded-2xl border border-zinc-800 bg-black px-5 py-4 outline-none focus:border-amber-500" />
                <input value={form.birthDate} onChange={(e) => update("birthDate", e.target.value)} type="date" className="rounded-2xl border border-zinc-800 bg-black px-5 py-4 outline-none focus:border-amber-500" />
                <input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Telefon" className="rounded-2xl border border-zinc-800 bg-black px-5 py-4 outline-none focus:border-amber-500" />
                <input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Şehir" className="rounded-2xl border border-zinc-800 bg-black px-5 py-4 outline-none focus:border-amber-500" />
                <input value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Adres" className="rounded-2xl border border-zinc-800 bg-black px-5 py-4 outline-none focus:border-amber-500" />
              </div>

              {form.intent === "iliski" && (
                <div className="mt-6 rounded-3xl border border-zinc-800 bg-black p-5">
                  <h3 className="text-xl font-black">Eş / Partner Bilgileri</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <input value={form.partnerName} onChange={(e) => update("partnerName", e.target.value)} placeholder="Partner Adı" className="rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 outline-none focus:border-amber-500" />
                    <input value={form.partnerMotherName} onChange={(e) => update("partnerMotherName", e.target.value)} placeholder="Partner Anne Adı" className="rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 outline-none focus:border-amber-500" />
                    <input value={form.partnerBirthDate} onChange={(e) => update("partnerBirthDate", e.target.value)} type="date" className="rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 outline-none focus:border-amber-500" />
                  </div>
                  <select value={form.relationshipStatus} onChange={(e) => update("relationshipStatus", e.target.value)} className="mt-4 w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 outline-none focus:border-amber-500">
                    <option value="">İlişki Durumu</option>
                    <option>Evli</option>
                    <option>Nişanlı</option>
                    <option>Sevgili</option>
                    <option>Flört</option>
                    <option>Uzak mesafe / ayrı</option>
                  </select>
                </div>
              )}

              {(form.intent === "bereket" || form.intent === "enerji") && (
                <select value={form.focusArea} onChange={(e) => update("focusArea", e.target.value)} className="mt-6 w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 outline-none focus:border-amber-500">
                  <option value="">Odak Alanı Seç</option>
                  <option>İş hayatı</option>
                  <option>Kariyer</option>
                  <option>Maddi hedefler</option>
                  <option>Motivasyon ve odak</option>
                  <option>Yeni başlangıç</option>
                </select>
              )}

              <textarea value={form.note} onChange={(e) => update("note", e.target.value)} placeholder="Eklemek istediğiniz özel not..." className="mt-4 min-h-32 w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 outline-none focus:border-amber-500" />

              <button onClick={() => setShowResult(true)} className="mt-6 rounded-full border border-amber-500 px-7 py-4 font-black text-amber-300 hover:bg-amber-500/10">
                Ön Sonucu Gör
              </button>

              {showResult && (
                <div className="mt-6 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-400">Uyumlu Öneri</p>
                  <h3 className="mt-2 text-2xl font-black">{selected.title}</h3>
                  <p className="mt-3 text-zinc-300">{resultText}</p>
                </div>
              )}

              <div className="mt-6 rounded-2xl bg-zinc-900 p-5 text-sm leading-6 text-zinc-300">
                Bu ürün dekoratif ve kişisel kullanım amaçlı özel tasarım aksesuardır. Tıbbi, psikolojik, finansal veya manevi sonuç garantisi sunmaz.
              </div>

              {error && <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>}

              <button disabled={loading} onClick={createOrder} className="mt-6 inline-flex w-full justify-center rounded-full bg-amber-500 px-8 py-4 text-lg font-black text-black hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Sipariş oluşturuluyor..." : "Siparişi Oluştur - ₺1490"}
              </button>
            </>
          )}

          {step === "payment" && (
            <div id="odeme" className="mt-8 rounded-[2rem] border border-amber-500/30 bg-amber-500/10 p-6">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-400">Ödeme Bekleniyor</p>
              <h3 className="mt-3 text-3xl font-black">Siparişin oluşturuldu.</h3>
              <p className="mt-3 text-zinc-300">Sipariş No: <b>{orderId}</b></p>
              <div className="mt-6 grid gap-3 rounded-3xl bg-black p-5 text-zinc-200">
                <p><b>Banka:</b> {ibanInfo.bank}</p>
                <p><b>Alıcı:</b> {ibanInfo.owner}</p>
                <p><b>IBAN:</b> <span className="break-all text-amber-300">{ibanInfo.iban}</span></p>
                <p><b>Tutar:</b> 1490 TL</p>
                <p><b>Açıklama:</b> MuhurZen {orderId}</p>
              </div>
              <p className="mt-5 text-sm leading-6 text-zinc-300">Ödeme açıklamasına sipariş numaranı yaz. Ödemeden sonra aşağıdaki butona bas; siparişin ödeme kontrol listesine düşer.</p>
              {error && <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>}
              <button disabled={loading} onClick={notifyPaid} className="mt-6 w-full rounded-full bg-amber-500 px-8 py-4 text-lg font-black text-black hover:bg-amber-400 disabled:opacity-60">
                {loading ? "Bildirim alınıyor..." : "Ödemeyi Yaptım"}
              </button>
              <a href={`https://wa.me/905000000000?text=${whatsappMessage}`} className="mt-4 inline-flex w-full justify-center rounded-full border border-zinc-700 px-8 py-4 font-black hover:bg-zinc-900">
                WhatsApp Destek
              </a>
            </div>
          )}

          {step === "done" && (
            <div id="tamamlandi" className="mt-8 rounded-[2rem] border border-green-500/30 bg-green-500/10 p-6">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-300">Ödeme Bildirimi Alındı</p>
              <h3 className="mt-3 text-3xl font-black">Teşekkürler, siparişin kontrol listesine düştü.</h3>
              <p className="mt-3 text-zinc-300">Sipariş No: <b>{orderId}</b></p>
              <p className="mt-4 text-zinc-300">Ödeme kontrolünden sonra hazırlık süreci başlatılacaktır.</p>
              <a href={`https://wa.me/905000000000?text=${whatsappMessage}`} className="mt-6 inline-flex rounded-full bg-green-500 px-8 py-4 font-black text-black hover:bg-green-400">
                WhatsApp Destek
              </a>
            </div>
          )}
        </div>
      </section>

      <section id="sss" className="mx-auto max-w-7xl px-5 py-16">
        <h2 className="text-4xl font-black">Sık Sorulan Sorular</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            ["Bileklik nasıl hazırlanıyor?", "Sipariş sırasında verilen bilgiler doğrultusunda kişisel hazırlık süreci başlatılır."],
            ["Sonuç garantisi veriyor musunuz?", "Hayır. Ürün kişisel kullanım ve hediye amaçlı sembolik bir aksesuardır."],
            ["Kargo süresi nedir?", "Hazırlık sonrası genellikle 1-3 iş günü içinde kargoya verilir."],
            ["Bilgilerim gizli kalır mı?", "Sipariş bilgileri yalnızca hazırlık ve teslimat süreci için kullanılır."],
          ].map(([q, a]) => (
            <div key={q} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <h3 className="text-xl font-black">{q}</h3>
              <p className="mt-3 text-zinc-400">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <a href="https://wa.me/905000000000" className="fixed bottom-5 right-5 z-50 rounded-full bg-green-500 px-5 py-4 font-black text-black shadow-2xl hover:bg-green-400">
        Sipariş Öncesi Sor
      </a>

      <footer className="border-t border-zinc-900 px-5 py-10 text-center text-sm text-zinc-500">
        <div className="mb-4 flex flex-wrap justify-center gap-5">
          <a href="/hakkimizda">Hakkımızda</a>
          <a href="/kvkk">KVKK</a>
          <a href="/gizlilik-politikasi">Gizlilik</a>
          <a href="/mesafeli-satis-sozlesmesi">Mesafeli Satış</a>
          <a href="/iade-politikasi">İade Politikası</a>
          <a href="/iletisim">İletişim</a>
        </div>
        © 2026 MuhurZen. Kişisel kullanım ve hediye amaçlı özel tasarım aksesuar.
      </footer>
    </main>
  );
}
