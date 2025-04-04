import { NextResponse } from "next/server"
import { getCollection } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json(
        {
          verified: false,
          message: "Phone number is required",
        },
        { status: 400 },
      )
    }

    // Check if the phone number exists in the registrations collection
    const registrationsCollection = await getCollection("registrations")
    const registration = await registrationsCollection.findOne({ phone })

    if (!registration) {
      return NextResponse.json({
        verified: false,
        message: "Phone number not found. Please register first.",
      })
    }

    // Check if the participant type is appropriate for submission
    if (registration.participant_type !== "Presenter" && registration.participant_type !== "paperPresenter") {
      return NextResponse.json({
        verified: false,
        message: "Only paper presenters can submit abstracts.",
      })
    }

    return NextResponse.json({
      verified: true,
      registrationId: registration._id.toString(),
      name: `${registration.first_name} ${registration.last_name}`,
      message: "Phone number verified successfully.",
    })
  } catch (error) {
    console.error("Phone verification error:", error)
    return NextResponse.json(
      {
        verified: false,
        message: "An error occurred during verification.",
      },
      { status: 500 },
    )
  }
}

