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
  intentTitle?: string;
  amount?: number;
  paymentStatus?: string;
  orderStatus?: string;
  createdAt?: { seconds?: number };
  motherName?: string;
  birthDate?: string;
  partnerName?: string;
  partnerMotherName?: string;
  partnerBirthDate?: string;
  relationshipStatus?: string;
  focusArea?: string;
  note?: string;
};

const paymentLabels: Record<string, string> = {
  bekliyor: "Ödeme bekliyor",
  odeme_bildirildi: "Ödeme bildirildi",
  onaylandi: "Ödeme onaylandı",
  reddedildi: "Ödeme reddedildi",
};

const orderLabels: Record<string, string> = {
  odeme_bekliyor: "Ödeme bekliyor",
  odeme_kontrol: "Ödeme kontrol",
  hazirlaniyor: "Hazırlanıyor",
  kargoda: "Kargoda",
  teslim_edildi: "Teslim edildi",
  iptal: "İptal",
};

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("ouzhancmn21@gmail.com");
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs.map((item) => ({ id: item.id, ...item.data() } as Order));
      setOrders(rows);
    });

    return unsub;
  }, [user]);

  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders;
    return orders.filter((order) => order.paymentStatus === filter || order.orderStatus === filter);
  }, [orders, filter]);

  const login = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError("Giriş başarısız. Mail veya şifre hatalı.");
    }
  };

  const updateOrder = async (id: string, data: Partial<Order>) => {
    await updateDoc(doc(db, "orders", id), data);
  };

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-5 text-white">
        <div className="w-full max-w-md rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8">
          <h1 className="text-3xl font-black">MuhurZen Admin</h1>
          <p className="mt-3 text-zinc-400">Siparişleri görmek için giriş yap.</p>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-posta" className="mt-6 w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 outline-none focus:border-amber-500" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Şifre" className="mt-4 w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 outline-none focus:border-amber-500" />
          {error && <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>}
          <button onClick={login} className="mt-6 w-full rounded-full bg-amber-500 px-8 py-4 font-black text-black hover:bg-amber-400">Giriş Yap</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black">Sipariş Paneli</h1>
            <p className="mt-2 text-zinc-400">{orders.length} sipariş listeleniyor.</p>
          </div>
          <button onClick={() => signOut(auth)} className="rounded-full border border-zinc-700 px-5 py-3 font-bold hover:bg-zinc-900">Çıkış</button>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {[
            ["all", "Tümü"],
            ["bekliyor", "Ödeme Bekliyor"],
            ["odeme_bildirildi", "Ödeme Bildirildi"],
            ["onaylandi", "Ödeme Onaylandı"],
            ["hazirlaniyor", "Hazırlanıyor"],
            ["kargoda", "Kargoda"],
          ].map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)} className={`rounded-full px-5 py-3 text-sm font-bold ${filter === key ? "bg-amber-500 text-black" : "border border-zinc-800 bg-zinc-950 text-zinc-300"}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5">
          {filteredOrders.map((order) => {
            const date = order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleString("tr-TR") : "-";

            return (
              <div key={order.id} className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-zinc-500">Sipariş No</p>
                    <h2 className="text-xl font-black text-amber-400">{order.id}</h2>
                    <p className="mt-2 text-sm text-zinc-400">{date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-zinc-500">Tutar</p>
                    <p className="text-3xl font-black">₺{order.amount || 1490}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <Info label="Niyet" value={order.intentTitle} />
                  <Info label="Müşteri" value={order.name} />
                  <Info label="Telefon" value={order.phone} />
                  <Info label="Anne Adı" value={order.motherName} />
                  <Info label="Doğum Tarihi" value={order.birthDate} />
                  <Info label="Şehir" value={order.city} />
                  <Info label="Adres" value={order.address} />
                  <Info label="Partner" value={order.partnerName} />
                  <Info label="Partner Anne" value={order.partnerMotherName} />
                  <Info label="Partner Doğum" value={order.partnerBirthDate} />
                  <Info label="İlişki Durumu" value={order.relationshipStatus} />
                  <Info label="Odak Alanı" value={order.focusArea} />
                </div>

                {order.note && (
                  <div className="mt-5 rounded-2xl bg-black p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Not</p>
                    <p className="mt-2 text-zinc-300">{order.note}</p>
                  </div>
                )}

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-black p-4">
                    <p className="text-sm text-zinc-500">Ödeme Durumu</p>
                    <p className="mt-1 text-lg font-black">{paymentLabels[order.paymentStatus || ""] || order.paymentStatus || "-"}</p>
                  </div>
                  <div className="rounded-2xl bg-black p-4">
                    <p className="text-sm text-zinc-500">Sipariş Durumu</p>
                    <p className="mt-1 text-lg font-black">{orderLabels[order.orderStatus || ""] || order.orderStatus || "-"}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={() => updateOrder(order.id, { paymentStatus: "onaylandi", orderStatus: "hazirlaniyor" })} className="rounded-full bg-green-500 px-5 py-3 font-black text-black hover:bg-green-400">Ödemeyi Onayla</button>
                  <button onClick={() => updateOrder(order.id, { paymentStatus: "reddedildi", orderStatus: "odeme_bekliyor" })} className="rounded-full bg-red-500 px-5 py-3 font-black text-black hover:bg-red-400">Ödemeyi Reddet</button>
                  <button onClick={() => updateOrder(order.id, { orderStatus: "hazirlaniyor" })} className="rounded-full border border-zinc-700 px-5 py-3 font-bold hover:bg-zinc-900">Hazırlanıyor</button>
                  <button onClick={() => updateOrder(order.id, { orderStatus: "kargoda" })} className="rounded-full border border-zinc-700 px-5 py-3 font-bold hover:bg-zinc-900">Kargoda</button>
                  <button onClick={() => updateOrder(order.id, { orderStatus: "teslim_edildi" })} className="rounded-full border border-zinc-700 px-5 py-3 font-bold hover:bg-zinc-900">Teslim Edildi</button>
                </div>
              </div>
            );
          })}

          {filteredOrders.length === 0 && (
            <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-10 text-center text-zinc-400">
              Bu filtrede sipariş yok.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-2xl bg-black p-4">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <p className="mt-2 break-words text-zinc-200">{value || "-"}</p>
    </div>
  );
}
