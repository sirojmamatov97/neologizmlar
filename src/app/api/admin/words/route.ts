import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  try {
    const { data: words, error: wordsError } = await supabase
      .from("words")
      .select(`
        id,
        word,
        slug,
        definition,
        example,
        appearance_year,
        category_id,
        categories (
          id,
          name
        )
      `)
      .order("word", { ascending: true });

    if (wordsError) {
      console.error("Words API error:", wordsError);
      return NextResponse.json(
        { error: "So‘zlarni yuklashda xatolik yuz berdi" },
        { status: 500 }
      );
    }

    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select("id, name")
      .order("name", { ascending: true });

    if (categoriesError) {
      console.error("Categories API error:", categoriesError);
      return NextResponse.json(
        { error: "Kategoriyalarni yuklashda xatolik yuz berdi" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      words: words || [],
      categories: categories || [],
    });
  } catch (error) {
    console.error("Public words API error:", error);

    return NextResponse.json(
      { error: "Server xatosi" },
      { status: 500 }
    );
  }
}