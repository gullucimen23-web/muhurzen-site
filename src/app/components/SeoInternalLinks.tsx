const seoLinks = [
  {
    href: "/suleyman-muhru",
    title: "Süleyman Mührü",
    desc: "Sembolün anlamı ve takılardaki kullanımını keşfet.",
  },
  {
    href: "/suleyman-muhru-bileklik",
    title: "Süleyman Mührü Bileklik",
    desc: "Kişiye özel Süleyman Mührü bileklik tasarımları.",
  },
  {
    href: "/bakir-suleyman-muhru-bileklik",
    title: "Bakır Süleyman Mührü Bileklik",
    desc: "Bakır işçiliğiyle hazırlanan sembolik bileklikler.",
  },
  {
    href: "/kisiye-ozel-bakir-bileklik",
    title: "Kişiye Özel Bakır Bileklik",
    desc: "İsim, tarih ve özel sembollerle hazırlanan bileklikler.",
  },
  {
    href: "/bakir-bileklik-faydalari",
    title: "Bakır Bileklik Faydaları",
    desc: "Bakır bileklik kullanımı ve bakım önerileri.",
  },
  {
    href: "/isim-yazili-bakir-bileklik",
    title: "İsim Yazılı Bakır Bileklik",
    desc: "Anlamlı ve kişiye özel hediye seçenekleri.",
  },
];

export default function SeoInternalLinks() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 md:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-400">
          MühürZen Rehberi
        </p>
        <h2 className="mt-3 text-4xl font-black">
          Bakır bileklik ve Süleyman Mührü rehberi
        </h2>
        <p className="mt-4 max-w-3xl leading-7 text-zinc-400">
          Kişiye özel bakır bileklikler, Süleyman Mührü sembolü ve bakım önerileri hakkında hazırladığımız rehberleri inceleyebilirsiniz.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {seoLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-3xl border border-zinc-800 bg-black p-5 transition hover:border-amber-500 hover:bg-amber-500/10"
            >
              <h3 className="text-xl font-black text-white">{link.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{link.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
