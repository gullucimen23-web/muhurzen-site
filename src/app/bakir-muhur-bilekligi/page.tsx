export const metadata = {
  title: "Bakır Mühür Bilekliği Nedir? | MühürZen",
  description:
    "Bakır mühür bilekliği, sembolik tasarım anlayışı ve kişiye özel kullanım alanları hakkında bilgiler.",
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
            Bakır Mühür Bilekliği Nedir?
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-300">
            Bakır mühür bilekliği, mühür sembolünden ilham alan, kişiye özel anlam taşıyacak şekilde hazırlanan özel bir aksesuardır. Geleneksel motifler ve modern tasarım çizgileriyle birleşir.
          </p>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Mühür Sembolü Ne Anlama Gelir?</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              Mühür, tarih boyunca kimlik, aidiyet, imza ve özel anlam taşıyan bir sembol olarak kullanılmıştır. Bileklik tasarımlarında bu sembol kişisel bir dokunuşa dönüşür.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Bakır ile Mühür Tasarımının Uyumu</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              Bakırın sıcak rengi ve doğal yapısı, mühür formunun güçlü görünümüyle birleşerek dikkat çekici bir aksesuar oluşturur.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Kimler Tercih Edebilir?</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              Kendine özel bir aksesuar isteyenler, anlamlı hediye arayanlar veya sade ama dikkat çekici bir tasarım tercih edenler için uygundur.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-black">MühürZen Yorumu</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              MühürZen’de bakır mühür bileklikleri, kişisel bilgiler ve özel niyet alanlarıyla birlikte hazırlanarak daha anlamlı bir kullanım deneyimi sunar.
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
