import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

function checkAdmin(request: NextRequest) {
  const password = request.headers.get("x-admin-password");
  return password && password === process.env.ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ message: "Ruxsat yo‘q" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*")
    .order("uz", { ascending: true });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ message: "Ruxsat yo‘q" }, { status: 401 });
  }

  const body = await request.json();

  const uz = String(body.uz || "").trim();
  const ru = String(body.ru || "").trim();

  if (!uz) {
    return NextResponse.json(
      { message: "Kategoriya nomi majburiy" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("categories")
    .insert({
      value: uz,
      uz,
      ru: ru || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ message: "Ruxsat yo‘q" }, { status: 401 });
  }

  const body = await request.json();

  const id = String(body.id || "").trim();
  const oldValue = String(body.oldValue || "").trim();
  const uz = String(body.uz || "").trim();
  const ru = String(body.ru || "").trim();

  if (!id || !uz) {
    return NextResponse.json(
      { message: "ID va kategoriya nomi majburiy" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("categories")
    .update({
      value: uz,
      uz,
      ru: ru || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  if (oldValue && oldValue !== uz) {
    await supabaseAdmin
      .from("words")
      .update({ category: uz })
      .eq("category", oldValue);
  }

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ message: "Ruxsat yo‘q" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const value = searchParams.get("value");

  if (!id) {
    return NextResponse.json({ message: "ID kerak" }, { status: 400 });
  }

  if (value) {
    const { data: usedWords } = await supabaseAdmin
      .from("words")
      .select("id")
      .eq("category", value)
      .limit(1);

    if (usedWords && usedWords.length > 0) {
      return NextResponse.json(
        {
          message:
            "Bu kategoriyada so‘zlar bor. Avval so‘zlarning kategoriyasini o‘zgartiring.",
        },
        { status: 400 }
      );
    }
  }

  const { error } = await supabaseAdmin
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}