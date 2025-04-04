import { NextResponse } from "next/server"
import { getCollection, ObjectId } from "@/lib/db"
import { isServerAdmin } from "@/lib/server-auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
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

    const papersCollection = await getCollection("papers")
    const paper = await papersCollection.findOne({ _id: new ObjectId(id) })

    if (!paper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 })
    }

    return NextResponse.json({ paper })
  } catch (error) {
    console.error("Error fetching paper:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const papersCollection = await getCollection("papers")
    const result = await papersCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: data.title,
          content: data.content,
          status: data.status,
          updated_at: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating paper:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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

    const papersCollection = await getCollection("papers")
    const result = await papersCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting paper:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

