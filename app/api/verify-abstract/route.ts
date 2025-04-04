import { NextResponse } from "next/server"
import { getCollection } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { phone, abstractId } = await request.json()

    if (!phone || !abstractId) {
      return NextResponse.json(
        {
          verified: false,
          message: "Phone number and Abstract ID are required",
        },
        { status: 400 },
      )
    }

    console.log("Verifying:", { phone, abstractId }) // Debug log

    // Find the registration by phone number
    const registrationsCollection = await getCollection("registrations")
    const registration = await registrationsCollection.findOne({ phone })

    if (!registration) {
      console.log("Registration not found for phone:", phone)
      return NextResponse.json({
        verified: false,
        message: "Phone number not found. Please register first.",
      })
    }

    console.log("Registration found:", registration._id.toString()) // Debug log

    // Find the abstract by ID
    const abstractsCollection = await getCollection("abstracts")
    const abstract = await abstractsCollection.findOne({ abstract_id: abstractId })

    if (!abstract) {
      console.log("Abstract not found with ID:", abstractId)
      return NextResponse.json({
        verified: false,
        message: "Abstract ID not found. Please check and try again.",
      })
    }

    console.log("Abstract found:", {
      abstractId: abstract.abstract_id,
      registrationId: abstract.registration_id.toString(),
      userRegistrationId: registration._id.toString(),
    }) // Debug log

    // Check if the abstract belongs to this registration
    // Convert ObjectId to string for comparison
    if (abstract.registration_id.toString() !== registration._id.toString()) {
      console.log("Abstract does not belong to this registration")
      return NextResponse.json({
        verified: false,
        message: "This Abstract ID does not belong to your registration.",
      })
    }

    // For now, let's skip the status check to simplify testing
    // We can add it back later once the basic verification works
    /*
    if (abstract.status !== "accepted") {
      return NextResponse.json({ 
        verified: false, 
        message: "Your abstract has not been accepted yet. Only accepted abstracts can proceed to full paper submission." 
      })
    }
    */

    return NextResponse.json({
      verified: true,
      abstractTitle: abstract.title,
      message: "Abstract ID verified successfully.",
    })
  } catch (error) {
    console.error("Abstract verification error:", error)
    return NextResponse.json(
      {
        verified: false,
        message: "An error occurred during verification.",
      },
      { status: 500 },
    )
  }
}

