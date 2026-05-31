export const metadata = {
  title: "Kişiye Özel Bakır Bileklik | MühürZen",
  description:
    "İsim, tarih ve özel sembollerle hazırlanan kişiye özel bakır bileklik modelleri ve sipariş süreci.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-black px-5 py-12 text-white">
      <article className="mx-auto max-w-4xl">
        <a href="/" className="text-xl font-black">
          Muhur<span className="text-amber-400">Zen</span>
        </a>

        <div className="mt-10 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-400">
            MühürZen Rehberi
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
            Kişiye Özel Bakır Bileklik
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-300">
            Kişiye özel bakır bileklikler, sıradan bir aksesuarın ötesinde anlam taşıyan tasarımlardır. İsim, doğum tarihi, özel sembol veya niyet alanı gibi bilgilerle kişiye özel hale getirilebilir.
          </p>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Kişiye Özel Bileklik Nasıl Hazırlanır?</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              Sipariş sırasında verilen bilgiler değerlendirilir ve bileklik kişisel anlam taşıyacak şekilde hazırlanır. Bu süreçte ürün hem estetik hem de sembolik bir tasarım diliyle ele alınır.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Hediye Olarak Uygun mu?</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              Kişiye özel bakır bileklikler doğum günü, yıl dönümü, sevgiliye hediye, eşe hediye veya özel günler için anlamlı bir alternatif olabilir.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-black">MühürZen’de Sipariş Süreci</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              Müşteri formu doldurur, ödeme bildirimi alınır ve sipariş hazırlık sürecine geçer. Sipariş durumu site üzerinden takip edilebilir.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Neden MühürZen?</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              MühürZen, kişiye özel bakır aksesuarları sade, şık ve anlamlı bir tasarım anlayışıyla sunar. Ürünler kişisel kullanım ve hediye amaçlı hazırlanır.
            </p>
          </section>

          <div className="mt-10 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6">
            <h2 className="text-2xl font-black">Kişiye Özel Bakır Bileklik</h2>
            <p className="mt-3 leading-7 text-zinc-300">
              MühürZen kişiye özel bakır mühür bileklikleri, anlamlı ve şık bir aksesuar arayanlar için hazırlanır.
            </p>
            <a
              href="/#siparis"
              className="mt-5 inline-flex rounded-full bg-amber-500 px-6 py-3 font-black text-black hover:bg-amber-400"
            >
              Bilekliğini Oluştur
            </a>
          </div>
        </div>
      </article>
    </main>
  );
}
