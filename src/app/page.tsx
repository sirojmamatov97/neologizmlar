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
};

type CategoryItem = {
  id: string | number;
  value: string;
  uz: string;
  ru?: string | null;
};

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/['’`‘ʻ]/g, "")
    .replace(/\s+/g, "-");
}

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const { data: wordsData, error: wordsError } = await supabase
        .from("words")
        .select("*")
        .order("title", { ascending: true });

      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .order("uz", { ascending: true });

      if (wordsError) {
        console.error("Words error:", wordsError.message);
      }

      if (categoriesError) {
        console.error("Categories error:", categoriesError.message);
      }

      setWords((wordsData || []) as Word[]);
      setCategories((categoriesData || []) as CategoryItem[]);
      setLoading(false);
    }

    loadData();
  }, []);

  const popularWords = useMemo(() => {
    return words.slice(0, 6);
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
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white">
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
            <a href="#categories" className="hover:text-blue-600">
              Kategoriyalar
            </a>
            <a href="#about" className="hover:text-blue-600">
              Qanday ishlaydi
            </a>
          </nav>
        </div>
      </header>

      <section className="bg-gradient-to-b from-white to-blue-50">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <div className="mx-auto mb-6 inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-medium text-blue-700">
            O‘zbek tilidagi yangi so‘zlar elektron lug‘ati
          </div>

          <h2 className="mx-auto mb-6 max-w-4xl text-4xl font-bold leading-tight text-slate-950 md:text-6xl">
            Neologizmlarni tez, qulay va tartibli izlash platformasi
          </h2>

          <p className="mx-auto mb-10 max-w-3xl text-lg leading-8 text-slate-600">
            Saytda yangi so‘zlarning ma’nosi, qo‘llanish sohasi, misollari va
            manbalari jamlanadi.
          </p>

          <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-3xl bg-white p-3 shadow-lg sm:flex-row sm:items-center">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="So‘z kiriting: layk, bloger, strim..."
              className="w-full bg-transparent px-5 py-4 outline-none"
            />

            <button
              type="button"
              onClick={handleSearch}
              className="rounded-2xl bg-blue-600 px-7 py-4 font-semibold text-white hover:bg-blue-700"
            >
              Izlash
            </button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="/words"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              Barcha so‘zlar
            </a>

            {categories.slice(0, 5).map((category) => (
              <a
                key={category.id}
                href={`/words?q=${encodeURIComponent(
                  category.value || category.uz
                )}`}
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm hover:border-blue-400 hover:text-blue-600"
              >
                {category.uz || category.value}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-4xl font-bold">Kategoriyalar</h2>
          <p className="text-slate-600">
            Kategoriyalar admin panel orqali qo‘shiladi va boshqariladi.
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-slate-600">Yuklanmoqda...</p>
          </div>
        ) : categories.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`/words?q=${encodeURIComponent(
                  category.value || category.uz
                )}`}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-xl">
                  🗂️
                </div>

                <h3 className="mb-3 text-2xl font-bold text-slate-950">
                  {category.uz || category.value}
                </h3>

                <p className="leading-7 text-slate-600">
                  Ushbu kategoriya bo‘yicha neologizmlarni ko‘rish.
                </p>

                <p className="mt-5 font-medium text-blue-600">Ko‘rish →</p>
              </a>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h3 className="mb-3 text-2xl font-bold">
              Kategoriyalar hozircha yo‘q
            </h3>
            <p className="text-slate-600">
              Kategoriyalarni admin panel orqali qo‘shishingiz mumkin.
            </p>
          </div>
        )}
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="mb-4 text-4xl font-bold">Mashhur so‘zlar</h2>
              <p className="text-slate-600">
                Lug‘atda mavjud bo‘lgan ayrim yangi so‘zlar.
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
            <div className="rounded-3xl bg-slate-50 p-10 text-center">
              <p className="text-slate-600">Yuklanmoqda...</p>
            </div>
          ) : popularWords.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {popularWords.map((word, index) => (
                <a
                  key={`${word.title}-${index}`}
                  href={`/words/${encodeURIComponent(
                    word.slug || createSlug(word.title)
                  )}`}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6 hover:bg-blue-50"
                >
                  <span className="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                    {word.category}
                  </span>

                  <h3 className="mb-3 text-2xl font-bold text-blue-700">
                    {word.title}
                  </h3>

                  <p className="line-clamp-3 leading-7 text-slate-600">
                    {word.meaning}
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <h3 className="mb-3 text-2xl font-bold">
                So‘zlar hozircha kiritilmagan
              </h3>
              <p className="text-slate-600">
                Yangi so‘zlarni admin panel orqali qo‘shishingiz mumkin.
              </p>
            </div>
          )}
        </div>
      </section>

      <section id="about" className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl bg-slate-900 p-8 text-white md:p-12">
          <h2 className="mb-5 text-4xl font-bold">Qanday ishlaydi?</h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-white/10 p-6">
              <div className="mb-4 text-3xl">1</div>
              <h3 className="mb-3 text-xl font-bold">So‘z qo‘shiladi</h3>
              <p className="leading-7 text-slate-300">
                Admin panel orqali yangi neologizm, ma’nosi va misoli
                kiritiladi.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-6">
              <div className="mb-4 text-3xl">2</div>
              <h3 className="mb-3 text-xl font-bold">Kategoriya tanlanadi</h3>
              <p className="leading-7 text-slate-300">
                Har bir so‘z tegishli mavzu yoki soha bo‘yicha ajratiladi.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-6">
              <div className="mb-4 text-3xl">3</div>
              <h3 className="mb-3 text-xl font-bold">Foydalanuvchi izlaydi</h3>
              <p className="leading-7 text-slate-300">
                Sayt foydalanuvchisi so‘zlarni izlash, kategoriya yoki alfavit
                bo‘yicha ko‘rishi mumkin.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-slate-500">
          © neologizmlar.uz — elektron neologizmlar lug‘ati
        </div>
      </footer>
    </main>
  );
}