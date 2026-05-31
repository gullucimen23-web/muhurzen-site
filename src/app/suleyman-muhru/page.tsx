export const metadata = {
  title: "Süleyman Mührü | Anlamı ve Kullanımı | MühürZen",
  description:
    "Süleyman Mührü sembolünün anlamı, tarihsel kullanımı ve takı tasarımlarındaki yeri hakkında bilgiler.",
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
            Süleyman Mührü
          </h1>

          <p className="mt-6 text-lg leading-8 text-zinc-300">
            Süleyman Mührü, tarih boyunca farklı kültürlerde sembolik anlamlar taşıyan özel bir işaret olarak bilinir. Günümüzde takı, kolye ve bileklik tasarımlarında estetik ve kültürel değeri nedeniyle tercih edilmektedir.
          </p>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Süleyman Mührü Nedir?</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              Süleyman Mührü, geometrik yapısı ve sembolik görünümüyle dikkat çeken geleneksel bir motiftir. Farklı dönemlerde kimlik, anlam, koruyucu sembol ve estetik tasarım unsuru olarak yorumlanmıştır.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Takılarda Kullanımı</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              Günümüzde Süleyman Mührü; bileklik, kolye, yüzük ve dekoratif aksesuar tasarımlarında sıkça kullanılır. Özellikle bakır gibi sıcak tonlu metallerle birleştiğinde güçlü ve dikkat çekici bir görünüm oluşturur.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-black">MühürZen Yorumu</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              MühürZen’de Süleyman Mührü temalı tasarımlar, kişisel anlam ve estetik görünüm odağında hazırlanır. Ürünler kişisel kullanım ve hediye amaçlı özel aksesuar olarak sunulur.
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
