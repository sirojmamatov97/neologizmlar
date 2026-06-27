import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

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
  const savedPassword = getAdminPassword();
  const requestPassword = request.headers.get("x-admin-password") || "";

  if (!savedPassword) {
    return NextResponse.json(
      { message: "Admin password is not configured" },
      { status: 500 }
    );
  }

  if (requestPassword !== savedPassword) {
    return NextResponse.json(
      { message: "Wrong admin password" },
      { status: 401 }
    );
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

  if (!Number.isInteger(year)) return null;
  if (year < 1900 || year > 2100) return null;

  return year;
}

function makeSlug(title: string) {
  const letters: Record<string, string> = {
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
    ц: "ts",
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
    Қ: "q",
    Ғ: "g",
    Ҳ: "h",
    Ў: "o",
  };

  return title
    .toLowerCase()
    .split("")
    .map((char) => letters[char] ?? char)
    .join("")
    .replace(/['’`‘ʻʼ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-")
    .trim();
}

async function makeUniqueSlug(baseSlug: string, ignoreId?: string) {
  let slug = baseSlug || "word";
  let counter = 1;

  while (true) {
    let query = supabaseAdmin
      .from("words")
      .select("id")
      .eq("slug", slug)
      .limit(1);

    if (ignoreId) {
      query = query.neq("id", ignoreId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return slug;
    }

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
}

export async function GET(request: NextRequest) {
  const authError = checkAdmin(request);

  if (authError) return authError;

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
  const authError = checkAdmin(request);

  if (authError) return authError;

  try {
    const body = (await request.json()) as WordBody;

    const title = cleanText(body.title);
    const category = cleanText(body.category);
    const meaning = cleanText(body.meaning);
    const example = cleanText(body.example);
    const source = cleanText(body.source);
    const appearanceYear = parseAppearanceYear(body.appearance_year);

    if (!title || !category || !meaning) {
      return NextResponse.json(
        { message: "So‘z, kategoriya va ma’no majburiy" },
        { status: 400 }
      );
    }

    const baseSlug = makeSlug(title);
    const slug = await makeUniqueSlug(baseSlug);

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
    const message =
      error instanceof Error ? error.message : "So‘zni qo‘shishda xatolik";

    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = checkAdmin(request);

  if (authError) return authError;

  try {
    const body = (await request.json()) as WordBody;

    const id = cleanText(body.id);
    const title = cleanText(body.title);
    const category = cleanText(body.category);
    const meaning = cleanText(body.meaning);
    const example = cleanText(body.example);
    const source = cleanText(body.source);
    const appearanceYear = parseAppearanceYear(body.appearance_year);

    if (!id) {
      return NextResponse.json({ message: "ID kerak" }, { status: 400 });
    }

    if (!title || !category || !meaning) {
      return NextResponse.json(
        { message: "So‘z, kategoriya va ma’no majburiy" },
        { status: 400 }
      );
    }

    const baseSlug = makeSlug(title);
    const slug = await makeUniqueSlug(baseSlug, id);

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
    const message =
      error instanceof Error ? error.message : "So‘zni yangilashda xatolik";

    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authError = checkAdmin(request);

  if (authError) return authError;

  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "ID kerak" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("words")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json(
      { message: "So‘z topilmadi yoki allaqachon o‘chirilgan" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    deletedId: id,
  });
}