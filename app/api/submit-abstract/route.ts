import { NextResponse } from "next/server"
import { getCollection } from "@/lib/db"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://updweuwtdxmiedrsepzg.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwZHdldXd0ZHhtaWVkcnNlcHpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMjY3ODgsImV4cCI6MjA1ODkwMjc4OH0.ZxC8hQqN9wqMejAloXZy72J3eq4_DcI9xJKJzkMmHHU"
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Generate a unique abstract ID
function generateAbstractId() {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `ABS-${timestamp}-${random}`
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const phone = formData.get("phone") as string
    const institution = formData.get("institution") as string
    const abstractTitle = formData.get("abstractTitle") as string
    const subTheme = formData.get("subTheme") as string
    const keywords = formData.get("keywords") as string
    const abstract = formData.get("abstract") as string
    const file = formData.get("file") as File | null

    // Verify phone number again as a security measure
    const registrationsCollection = await getCollection("registrations")
    const registration = await registrationsCollection.findOne({ phone })

    if (!registration) {
      return NextResponse.json(
        {
          success: false,
          error: "Phone number not registered. Please register first.",
        },
        { status: 400 },
      )
    }

    let filePath = null

    // Upload file to Supabase if provided
    if (file) {
      const fileName = `abstract_${Date.now()}_${file.name}`

      // Upload to Supabase
      const { data, error } = await supabase.storage.from("submissions").upload(fileName, file)

      if (error) {
        console.error("Supabase upload error:", error)
        throw new Error("File upload failed")
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from("submissions").getPublicUrl(fileName)

      filePath = urlData.publicUrl
    }

    // Generate a unique abstract ID
    const abstractId = generateAbstractId()

    // Insert abstract into database
    const abstractsCollection = await getCollection("abstracts")
    const result = await abstractsCollection.insertOne({
      registration_id: registration._id,
      abstract_id: abstractId,
      title: abstractTitle,
      sub_theme: subTheme,
      keywords: keywords,
      content: abstract,
      file_path: filePath,
      status: "pending",
      created_at: new Date(),
    })

    return NextResponse.json({
      success: true,
      abstractId: abstractId,
      message: "Abstract submitted successfully.",
    })
  } catch (error) {
    console.error("Abstract submission error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

