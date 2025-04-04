import { NextResponse } from "next/server"
import { getCollection, ObjectId } from "@/lib/db"
import { isServerAdmin } from "@/lib/server-auth"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    const isAdmin = await isServerAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const id = params.id

    // Validate ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const { is_read } = await request.json()

    // Validate is_read
    if (typeof is_read !== "boolean") {
      return NextResponse.json({ error: "Invalid is_read value" }, { status: 400 })
    }

    const messagesCollection = await getCollection("messages")
    const result = await messagesCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          is_read,
          updated_at: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating message read status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

