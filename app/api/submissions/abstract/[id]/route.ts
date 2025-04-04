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

    const abstractsCollection = await getCollection("abstracts")
    const abstract = await abstractsCollection.findOne({ _id: new ObjectId(id) })

    if (!abstract) {
      return NextResponse.json({ error: "Abstract not found" }, { status: 404 })
    }

    return NextResponse.json({ abstract })
  } catch (error) {
    console.error("Error fetching abstract:", error)
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
    if (!data.title || !data.sub_theme || !data.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const abstractsCollection = await getCollection("abstracts")
    const result = await abstractsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: data.title,
          sub_theme: data.sub_theme,
          keywords: data.keywords,
          content: data.content,
          status: data.status,
          updated_at: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Abstract not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating abstract:", error)
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

    const abstractsCollection = await getCollection("abstracts")
    const result = await abstractsCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Abstract not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting abstract:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

