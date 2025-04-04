import { NextResponse } from "next/server"
import { getCollection, ObjectId } from "@/lib/db"
import { generateCertificate } from "@/lib/certificate-generator"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Validate ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid certificate ID" }, { status: 400 })
    }

    // Get certificate details
    const certificatesCollection = await getCollection("certificates")
    const certificate = await certificatesCollection.findOne({ _id: new ObjectId(id) })

    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    // Get registration and paper details
    const registrationsCollection = await getCollection("registrations")
    const papersCollection = await getCollection("papers")

    const registration = await registrationsCollection.findOne({ _id: certificate.registration_id })
    const paper = await papersCollection.findOne({ _id: certificate.paper_id })

    if (!registration || !paper) {
      return NextResponse.json({ error: "Registration or paper not found" }, { status: 404 })
    }

    // Generate certificate
    const certificateBlob = await generateCertificate({
      name: `${registration.first_name} ${registration.last_name}`,
      title: paper.title,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      certificateNumber: certificate.certificate_number,
      templateUrl: "/api/certificate-template",
    })

    // Create a response with the certificate blob
    const response = new NextResponse(certificateBlob)

    // Set headers for PDF download
    response.headers.set("Content-Type", "application/pdf")
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="certificate-${certificate.certificate_number}.pdf"`,
    )

    return response
  } catch (error) {
    console.error("Certificate download error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

