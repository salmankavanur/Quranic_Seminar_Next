import { NextResponse } from "next/server";
import { verifyBadge, recordAttendance } from "@/lib/badge-utils";
import { isServerAdmin } from "@/lib/auth-utils";

// Record attendance using QR code
export async function POST(request: Request) {
  try {
    // Check if user is admin
    const isAdmin = await isServerAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const data = await request.json();
    const { qrData, sessionId } = data;

    if (!qrData || !sessionId) {
      return NextResponse.json(
        { error: "QR data and session ID are required" },
        { status: 400 }
      );
    }

    // Verify badge
    const verificationResult = await verifyBadge(qrData);
    if (!verificationResult.isValid) {
      return NextResponse.json(
        { error: verificationResult.message },
        { status: 400 }
      );
    }

    // Record attendance
    const success = await recordAttendance(
      verificationResult.badge!._id,
      sessionId
    );

    if (!success) {
      return NextResponse.json(
        { error: "Attendance already recorded or failed to record" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Attendance recorded successfully",
      participant: {
        name: verificationResult.registration!.first_name + " " + verificationResult.registration!.last_name,
        type: verificationResult.registration!.participant_type,
      },
    });
  } catch (error) {
    console.error("Error recording attendance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 