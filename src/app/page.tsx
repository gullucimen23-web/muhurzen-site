"use client";

import Image from "next/image";
import Script from "next/script";
import { useMemo, useState } from "react";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

type Flow = "iliski" | "manevi" | "maddi";
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

const whatsappUrl =
  "https://wa.me/905534236441?text=Merhaba,%20M%C3%BCh%C3%BCrZen%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.";

const intents = {
  iliski: {
    label: "İlişki & Uyum",
    eyebrow: "İlişki niyeti",
    title: "İlişki ve Uyum Niyeti",
    desc: "İlişkilerinde uyum, anlayış ve bağ hissine odaklanmak isteyenler için kişisel hazırlık seçeneği.",
  },
  manevi: {
    label: "Manevi Niyet",
    eyebrow: "Kişisel niyet",
    title: "Manevi Niyet Çalışması",
    desc: "Korunma, huzur, bağ, içsel denge ve kişisel anlam odağında hazırlanan özel tasarım.",
  },
  maddi: {
    label: "Maddi Niyet",
    eyebrow: "Bereket & hedef",
    title: "Maddi Niyet Çalışması",
    desc: "İş, kariyer, bereket, kazanç ve yeni başlangıçlara odaklanan kişisel tasarım.",
  },
};

const initialForm: FormState = {
  intent: "manevi",
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

async function notifyTelegram(payload: Record<string, unknown>) {
  try {
    await fetch("/api/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Sipariş akışını Telegram hatası yüzünden durdurmuyoruz.
  }
}

export default function Home() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [showResult, setShowResult] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [orderId, setOrderId] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [error, setError] = useState("");

  const selected = intents[form.intent];

  const resultText = useMemo(() => {
    if (form.intent === "iliski") {
      return "İlişki ve uyum niyetinde iki kişinin ad, anne adı ve doğum tarihi birlikte değerlendirilerek kişiye özel hazırlık süreci başlatılır.";
    }
    if (form.intent === "manevi") {
      return "Manevi niyetiniz; ad, anne adı, doğum tarihi ve yazdığınız niyet doğrultusunda özel hazırlık sürecine alınır.";
    }
    return "Maddi niyetiniz; iş, bereket, kazanç veya hedef odağınıza göre kişisel hazırlık sürecine alınır.";
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

    if (
      form.intent === "iliski" &&
      (!form.partnerName || !form.partnerMotherName || !form.partnerBirthDate || !form.relationshipStatus)
    ) {
      setError("İlişki & Uyum niyeti için ikinci kişinin ad soyad, anne adı, doğum tarihi ve ilişki durumunu ekleyin.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const refDoc = await addDoc(collection(db, "orders"), {
        ...form,
        intentTitle: selected.title,
        productName: "MühürZen Bakır Mühür Bilekliği",
        amount: 1600,
        currency: "TRY",
        paymentStatus: "bekliyor",
        orderStatus: "odeme_bekliyor",
        paymentMethod: "iban",
        ibanInfo,
        receiptUrl: "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setOrderId(refDoc.id);
      setStep("payment");
      window.location.hash = "odeme";

      await notifyTelegram({
        type: "new_order",
        orderId: refDoc.id,
        name: form.name,
        phone: form.phone,
        city: form.city,
        intentTitle: selected.title,
        amount: 1600,
        paymentStatus: "bekliyor",
        orderStatus: "odeme_bekliyor",
      });
    } catch (err) {
      console.error(err);
      setError("Sipariş oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const uploadReceipt = async (file: File) => {
    if (!orderId) return;

    setReceiptLoading(true);
    setError("");

    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const receiptRef = ref(storage, `receipts/${orderId}/${Date.now()}-${safeName}`);
      await uploadBytes(receiptRef, file);
      const url = await getDownloadURL(receiptRef);

      await updateDoc(doc(db, "orders", orderId), {
        receiptUrl: url,
        paymentStatus: "odeme_bildirildi",
        orderStatus: "odeme_kontrol",
        paidNotifiedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setReceiptUrl(url);

      await notifyTelegram({
        type: "receipt_uploaded",
        orderId,
        name: form.name,
        phone: form.phone,
        city: form.city,
        intentTitle: selected.title,
        amount: 1600,
        paymentStatus: "odeme_bildirildi",
        orderStatus: "odeme_kontrol",
      });

      setStep("done");
      window.location.hash = "tamamlandi";
    } catch (err) {
      console.error(err);
      setError("Dekont yüklenemedi. Lütfen tekrar deneyin veya WhatsApp üzerinden bize ulaşın.");
    } finally {
      setReceiptLoading(false);
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

      await notifyTelegram({
        type: "payment_notified",
        orderId,
        name: form.name,
        phone: form.phone,
        city: form.city,
        intentTitle: selected.title,
        amount: 1600,
        paymentStatus: "odeme_bildirildi",
        orderStatus: "odeme_kontrol",
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


  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "MühürZen Bakır Mühür Bilekliği",
    image: ["https://mühürzen.com/images/bileklik-1.jpg"],
    description:
      "İsme özel hazırlanan bakır mühür bilekliği. Süleyman Mührü işlenebilen kişiye özel tasarım bakır aksesuar.",
    brand: {
      "@type": "Brand",
      name: "MühürZen",
    },
    offers: {
      "@type": "Offer",
      url: "https://mühürzen.com",
      priceCurrency: "TRY",
      price: "1600",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "37",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Bileklik nasıl hazırlanıyor?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sipariş sırasında verilen bilgiler doğrultusunda kişisel hazırlık süreci başlatılır.",
        },
      },
      {
        "@type": "Question",
        name: "Neden ad, anne adı ve doğum tarihi isteniyor?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Kişiye özel hazırlık sürecinde bu bilgiler, yazdığınız niyetle birlikte değerlendirilir. Bilgiler yalnızca hazırlık ve teslimat süreci için kullanılır.",
        },
      },
      {
        "@type": "Question",
        name: "Sonuç garantisi veriyor musunuz?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hayır. Ürün kişisel kullanım ve hediye amaçlı sembolik bir aksesuardır.",
        },
      },
      {
        "@type": "Question",
        name: "Kargo süresi nedir?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hazırlık sonrası genellikle 1-3 iş günü içinde kargoya verilir.",
        },
      },
      {
        "@type": "Question",
        name: "Bilgilerim gizli kalır mı?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sipariş bilgileri yalnızca hazırlık ve teslimat süreci için kullanılır.",
        },
      },
    ],
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MühürZen",
    url: "https://mühürzen.com",
    logo: "https://mühürzen.com/og-image.png",
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />

      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#" className="text-xl font-black tracking-tight">
            Mühür<span className="text-amber-400">Zen</span>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
            <a href="#hazirlik" className="hover:text-white">Süreç</a>
            <a href="#siparis" className="hover:text-white">Sipariş</a>
            <a href="#sss" className="hover:text-white">SSS</a>
            <a href="/takip" className="hover:text-white">Sipariş Takip</a>
          </nav>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-amber-500 px-5 py-2 text-sm font-bold text-black hover:bg-amber-400">
            WhatsApp'tan Bilgi Al
          </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-8 px-5 pb-10 pt-8 lg:grid-cols-2 lg:py-20">
        <div className="order-2 lg:order-1">
          <div className="inline-flex rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-amber-300">
            Seri üretim değil • Kişiye özel hazırlık
          </div>

          <h1 className="mt-5 text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl md:text-7xl">
            İsminiz ve niyetinizle hazırlanan bakır mühür bileklik
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
            Siparişiniz; <b>ad soyad, anne adı, doğum tarihi</b> ve paylaştığınız
            <b> maddi / manevi niyet</b> doğrultusunda değerlendirilir. İlişki niyetinde iki kişinin bilgileri birlikte alınır.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Kişiye özel hazırlık bilgileri alınır",
              "Maddi veya manevi niyetiniz değerlendirilir",
              "İlişki niyetinde iki kişinin bilgisi alınır",
              "Özel kutu ve sipariş takip sistemi",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-200">
                ✓ {item}
              </div>
            ))}
          </div>

          <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-amber-500 px-8 py-4 text-center font-black text-black hover:bg-amber-400">
              WhatsApp'tan Bilgi Al
            </a>
            <a href="#hazirlik" className="rounded-full border border-zinc-700 px-8 py-4 text-center font-bold hover:bg-zinc-900">
              Süreç Nasıl İşliyor?
            </a>
          </div>

          <div className="mt-5 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm leading-6 text-amber-50">
            <b>Gizlilik notu:</b> Paylaştığınız bilgiler yalnızca kişiye özel hazırlık, sipariş ve teslimat süreci için kullanılır.
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950 p-4 shadow-2xl">
              <Image
                src="/images/bileklik-1.jpg"
                alt="MühürZen kişiye özel bakır mühür bilekliği"
                width={900}
                height={900}
                className="rounded-[1.5rem]"
                priority
              />
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs text-zinc-400">Kişiye özel hazırlık dahil</p>
                  <h2 className="text-xl font-black sm:text-2xl">MühürZen Bilekliği</h2>
                  <p className="mt-1 text-xs text-zinc-500">İsim • Anne adı • Doğum tarihi • Niyet</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-400 line-through">₺2990</p>
                  <p className="text-3xl font-black text-amber-400">₺1600</p>
                </div>
              </div>
              <div className="mt-4 grid gap-2 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-xs font-semibold text-amber-50 sm:grid-cols-3">
                <span>✓ Özel hazırlık dahil</span>
                <span>✓ Özel kutu dahil</span>
                <span>✓ Takip sistemi dahil</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-400">
            Neden Tercih Ediliyor?
          </p>
          <h2 className="mt-3 text-3xl font-black">
            Sadece takmak için değil, kendi niyetini üzerinde taşımak için.
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              ["Korunma ve iç huzur niyeti", "Kendini daha dengede ve güvende hissetmek isteyenler için."],
              ["İlişkilerde uyum niyeti", "Bağ, anlayış ve uyum hissine odaklanan kişisel hazırlık."],
              ["İş ve bereket niyeti", "Hedef, kazanç ve yeni başlangıçlara odaklanan özel tasarım."],
              ["Kişiye özel anlam", "Ad, doğum tarihi ve niyet doğrultusunda hazırlanan kişisel aksesuar."],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-3xl border border-zinc-800 bg-black p-5">
                <h3 className="text-lg font-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm leading-6 text-amber-50">
            <b>Not:</b> Bu ürün kişisel kullanım ve hediye amaçlı sembolik özel tasarım aksesuardır; sonuç garantisi sunmaz.
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid gap-4 md:grid-cols-4">
          {["Kişiye özel hazırlık", "Türkiye geneli gönderim", "Gizli bilgi işleme", "WhatsApp destek"].map((item) => (
            <div key={item} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 font-bold">✓ {item}</div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="rounded-[2rem] border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-zinc-950 p-6 md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-400">
            Her Mühür Aynı Değildir
          </p>

          <h2 className="mt-3 text-4xl font-black">
            Sadece bir bileklik değil, kişiye özel hazırlık süreci.
          </h2>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5 text-base leading-8 text-zinc-300">
              <p>
                Geçmişten günümüze birçok gelenekte kişinin adı, anne adı,
                doğum tarihi ve niyeti birlikte değerlendirilirdi. Kişiye özel
                hazırlanan çalışmaların temelinde, kişinin kendi bilgileri ve
                taşıdığı niyet yer alırdı.
              </p>

              <p>
                Bugün piyasada Süleyman Mührü sembolünü taşıyan birçok ürün
                bulabilirsiniz. Ancak MühürZen'de amaç yalnızca bir sembolü
                taşımak değildir.
              </p>

              <p>
                Her sipariş; ad, anne adı, doğum tarihi ve ilettiğiniz niyet
                doğrultusunda özel hazırlık sürecine alınır. İlişki niyetlerinde
                ise iki kişinin bilgileri birlikte değerlendirilir.
              </p>

              <p className="font-semibold text-amber-100">
                Belki de ihtiyacınız olan şey sıradan bir aksesuar değil;
                sizin niyetiniz, hikayeniz ve hissetmek istediğiniz anlam
                doğrultusunda hazırlanmış kişisel bir çalışmadır.
              </p>

              <p>
                Bu yüzden MühürZen bilekliği yalnızca görüntüsüyle değil,
                size özel hazırlanma süreciyle de farklılaşır. Kişi ürünü
                aldığında sadece bir bileklik değil; kendi niyetine ait özel
                bir sembol taşır.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-black p-5">
              <h3 className="text-2xl font-black">Neden farklı?</h3>
              <div className="mt-5 grid gap-3 text-sm text-zinc-300">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  ✓ Seri üretim değil, kişiye özel hazırlık
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  ✓ İsim, doğum tarihi ve niyet birlikte ele alınır
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  ✓ İlişki niyetinde iki kişinin bilgileri değerlendirilir
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  ✓ Özel kutu ve sipariş takip sistemiyle gönderilir
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Kişiye Özel", "Her çalışma kişiye özel bilgiler doğrultusunda hazırlanır."],
              ["Özel Hazırlık", "Sembol, niyet ve kişisel bilgiler aynı süreçte değerlendirilir."],
              ["Anlamlı Hediye", "Kendiniz veya sevdikleriniz için sıradan olmayan bir aksesuar."],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-3xl border border-zinc-800 bg-black p-5">
                <h3 className="text-xl font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{desc}</p>
              </div>
            ))}
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex rounded-full bg-amber-500 px-8 py-4 font-black text-black hover:bg-amber-400"
          >
            WhatsApp'tan Bilgi Al
          </a>
        </div>
      </section>

      <section id="test" className="mx-auto max-w-7xl px-5 py-16">
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-400">Niyet Alanı</p>
          <h2 className="mt-3 text-4xl font-black">Niyet alanınızı seçin.</h2>
          <p className="mt-4 max-w-2xl text-zinc-400">Bilekliğiniz, seçtiğiniz alan ve yazdığınız niyet doğrultusunda kişiye özel hazırlık sürecine alınır.</p>

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
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex rounded-full bg-amber-500 px-6 py-3 font-black text-black hover:bg-amber-400">WhatsApp'tan Devam Et</a>
          </div>
        </div>
      </section>

      <section id="hazirlik" className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-400">Nasıl Hazırlanıyor?</p>
            <h2 className="mt-3 text-4xl font-black">Seri üretim değil, kişiye özel hazırlık.</h2>
            <div className="mt-8 grid gap-4">
              {["Ad, anne adı ve doğum tarihin alınır.", "Maddi veya manevi niyetin değerlendirilir.", "İlişki niyetinde iki kişinin bilgileri birlikte alınır.", "Özel kutu ile hazırlanır ve takip bilgisi paylaşılır."].map((item, i) => (
                <div key={item} className="flex gap-4 rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 font-black text-black">{i + 1}</div>
                  <p className="pt-2 text-zinc-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <Image src="/images/bileklik-2.jpg" alt="MühürZen bileklik dış yüzey detayı" width={900} height={900} className="rounded-[2rem] border border-zinc-800 object-cover" />
        </div>
      </section>

      <section id="siparis" className="mx-auto max-w-7xl px-5 py-16">
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-400">Kişiye Özel Hazırlık Formu</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Bilgilerinizi girin, çalışmanızı başlatalım.</h2>
          <p className="mt-4 max-w-3xl leading-7 text-zinc-400">Ad soyad, anne adı, doğum tarihi ve niyet alanınız kişiye özel hazırlık sürecinde değerlendirilir.</p>

          {step === "form" && (
            <>
              <div className="mt-8 grid gap-3 rounded-3xl border border-amber-500/20 bg-black p-4 text-sm text-zinc-300 sm:grid-cols-3">
                <div><b className="text-amber-400">1.</b> Bilgilerini gir</div>
                <div><b className="text-amber-400">2.</b> Niyetini yaz</div>
                <div><b className="text-amber-400">3.</b> Ödeme bildir</div>
              </div>

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
                  <h3 className="text-xl font-black">İkinci Kişi Bilgileri</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <input value={form.partnerName} onChange={(e) => update("partnerName", e.target.value)} placeholder="İkinci Kişi Ad Soyad" className="rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 outline-none focus:border-amber-500" />
                    <input value={form.partnerMotherName} onChange={(e) => update("partnerMotherName", e.target.value)} placeholder="İkinci Kişi Anne Adı" className="rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 outline-none focus:border-amber-500" />
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

              {(form.intent === "maddi" || form.intent === "manevi") && (
                <select value={form.focusArea} onChange={(e) => update("focusArea", e.target.value)} className="mt-6 w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 outline-none focus:border-amber-500">
                  <option value="">Niyet Alanı Seç</option>
                  <option>Bereket ve bolluk</option>
                  <option>İş ve kariyer</option>
                  <option>Maddi hedefler</option>
                  <option>Huzur ve denge</option>
                  <option>Nazar ve korunma</option>
                  <option>Yeni başlangıç</option>
                </select>
              )}

              <textarea value={form.note} onChange={(e) => update("note", e.target.value)} placeholder="Maddi veya manevi niyetinizi birkaç cümleyle yazın. Örn: bereket, iş, huzur, ilişki, korunma, yeni başlangıç..." className="mt-4 min-h-32 w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 outline-none focus:border-amber-500" />

              <button onClick={() => setShowResult(true)} className="mt-6 rounded-full border border-amber-500 px-7 py-4 font-black text-amber-300 hover:bg-amber-500/10">
                Bana Uygun Alanı Göster
              </button>

              {showResult && (
                <div className="mt-6 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-400">Hazırlık Özeti</p>
                  <h3 className="mt-2 text-2xl font-black">{selected.title}</h3>
                  <p className="mt-3 text-zinc-300">{resultText}</p>
                </div>
              )}

              <div className="mt-6 rounded-2xl bg-zinc-900 p-5 text-sm leading-6 text-zinc-300">
                Bu ürün dekoratif ve kişisel kullanım amaçlı özel tasarım aksesuardır. Tıbbi, psikolojik, finansal veya manevi sonuç garantisi sunmaz.
              </div>

              {error && <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>}

              <button disabled={loading} onClick={createOrder} className="mt-6 inline-flex w-full justify-center rounded-full bg-amber-500 px-8 py-4 text-lg font-black text-black hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Sipariş oluşturuluyor..." : "Çalışmamı Başlat - ₺1600"}
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full justify-center rounded-full border border-green-600 bg-green-600/10 px-8 py-4 font-black text-green-100 hover:bg-green-600/20"
              >
                WhatsApp'tan Sor
              </a>

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
                <p><b>Tutar:</b> 1600 TL</p>
                <p><b>Açıklama:</b> MühürZen {orderId}</p>
              </div>

              <div className="mt-6 rounded-3xl border border-zinc-800 bg-black p-5">
                <h4 className="text-xl font-black">Dekont Yükle</h4>
                <p className="mt-2 text-sm text-zinc-400">
                  Dekont yüklemek zorunlu değildir; yüklerseniz ödeme kontrolü daha hızlı yapılır.
                </p>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadReceipt(file);
                  }}
                  className="mt-4 w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-sm"
                />
                {receiptUrl && (
                  <a href={receiptUrl} target="_blank" className="mt-3 inline-flex text-sm font-bold text-amber-300">
                    Yüklenen dekontu görüntüle
                  </a>
                )}
              </div>

              <p className="mt-5 text-sm leading-6 text-zinc-300">Ödeme açıklamasına sipariş numaranı yaz. Ödemeden sonra aşağıdaki butona bas; siparişin ödeme kontrol listesine düşer.</p>
              {error && <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>}
              <button disabled={loading || receiptLoading} onClick={notifyPaid} className="mt-6 w-full rounded-full bg-amber-500 px-8 py-4 text-lg font-black text-black hover:bg-amber-400 disabled:opacity-60">
                {loading || receiptLoading ? "İşlem alınıyor..." : "Ödemeyi Yaptım"}
              </button>
            </div>
          )}

          {step === "done" && (
            <div id="tamamlandi" className="mt-8 rounded-[2rem] border border-green-500/30 bg-green-500/10 p-6">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-300">Ödeme Bildirimi Alındı</p>
              <h3 className="mt-3 text-3xl font-black">Teşekkürler, siparişin kontrol listesine düştü.</h3>
              <p className="mt-3 text-zinc-300">Sipariş No: <b>{orderId}</b></p>
              <p className="mt-4 text-zinc-300">Ödeme kontrolünden sonra hazırlık süreci başlatılacaktır.</p>
              <div className="mt-5 rounded-2xl bg-black p-4 text-sm text-zinc-300">
                Siparişini takip etmek için bu numarayı sakla: <b>{orderId}</b>
              </div>
              <a href={`/takip?orderId=${orderId}`} className="mt-6 mr-3 inline-flex rounded-full bg-amber-500 px-8 py-4 font-black text-black hover:bg-amber-400">
                Siparişimi Takip Et
              </a>
            </div>
          )}
        </div>
      </section>
              <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="rounded-[2rem] border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-zinc-950 p-6 md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-400">
            Neden MühürZen?
          </p>
          <h2 className="mt-3 text-4xl font-black">
            İnsanların aradığı şey sadece bileklik değil, kendine özel anlam.
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-zinc-400">
            MühürZen, ürünü sıradan bir aksesuar olmaktan çıkarıp kişinin niyetine,
            hikayesine ve hediye etmek istediği duyguya bağlayan özel bir hazırlık
            deneyimi sunar.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Kişiye Özel Hazırlık", "Her sipariş, ilettiğiniz bilgiler ve seçtiğiniz niyet alanına göre özel olarak hazırlanır."],
              ["Bakır Tasarım", "Sıcak bakır tonu, mühür sembolleriyle birleşerek sade ama dikkat çekici bir görünüm sunar."],
              ["Sipariş Takibi", "Sipariş numaranızla hazırlık ve ödeme durumunu site üzerinden takip edebilirsiniz."],
              ["Gizli Bilgi İşleme", "Sipariş bilgileriniz yalnızca hazırlık ve teslimat süreci için kullanılır."],
              ["Özel Kutu", "Bileklik, hediye etmeye uygun özel kutu ve özenli paketleme ile gönderilir."],
              ["Canlı Destek", "Ürün, sipariş veya kargo hakkında sorularınız için WhatsApp üzerinden ulaşabilirsiniz."],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-3xl border border-zinc-800 bg-black p-5">
                <h3 className="text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-400">
                Müşteri Deneyimi
              </p>
              <h2 className="mt-3 text-4xl font-black">
                Anlamlı hediye ve kişisel kullanım için tercih ediliyor.
              </h2>
              <p className="mt-4 leading-7 text-zinc-400">
                Müşteriler ürünü yalnızca görüntüsü için değil; kişiye özel hazırlanması,
                kutulaması ve taşıdığı anlam için tercih ediyor.
              </p>

              <div className="mt-6 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm leading-6 text-amber-50">
                Gerçek siparişlerde en çok sorulan konular: özel kutu, hazırlık süresi,
                kişiye özel bilgi kullanımı ve kargo takibi.
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["★★★★★", "Eşime hediye aldım. Kutulaması ve işçiliği çok güzeldi, beklediğimden daha özenli geldi."],
                ["★★★★★", "Kişiye özel hazırlanması ürünü daha anlamlı hissettirdi. Sıradan bir bileklik gibi durmuyor."],
                ["★★★★★", "Siparişten birkaç gün sonra elime ulaştı. Takip süreci ve destek kısmı güven verdi."],
                ["★★★★★", "İsim ve niyet detaylarıyla hazırlanması hoşuma gitti. Hediye olarak çok farklı bir seçenek."],
              ].map(([stars, text]) => (
                <div key={text} className="rounded-3xl border border-zinc-800 bg-black p-5">
                  <p className="text-amber-400">{stars}</p>
                  <p className="mt-4 text-sm leading-6 text-zinc-300">“{text}”</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-400">
            MühürZen Rehberi
          </p>

          <h2 className="mt-3 text-4xl font-black">
            Süleyman Mührü ve Bakır Bileklik Rehberi
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-zinc-400">
            Google'da aranan konular için hazırladığımız rehberleri inceleyebilir, ürün seçmeden önce detaylı bilgi alabilirsiniz.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              ["/suleyman-muhru", "Süleyman Mührü", "Süleyman Mührünün anlamı, tarihi ve sembolik kullanımı."],
              ["/suleyman-muhru-anlami", "Süleyman Mührü Anlamı", "Sembolün kültürel ve modern yorumları."],
              ["/suleyman-muhru-bileklik", "Süleyman Mührü Bileklik", "Süleyman Mührü işlenen özel bileklik modelleri."],
              ["/bakir-suleyman-muhru-bileklik", "Bakır Süleyman Mührü Bileklik", "Bakır üzerine işlenen Süleyman Mührü tasarımları."],
              ["/bakir-bileklik-faydalari", "Bakır Bileklik Faydaları", "Bakır bileklik hakkında merak edilenler."],
              ["/kisiye-ozel-bakir-bileklik", "Kişiye Özel Bakır Bileklik", "Tamamen kişiye özel hazırlanan bileklikler."],
              ["/isim-yazili-bakir-bileklik", "İsim Yazılı Bakır Bileklik", "Kişiye özel isim yazılı tasarımlar."],
              ["/bakir-bileklik-bakimi", "Bakır Bileklik Bakımı", "Bakır bileklik temizliği ve kullanım önerileri."],
              ["/bakir-bileklik-ne-ise-yarar", "Bakır Bileklik Ne İşe Yarar?", "Bakır bilekliklerin aksesuar olarak kullanım amacı."],
            ].map(([href, title, desc]) => (
              <a
                key={href}
                href={href}
                className="rounded-3xl border border-zinc-800 bg-black p-5 transition hover:border-amber-500 hover:bg-amber-500/10"
              >
                <h3 className="text-xl font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="rounded-[2rem] border border-green-500/30 bg-green-500/10 p-6 text-center md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-300">
            Hazırlık Kontenjanı
          </p>
          <h2 className="mt-3 text-4xl font-black">
            Bugün kendi bilekliğini oluştur.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-zinc-300">
            Sipariş formunu doldur, ödeme bildirimi sonrası kişiye özel hazırlık sürecin başlasın.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-full bg-amber-500 px-8 py-4 font-black text-black hover:bg-amber-400"
          >
            WhatsApp'tan Bilgi Al
          </a>
        </div>
      </section>

      <section id="sss" className="mx-auto max-w-7xl px-5 py-16">
        <h2 className="text-4xl font-black">Sık Sorulan Sorular</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            ["Bileklik nasıl hazırlanıyor?", "Sipariş sırasında verilen bilgiler doğrultusunda kişisel hazırlık süreci başlatılır."],
            ["Neden ad, anne adı ve doğum tarihi isteniyor?", "Kişiye özel hazırlık sürecinde bu bilgiler, yazdığınız niyetle birlikte değerlendirilir. Bilgiler yalnızca hazırlık ve teslimat süreci için kullanılır."],
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


      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp'tan bilgi al"
        className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-3xl shadow-2xl shadow-green-500/30 transition hover:scale-105 hover:bg-green-400"
      >
        ☎
      </a>

      <footer className="border-t border-zinc-900 px-5 py-10 text-center text-sm text-zinc-500">
        <div className="mb-4 flex flex-wrap justify-center gap-5">
          <a href="/hakkimizda">Hakkımızda</a>
          <a href="/kvkk">KVKK</a>
          <a href="/gizlilik-politikasi">Gizlilik</a>
          <a href="/mesafeli-satis-sozlesmesi">Mesafeli Satış</a>
          <a href="/iade-politikasi">İade Politikası</a>
          <a href="/iletisim">İletişim</a>
          <a href="/suleyman-muhru">Süleyman Mührü</a>
          <a href="/bakir-bileklik-faydalari">Bakır Bileklik</a>
          <a href="/kisiye-ozel-bakir-bileklik">Kişiye Özel</a>
        </div>
        © 2026 MühürZen. Kişisel kullanım ve hediye amaçlı özel tasarım aksesuar.
      </footer>
    </main>
  );
}
