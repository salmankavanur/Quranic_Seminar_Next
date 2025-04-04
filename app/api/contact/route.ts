import { NextResponse } from "next/server"
import { getCollection } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Insert message into database
    const messagesCollection = await getCollection("messages")
    await messagesCollection.insertOne({
      sender_name: data.firstName + " " + data.lastName,
      sender_email: data.email,
      phone: data.phone || "",
      subject: data.subject,
      message: data.message,
      is_read: false,
      created_at: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

