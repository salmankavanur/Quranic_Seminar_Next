import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";

export async function POST(request: Request) {
  try {
    console.log("Received badge request"); // Debug log
    const body = await request.json();
    console.log("Request body:", body); // Debug log
    
    const { email, phone } = body;

    if (!email && !phone) {
      console.log("No email or phone provided"); // Debug log
      return NextResponse.json(
        { error: "Either email or phone number is required" },
        { status: 400 }
      );
    }

    // Get registration by email or phone
    try {
      const registrationsCollection = await getCollection("registrations");
      const query = email ? { email: email.toLowerCase() } : { phone };
      console.log("Searching with query:", query); // Debug log
      
      const registration = await registrationsCollection.findOne(query);
      console.log("Found registration:", registration ? "yes" : "no"); // Debug log

      if (!registration) {
        return NextResponse.json(
          { error: "Registration not found" },
          { status: 404 }
        );
      }

      if (!registration.badge_id) {
        return NextResponse.json(
          { error: "Badge has not been generated yet" },
          { status: 404 }
        );
      }

      // Return badge details
      const badge = {
        id: registration.badge_id,
        qr_code: registration.qr_code,
        issued_at: registration.badge_issued_at,
        participant_name: `${registration.first_name} ${registration.last_name}`,
        participant_type: registration.participant_type,
        status: registration.badge_status
      };
      console.log("Returning badge:", badge.id); // Debug log

      return NextResponse.json({
        success: true,
        badge
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Database error occurred" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error fetching badge:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 