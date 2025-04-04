import { NextResponse } from "next/server"
import { getCollection } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Insert registration into database
    const registrationsCollection = await getCollection("registrations")
    const result = await registrationsCollection.insertOne({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      institution: data.institution,
      participant_type: data.participantType,
      special_requirements: data.specialRequirements || "",
      status: "pending",
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

