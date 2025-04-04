import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    // Test Supabase connection by listing buckets
    const { data, error } = await supabase.storage.listBuckets()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      buckets: data,
      message: "Supabase connection successful",
    })
  } catch (error) {
    console.error("Supabase test error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

