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

    const registrationsCollection = await getCollection("registrations")
    const registration = await registrationsCollection.findOne({ _id: new ObjectId(id) })

    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    return NextResponse.json({ registration })
  } catch (error) {
    console.error("Error fetching registration:", error)
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
    if (!data.first_name || !data.last_name || !data.email || !data.phone || !data.institution) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const registrationsCollection = await getCollection("registrations")
    const result = await registrationsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          institution: data.institution,
          participant_type: data.participant_type,
          special_requirements: data.special_requirements || "",
          status: data.status,
          updated_at: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating registration:", error)
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

    const registrationsCollection = await getCollection("registrations")
    const result = await registrationsCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting registration:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

