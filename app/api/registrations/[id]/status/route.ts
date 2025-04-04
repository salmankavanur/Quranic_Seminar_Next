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

    const { status } = await request.json()

    // Validate status
    if (!status || !["pending", "confirmed", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const registrationsCollection = await getCollection("registrations")
    const result = await registrationsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          updated_at: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating registration status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

