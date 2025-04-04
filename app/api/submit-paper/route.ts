import { NextResponse } from "next/server"
import { getCollection } from "@/lib/db"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://updweuwtdxmiedrsepzg.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwZHdldXd0ZHhtaWVkcnNlcHpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMjY3ODgsImV4cCI6MjA1ODkwMjc4OH0.ZxC8hQqN9wqMejAloXZy72J3eq4_DcI9xJKJzkMmHHU"
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const phone = formData.get("phone") as string
    const abstractId = formData.get("abstractId") as string
    const paperTitle = formData.get("paperTitle") as string
    const language = formData.get("language") as string
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Verify phone and abstract ID again as a security measure
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

    // Find the abstract by ID
    const abstractsCollection = await getCollection("abstracts")
    const abstract = await abstractsCollection.findOne({ abstract_id: abstractId })

    if (!abstract) {
      return NextResponse.json(
        {
          success: false,
          error: "Abstract ID not found. Please check and try again.",
        },
        { status: 400 },
      )
    }

    // Check if the abstract belongs to this registration
    if (abstract.registration_id.toString() !== registration._id.toString()) {
      return NextResponse.json(
        {
          success: false,
          error: "This Abstract ID does not belong to your registration.",
        },
        { status: 400 },
      )
    }

    // Upload file to Supabase
    const fileName = `paper_${Date.now()}_${file.name}`

    // Upload to Supabase
    const { data, error } = await supabase.storage.from("documents").upload(fileName, file)

    if (error) {
      console.error("Supabase upload error:", error)
      throw new Error("File upload failed")
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("documents").getPublicUrl(fileName)

    const filePath = urlData.publicUrl

    // Insert paper into database
    const papersCollection = await getCollection("papers")
    await papersCollection.insertOne({
      abstract_id: abstract._id,
      registration_id: registration._id,
      title: paperTitle,
      language: language,
      content: "",
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      file_path: filePath,
      status: "pending",
      created_at: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Paper submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

