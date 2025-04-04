import { NextResponse } from "next/server"
import { isServerAdmin } from "@/lib/server-auth"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://updweuwtdxmiedrsepzg.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwZHdldXd0ZHhtaWVkcnNlcHpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMjY3ODgsImV4cCI6MjA1ODkwMjc4OH0.ZxC8hQqN9wqMejAloXZy72J3eq4_DcI9xJKJzkMmHHU"
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: Request) {
  try {
    // Check if user is admin
    const isAdmin = await isServerAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get file path and bucket from query parameters
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get("path")
    const bucket = searchParams.get("bucket") || "submissions"
    const fileName = searchParams.get("filename") || filePath?.split("/").pop() || "download"

    if (!filePath) {
      return NextResponse.json({ error: "File path is required" }, { status: 400 })
    }

    // Get a signed URL with a longer expiration time
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(filePath, 60 * 60) // 1 hour expiration

    if (error || !data?.signedUrl) {
      console.error("Error creating signed URL:", error)
      return NextResponse.json({ error: "Failed to generate download URL" }, { status: 500 })
    }

    // Fetch the file content
    const fileResponse = await fetch(data.signedUrl)

    if (!fileResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 })
    }

    // Get the file content as an array buffer
    const fileBuffer = await fileResponse.arrayBuffer()

    // Create a response with the file content
    const response = new NextResponse(fileBuffer)

    // Set headers to force download
    response.headers.set("Content-Disposition", `attachment; filename="${fileName}"`)
    response.headers.set("Content-Type", fileResponse.headers.get("Content-Type") || "application/octet-stream")
    response.headers.set("Content-Length", fileResponse.headers.get("Content-Length") || "")

    return response
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

