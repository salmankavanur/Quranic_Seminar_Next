import { NextResponse } from "next/server"
import { getCollection } from "@/lib/db"
import { isServerAdmin } from "@/lib/server-auth"

export async function GET() {
  try {
    const registrationsCollection = await getCollection("registrations")
    const registrations = await registrationsCollection.find({}).sort({ created_at: -1 }).toArray()

    // Convert MongoDB objects to plain objects for serialization
    const data = registrations.map((reg) => ({
      ...reg,
      _id: reg._id.toString(),
      created_at: reg.created_at.toISOString(),
      updated_at: reg.updated_at ? reg.updated_at.toISOString() : null,
    }))

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching registrations:", error)
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Check if user is admin
    const isAdmin = await isServerAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.first_name || !data.last_name || !data.email || !data.phone || !data.institution) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert registration into database
    const registrationsCollection = await getCollection("registrations")
    const result = await registrationsCollection.insertOne({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      institution: data.institution,
      participant_type: data.participant_type,
      special_requirements: data.special_requirements || "",
      status: data.status || "pending",
      created_at: new Date(),
    })

    return NextResponse.json({
      success: true,
      registrationId: result.insertedId,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

