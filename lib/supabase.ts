import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://updweuwtdxmiedrsepzg.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwZHdldXd0ZHhtaWVkcnNlcHpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMjY3ODgsImV4cCI6MjA1ODkwMjc4OH0.ZxC8hQqN9wqMejAloXZy72J3eq4_DcI9xJKJzkMmHHU"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function uploadFile(file: File, bucket: string) {
  const fileName = `${Date.now()}_${file.name}`

  // Upload to Supabase
  const { data, error } = await supabase.storage.from(bucket).upload(fileName, file)

  if (error) {
    console.error("Supabase upload error:", error)
    throw new Error("File upload failed")
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName)

  return urlData.publicUrl
}

