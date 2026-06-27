"use client";

import { type ChangeEvent, useEffect, useRef, useState } from "react";

type AdminLang = "uz" | "ru";

type Word = {
  id: string;
  title: string;
  category: string;
  meaning: string;
  example?: string | null;
  source?: string | null;
  appearance_year?: number | null;
  slug: string;
};

type CategoryItem = {
  id: string;
  value: string;
  uz: string;
  ru?: string | null;
};

type WordForm = {
  title: string;
  category: string;
  meaning: string;
  example: string;
  source: string;
  appearance_year: string;
};

type CategoryForm = {
  uz: string;
};

const emptyWordForm: WordForm = {
  title: "",
  category: "",
  meaning: "",
  example: "",
  source: "",
  appearance_year: "",
};

const emptyCategoryForm: CategoryForm = {
  uz: "",
};

const texts = {
  uz: {
    adminTitle: "neologizmlar.uz — Admin",
    adminDescription: "So‘zlar va kategoriyalarni boshqarish",
    adminPanel: "Admin panel",
    loginDescription: "Lug‘atni boshqarish uchun parol kiriting.",
    password: "Parol",
    login: "Kirish",
    checking: "Tekshirilmoqda...",
    viewDictionary: "Lug‘atni ko‘rish",
    logout: "Chiqish",

    exportWords: "Word eksport",
    importWords: "Word import",
    importOnlyWord: "Faqat Word (.doc yoki .html) fayl tanlang",
    importEmpty: "Import uchun so‘zlar topilmadi",
    exportDone: "Word fayl eksport qilindi",
    importDone: "Import yakunlandi",
    importError: "Import qilishda xatolik",

    addWord: "Yangi so‘z qo‘shish",
    editWord: "So‘zni tahrirlash",
    word: "So‘z",
    wordPlaceholder: "Masalan: trend",
    category: "Kategoriya",
    selectCategory: "Kategoriya tanlang",
    meaning: "Ma’nosi",
    meaningPlaceholder: "So‘zning izohini kiriting...",
    example: "Misol",
    examplePlaceholder: "Misol gap...",
    source: "Manba",
    sourcePlaceholder: "Masalan: Ijtimoiy tarmoq nutqi",
    appearanceYear: "Paydo bo‘lgan yili",
    appearanceYearPlaceholder: "Masalan: 2024",
    add: "Qo‘shish",
    update: "Yangilash",
    cancel: "Bekor qilish",

    addCategory: "Yangi kategoriya qo‘shish",
    editCategory: "Kategoriyani tahrirlash",
    categoryName: "Kategoriya nomi",
    categoryPlaceholder: "Masalan: Fan",
    addCategoryButton: "Kategoriya qo‘shish",

    categories: "Kategoriyalar",
    totalCategories: "Jami kategoriyalar",
    wordsList: "So‘zlar ro‘yxati",
    totalWords: "Jami so‘zlar",
    refresh: "Yangilash",
    loading: "Yuklanmoqda...",
    edit: "Tahrirlash",
    delete: "O‘chirish",
    noWords: "Hozircha so‘zlar yo‘q.",
    noCategories: "Hozircha kategoriyalar yo‘q.",

    enterPassword: "Parol kiriting",
    wrongPassword: "Parol noto‘g‘ri",
    loginSuccess: "Admin panelga kirildi",
    wordsLoadError: "So‘zlarni yuklashda xatolik",
    categoriesLoadError: "Kategoriyalarni yuklashda xatolik",
    requiredWord: "So‘z, kategoriya va ma’no majburiy",
    wordSaveError: "So‘zni saqlashda xatolik",
    wordAdded: "Yangi so‘z qo‘shildi",
    wordUpdated: "So‘z yangilandi",
    wordDeleted: "So‘z o‘chirildi",
    wordDeleteError: "So‘zni o‘chirishda xatolik",
    requiredCategory: "Kategoriya nomi majburiy",
    categorySaveError: "Kategoriyani saqlashda xatolik",
    categoryAdded: "Yangi kategoriya qo‘shildi",
    categoryUpdated: "Kategoriya yangilandi",
    categoryDeleted: "Kategoriya o‘chirildi",
    categoryDeleteError: "Kategoriyani o‘chirishda xatolik",
    confirmDeleteWord: "Bu so‘zni o‘chirishni xohlaysizmi?",
    confirmDeleteCategory: "Bu kategoriyani o‘chirishni xohlaysizmi?",
  },
  ru: {
    adminTitle: "neologizmlar.uz — Админ",
    adminDescription: "Управление словами и категориями",
    adminPanel: "Админ-панель",
    loginDescription: "Введите пароль для управления словарём.",
    password: "Пароль",
    login: "Войти",
    checking: "Проверка...",
    viewDictionary: "Открыть словарь",
    logout: "Выйти",

    exportWords: "Word экспорт",
    importWords: "Word импорт",
    importOnlyWord: "Выберите только Word-файл (.doc или .html)",
    importEmpty: "Слова для импорта не найдены",
    exportDone: "Word-файл экспортирован",
    importDone: "Импорт завершён",
    importError: "Ошибка импорта",

    addWord: "Добавить новое слово",
    editWord: "Редактировать слово",
    word: "Слово",
    wordPlaceholder: "Например: trend",
    category: "Категория",
    selectCategory: "Выберите категорию",
    meaning: "Значение",
    meaningPlaceholder: "Введите значение слова...",
    example: "Пример",
    examplePlaceholder: "Пример предложения...",
    source: "Источник",
    sourcePlaceholder: "Например: речь социальных сетей",
    appearanceYear: "Год появления",
    appearanceYearPlaceholder: "Например: 2024",
    add: "Добавить",
    update: "Обновить",
    cancel: "Отмена",

    addCategory: "Добавить категорию",
    editCategory: "Редактировать категорию",
    categoryName: "Название категории",
    categoryPlaceholder: "Например: Fan",
    addCategoryButton: "Добавить категорию",

    categories: "Категории",
    totalCategories: "Всего категорий",
    wordsList: "Список слов",
    totalWords: "Всего слов",
    refresh: "Обновить",
    loading: "Загрузка...",
    edit: "Редактировать",
    delete: "Удалить",
    noWords: "Пока слов нет.",
    noCategories: "Пока категорий нет.",

    enterPassword: "Введите пароль",
    wrongPassword: "Неверный пароль",
    loginSuccess: "Вход в админ-панель выполнен",
    wordsLoadError: "Ошибка загрузки слов",
    categoriesLoadError: "Ошибка загрузки категорий",
    requiredWord: "Слово, категория и значение обязательны",
    wordSaveError: "Ошибка сохранения слова",
    wordAdded: "Новое слово добавлено",
    wordUpdated: "Слово обновлено",
    wordDeleted: "Слово удалено",
    wordDeleteError: "Ошибка удаления слова",
    requiredCategory: "Название категории обязательно",
    categorySaveError: "Ошибка сохранения категории",
    categoryAdded: "Новая категория добавлена",
    categoryUpdated: "Категория обновлена",
    categoryDeleted: "Категория удалена",
    categoryDeleteError: "Ошибка удаления категории",
    confirmDeleteWord: "Вы хотите удалить это слово?",
    confirmDeleteCategory: "Вы хотите удалить эту категорию?",
  },
};

function valueToString(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function makeExportFileName(extension: string) {
  const date = new Date().toISOString().slice(0, 10);
  return `neologizmlar-words-${date}.${extension}`;
}

function downloadFile(content: string, fileName: string, type: string) {
  const blob = new Blob([content], {
    type,
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function cleanText(value: string | number | null | undefined) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\s+/g, " ").trim();
}

function escapeHtml(value: string | number | null | undefined) {
  return cleanText(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default function AdminPage() {
  const [adminLang, setAdminLang] = useState<AdminLang>("uz");
  const t = texts[adminLang];

  const importInputRef = useRef<HTMLInputElement | null>(null);

  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [words, setWords] = useState<Word[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  const [wordForm, setWordForm] = useState<WordForm>(emptyWordForm);
  const [categoryForm, setCategoryForm] =
    useState<CategoryForm>(emptyCategoryForm);

  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedLang = localStorage.getItem("admin_lang");

    if (savedLang === "uz" || savedLang === "ru") {
      setAdminLang(savedLang);
    }

    const savedPassword = localStorage.getItem("admin_password");

    if (savedPassword) {
      setPassword(savedPassword);
      setIsLoggedIn(true);
      loadAll(savedPassword);
    }
  }, []);

  function changeLang(lang: AdminLang) {
    setAdminLang(lang);
    localStorage.setItem("admin_lang", lang);
  }

  async function loadAll(adminPassword = password) {
    setLoading(true);

    await Promise.all([
      loadWords(adminPassword, false),
      loadCategories(adminPassword),
    ]);

    setLoading(false);
  }

  async function loadWords(adminPassword = password, withLoading = true) {
    if (withLoading) {
      setLoading(true);
    }

    const response = await fetch("/api/admin/words", {
      headers: {
        "x-admin-password": adminPassword,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || t.wordsLoadError);

      if (response.status === 401) {
        logout();
      }

      if (withLoading) {
        setLoading(false);
      }

      return;
    }

    setWords(data);

    if (withLoading) {
      setLoading(false);
    }
  }

  async function loadCategories(adminPassword = password) {
    const response = await fetch("/api/admin/categories", {
      headers: {
        "x-admin-password": adminPassword,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || t.categoriesLoadError);

      if (response.status === 401) {
        logout();
      }

      return;
    }

    setCategories(data);
  }

  async function login() {
    if (!password.trim()) {
      setMessage(t.enterPassword);
      return;
    }

    setLoading(true);

    const wordsResponse = await fetch("/api/admin/words", {
      headers: {
        "x-admin-password": password,
      },
    });

    const wordsData = await wordsResponse.json();

    if (!wordsResponse.ok) {
      setMessage(t.wrongPassword);
      setLoading(false);
      return;
    }

    const categoriesResponse = await fetch("/api/admin/categories", {
      headers: {
        "x-admin-password": password,
      },
    });

    const categoriesData = await categoriesResponse.json();

    if (!categoriesResponse.ok) {
      setMessage(t.categoriesLoadError);
      setLoading(false);
      return;
    }

    localStorage.setItem("admin_password", password);
    setIsLoggedIn(true);
    setWords(wordsData);
    setCategories(categoriesData);
    setMessage(t.loginSuccess);
    setLoading(false);
  }

  function logout() {
    localStorage.removeItem("admin_password");
    setPassword("");
    setIsLoggedIn(false);
    setWords([]);
    setCategories([]);
    setWordForm(emptyWordForm);
    setCategoryForm(emptyCategoryForm);
    setEditingWord(null);
    setEditingCategory(null);
    setMessage("");
  }

  function updateWordForm(field: keyof WordForm, value: string) {
    setWordForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateCategoryForm(field: keyof CategoryForm, value: string) {
    setCategoryForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function createWordsHtml() {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Neologizmlar</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
              color: #111827;
            }
            h1 {
              color: #1d4ed8;
            }
            .word-export-item {
              border-bottom: 1px solid #ddd;
              padding: 14px 0;
            }
            .title {
              font-size: 20px;
              font-weight: bold;
              color: #1d4ed8;
            }
            .meta {
              color: #555;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <h1>Neologizmlar ro‘yxati</h1>
          <p>Jami so‘zlar: ${words.length}</p>

          ${words
            .map(
              (word, index) => `
                <div
                  class="word-export-item"
                  data-title="${escapeHtml(word.title)}"
                  data-category="${escapeHtml(word.category)}"
                  data-meaning="${escapeHtml(word.meaning)}"
                  data-example="${escapeHtml(word.example || "")}"
                  data-source="${escapeHtml(word.source || "")}"
                  data-appearance-year="${escapeHtml(word.appearance_year || "")}"
                >
                  <div class="title">${index + 1}. ${escapeHtml(
                    word.title
                  )}</div>
                  <p><b>Kategoriya:</b> ${escapeHtml(word.category)}</p>
                  <p><b>Ma’nosi:</b> ${escapeHtml(word.meaning)}</p>
                  <p><b>Misol:</b> ${escapeHtml(word.example || "")}</p>
                  <p><b>Manba:</b> ${escapeHtml(word.source || "")}</p>
                  <p class="meta">
                    <b>Yil:</b> ${escapeHtml(word.appearance_year || "")}
                    |
                    <b>Slug:</b> ${escapeHtml(word.slug)}
                  </p>
                </div>
              `
            )
            .join("")}
        </body>
      </html>
    `;
  }

  function exportWordsDoc() {
    downloadFile(
      createWordsHtml(),
      makeExportFileName("doc"),
      "application/msword;charset=utf-8"
    );

    setMessage(t.exportDone);
  }

  function normalizeImportedWord(raw: Record<string, unknown>): WordForm {
    return {
      title: valueToString(raw.title ?? raw.word ?? raw.soz ?? raw["so‘z"]).trim(),
      category: valueToString(
        raw.category ?? raw.category_id ?? raw.kategoriya
      ).trim(),
      meaning: valueToString(
        raw.meaning ??
          raw.definition ??
          raw.manosi ??
          raw["ma’nosi"] ??
          raw.izoh
      ).trim(),
      example: valueToString(raw.example ?? raw.misol).trim(),
      source: valueToString(raw.source ?? raw.manba).trim(),
      appearance_year: valueToString(
        raw.appearance_year ?? raw.appearanceYear ?? raw.year ?? raw.yil
      ).trim(),
    };
  }

  function getValueFromTextBlock(block: string, labels: string[]) {
    const lines = block.split(/\r?\n/);

    for (const line of lines) {
      const cleanLine = line.trim();

      for (const label of labels) {
        const lowerLine = cleanLine.toLowerCase();
        const lowerLabel = label.toLowerCase();

        if (lowerLine.startsWith(lowerLabel)) {
          return cleanLine.slice(label.length).replace(/^[:：]\s*/, "").trim();
        }
      }
    }

    return "";
  }

  function parseTxtWords(text: string): WordForm[] {
    const blocks = text
      .split(/\n\s*-{3,}\s*\n|\n\s*={3,}\s*\n/)
      .map((block) => block.trim())
      .filter(Boolean);

    return blocks.map((block) => {
      const firstLine = block.split(/\r?\n/)[0] || "";
      const titleFromFirstLine = firstLine.replace(/^\d+\.\s*/, "").trim();

      const raw = {
        title:
          getValueFromTextBlock(block, [
            "title",
            "word",
            "so‘z",
            "soz",
            "слово",
          ]) || titleFromFirstLine,
        category: getValueFromTextBlock(block, [
          "kategoriya",
          "category",
          "категория",
        ]),
        meaning: getValueFromTextBlock(block, [
          "ma’nosi",
          "manosi",
          "meaning",
          "definition",
          "значение",
          "изоҳ",
          "izoh",
        ]),
        example: getValueFromTextBlock(block, ["misol", "example", "пример"]),
        source: getValueFromTextBlock(block, ["manba", "source", "источник"]),
        appearance_year: getValueFromTextBlock(block, [
          "yil",
          "year",
          "appearance_year",
          "год",
        ]),
      };

      return normalizeImportedWord(raw);
    });
  }

  function parseDocWords(text: string): WordForm[] {
    const parser = new DOMParser();
    const documentHtml = parser.parseFromString(text, "text/html");
    const items = Array.from(
      documentHtml.querySelectorAll(".word-export-item")
    );

    if (items.length > 0) {
      return items.map((item) =>
        normalizeImportedWord({
          title: item.getAttribute("data-title") || "",
          category: item.getAttribute("data-category") || "",
          meaning: item.getAttribute("data-meaning") || "",
          example: item.getAttribute("data-example") || "",
          source: item.getAttribute("data-source") || "",
          appearance_year: item.getAttribute("data-appearance-year") || "",
        })
      );
    }

    return parseTxtWords(documentHtml.body?.innerText || text);
  }

  function parseWordsByFileType(fileName: string, text: string): WordForm[] {
    const lowerName = fileName.toLowerCase();

    if (
      lowerName.endsWith(".doc") ||
      lowerName.endsWith(".html") ||
      lowerName.endsWith(".htm")
    ) {
      return parseDocWords(text);
    }

    return [];
  }

  async function importWordsFromFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const lowerName = file.name.toLowerCase();

    if (
      !lowerName.endsWith(".doc") &&
      !lowerName.endsWith(".html") &&
      !lowerName.endsWith(".htm")
    ) {
      setMessage(t.importOnlyWord);
      event.target.value = "";
      return;
    }

    setLoading(true);

    try {
      const fileText = await file.text();
      const items = parseWordsByFileType(file.name, fileText);

      if (items.length === 0) {
        setMessage(t.importEmpty);
        setLoading(false);
        event.target.value = "";
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      for (const importedWord of items) {
        if (
          !importedWord.title ||
          !importedWord.category ||
          !importedWord.meaning
        ) {
          errorCount += 1;
          continue;
        }

        const response = await fetch("/api/admin/words", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": password,
          },
          body: JSON.stringify(importedWord),
        });

        if (response.ok) {
          successCount += 1;
        } else {
          errorCount += 1;
        }
      }

      await loadWords(password, false);

      setMessage(
        adminLang === "uz"
          ? `${t.importDone}: ${successCount} ta qo‘shildi, ${errorCount} ta xato`
          : `${t.importDone}: добавлено ${successCount}, ошибок ${errorCount}`
      );
    } catch (error) {
      console.error(error);
      setMessage(t.importError);
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  }

  async function saveWord() {
    if (
      !wordForm.title.trim() ||
      !wordForm.category.trim() ||
      !wordForm.meaning.trim()
    ) {
      setMessage(t.requiredWord);
      return;
    }

    setLoading(true);

    const method = editingWord ? "PUT" : "POST";

    const body = editingWord
      ? {
          id: editingWord.id,
          ...wordForm,
        }
      : wordForm;

    const response = await fetch("/api/admin/words", {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || t.wordSaveError);
      setLoading(false);
      return;
    }

    setWordForm(emptyWordForm);
    setEditingWord(null);
    setMessage(editingWord ? t.wordUpdated : t.wordAdded);

    await loadWords();
    setLoading(false);
  }

  function startEditWord(word: Word) {
    setEditingWord(word);

    setWordForm({
      title: word.title,
      category: word.category,
      meaning: word.meaning,
      example: word.example || "",
      source: word.source || "",
      appearance_year: word.appearance_year ? String(word.appearance_year) : "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditWord() {
    setEditingWord(null);
    setWordForm(emptyWordForm);
    setMessage("");
  }

  async function deleteWord(id: string) {
    const confirmed = confirm(t.confirmDeleteWord);

    if (!confirmed) return;

    setLoading(true);

    const response = await fetch(`/api/admin/words?id=${id}`, {
      method: "DELETE",
      headers: {
        "x-admin-password": password,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || t.wordDeleteError);
      setLoading(false);
      return;
    }

    setMessage(t.wordDeleted);
    await loadWords();
    setLoading(false);
  }

  async function saveCategory() {
    if (!categoryForm.uz.trim()) {
      setMessage(t.requiredCategory);
      return;
    }

    setLoading(true);

    const method = editingCategory ? "PUT" : "POST";

    const body = editingCategory
      ? {
          id: editingCategory.id,
          oldValue: editingCategory.value,
          uz: categoryForm.uz,
          ru: editingCategory.ru || "",
        }
      : {
          uz: categoryForm.uz,
          ru: "",
        };

    const response = await fetch("/api/admin/categories", {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || t.categorySaveError);
      setLoading(false);
      return;
    }

    setCategoryForm(emptyCategoryForm);
    setEditingCategory(null);
    setMessage(editingCategory ? t.categoryUpdated : t.categoryAdded);

    await loadCategories();
    await loadWords();
    setLoading(false);
  }

  function startEditCategory(category: CategoryItem) {
    setEditingCategory(category);

    setCategoryForm({
      uz: category.uz,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditCategory() {
    setEditingCategory(null);
    setCategoryForm(emptyCategoryForm);
    setMessage("");
  }

  async function deleteCategory(category: CategoryItem) {
    const confirmed = confirm(t.confirmDeleteCategory);

    if (!confirmed) return;

    setLoading(true);

    const response = await fetch(
      `/api/admin/categories?id=${category.id}&value=${encodeURIComponent(
        category.value
      )}`,
      {
        method: "DELETE",
        headers: {
          "x-admin-password": password,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || t.categoryDeleteError);
      setLoading(false);
      return;
    }

    setMessage(t.categoryDeleted);
    await loadCategories();
    setLoading(false);
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <section className="mx-auto flex min-h-screen max-w-md items-center px-6">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-3">
              <h1 className="text-3xl font-bold text-blue-700">
                {t.adminPanel}
              </h1>

              <div className="flex rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => changeLang("uz")}
                  className={`rounded-lg px-3 py-1 text-sm font-medium ${
                    adminLang === "uz"
                      ? "bg-blue-600 text-white"
                      : "text-slate-600"
                  }`}
                >
                  UZ
                </button>

                <button
                  type="button"
                  onClick={() => changeLang("ru")}
                  className={`rounded-lg px-3 py-1 text-sm font-medium ${
                    adminLang === "ru"
                      ? "bg-blue-600 text-white"
                      : "text-slate-600"
                  }`}
                >
                  RU
                </button>
              </div>
            </div>

            <p className="mb-6 text-slate-600">{t.loginDescription}</p>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t.password}
              className="mb-4 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            <button
              type="button"
              onClick={login}
              disabled={loading}
              className="w-full rounded-2xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? t.checking : t.login}
            </button>

            {message && (
              <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-600">
                {message}
              </p>
            )}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-blue-700">
              {t.adminTitle}
            </h1>
            <p className="text-sm text-slate-500">{t.adminDescription}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => changeLang("uz")}
                className={`rounded-lg px-3 py-1 text-sm font-medium ${
                  adminLang === "uz"
                    ? "bg-blue-600 text-white"
                    : "text-slate-600"
                }`}
              >
                UZ
              </button>

              <button
                type="button"
                onClick={() => changeLang("ru")}
                className={`rounded-lg px-3 py-1 text-sm font-medium ${
                  adminLang === "ru"
                    ? "bg-blue-600 text-white"
                    : "text-slate-600"
                }`}
              >
                RU
              </button>
            </div>

            <button
              type="button"
              onClick={exportWordsDoc}
              disabled={loading}
              className="rounded-xl bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-200 disabled:opacity-60"
            >
              {t.exportWords}
            </button>

            <button
              type="button"
              onClick={() => importInputRef.current?.click()}
              disabled={loading}
              className="rounded-xl bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-200 disabled:opacity-60"
            >
              {t.importWords}
            </button>

            <input
              ref={importInputRef}
              type="file"
              accept=".doc,.html,.htm,application/msword,text/html"
              onChange={importWordsFromFile}
              className="hidden"
            />

            <a
              href="/words"
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              {t.viewDictionary}
            </a>

            <button
              type="button"
              onClick={logout}
              style={{
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
              }}
              className="rounded-xl px-4 py-2 text-sm font-medium shadow-sm"
            >
              {t.logout}
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8">
        {message && (
          <p className="mb-6 rounded-2xl bg-blue-50 p-4 text-sm text-blue-700">
            {message}
          </p>
        )}

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold">
                {editingWord ? t.editWord : t.addWord}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    {t.word}
                  </label>
                  <input
                    type="text"
                    value={wordForm.title}
                    onChange={(event) =>
                      updateWordForm("title", event.target.value)
                    }
                    placeholder={t.wordPlaceholder}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    {t.category}
                  </label>
                  <select
                    value={wordForm.category}
                    onChange={(event) =>
                      updateWordForm("category", event.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  >
                    <option value="">{t.selectCategory}</option>

                    {categories.map((category) => (
                      <option key={category.id} value={category.value}>
                        {category.uz}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    {t.meaning}
                  </label>
                  <textarea
                    value={wordForm.meaning}
                    onChange={(event) =>
                      updateWordForm("meaning", event.target.value)
                    }
                    placeholder={t.meaningPlaceholder}
                    rows={5}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    {t.example}
                  </label>
                  <textarea
                    value={wordForm.example}
                    onChange={(event) =>
                      updateWordForm("example", event.target.value)
                    }
                    placeholder={t.examplePlaceholder}
                    rows={3}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    {t.source}
                  </label>
                  <input
                    type="text"
                    value={wordForm.source}
                    onChange={(event) =>
                      updateWordForm("source", event.target.value)
                    }
                    placeholder={t.sourcePlaceholder}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    {t.appearanceYear}
                  </label>
                  <input
                    type="number"
                    min="2015"
                    max="2050"
                    value={wordForm.appearance_year}
                    onChange={(event) =>
                      updateWordForm("appearance_year", event.target.value)
                    }
                    placeholder={t.appearanceYearPlaceholder}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={saveWord}
                    disabled={loading}
                    className="flex-1 rounded-2xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {editingWord ? t.update : t.add}
                  </button>

                  {editingWord && (
                    <button
                      type="button"
                      onClick={cancelEditWord}
                      className="rounded-2xl bg-slate-100 px-5 py-3 font-medium text-slate-700 hover:bg-slate-200"
                    >
                      {t.cancel}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold">
                {editingCategory ? t.editCategory : t.addCategory}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    {t.categoryName}
                  </label>
                  <input
                    type="text"
                    value={categoryForm.uz}
                    onChange={(event) =>
                      updateCategoryForm("uz", event.target.value)
                    }
                    placeholder={t.categoryPlaceholder}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={saveCategory}
                    disabled={loading}
                    className="flex-1 rounded-2xl bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-60"
                  >
                    {editingCategory ? t.update : t.addCategoryButton}
                  </button>

                  {editingCategory && (
                    <button
                      type="button"
                      onClick={cancelEditCategory}
                      className="rounded-2xl bg-slate-100 px-5 py-3 font-medium text-slate-700 hover:bg-slate-200"
                    >
                      {t.cancel}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">{t.categories}</h2>
                  <p className="text-sm text-slate-500">
                    {t.totalCategories}: {categories.length}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => loadCategories()}
                  className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                >
                  {t.refresh}
                </button>
              </div>

              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4"
                  >
                    <div>
                      <h3 className="font-bold text-blue-700">
                        {category.uz}
                      </h3>
                      <p className="text-sm text-slate-500">
                        value: {category.value}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEditCategory(category)}
                        className="rounded-xl bg-yellow-100 px-3 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-200"
                      >
                        {t.edit}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteCategory(category)}
                        className="rounded-xl bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                      >
                        {t.delete}
                      </button>
                    </div>
                  </div>
                ))}

                {categories.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-600">
                    {t.noCategories}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">{t.wordsList}</h2>
                  <p className="text-sm text-slate-500">
                    {t.totalWords}: {words.length}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={exportWordsDoc}
                    disabled={loading}
                    className="rounded-xl bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-200 disabled:opacity-60"
                  >
                    {t.exportWords}
                  </button>

                  <button
                    type="button"
                    onClick={() => importInputRef.current?.click()}
                    disabled={loading}
                    className="rounded-xl bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-200 disabled:opacity-60"
                  >
                    {t.importWords}
                  </button>

                  <button
                    type="button"
                    onClick={() => loadWords()}
                    className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                  >
                    {t.refresh}
                  </button>
                </div>
              </div>

              {loading ? (
                <p className="rounded-2xl bg-slate-50 p-5 text-center text-slate-600">
                  {t.loading}
                </p>
              ) : (
                <div className="space-y-4">
                  {words.map((word) => (
                    <div
                      key={word.id}
                      className="rounded-2xl border border-slate-200 p-5"
                    >
                      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-bold text-blue-700">
                            {word.title}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {word.category} · /words/{word.slug}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => startEditWord(word)}
                            className="rounded-xl bg-yellow-100 px-3 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-200"
                          >
                            {t.edit}
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteWord(word.id)}
                            className="rounded-xl bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                          >
                            {t.delete}
                          </button>
                        </div>
                      </div>

                      <p className="mb-3 leading-7 text-slate-700">
                        {word.meaning}
                      </p>

                      {word.example && (
                        <p className="mb-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                          <b>{t.example}:</b> {word.example}
                        </p>
                      )}

                      {word.appearance_year && (
                        <p className="mb-2 text-sm text-slate-500">
                          <b>{t.appearanceYear}:</b> {word.appearance_year}
                        </p>
                      )}

                      {word.source && (
                        <p className="text-sm text-slate-500">
                          <b>{t.source}:</b> {word.source}
                        </p>
                      )}
                    </div>
                  ))}

                  {words.length === 0 && (
                    <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-600">
                      {t.noWords}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}