import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-amber-400">← Ana sayfaya dön</Link>
        <h1 className="mt-8 text-4xl font-black">Blog</h1>
        <div className="mt-8 space-y-5 leading-8 text-zinc-300">
          <p>Yakında Süleyman mührü, bakır bileklik bakımı, kişiye özel hediye seçimi ve geleneksel semboller hakkında SEO odaklı içerikler yayınlanacaktır.</p>
        </div>
      </div>
    </main>
  );
}
