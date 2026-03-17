import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("blog_categories")
      .select("*")
      .order("name")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
