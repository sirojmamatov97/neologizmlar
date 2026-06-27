import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type WordBody = {
  id?: string;
  title?: string;
  category?: string;
  meaning?: string;
  example?: string | null;
  source?: string | null;
  appearance_year?: string | number | null;
};

function getAdminPassword() {
  return (
    process.env.ADMIN_PASSWORD ||
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
    process.env.ADMIN_SECRET ||
    ""
  );
}

function checkAdmin(request: NextRequest) {
  const adminPassword = getAdminPassword();
  const requestPassword = request.headers.get("x-admin-password") || "";

  if (!adminPassword) {
    return NextResponse.json(
      { message: "Admin password is not configured" },
      { status: 500 }
    );
  }

  if (requestPassword !== adminPassword) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return null;
}

function cleanText(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\s+/g, " ").trim();
}

function parseAppearanceYear(value: unknown) {
  const text = cleanText(value);

  if (!text) return null;

  const year = Number(text);

  if (!Number.isFinite(year)) return null;

  return year;
}

function makeSlug(text: string) {
  const map: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "yo",
    ж: "j",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "x",
    ц: "s",
    ч: "ch",
    ш: "sh",
    щ: "sh",
    ъ: "",
    ы: "i",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
    қ: "q",
    ғ: "g",
    ҳ: "h",
    ў: "o",
  };

  const lowered = text.toLowerCase().trim();

  const transliterated = lowered
    .split("")
    .map((char) => map[char] ?? char)
    .join("")
    .replaceAll("o‘", "o")
    .replaceAll("oʻ", "o")
    .replaceAll("g‘", "g")
    .replaceAll("gʻ", "g");

  return (
    transliterated
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || `word-${Date.now()}`
  );
}

async function makeUniqueSlug(title: string, currentId?: string) {
  const baseSlug = makeSlug(title);
  let slug = baseSlug;
  let counter = 2;

  while (counter < 100) {
    const { data, error } = await supabaseAdmin
      .from("words")
      .select("id")
      .eq("slug", slug)
      .limit(1);

    if (error) {
      throw error;
    }

    const existingWord = data?.[0];

    if (!existingWord || existingWord.id === currentId) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return `${baseSlug}-${Date.now()}`;
}

export async function GET(request: NextRequest) {
  const adminError = checkAdmin(request);

  if (adminError) {
    return adminError;
  }

  const { data, error } = await supabaseAdmin
    .from("words")
    .select("*")
    .order("title", { ascending: true });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const adminError = checkAdmin(request);

  if (adminError) {
    return adminError;
  }

  const body = (await request.json()) as WordBody;

  const title = cleanText(body.title);
  const category = cleanText(body.category);
  const meaning = cleanText(body.meaning);
  const example = cleanText(body.example);
  const source = cleanText(body.source);
  const appearanceYear = parseAppearanceYear(body.appearance_year);

  if (!title || !category || !meaning) {
    return NextResponse.json(
      { message: "Word, category and meaning are required" },
      { status: 400 }
    );
  }

  try {
    const slug = await makeUniqueSlug(title);

    const { data, error } = await supabaseAdmin
      .from("words")
      .insert([
        {
          title,
          category,
          meaning,
          example: example || null,
          source: source || null,
          appearance_year: appearanceYear,
          slug,
        },
      ])
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Word save error";

    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const adminError = checkAdmin(request);

  if (adminError) {
    return adminError;
  }

  const body = (await request.json()) as WordBody;

  const id = cleanText(body.id);
  const title = cleanText(body.title);
  const category = cleanText(body.category);
  const meaning = cleanText(body.meaning);
  const example = cleanText(body.example);
  const source = cleanText(body.source);
  const appearanceYear = parseAppearanceYear(body.appearance_year);

  if (!id) {
    return NextResponse.json({ message: "Word id is required" }, { status: 400 });
  }

  if (!title || !category || !meaning) {
    return NextResponse.json(
      { message: "Word, category and meaning are required" },
      { status: 400 }
    );
  }

  try {
    const slug = await makeUniqueSlug(title, id);

    const { data, error } = await supabaseAdmin
      .from("words")
      .update({
        title,
        category,
        meaning,
        example: example || null,
        source: source || null,
        appearance_year: appearanceYear,
        slug,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Word update error";

    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const adminError = checkAdmin(request);

  if (adminError) {
    return adminError;
  }

  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "Word id is required" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("words").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}