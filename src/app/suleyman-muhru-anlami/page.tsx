export const metadata = {
  title: "Süleyman Mührü Anlamı | MühürZen",
  description:
    "Süleyman Mührü anlamı, sembolik yorumu ve kültürel kullanım alanları hakkında detaylı bilgi.",
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
            Süleyman Mührü Anlamı
          </h1>

          <p className="mt-6 text-lg leading-8 text-zinc-300">
            Süleyman Mührü anlamı, tarihsel ve kültürel bağlama göre farklı şekillerde yorumlanmıştır. Bugün bu sembol daha çok estetik, kültürel ve kişisel anlam taşıyan tasarımlarda karşımıza çıkar.
          </p>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Tarihsel ve Sembolik Anlam</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              Süleyman Mührü, farklı geleneklerde güçlü bir sembol olarak görülmüştür. Takı tasarımlarında ise kişinin kendisiyle özdeşleştirdiği anlamı taşıyan özel bir motif haline gelir.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Modern Kullanım</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              Modern takı dünyasında Süleyman Mührü, sade ama dikkat çekici bir sembol olarak tercih edilir. Özellikle kişiye özel tasarımlarda sembolik değer kazandırır.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Önemli Not</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              MühürZen ürünleri dekoratif ve kişisel kullanım amaçlı özel tasarım aksesuarlardır. Tıbbi, finansal veya manevi sonuç garantisi sunmaz.
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
