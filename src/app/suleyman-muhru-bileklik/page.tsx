export const metadata = {
  title: "Süleyman Mührü Bileklik | MühürZen",
  description:
    "Süleyman Mührü bileklik modelleri, kişiye özel tasarım süreci ve bakır bileklik seçenekleri.",
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
            Süleyman Mührü Bileklik
          </h1>

          <p className="mt-6 text-lg leading-8 text-zinc-300">
            Süleyman Mührü bileklik, sembolik tasarım anlayışını günlük kullanıma uygun bir aksesuarla birleştirir. Bakır bileklik formunda hazırlandığında hem şık hem de anlamlı bir parça haline gelir.
          </p>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Kimler İçin Uygun?</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              Sembolik anlam taşıyan takıları sevenler, kişiye özel aksesuar arayanlar veya farklı bir hediye seçeneği isteyenler için uygundur.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Kişiye Özel Hazırlık</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              İsim, doğum tarihi, özel not veya niyet alanı gibi bilgilerle tasarım kişiselleştirilebilir. Böylece bileklik yalnızca bir aksesuar değil, kişisel bir parça haline gelir.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Sipariş Süreci</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              MühürZen üzerinden form doldurularak sipariş oluşturulur. Ödeme bildirimi sonrası ürün hazırlık sürecine alınır ve sipariş durumu takip edilebilir.
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
