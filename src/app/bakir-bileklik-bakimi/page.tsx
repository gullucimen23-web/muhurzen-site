export const metadata = {
  title: "Bakır Bileklik Bakımı Nasıl Yapılır? | MühürZen",
  description:
    "Bakır bileklik kararması, temizliği ve uzun ömürlü kullanım için bakım önerileri.",
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
            Bakır Bileklik Bakımı Nasıl Yapılır?
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-300">
            Bakır bileklikler doğal metal yapısı nedeniyle zamanla renk değiştirebilir. Doğru bakım ile ürünün görünümünü korumak ve kullanım ömrünü uzatmak mümkündür.
          </p>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Bakır Neden Kararır?</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              Bakır, hava, nem ve ciltle temas ettiğinde doğal olarak oksitlenebilir. Bu durum ürünün bozulduğu anlamına gelmez; bakırın doğal tepkisidir.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Günlük Bakım Önerileri</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              Bilekliği duş, deniz, havuz ve yoğun kimyasal temasından uzak tutmak önerilir. Parfüm, krem ve temizlik ürünleriyle doğrudan temas ettirmemek daha iyi sonuç verir.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Temizlik Nasıl Yapılır?</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              Yumuşak ve kuru bir bezle düzenli silmek yeterlidir. Aşındırıcı malzemeler kullanılmamalıdır. Hassas temizlik için profesyonel takı bakım ürünleri tercih edilebilir.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Saklama Önerisi</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              Kullanılmadığında kuru bir yerde, ayrı bir kese veya kutu içinde saklamak çizilmeyi ve kararmayı azaltabilir.
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
