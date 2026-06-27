import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

type WordBody = {
  id?: string | number;
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
  const realPassword = getAdminPassword();
  const requestPassword = request.headers.get("x-admin-password") || "";

  if (!realPassword) {
    return NextResponse.json(
      { message: "Admin password is not configured" },
      { status: 500 }
    );
  }

  if (requestPassword !== realPassword) {
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

  if (!Number.isInteger(year)) return null;
  if (year < 1900 || year > 2100) return null;

  return year;
}

function makeSlug(title: string) {
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
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "sh",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
    қ: "q",
    ғ: "g",
    ҳ: "h",
    ў: "o",
  };

  return title
    .toLowerCase()
    .trim()
    .split("")
    .map((char) => map[char] ?? char)
    .join("")
    .replace(/[‘’'`ʻʼ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function makeUniqueSlug(title: string, currentId?: string | number) {
  const baseSlug = makeSlug(title) || "word";
  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const { data, error } = await supabaseAdmin
      .from("words")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data || (currentId !== undefined && String(data.id) === String(currentId))) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

async function readJsonBody(request: NextRequest) {
  try {
    return (await request.json()) as WordBody;
  } catch {
    return {} as WordBody;
  }
}

export async function GET(request: NextRequest) {
  const adminError = checkAdmin(request);
  if (adminError) return adminError;

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
  if (adminError) return adminError;

  const body = await readJsonBody(request);

  const title = cleanText(body.title);
  const category = cleanText(body.category);
  const meaning = cleanText(body.meaning);
  const example = cleanText(body.example) || null;
  const source = cleanText(body.source) || null;
  const appearance_year = parseAppearanceYear(body.appearance_year);

  if (!title || !category || !meaning) {
    return NextResponse.json(
      { message: "Title, category and meaning are required" },
      { status: 400 }
    );
  }

  try {
    const slug = await makeUniqueSlug(title);

    const { data, error } = await supabaseAdmin
      .from("words")
      .insert({
        title,
        category,
        meaning,
        example,
        source,
        appearance_year,
        slug,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const adminError = checkAdmin(request);
  if (adminError) return adminError;

  const body = await readJsonBody(request);
  const id = body.id;

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  const title = cleanText(body.title);
  const category = cleanText(body.category);
  const meaning = cleanText(body.meaning);
  const example = cleanText(body.example) || null;
  const source = cleanText(body.source) || null;
  const appearance_year = parseAppearanceYear(body.appearance_year);

  if (!title || !category || !meaning) {
    return NextResponse.json(
      { message: "Title, category and meaning are required" },
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
        example,
        source,
        appearance_year,
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
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const adminError = checkAdmin(request);
  if (adminError) return adminError;

  let id: string | number | undefined | null = request.nextUrl.searchParams.get("id");

  if (!id) {
    const body = await readJsonBody(request);
    id = body.id;
  }

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("words")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, deleted: data?.length || 0, id });
}
