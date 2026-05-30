export default function Page() {
  return (
    <main className="min-h-screen bg-black px-5 py-16 text-white">
      <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
        <a href="/" className="text-amber-400">← Ana sayfa</a>
        <h1 className="mt-6 text-4xl font-black">iletisim</h1>
        <p className="mt-5 leading-8 text-zinc-300">
          Bu sayfa MuhurZen için hazırlanmış bilgilendirme metnidir. Ödeme altyapısı aktif edilmeden önce şirket bilgileri, adres, vergi bilgileri, iletişim ve sözleşme detayları netleştirilerek güncellenecektir.
        </p>
        <p className="mt-5 leading-8 text-zinc-300">
          Ürünler kişisel kullanım ve hediye amaçlı özel tasarım aksesuar olarak sunulur. Tıbbi, psikolojik, finansal veya manevi sonuç garantisi verilmez.
        </p>
      </div>
    </main>
  );
}
