"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Category = {
  id: string;
  name: string;
};

type WordItem = {
  id: string;
  word: string;
  slug: string;
  definition: string | null;
  example: string | null;
  appearance_year: number | null;
  category_id: string | null;
  categories: Category | Category[] | null;
};

const alphabet = [
  "A",
  "B",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
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
  "O‘",
  "G‘",
  "Sh",
  "Ch",
];

function getCategoryName(categories: WordItem["categories"]) {
  if (!categories) return "";
  if (Array.isArray(categories)) {
    return categories[0]?.name || "";
  }
  return categories.name || "";
}

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replaceAll("'", "‘")
    .replaceAll("ʼ", "‘")
    .trim();
}

function startsWithLetter(word: string, letter: string) {
  const normalizedWord = normalizeText(word);
  const normalizedLetter = normalizeText(letter);

  return normalizedWord.startsWith(normalizedLetter);
}

export default function WordsPage() {
  const [words, setWords] = useState<WordItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    async function loadWords() {
      try {
        setLoading(true);

        const response = await fetch("/api/words", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Ma’lumotlarni yuklashda xatolik");
        }

        setWords(data.words || []);
        setCategories(data.categories || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadWords();
  }, []);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 2015;

    return Array.from(
      { length: currentYear - startYear + 1 },
      (_, index) => currentYear - index
    );
  }, []);

  const filteredWords = useMemo(() => {
    return words.filter((item) => {
      const word = item.word || "";
      const definition = item.definition || "";
      const categoryName = getCategoryName(item.categories);

      const searchText = normalizeText(search);

      const matchesSearch =
        !searchText ||
        normalizeText(word).includes(searchText) ||
        normalizeText(definition).includes(searchText) ||
        normalizeText(categoryName).includes(searchText);

      const matchesLetter =
        selectedLetter === "all" || startsWithLetter(word, selectedLetter);

      const matchesYear =
        selectedYear === "all" ||
        Number(item.appearance_year) === Number(selectedYear);

      const matchesCategory =
        selectedCategory === "all" || item.category_id === selectedCategory;

      return matchesSearch && matchesLetter && matchesYear && matchesCategory;
    });
  }, [words, search, selectedLetter, selectedYear, selectedCategory]);

  function resetFilters() {
    setSearch("");
    setSelectedLetter("all");
    setSelectedYear("all");
    setSelectedCategory("all");
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <Link href="/" style={styles.backLink}>
          ← Bosh sahifa
        </Link>

        <h1 style={styles.title}>Neologizmlar lug‘ati</h1>

        <p style={styles.subtitle}>
          So‘zlarni harf, yil va kategoriya bo‘yicha saralash imkoniyati.
        </p>
      </section>

      <section style={styles.filtersBox}>
        <div style={styles.searchRow}>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="So‘z, izoh yoki kategoriya bo‘yicha qidirish..."
            style={styles.searchInput}
          />

          <button onClick={resetFilters} style={styles.resetButton}>
            Tozalash
          </button>
        </div>

        <div style={styles.filterBlock}>
          <h3 style={styles.filterTitle}>Harf bo‘yicha</h3>

          <div style={styles.buttonGroup}>
            <button
              onClick={() => setSelectedLetter("all")}
              style={{
                ...styles.filterButton,
                ...(selectedLetter === "all" ? styles.activeButton : {}),
              }}
            >
              Barchasi
            </button>

            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                style={{
                  ...styles.filterButton,
                  ...(selectedLetter === letter ? styles.activeButton : {}),
                }}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.filterBlock}>
          <h3 style={styles.filterTitle}>Yil bo‘yicha</h3>

          <div style={styles.buttonGroup}>
            <button
              onClick={() => setSelectedYear("all")}
              style={{
                ...styles.filterButton,
                ...(selectedYear === "all" ? styles.activeButton : {}),
              }}
            >
              Barchasi
            </button>

            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(String(year))}
                style={{
                  ...styles.filterButton,
                  ...(selectedYear === String(year) ? styles.activeButton : {}),
                }}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.filterBlock}>
          <h3 style={styles.filterTitle}>Kategoriya bo‘yicha</h3>

          <div style={styles.buttonGroup}>
            <button
              onClick={() => setSelectedCategory("all")}
              style={{
                ...styles.filterButton,
                ...(selectedCategory === "all" ? styles.activeButton : {}),
              }}
            >
              Barchasi
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  ...styles.filterButton,
                  ...(selectedCategory === category.id
                    ? styles.activeButton
                    : {}),
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section style={styles.resultHeader}>
        <p style={styles.resultCount}>
          Topildi: <b>{filteredWords.length}</b> ta so‘z
        </p>
      </section>

      {loading ? (
        <div style={styles.emptyBox}>Yuklanmoqda...</div>
      ) : filteredWords.length === 0 ? (
        <div style={styles.emptyBox}>
          Tanlangan filtrlar bo‘yicha so‘z topilmadi.
        </div>
      ) : (
        <section style={styles.grid}>
          {filteredWords.map((item) => {
            const categoryName = getCategoryName(item.categories);

            return (
              <Link
                key={item.id}
                href={`/words/${item.slug}`}
                style={styles.card}
              >
                <div style={styles.cardTop}>
                  <h2 style={styles.wordTitle}>{item.word}</h2>

                  {item.appearance_year ? (
                    <span style={styles.yearBadge}>
                      {item.appearance_year}
                    </span>
                  ) : null}
                </div>

                {categoryName ? (
                  <span style={styles.categoryBadge}>{categoryName}</span>
                ) : null}

                {item.definition ? (
                  <p style={styles.definition}>{item.definition}</p>
                ) : (
                  <p style={styles.definitionMuted}>Izoh kiritilmagan</p>
                )}

                <span style={styles.more}>Batafsil →</span>
              </Link>
            );
          })}
        </section>
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f7f8fb",
    padding: "32px 18px 60px",
    color: "#172033",
  },

  hero: {
    maxWidth: 1120,
    margin: "0 auto 22px",
  },

  backLink: {
    display: "inline-block",
    marginBottom: 18,
    color: "#2563eb",
    textDecoration: "none",
    fontSize: 15,
    fontWeight: 600,
  },

  title: {
    margin: 0,
    fontSize: 42,
    lineHeight: 1.1,
    fontWeight: 800,
    letterSpacing: "-0.03em",
  },

  subtitle: {
    marginTop: 12,
    marginBottom: 0,
    fontSize: 17,
    color: "#667085",
    maxWidth: 680,
    lineHeight: 1.6,
  },

  filtersBox: {
    maxWidth: 1120,
    margin: "0 auto",
    background: "#ffffff",
    border: "1px solid #e6e9f0",
    borderRadius: 22,
    padding: 20,
    boxShadow: "0 12px 35px rgba(15, 23, 42, 0.06)",
  },

  searchRow: {
    display: "flex",
    gap: 12,
    marginBottom: 18,
    flexWrap: "wrap",
  },

  searchInput: {
    flex: "1 1 320px",
    border: "1px solid #d8deea",
    borderRadius: 14,
    padding: "14px 16px",
    fontSize: 15,
    outline: "none",
    background: "#fbfcff",
  },

  resetButton: {
    border: "none",
    borderRadius: 14,
    padding: "14px 18px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    background: "#172033",
    color: "#ffffff",
  },

  filterBlock: {
    marginTop: 18,
  },

  filterTitle: {
    margin: "0 0 10px",
    fontSize: 16,
    fontWeight: 800,
  },

  buttonGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },

  filterButton: {
    border: "1px solid #d8deea",
    background: "#ffffff",
    color: "#344054",
    borderRadius: 999,
    padding: "9px 13px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },

  activeButton: {
    background: "#2563eb",
    borderColor: "#2563eb",
    color: "#ffffff",
  },

  resultHeader: {
    maxWidth: 1120,
    margin: "22px auto 12px",
  },

  resultCount: {
    margin: 0,
    color: "#475467",
    fontSize: 15,
  },

  grid: {
    maxWidth: 1120,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 16,
  },

  card: {
    display: "block",
    background: "#ffffff",
    border: "1px solid #e6e9f0",
    borderRadius: 20,
    padding: 18,
    textDecoration: "none",
    color: "#172033",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.04)",
    transition: "0.2s ease",
  },

  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
  },

  wordTitle: {
    margin: 0,
    fontSize: 23,
    lineHeight: 1.2,
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },

  yearBadge: {
    flexShrink: 0,
    borderRadius: 999,
    padding: "6px 10px",
    background: "#eff6ff",
    color: "#2563eb",
    fontSize: 13,
    fontWeight: 800,
  },

  categoryBadge: {
    display: "inline-block",
    marginBottom: 12,
    borderRadius: 999,
    padding: "6px 10px",
    background: "#f2f4f7",
    color: "#475467",
    fontSize: 13,
    fontWeight: 700,
  },

  definition: {
    margin: "0 0 14px",
    color: "#475467",
    fontSize: 15,
    lineHeight: 1.55,
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  definitionMuted: {
    margin: "0 0 14px",
    color: "#98a2b3",
    fontSize: 15,
    lineHeight: 1.55,
  },

  more: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: 800,
  },

  emptyBox: {
    maxWidth: 1120,
    margin: "0 auto",
    background: "#ffffff",
    border: "1px solid #e6e9f0",
    borderRadius: 20,
    padding: 28,
    color: "#667085",
    textAlign: "center",
    fontSize: 16,
  },
};