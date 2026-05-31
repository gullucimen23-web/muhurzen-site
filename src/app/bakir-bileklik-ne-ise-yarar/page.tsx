export const metadata = {
  title: "Bakır Bileklik Ne İşe Yarar? | MühürZen",
  description:
    "Bakır bilekliklerin kullanım amacı, aksesuar olarak tercih edilme nedenleri ve kişiye özel tasarım seçenekleri.",
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
            Bakır Bileklik Ne İşe Yarar?
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-300">
            Bakır bileklikler günümüzde en çok estetik görünüm, kişisel anlam ve hediye amacıyla tercih edilir. Doğal bakır rengi sayesinde sade ama dikkat çekici bir aksesuar görünümü sunar.
          </p>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Aksesuar Olarak Kullanımı</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              Bakır bileklikler günlük kombinlerde, özel günlerde veya anlamlı bir kişisel parça olarak kullanılabilir. Zamansız rengi birçok tarzla uyum sağlar.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Kişisel Anlam Taşıması</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              İsim, doğum tarihi veya özel sembol eklenerek bileklik kişiye özel hale getirilebilir. Bu da ürünü yalnızca bir takı değil, anlamlı bir hatıra haline getirir.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Hediye Seçeneği</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              Özel günlerde kişiye özel hazırlanmış bir bileklik, klasik hediyelere göre daha kalıcı ve anlamlı bir seçenek olabilir.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Önemli Not</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              Bakır bileklikler kişisel kullanım ve dekoratif aksesuar amaçlıdır. Tıbbi, finansal veya manevi sonuç garantisi sunmaz.
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
