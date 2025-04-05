import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { createDigitalBadge } from "@/lib/badge-utils";
import { isAdmin } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { Registration } from "@/types/registration";
import type { NextRequest } from "next/server";

// Generate badge for a registration
export async function POST(request: NextRequest) {
  try {
    // Check if user is admin using our custom auth
    const isUserAdmin = await isAdmin(request);
    console.log("Is admin check result:", isUserAdmin);
    
    if (!isUserAdmin) {
      return NextResponse.json({ 
        error: "Unauthorized - Admin privileges required",
        details: "Please ensure you are logged in with an admin account"
      }, { status: 403 });
    }

    const data = await request.json();
    const { registrationId } = data;

    if (!registrationId) {
      return NextResponse.json(
        { error: "Registration ID is required" },
        { status: 400 }
      );
    }

    // Get registration
    const registrationsCollection = await getCollection("registrations");
    
    console.log("Looking for registration with ID:", registrationId);
    
    const registration = await registrationsCollection.findOne({
      _id: new ObjectId(registrationId),
    }) as Registration | null;

    if (!registration) {
      console.error("Registration not found:", registrationId);
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    // Check if badge already exists
    if (registration.badge_id) {
      console.error("Badge already exists for registration:", registrationId);
      return NextResponse.json(
        { error: "Badge already exists for this registration" },
        { status: 400 }
      );
    }

    // Check if registration is confirmed
    if (registration.status !== "confirmed") {
      console.error("Registration not confirmed:", registrationId);
      return NextResponse.json(
        { error: "Registration must be confirmed before generating a badge" },
        { status: 400 }
      );
    }

    console.log("Creating digital badge for registration:", registrationId);

    // Create digital badge
    const badge = await createDigitalBadge(registration);

    console.log("Badge created successfully:", badge._id);

    return NextResponse.json({
      success: true,
      badge,
    });
  } catch (error) {
    console.error("Error in badge generation:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Internal server error",
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Get all badges
export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const isUserAdmin = await isAdmin(request);
    if (!isUserAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const badgesCollection = await getCollection("badges");
    const badges = await badgesCollection.find({}).toArray();

    return NextResponse.json({
      success: true,
      badges,
    });
  } catch (error) {
    console.error("Error fetching badges:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 