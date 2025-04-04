import { NextResponse } from "next/server"
import { getCollection } from "@/lib/db"
import { generateCertificate } from "@/lib/certificate-generator"

export async function POST(request: Request) {
  try {
    const { phone, abstractId } = await request.json()

    if (!phone) {
      return NextResponse.json(
        {
          verified: false,
          message: "Phone number is required",
        },
        { status: 400 },
      )
    }

    // Find the registration by phone number
    const registrationsCollection = await getCollection("registrations")
    const registration = await registrationsCollection.findOne({ phone })

    if (!registration) {
      return NextResponse.json({
        verified: false,
        message: "Phone number not found. Please check and try again.",
      })
    }

    // Find the paper by registration ID
    const papersCollection = await getCollection("papers")

    // If abstractId is provided, use it to find the specific paper
    const query: any = { registration_id: registration._id, status: "qualified" }

    if (abstractId) {
      // Find the abstract by ID
      const abstractsCollection = await getCollection("abstracts")
      const abstract = await abstractsCollection.findOne({ abstract_id: abstractId })

      if (!abstract) {
        return NextResponse.json({
          verified: false,
          message: "Abstract ID not found. Please check and try again.",
        })
      }

      // Add the abstract ID to the query
      query.abstract_id = abstract._id
    }

    const paper = await papersCollection.findOne(query)

    if (!paper) {
      return NextResponse.json({
        verified: false,
        message:
          "No qualified paper found for this registration. Only papers marked as 'Qualified for Presentation' are eligible for certificates.",
      })
    }

    // Generate certificate number
    const certificateNumber = `QS-${new Date().getFullYear()}-${paper._id.toString().substring(0, 4)}`

    // Check if certificate already exists
    const certificatesCollection = await getCollection("certificates")
    let certificate = await certificatesCollection.findOne({
      registration_id: registration._id,
    })

    // If certificate doesn't exist, create one
    if (!certificate) {
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
        templateUrl: "/api/certificate-template",
      })

      // Save certificate info to database
      const result = await certificatesCollection.insertOne({
        registration_id: registration._id,
        paper_id: paper._id,
        certificate_number: certificateNumber,
        file_path: `/certificates/${certificateNumber}.pdf`,
        created_at: new Date(),
      })

      certificate = {
        _id: result.insertedId,
        registration_id: registration._id,
        paper_id: paper._id,
        certificate_number: certificateNumber,
        file_path: `/certificates/${certificateNumber}.pdf`,
        created_at: new Date(),
      }
    }

    return NextResponse.json({
      verified: true,
      name: `${registration.first_name} ${registration.last_name}`,
      paperTitle: paper.title,
      certificateNumber: certificate.certificate_number,
      downloadUrl: `/api/download-certificate/${certificate._id}`,
      message: "Certificate verification successful.",
    })
  } catch (error) {
    console.error("Certificate verification error:", error)
    return NextResponse.json(
      {
        verified: false,
        message: "An error occurred during verification.",
      },
      { status: 500 },
    )
  }
}

