import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a production environment, you would serve the image from your server
    // For this demo, we'll redirect to the blob URL
    return NextResponse.redirect(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Paper-Presentation-Certificate.png-P1jFRcMvcWRvvkaZCZul4pzzkCgkfb.jpeg",
    )
  } catch (error) {
    console.error("Error serving certificate template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

