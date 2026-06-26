import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/['’`]/g, "")
    .replace(/\s+/g, "-");
}

function checkAdmin(request: NextRequest) {
  const password = request.headers.get("x-admin-password");
  return password && password === process.env.ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ message: "Ruxsat yo‘q" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("words")
    .select("*")
    .order("created_at", { ascending: false });

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

  const title = String(body.title || "").trim();
  const category = String(body.category || "").trim();
  const meaning = String(body.meaning || "").trim();
  const example = String(body.example || "").trim();
  const source = String(body.source || "").trim();

  if (!title || !category || !meaning) {
    return NextResponse.json(
      { message: "So‘z, kategoriya va ma’no majburiy" },
      { status: 400 }
    );
  }

  const slug = createSlug(title);

  const { data, error } = await supabaseAdmin
    .from("words")
    .insert({
      title,
      category,
      meaning,
      example: example || null,
      source: source || null,
      slug,
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
  const title = String(body.title || "").trim();
  const category = String(body.category || "").trim();
  const meaning = String(body.meaning || "").trim();
  const example = String(body.example || "").trim();
  const source = String(body.source || "").trim();

  if (!id || !title || !category || !meaning) {
    return NextResponse.json(
      { message: "ID, so‘z, kategoriya va ma’no majburiy" },
      { status: 400 }
    );
  }

  const slug = createSlug(title);

  const { data, error } = await supabaseAdmin
    .from("words")
    .update({
      title,
      category,
      meaning,
      example: example || null,
      source: source || null,
      slug,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ message: "Ruxsat yo‘q" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "ID kerak" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("words").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}