export const metadata = {
  title: "Bakır Süleyman Mührü Bileklik | MühürZen",
  description:
    "Bakır Süleyman Mührü bileklik tasarımları, kişiye özel üretim ve bakım önerileri.",
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
            Süleyman Mührü Rehberi
          </p>

          <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
            Bakır Süleyman Mührü Bileklik
          </h1>

          <p className="mt-6 text-lg leading-8 text-zinc-300">
            Bakır Süleyman Mührü bileklik, bakırın sıcak ve doğal görünümünü Süleyman Mührü sembolünün güçlü tasarım diliyle birleştirir. Günlük kullanım ve anlamlı hediye için özel bir seçenektir.
          </p>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Bakırın Tasarımdaki Yeri</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              Bakır rengi, doğal ve zamansız bir görünüm sunar. Süleyman Mührü gibi sembolik motiflerle birleştiğinde geleneksel ve modern çizgileri aynı üründe toplar.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Bakım Önerileri</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              Bakır ürünler zamanla doğal olarak kararabilir. Ürünü nemden ve kimyasallardan uzak tutmak, yumuşak bezle temizlemek uzun ömürlü kullanım sağlar.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-black">MühürZen Kalitesi</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              MühürZen bakır bileklikleri, kişiye özel detaylarla hazırlanan sembolik aksesuarlar olarak tasarlanır. Her ürün hediye ve kişisel kullanım amacıyla özenle sunulur.
            </p>
          </section>

          <div className="mt-10 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6">
            <h2 className="text-2xl font-black">
              Kişiye Özel Süleyman Mührü Bileklik
            </h2>
            <p className="mt-3 leading-7 text-zinc-300">
              MühürZen’de Süleyman Mührü temalı bakır bileklikler, kişisel anlam ve estetik tasarım odağında hazırlanır.
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
