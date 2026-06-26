"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Word = {
  id?: string;
  title: string;
  category: string;
  meaning: string;
  example?: string | null;
  source?: string | null;
  slug: string;
};

type CategoryItem = {
  id: string;
  value: string;
  uz: string;
  ru?: string | null;
};

const alphabet = [
  "Barchasi",
  "A",
  "B",
  "D",
  "E",
  "F",
  "G",
  "G‘",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "O‘",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "X",
  "Y",
  "Z",
  "Sh",
  "Ch",
];

function normalizeText(value: string | null | undefined) {
  return (value || "")
    .toLowerCase()
    .replaceAll("’", "'")
    .replaceAll("‘", "'")
    .replaceAll("ʻ", "'")
    .trim();
}

function getFirstLetter(title: string) {
  const word = normalizeText(title);

  if (word.startsWith("o'") || word.startsWith("o‘")) return "O‘";
  if (word.startsWith("g'") || word.startsWith("g‘")) return "G‘";
  if (word.startsWith("sh")) return "Sh";
  if (word.startsWith("ch")) return "Ch";

  return word.charAt(0).toUpperCase();
}

export default function WordsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Barchasi");
  const [activeLetter, setActiveLetter] = useState("Barchasi");

  const [words, setWords] = useState<Word[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryFromUrl = params.get("q");

    if (queryFromUrl) {
      setSearch(queryFromUrl);
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setErrorText("");

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
        setErrorText("So‘zlarni yuklashda xatolik yuz berdi.");
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

  const categoryButtons = useMemo(() => {
    const items = categories.map((category) => ({
      value: category.value || category.uz,
      label: category.uz || category.value,
    }));

    return [{ value: "Barchasi", label: "Barchasi" }, ...items];
  }, [categories]);

  function getCategoryLabel(value: string) {
    const found = categories.find(
      (category) => category.value === value || category.uz === value
    );

    return found?.uz || value;
  }

  const filteredWords = useMemo(() => {
    const query = normalizeText(search);

    return words.filter((word) => {
      const title = normalizeText(word.title);
      const meaning = normalizeText(word.meaning);
      const category = normalizeText(word.category);
      const example = normalizeText(word.example);
      const source = normalizeText(word.source);

      const matchesSearch =
        !query ||
        title.includes(query) ||
        meaning.includes(query) ||
        category.includes(query) ||
        example.includes(query) ||
        source.includes(query);

      const matchesCategory =
        activeCategory === "Barchasi" || word.category === activeCategory;

      const matchesLetter =
        activeLetter === "Barchasi" ||
        getFirstLetter(word.title) === activeLetter;

      return matchesSearch && matchesCategory && matchesLetter;
    });
  }, [search, activeCategory, activeLetter, words]);

  function resetFilters() {
    setSearch("");
    setActiveCategory("Barchasi");
    setActiveLetter("Barchasi");

    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, "", cleanUrl);
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

          <a
            href="/"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Bosh sahifa
          </a>
        </div>
      </header>

      <section className="border-b bg-gradient-to-b from-white to-blue-50">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <h2 className="mb-5 text-4xl font-bold text-slate-950 md:text-5xl">
            Neologizmlar lug‘ati
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-lg leading-8 text-slate-600">
            Yangi so‘zlar, ularning ma’nosi, qo‘llanish sohasi va misollarini
            shu sahifadan topishingiz mumkin.
          </p>

          <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-3xl bg-white p-3 shadow-lg sm:flex-row sm:items-center">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="So‘z kiriting, masalan: layk, bloger, strim..."
              className="w-full bg-transparent px-5 py-4 outline-none"
            />

            {(search ||
              activeCategory !== "Barchasi" ||
              activeLetter !== "Barchasi") && (
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-200"
              >
                Tozalash
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        {errorText && (
          <div className="mb-8 rounded-3xl border border-red-200 bg-red-50 p-5 text-red-700">
            {errorText}
          </div>
        )}

        <div className="mb-8">
          <h3 className="mb-4 text-xl font-bold">Kategoriyalar</h3>

          <div className="flex flex-wrap gap-3">
            {categoryButtons.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => setActiveCategory(category.value)}
                className={`rounded-full border px-5 py-3 text-sm font-medium shadow-sm ${
                  activeCategory === category.value
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-600"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h3 className="mb-4 text-xl font-bold">Alfavit bo‘yicha</h3>

          <div className="flex flex-wrap gap-2">
            {alphabet.map((letter) => (
              <button
                key={letter}
                type="button"
                onClick={() => setActiveLetter(letter)}
                className={`rounded-xl border px-4 py-2 text-sm font-medium shadow-sm ${
                  activeLetter === letter
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-600"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">So‘zlar ro‘yxati</h2>

            <p className="mt-2 text-sm text-slate-500">
              Faol kategoriya:{" "}
              <span className="font-medium text-slate-700">
                {activeCategory === "Barchasi"
                  ? "Barchasi"
                  : getCategoryLabel(activeCategory)}
              </span>{" "}
              · Harf:{" "}
              <span className="font-medium text-slate-700">
                {activeLetter}
              </span>
            </p>
          </div>

          <div className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm">
            Topilgan so‘zlar:{" "}
            <span className="font-bold text-blue-700">
              {filteredWords.length}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-slate-600">Yuklanmoqda...</p>
          </div>
        ) : filteredWords.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredWords.map((word) => (
              <a
                key={word.id || word.slug}
                href={`/words/${encodeURIComponent(word.slug)}`}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-2xl font-bold text-blue-700">
                    {word.title}
                  </h3>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                    {getCategoryLabel(word.category)}
                  </span>
                </div>

                <p className="mb-5 leading-8 text-slate-700">
                  {word.meaning}
                </p>

                {word.example && (
                  <p className="mb-4 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                    <b>Misol:</b> {word.example}
                  </p>
                )}

                {word.source && (
                  <p className="text-sm text-slate-500">
                    <b>Manba:</b> {word.source}
                  </p>
                )}

                <p className="mt-5 font-medium text-blue-600">
                  Batafsil o‘qish →
                </p>
              </a>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h3 className="mb-3 text-2xl font-bold">So‘z topilmadi</h3>
            <p className="text-slate-600">
              Boshqa so‘z yozib ko‘ring, kategoriyani o‘zgartiring yoki boshqa
              harfni tanlang.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              Filtrlarni tozalash
            </button>
          </div>
        )}
      </section>
    </main>
  );
}