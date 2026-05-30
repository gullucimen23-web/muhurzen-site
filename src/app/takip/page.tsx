"use client";

import { doc, getDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { db } from "@/lib/firebase";

type OrderData = {
  name?: string;
  phone?: string;
  city?: string;
  intentTitle?: string;
  productName?: string;
  amount?: number;
  paymentStatus?: string;
  orderStatus?: string;
  receiptUrl?: string;
};

const statusLabels: Record<string, string> = {
  odeme_bekliyor: "Ödeme bekleniyor",
  odeme_kontrol: "Ödeme kontrol ediliyor",
  hazirlaniyor: "Hazırlanıyor",
  kargoda: "Kargoda",
  teslim_edildi: "Teslim edildi",
  iptal: "İptal edildi",
};

const paymentLabels: Record<string, string> = {
  bekliyor: "Bekleniyor",
  odeme_bildirildi: "Ödeme bildirildi",
  onaylandi: "Onaylandı",
  reddedildi: "Reddedildi",
};

function TrackContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId") || "";
  const [orderId, setOrderId] = useState(initialOrderId);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const findOrder = async () => {
    if (!orderId.trim()) {
      setError("Lütfen sipariş numaranı gir.");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const snap = await getDoc(doc(db, "orders", orderId.trim()));
      if (!snap.exists()) {
        setError("Bu sipariş numarasıyla kayıt bulunamadı.");
        return;
      }
      setOrder(snap.data() as OrderData);
    } catch (err) {
      console.error(err);
      setError("Sipariş bilgisi alınamadı. Lütfen tekrar dene.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) findOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialOrderId]);

  return (
    <main className="min-h-screen bg-black px-5 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <a href="/" className="text-xl font-black">
          Muhur<span className="text-amber-400">Zen</span>
        </a>

        <div className="mt-10 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-400">Sipariş Takip</p>
          <h1 className="mt-3 text-4xl font-black">Sipariş durumunu kontrol et.</h1>
          <p className="mt-4 text-zinc-400">Sipariş oluşturduktan sonra verilen sipariş numaranı gir.</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Sipariş No"
              className="min-h-14 flex-1 rounded-2xl border border-zinc-800 bg-black px-5 outline-none focus:border-amber-500"
            />
            <button onClick={findOrder} disabled={loading} className="rounded-full bg-amber-500 px-8 py-4 font-black text-black disabled:opacity-60">
              {loading ? "Aranıyor..." : "Sorgula"}
            </button>
          </div>

          {error && <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-100">{error}</div>}

          {order && (
            <div className="mt-8 rounded-3xl border border-zinc-800 bg-black p-6">
              <h2 className="text-2xl font-black">{order.productName || "MuhurZen Bilekliği"}</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Info label="Ad Soyad" value={order.name} />
                <Info label="Telefon" value={order.phone} />
                <Info label="Şehir" value={order.city} />
                <Info label="Niyet" value={order.intentTitle} />
                <Info label="Tutar" value={`${order.amount || 1490} TL`} />
                <Info label="Ödeme" value={paymentLabels[order.paymentStatus || ""] || order.paymentStatus} />
                <Info label="Sipariş Durumu" value={statusLabels[order.orderStatus || ""] || order.orderStatus} />
              </div>

              {order.receiptUrl && (
                <a href={order.receiptUrl} target="_blank" className="mt-6 inline-flex rounded-full border border-zinc-700 px-6 py-3 font-bold text-amber-300">
                  Dekontu Görüntüle
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-2xl bg-zinc-950 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <p className="mt-2 font-bold text-zinc-100">{value || "-"}</p>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-black p-10 text-white">Yükleniyor...</main>}>
      <TrackContent />
    </Suspense>
  );
}
