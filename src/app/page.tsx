"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Word = {
  id?: string | number;
  title: string;
  category: string;
  meaning: string;
  example?: string | null;
  source?: string | null;
  slug?: string | null;
  appearance_year?: number | null;
};

const floatingWords = [
  "layk",
  "bloger",
  "strim",
  "kontent",
  "keshbek",
  "platforma",
];

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/['’`‘ʻ]/g, "")
    .replace(/\s+/g, "-");
}

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const { data: wordsData, error: wordsError } = await supabase
        .from("words")
        .select("*")
        .order("title", { ascending: true });

      if (wordsError) {
        console.error("Words error:", wordsError.message);
      }

      setWords((wordsData || []) as Word[]);
      setLoading(false);
    }

    loadData();
  }, []);

  const visibleWords = useMemo(() => {
    return words.slice(0, 12);
  }, [words]);

  function handleSearch() {
    const query = search.trim();

    if (query) {
      window.location.href = `/words?q=${encodeURIComponent(query)}`;
      return;
    }

    window.location.href = "/words";
  }

  function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <style>
        {`
          @keyframes floatSlow {
            0% { transform: translateY(0px) translateX(0px) scale(1); }
            50% { transform: translateY(-22px) translateX(14px) scale(1.04); }
            100% { transform: translateY(0px) translateX(0px) scale(1); }
          }

          @keyframes floatWord {
            0% { transform: translateY(0px); opacity: 0.72; }
            50% { transform: translateY(-14px); opacity: 1; }
            100% { transform: translateY(0px); opacity: 0.72; }
          }

          @keyframes glowPulse {
            0% { box-shadow: 0 20px 60px rgba(37, 99, 235, 0.18); }
            50% { box-shadow: 0 28px 80px rgba(37, 99, 235, 0.32); }
            100% { box-shadow: 0 20px 60px rgba(37, 99, 235, 0.18); }
          }

          .neo-hero-bg {
            background:
              radial-gradient(circle at 15% 18%, rgba(59, 130, 246, 0.28), transparent 28%),
              radial-gradient(circle at 85% 25%, rgba(37, 99, 235, 0.22), transparent 30%),
              radial-gradient(circle at 50% 100%, rgba(14, 165, 233, 0.20), transparent 34%),
              linear-gradient(180deg, #ffffff 0%, #eff6ff 55%, #f8fafc 100%);
          }

          .neo-grid-bg {
            background-image:
              linear-gradient(rgba(37, 99, 235, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(37, 99, 235, 0.08) 1px, transparent 1px);
            background-size: 42px 42px;
          }

          .neo-blob {
            animation: floatSlow 7s ease-in-out infinite;
          }

          .neo-word {
            animation: floatWord 4.5s ease-in-out infinite;
          }

          .neo-search {
            animation: glowPulse 4s ease-in-out infinite;
            backdrop-filter: blur(16px);
          }
        `}
      </style>

      <header className="sticky top-0 z-40 border-b border-blue-100/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-400 text-white shadow-lg shadow-blue-200">
              📖
            </div>

            <div>
              <h1 className="text-xl font-bold">neologizmlar.uz</h1>
              <p className="text-sm text-slate-500">
                Elektron neologizmlar lug‘ati
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="/words" className="hover:text-blue-600">
              Lug‘at
            </a>

            <a href="/about" className="hover:text-blue-600">
              Loyiha haqida
            </a>
          </nav>
        </div>
      </header>

      <section className="neo-hero-bg relative overflow-hidden">
        <div className="neo-grid-bg absolute inset-0 opacity-60" />

        <div className="neo-blob absolute left-8 top-20 h-40 w-40 rounded-full bg-blue-300/30 blur-3xl" />
        <div
          className="neo-blob absolute right-12 top-28 h-56 w-56 rounded-full bg-sky-300/35 blur-3xl"
          style={{ animationDelay: "1.2s" }}
        />
        <div
          className="neo-blob absolute bottom-8 left-1/2 h-48 w-48 rounded-full bg-indigo-300/25 blur-3xl"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative mx-auto max-w-6xl px-6 py-24 text-center md:py-28">
          <div className="mx-auto mb-6 inline-flex rounded-full border border-blue-200 bg-white/70 px-5 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur">
            O‘zbek tilidagi yangi so‘zlar elektron lug‘ati
          </div>

          <h2 className="mx-auto mb-6 max-w-4xl text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl">
            Neologizmlarni{" "}
            <span className="bg-gradient-to-r from-blue-700 via-sky-500 to-blue-700 bg-clip-text text-transparent">
              tez va aqlli
            </span>{" "}
            izlash platformasi
          </h2>

          <p className="mx-auto mb-10 max-w-3xl text-lg leading-8 text-slate-600">
            Saytda yangi so‘zlarning ma’nosi, qo‘llanish sohasi, misollari,
            manbalari va paydo bo‘lish yillari jamlanadi.
          </p>

          <div className="relative mx-auto max-w-4xl">
            {floatingWords.map((item, index) => (
              <span
                key={item}
                className="neo-word pointer-events-none absolute hidden rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm backdrop-blur md:inline-flex"
                style={{
                  left:
                    index === 0
                      ? "0%"
                      : index === 1
                      ? "8%"
                      : index === 2
                      ? "78%"
                      : index === 3
                      ? "86%"
                      : index === 4
                      ? "15%"
                      : "70%",
                  top:
                    index === 0
                      ? "-34px"
                      : index === 1
                      ? "96px"
                      : index === 2
                      ? "-28px"
                      : index === 3
                      ? "98px"
                      : index === 4
                      ? "170px"
                      : "166px",
                  animationDelay: `${index * 0.35}s`,
                }}
              >
                {item}
              </span>
            ))}

            <div className="neo-search mx-auto flex max-w-3xl flex-col gap-3 rounded-[2rem] border border-blue-200/80 bg-white/80 p-3 shadow-2xl sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-3 rounded-3xl bg-blue-50/70 px-5">
                <span className="text-xl">🔎</span>

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="So‘z kiriting: layk, bloger, strim..."
                  className="w-full bg-transparent py-5 text-base outline-none placeholder:text-slate-400"
                />
              </div>

              <button
                type="button"
                onClick={handleSearch}
                className="rounded-3xl bg-gradient-to-r from-blue-700 to-sky-500 px-8 py-5 font-bold text-white shadow-lg shadow-blue-200 transition hover:scale-[1.02]"
              >
                Izlash
              </button>
            </div>
          </div>

          <div className="mt-9">
            <a
              href="/words"
              className="inline-flex rounded-full bg-slate-950 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:bg-blue-700"
            >
              Barcha so‘zlarni ko‘rish
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="mb-4 text-4xl font-bold">So‘zlar</h2>
            <p className="text-slate-600">
              Lug‘atda mavjud bo‘lgan yangi so‘zlar.
            </p>
          </div>

          <a
            href="/words"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            Lug‘atga o‘tish
          </a>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-slate-600">Yuklanmoqda...</p>
          </div>
        ) : visibleWords.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {visibleWords.map((word, index) => (
              <a
                key={`${word.title}-${index}`}
                href={`/words/${encodeURIComponent(
                  word.slug || createSlug(word.title)
                )}`}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:bg-blue-50 hover:shadow-md"
              >
                {word.category ? (
                  <span className="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                    {word.category}
                  </span>
                ) : null}

                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="text-2xl font-bold text-blue-700">
                    {word.title}
                  </h3>

                  {word.appearance_year ? (
                    <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      {word.appearance_year}
                    </span>
                  ) : null}
                </div>

                <p className="line-clamp-3 leading-7 text-slate-600">
                  {word.meaning}
                </p>
              </a>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h3 className="mb-3 text-2xl font-bold">
              So‘zlar hozircha kiritilmagan
            </h3>
            <p className="text-slate-600">
              Yangi so‘zlarni admin panel orqali qo‘shishingiz mumkin.
            </p>
          </div>
        )}
      </section>

      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 px-6 py-8 text-center text-sm text-slate-500">
          <span>© 2026 neologizmlar.uz</span>

          <span>·</span>

          <a
            href="/about"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Loyiha haqida
          </a>

          <span>·</span>

          <a
            href="mailto:anechkavapayeva@gmail.com"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            anechkavapayeva@gmail.com
          </a>
        </div>
      </footer>
    </main>
  );
}