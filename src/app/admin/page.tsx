"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type Order = {
  id: string;
  name?: string;
  motherName?: string;
  birthDate?: string;
  phone?: string;
  city?: string;
  address?: string;
  intent?: string;
  intentTitle?: string;
  productName?: string;
  amount?: number;
  paymentStatus?: string;
  orderStatus?: string;
  note?: string;
  receiptUrl?: string;
  partnerName?: string;
  partnerMotherName?: string;
  partnerBirthDate?: string;
  relationshipStatus?: string;
  createdAt?: { seconds?: number };
};

const orderLabels: Record<string, string> = {
  odeme_bekliyor: "Ödeme Bekliyor",
  odeme_kontrol: "Ödeme Kontrol",
  hazirlaniyor: "Hazırlanıyor",
  kargoda: "Kargoda",
  teslim_edildi: "Teslim Edildi",
  iptal: "İptal",
};

const paymentLabels: Record<string, string> = {
  bekliyor: "Bekliyor",
  odeme_bildirildi: "Ödeme Bildirildi",
  onaylandi: "Onaylandı",
  reddedildi: "Reddedildi",
};

const filters = [
  { key: "all", label: "Tümü" },
  { key: "odeme_bekliyor", label: "Ödeme Bekliyor" },
  { key: "odeme_kontrol", label: "Ödeme Kontrol" },
  { key: "hazirlaniyor", label: "Hazırlanıyor" },
  { key: "kargoda", label: "Kargoda" },
  { key: "teslim_edildi", label: "Teslim Edildi" },
];

async function notifyTelegram(payload: Record<string, unknown>) {
  try {
    await fetch("/api/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Admin işleminde Telegram hatası paneli durdurmasın.
  }
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("ouzhancmn21@gmail.com");
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Order, "id">) })));
    });

    return () => unsub();
  }, [user]);

  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders;
    return orders.filter((o) => o.orderStatus === filter);
  }, [orders, filter]);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter((o) => {
      if (!o.createdAt?.seconds) return false;
      return new Date(o.createdAt.seconds * 1000).toDateString() === today;
    });
    return {
      total: orders.length,
      waiting: orders.filter((o) => o.orderStatus === "odeme_bekliyor").length,
      control: orders.filter((o) => o.orderStatus === "odeme_kontrol").length,
      revenue: orders
        .filter((o) => o.paymentStatus === "onaylandi")
        .reduce((sum, o) => sum + (o.amount || 1490), 0),
      today: todayOrders.length,
    };
  }, [orders]);

  const login = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      setError("Giriş yapılamadı. Mail veya şifreyi kontrol et.");
    }
  };

  const updateStatus = async (order: Order, paymentStatus: string, orderStatus: string) => {
    await updateDoc(doc(db, "orders", order.id), {
      paymentStatus,
      orderStatus,
      updatedAt: serverTimestamp(),
    });

    await notifyTelegram({
      type: "status_changed",
      orderId: order.id,
      name: order.name,
      phone: order.phone,
      city: order.city,
      intentTitle: order.intentTitle,
      amount: order.amount || 1490,
      paymentStatus,
      orderStatus,
    });
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-black px-5 py-10 text-white">
        <div className="mx-auto max-w-md rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 md:p-8">
          <a href="/" className="text-xl font-black">
            Muhur<span className="text-amber-400">Zen</span>
          </a>
          <h1 className="mt-8 text-3xl font-black">Admin Girişi</h1>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-posta" className="mt-6 w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 outline-none focus:border-amber-500" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifre" type="password" className="mt-4 w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 outline-none focus:border-amber-500" />
          {error && <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>}
          <button onClick={login} className="mt-6 w-full rounded-full bg-amber-500 px-8 py-4 font-black text-black hover:bg-amber-400">Giriş Yap</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <a href="/" className="text-xl font-black">
              Muhur<span className="text-amber-400">Zen</span>
            </a>
            <h1 className="mt-4 text-4xl font-black">Sipariş Yönetimi</h1>
          </div>
          <button onClick={() => signOut(auth)} className="rounded-full border border-zinc-700 px-6 py-3 font-bold hover:bg-zinc-900">Çıkış</button>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-5">
          <Stat label="Toplam Sipariş" value={stats.total} />
          <Stat label="Bugünkü Sipariş" value={stats.today} />
          <Stat label="Ödeme Bekliyor" value={stats.waiting} />
          <Stat label="Ödeme Kontrol" value={stats.control} />
          <Stat label="Onaylı Ciro" value={`${stats.revenue} TL`} />
        </section>

        <section className="mt-8 flex flex-wrap gap-3">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-5 py-3 text-sm font-black ${filter === f.key ? "bg-amber-500 text-black" : "border border-zinc-800 bg-zinc-950 text-zinc-300"}`}
            >
              {f.label}
            </button>
          ))}
        </section>

        <section className="mt-8 grid gap-5">
          {filteredOrders.map((order) => (
            <article key={order.id} className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-5">
              <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-black">{order.name || "İsimsiz Sipariş"}</h2>
                    <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">{orderLabels[order.orderStatus || ""] || order.orderStatus}</span>
                    <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-bold text-zinc-300">{paymentLabels[order.paymentStatus || ""] || order.paymentStatus}</span>
                  </div>
                  <p className="mt-3 text-sm text-zinc-500">Sipariş No: {order.id}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <Info label="Telefon" value={order.phone} />
                    <Info label="Şehir" value={order.city} />
                    <Info label="Tutar" value={`${order.amount || 1490} TL`} />
                    <Info label="Niyet" value={order.intentTitle} />
                    <Info label="Anne Adı" value={order.motherName} />
                    <Info label="Doğum" value={order.birthDate} />
                  </div>
                  <button onClick={() => setSelected(order)} className="mt-4 rounded-full border border-zinc-700 px-5 py-3 text-sm font-bold hover:bg-zinc-900">Detay Gör</button>
                  {order.receiptUrl && (
                    <a href={order.receiptUrl} target="_blank" className="ml-3 mt-4 inline-flex rounded-full bg-green-500 px-5 py-3 text-sm font-black text-black hover:bg-green-400">
                      Dekontu Aç
                    </a>
                  )}
                </div>

                <div className="grid gap-3">
                  <button onClick={() => updateStatus(order, "onaylandi", "hazirlaniyor")} className="rounded-2xl bg-amber-500 px-5 py-4 font-black text-black hover:bg-amber-400">Ödemeyi Onayla → Hazırlanıyor</button>
                  <button onClick={() => updateStatus(order, order.paymentStatus || "onaylandi", "kargoda")} className="rounded-2xl border border-zinc-700 px-5 py-4 font-black hover:bg-zinc-900">Kargoda Yap</button>
                  <button onClick={() => updateStatus(order, order.paymentStatus || "onaylandi", "teslim_edildi")} className="rounded-2xl border border-zinc-700 px-5 py-4 font-black hover:bg-zinc-900">Teslim Edildi Yap</button>
                  <button onClick={() => updateStatus(order, "reddedildi", "iptal")} className="rounded-2xl border border-red-500/40 px-5 py-4 font-black text-red-300 hover:bg-red-500/10">Reddet / İptal</button>
                </div>
              </div>
            </article>
          ))}

          {filteredOrders.length === 0 && (
            <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-10 text-center text-zinc-400">
              Bu filtrede sipariş yok.
            </div>
          )}
        </section>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/80 p-5 backdrop-blur">
          <div className="mx-auto max-h-[90vh] max-w-3xl overflow-auto rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-3xl font-black">Sipariş Detayı</h2>
              <button onClick={() => setSelected(null)} className="rounded-full border border-zinc-700 px-4 py-2">Kapat</button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Info label="Sipariş No" value={selected.id} />
              <Info label="Ad Soyad" value={selected.name} />
              <Info label="Telefon" value={selected.phone} />
              <Info label="Şehir" value={selected.city} />
              <Info label="Adres" value={selected.address} />
              <Info label="Niyet" value={selected.intentTitle} />
              <Info label="Anne Adı" value={selected.motherName} />
              <Info label="Doğum Tarihi" value={selected.birthDate} />
              <Info label="Partner" value={selected.partnerName} />
              <Info label="Partner Anne" value={selected.partnerMotherName} />
              <Info label="Partner Doğum" value={selected.partnerBirthDate} />
              <Info label="İlişki Durumu" value={selected.relationshipStatus} />
              <Info label="Not" value={selected.note} />
            </div>

            {selected.receiptUrl && (
              <a href={selected.receiptUrl} target="_blank" className="mt-6 inline-flex rounded-full bg-green-500 px-6 py-3 font-black text-black">
                Dekontu Aç
              </a>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-2xl bg-black p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <p className="mt-2 break-words font-bold text-zinc-100">{value || "-"}</p>
    </div>
  );
}
