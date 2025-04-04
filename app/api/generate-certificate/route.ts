import { NextResponse } from "next/server"
import { getCollection, ObjectId } from "@/lib/db"
import { generateCertificate } from "@/lib/certificate-generator"
import { isServerAdmin } from "@/lib/server-auth"

export async function POST(request: Request) {
  try {
    // Check if user is admin
    const admin = await isServerAdmin()

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { registrationId } = await request.json()

    // Get registration and paper details
    const registrationsCollection = await getCollection("registrations")
    const papersCollection = await getCollection("papers")

    const registration = await registrationsCollection.findOne({ _id: new ObjectId(registrationId) })

    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    const paper = await papersCollection.findOne({
      registration_id: registration._id,
      status: "qualified",
    })

    if (!paper) {
      return NextResponse.json({ error: "No qualified paper found for this registration" }, { status: 404 })
    }

    // Generate certificate number
    const certificateNumber = `QS-${new Date().getFullYear()}-${paper._id.toString().substring(0, 4)}`

    // Generate certificate
    const certificateBlob = await generateCertificate({
      name: `${registration.first_name} ${registration.last_name}`,
      title: paper.title,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      certificateNumber,
      templateUrl: "/api/certificate-template", // This will be a static image endpoint
    })

    // In a real application, you would save the certificate to a storage service like Supabase
    // For demo purposes, we'll just record it in the database
    const certificatesCollection = await getCollection("certificates")
    await certificatesCollection.insertOne({
      registration_id: registration._id,
      certificate_number: certificateNumber,
      file_path: `/certificates/${certificateNumber}.pdf`,
      created_at: new Date(),
    })

    return NextResponse.json({
      success: true,
      certificateNumber,
    })
  } catch (error) {
    console.error("Certificate generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

