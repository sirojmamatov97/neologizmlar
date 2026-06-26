"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

type Word = {
  id?: string | number;
  title: string;
  category: string;
  meaning: string;
  example?: string | null;
  source?: string | null;
  slug: string;
};

type CategoryItem = {
  id: string | number;
  value: string;
  uz: string;
  ru?: string | null;
};

export default function WordDetailPage() {
  const params = useParams();
  const slugParam = params.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

  const [word, setWord] = useState<Word | null>(null);
  const [similarWords, setSimilarWords] = useState<Word[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    async function loadWord() {
      if (!slug) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorText("");
      setWord(null);
      setSimilarWords([]);

      const { data: wordData, error: wordError } = await supabase
        .from("words")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .order("uz", { ascending: true });

      if (wordError) {
        console.error("Word detail error:", wordError.message);
        setErrorText("So‘zni yuklashda xatolik yuz berdi.");
      }

      if (categoriesError) {
        console.error("Categories error:", categoriesError.message);
      }

      setCategories((categoriesData || []) as CategoryItem[]);

      if (wordData) {
        const currentWord = wordData as Word;
        setWord(currentWord);

        const { data: similarData, error: similarError } = await supabase
          .from("words")
          .select("*")
          .eq("category", currentWord.category)
          .neq("slug", currentWord.slug)
          .order("title", { ascending: true })
          .limit(4);

        if (similarError) {
          console.error("Similar words error:", similarError.message);
        }

        setSimilarWords((similarData || []) as Word[]);
      } else {
        setWord(null);
      }

      setLoading(false);
    }

    loadWord();
  }, [slug]);

  function getCategoryLabel(value: string) {
    const found = categories.find(
      (category) => category.value === value || category.uz === value
    );

    return found?.uz || value;
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
            href="/words"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Lug‘atga qaytish
          </a>
        </div>
      </header>

      {loading ? (
        <section className="mx-auto max-w-4xl px-6 py-20 text-center">
          <div className="rounded-3xl bg-white p-10 shadow-sm">
            <p className="text-slate-600">Yuklanmoqda...</p>
          </div>
        </section>
      ) : !word ? (
        <section className="mx-auto max-w-4xl px-6 py-20 text-center">
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10">
            <h2 className="mb-4 text-3xl font-bold">So‘z topilmadi</h2>

            <p className="mb-8 text-slate-600">
              Bunday so‘z lug‘atda mavjud emas yoki manzil noto‘g‘ri
              kiritilgan.
            </p>

            <a
              href="/words"
              className="inline-block rounded-2xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Lug‘atga qaytish
            </a>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-5xl px-6 py-16">
          <a
            href="/words"
            className="mb-8 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Barcha so‘zlarga qaytish
          </a>

          {errorText && (
            <div className="mb-8 rounded-3xl border border-red-200 bg-red-50 p-5 text-red-700">
              {errorText}
            </div>
          )}

          <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-br from-blue-600 to-slate-900 p-8 text-white md:p-10">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white">
                  {getCategoryLabel(word.category)}
                </span>

                <span className="rounded-full bg-white/15 px-4 py-2 text-sm text-white/90">
                  Neologizm
                </span>
              </div>

              <h2 className="text-5xl font-bold md:text-6xl">{word.title}</h2>
            </div>

            <div className="p-8 md:p-10">
              <div className="mb-8">
                <h3 className="mb-3 text-xl font-bold">Ma’nosi</h3>
                <p className="text-lg leading-9 text-slate-700">
                  {word.meaning}
                </p>
              </div>

              {word.example && (
                <div className="mb-8 rounded-3xl bg-blue-50 p-6">
                  <h3 className="mb-3 text-xl font-bold text-slate-950">
                    Qo‘llanish misoli
                  </h3>
                  <p className="leading-8 text-slate-700">{word.example}</p>
                </div>
              )}

              {word.source && (
                <div className="rounded-3xl bg-slate-50 p-6">
                  <h3 className="mb-3 text-xl font-bold text-slate-950">
                    Manba
                  </h3>
                  <p className="leading-8 text-slate-600">{word.source}</p>
                </div>
              )}
            </div>
          </article>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="/words"
              className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              Lug‘atga qaytish
            </a>

            <a
              href={`/words?q=${encodeURIComponent(word.category)}`}
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:border-blue-400 hover:text-blue-600"
            >
              Shu kategoriya bo‘yicha ko‘rish
            </a>
          </div>

          {similarWords.length > 0 && (
            <section className="mt-14">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold">O‘xshash so‘zlar</h2>
                  <p className="mt-2 text-slate-600">
                    Shu kategoriya bo‘yicha boshqa neologizmlar.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {similarWords.map((item) => (
                  <a
                    key={item.id || item.slug}
                    href={`/words/${encodeURIComponent(item.slug)}`}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md"
                  >
                    <span className="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                      {getCategoryLabel(item.category)}
                    </span>

                    <h3 className="mb-3 text-2xl font-bold text-blue-700">
                      {item.title}
                    </h3>

                    <p className="leading-7 text-slate-600">{item.meaning}</p>

                    <p className="mt-5 font-medium text-blue-600">
                      Batafsil o‘qish →
                    </p>
                  </a>
                ))}
              </div>
            </section>
          )}
        </section>
      )}
    </main>
  );
}