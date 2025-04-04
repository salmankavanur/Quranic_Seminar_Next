import { NextResponse } from "next/server"
import { getCollection } from "@/lib/db"
import { createHash } from "crypto"

export async function GET(request: Request) {
  try {
    const usersCollection = await getCollection("users")

    // Check if admin already exists
    const adminExists = await usersCollection.findOne({ email: "admin@example.com" })

    if (adminExists) {
      // Update existing admin's password
      const passwordHash = createHash("sha256").update("password123").digest("hex")
      await usersCollection.updateOne({ email: "admin@example.com" }, { $set: { password_hash: passwordHash } })
    } else {
      // Create new admin
      const passwordHash = createHash("sha256").update("password123").digest("hex")
      await usersCollection.insertOne({
        name: "Admin User",
        email: "admin@example.com",
        password_hash: passwordHash,
        role: "admin",
        permissions: {
          manage_registrations: true,
          manage_submissions: true,
          manage_admins: true,
        },
        created_at: new Date(),
      })
    }

    return NextResponse.json({
      success: true,
      message: "Admin user created/updated successfully. Use email: admin@example.com and password: password123",
    })
  } catch (error) {
    console.error("Create admin error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

