export const metadata = {
  title: "Bakır Bileklik Faydaları | MühürZen",
  description: "Bakır bileklik kullanımı, bakım önerileri ve kişiye özel tasarım seçenekleri.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-black px-5 py-12 text-white">
      <article className="mx-auto max-w-4xl">
        <a href="/" className="text-xl font-black">
          Mühür<span className="text-amber-400">Zen</span>
        </a>

        <div className="mt-10 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-400">
            MühürZen Rehberi
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">Bakır Bileklik Faydaları</h1>
          <p className="mt-6 text-lg leading-8 text-zinc-300">Bakır bileklik kullanımı, bakım önerileri ve kişiye özel tasarım seçenekleri.</p>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Bakır Bileklik Nedir?</h2>
            <p className="mt-4 leading-8 text-zinc-300">Bakır bileklik, doğal bakır metalinden üretilen ve günlük kullanım için tasarlanan özel bir aksesuardır.</p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Neden Tercih Edilir?</h2>
            <p className="mt-4 leading-8 text-zinc-300">Doğal görünümü, kişiye özel hazırlanabilmesi ve hediye olarak anlam taşıması nedeniyle tercih edilir.</p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Bakımı Nasıl Yapılır?</h2>
            <p className="mt-4 leading-8 text-zinc-300">Nem, kimyasal ve yoğun su temasından uzak tutulmalı; yumuşak bir bezle temizlenmelidir.</p>
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
