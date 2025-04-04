import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/init-db"
import { seedDatabase } from "@/lib/seed-db"
import { isAdmin } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    // Check if user is admin
    const admin = await isAdmin()

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Initialize database
    await initializeDatabase()

    // Seed database if requested
    const { seed } = await request.json()

    if (seed) {
      await seedDatabase()
    }

    return NextResponse.json({
      success: true,
      message: seed ? "Database initialized and seeded successfully" : "Database initialized successfully",
    })
  } catch (error) {
    console.error("Database initialization error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

