"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type Order = {
  id: string;
  name?: string;
  phone?: string;
  city?: string;
  address?: string;
  motherName?: string;
  birthDate?: string;
  partnerName?: string;
  partnerMotherName?: string;
  partnerBirthDate?: string;
  relationshipStatus?: string;
  focusArea?: string;
  intent?: string;
  intentTitle?: string;
  productName?: string;
  amount?: number;
  currency?: string;
  paymentStatus?: string;
  orderStatus?: string;
  paymentMethod?: string;
  note?: string;
  q1?: string;
  q2?: string;
  q3?: string;
  createdAt?: { seconds?: number };
  updatedAt?: { seconds?: number };
};

const paymentLabels: Record<string, string> = {
  bekliyor: "Ödeme Bekliyor",
  odeme_bildirildi: "Ödeme Bildirildi",
  onaylandi: "Ödeme Onaylandı",
  reddedildi: "Ödeme Reddedildi",
};

const orderLabels: Record<string, string> = {
  odeme_bekliyor: "Ödeme Bekliyor",
  odeme_kontrol: "Ödeme Kontrol",
  hazirlaniyor: "Hazırlanıyor",
  kargoda: "Kargoda",
  teslim_edildi: "Teslim Edildi",
  iptal: "İptal",
};

const filters = [
  { key: "all", label: "Tümü" },
  { key: "odeme_bekliyor", label: "Ödeme Bekliyor" },
  { key: "odeme_kontrol", label: "Ödeme Bildirildi" },
  { key: "hazirlaniyor", label: "Hazırlanıyor" },
  { key: "kargoda", label: "Kargoda" },
  { key: "teslim_edildi", label: "Teslim" },
];

function formatDate(order?: Order) {
  const seconds = order?.createdAt?.seconds;
  if (!seconds) return "-";
  return new Date(seconds * 1000).toLocaleString("tr-TR");
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("ouzhancmn21@gmail.com");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (current) => {
      setUser(current);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Order));
      setOrders(data);
    });
    return () => unsub();
  }, [user]);

  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders;
    return orders.filter((order) => order.orderStatus === filter);
  }, [orders, filter]);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      waiting: orders.filter((o) => o.orderStatus === "odeme_bekliyor").length,
      paymentNotice: orders.filter((o) => o.orderStatus === "odeme_kontrol").length,
      preparing: orders.filter((o) => o.orderStatus === "hazirlaniyor").length,
      shipped: orders.filter((o) => o.orderStatus === "kargoda").length,
    };
  }, [orders]);

  const login = async () => {
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setLoginError("Giriş başarısız. Mail veya şifre hatalı olabilir.");
    }
  };

  const updateOrder = async (orderId: string, payload: Partial<Order>) => {
    setBusyId(orderId);
    try {
      await updateDoc(doc(db, "orders", orderId), {
        ...payload,
        updatedAt: new Date(),
      });
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, ...payload } : prev));
      }
    } finally {
      setBusyId("");
    }
  };

  if (loading) {
    return <main className="min-h-screen bg-black p-6 text-white">Yükleniyor...</main>;
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-5 text-white">
        <div className="w-full max-w-md rounded-[2rem] border border-zinc-800 bg-zinc-950 p-7">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-400">MuhurZen Admin</p>
          <h1 className="mt-3 text-3xl font-black">Sipariş paneline giriş</h1>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin mail" className="mt-6 w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 outline-none focus:border-amber-500" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Şifre" className="mt-4 w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 outline-none focus:border-amber-500" />
          {loginError && <div className="mt-4 rounded-2xl bg-red-500/10 p-4 text-sm text-red-100">{loginError}</div>}
          <button onClick={login} className="mt-5 w-full rounded-full bg-amber-500 px-6 py-4 font-black text-black hover:bg-amber-400">Giriş Yap</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 border-b border-zinc-900 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-400">MuhurZen Admin</p>
            <h1 className="mt-2 text-4xl font-black">Sipariş Yönetimi</h1>
            <p className="mt-2 text-zinc-400">Giriş: {user.email}</p>
          </div>
          <div className="flex gap-3">
            <a href="/" className="rounded-full border border-zinc-800 px-5 py-3 font-bold hover:bg-zinc-900">Siteye Git</a>
            <button onClick={() => signOut(auth)} className="rounded-full bg-zinc-900 px-5 py-3 font-bold hover:bg-zinc-800">Çıkış</button>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-5">
          {[
            ["Toplam", stats.total],
            ["Ödeme Bekliyor", stats.waiting],
            ["Ödeme Bildirildi", stats.paymentNotice],
            ["Hazırlanıyor", stats.preparing],
            ["Kargoda", stats.shipped],
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-sm text-zinc-400">{label}</p>
              <p className="mt-2 text-3xl font-black text-amber-400">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-7 flex flex-wrap gap-3">
          {filters.map((item) => (
            <button key={item.key} onClick={() => setFilter(item.key)} className={`rounded-full px-5 py-3 text-sm font-black ${filter === item.key ? "bg-amber-500 text-black" : "border border-zinc-800 bg-zinc-950 text-white hover:bg-zinc-900"}`}>
              {item.label}
            </button>
          ))}
        </section>

        <section className="mt-7 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950">
            <div className="grid grid-cols-[1fr_1fr_0.9fr_0.9fr] border-b border-zinc-800 bg-zinc-900/60 p-4 text-xs font-bold uppercase tracking-wider text-zinc-400 md:grid-cols-[1fr_1fr_0.8fr_0.8fr_0.7fr]">
              <div>Müşteri</div>
              <div>Niyet</div>
              <div>Ödeme</div>
              <div>Durum</div>
              <div className="hidden md:block">Tarih</div>
            </div>
            {filteredOrders.length === 0 && <div className="p-8 text-center text-zinc-500">Bu filtrede sipariş yok.</div>}
            {filteredOrders.map((order) => (
              <button key={order.id} onClick={() => setSelectedOrder(order)} className={`grid w-full grid-cols-[1fr_1fr_0.9fr_0.9fr] gap-2 border-b border-zinc-900 p-4 text-left text-sm hover:bg-zinc-900 md:grid-cols-[1fr_1fr_0.8fr_0.8fr_0.7fr] ${selectedOrder?.id === order.id ? "bg-amber-500/10" : ""}`}>
                <div>
                  <p className="font-black">{order.name || "-"}</p>
                  <p className="mt-1 text-xs text-zinc-500">{order.phone || "-"}</p>
                </div>
                <div className="text-zinc-300">{order.intentTitle || "-"}</div>
                <div className="text-amber-300">{paymentLabels[order.paymentStatus || ""] || order.paymentStatus || "-"}</div>
                <div className="text-zinc-300">{orderLabels[order.orderStatus || ""] || order.orderStatus || "-"}</div>
                <div className="hidden text-xs text-zinc-500 md:block">{formatDate(order)}</div>
              </button>
            ))}
          </div>

          <aside className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
            {!selectedOrder ? (
              <div className="text-zinc-500">Detay görmek için soldan bir sipariş seç.</div>
            ) : (
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-400">Sipariş Detayı</p>
                <h2 className="mt-2 break-all text-2xl font-black">#{selectedOrder.id}</h2>
                <div className="mt-5 grid gap-3 text-sm text-zinc-300">
                  <p><b>Ad:</b> {selectedOrder.name || "-"}</p>
                  <p><b>Telefon:</b> {selectedOrder.phone || "-"}</p>
                  <p><b>Şehir:</b> {selectedOrder.city || "-"}</p>
                  <p><b>Adres:</b> {selectedOrder.address || "-"}</p>
                  <p><b>Anne Adı:</b> {selectedOrder.motherName || "-"}</p>
                  <p><b>Doğum Tarihi:</b> {selectedOrder.birthDate || "-"}</p>
                  <p><b>Niyet:</b> {selectedOrder.intentTitle || "-"}</p>
                  <p><b>Odak:</b> {selectedOrder.focusArea || "-"}</p>
                  <p><b>Partner:</b> {selectedOrder.partnerName || "-"}</p>
                  <p><b>Partner Anne:</b> {selectedOrder.partnerMotherName || "-"}</p>
                  <p><b>Partner Doğum:</b> {selectedOrder.partnerBirthDate || "-"}</p>
                  <p><b>İlişki Durumu:</b> {selectedOrder.relationshipStatus || "-"}</p>
                  <p><b>Not:</b> {selectedOrder.note || "-"}</p>
                  <p><b>Tutar:</b> {selectedOrder.amount || 1490} TL</p>
                </div>

                <div className="mt-6 grid gap-3">
                  <button disabled={busyId === selectedOrder.id} onClick={() => updateOrder(selectedOrder.id, { paymentStatus: "onaylandi", orderStatus: "hazirlaniyor" })} className="rounded-full bg-green-500 px-5 py-3 font-black text-black hover:bg-green-400 disabled:opacity-50">Ödemeyi Onayla → Hazırlanıyor</button>
                  <button disabled={busyId === selectedOrder.id} onClick={() => updateOrder(selectedOrder.id, { orderStatus: "kargoda" })} className="rounded-full bg-amber-500 px-5 py-3 font-black text-black hover:bg-amber-400 disabled:opacity-50">Kargoda Yap</button>
                  <button disabled={busyId === selectedOrder.id} onClick={() => updateOrder(selectedOrder.id, { orderStatus: "teslim_edildi" })} className="rounded-full border border-zinc-700 px-5 py-3 font-black hover:bg-zinc-900 disabled:opacity-50">Teslim Edildi</button>
                  <button disabled={busyId === selectedOrder.id} onClick={() => updateOrder(selectedOrder.id, { paymentStatus: "reddedildi", orderStatus: "iptal" })} className="rounded-full border border-red-500/40 px-5 py-3 font-black text-red-200 hover:bg-red-500/10 disabled:opacity-50">Reddet / İptal</button>
                </div>
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}
