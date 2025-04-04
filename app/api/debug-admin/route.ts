import { NextResponse } from "next/server"
import { getCollection } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const usersCollection = await getCollection("users")

    // Find admin user
    const adminUser = await usersCollection.findOne({ email: "admin@example.com" })

    if (!adminUser) {
      // Create admin user if it doesn't exist
      const passwordHash = await hashPassword("password123")

      const result = await usersCollection.insertOne({
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

      return NextResponse.json({
        message: "Admin user created",
        userId: result.insertedId.toString(),
        email: "admin@example.com",
        password: "password123",
        passwordHash: passwordHash,
      })
    } else {
      // Update admin password
      const passwordHash = await hashPassword("password123")

      await usersCollection.updateOne({ _id: adminUser._id }, { $set: { password_hash: passwordHash } })

      return NextResponse.json({
        message: "Admin user updated",
        userId: adminUser._id.toString(),
        email: adminUser.email,
        password: "password123",
        passwordHash: passwordHash,
        currentHash: adminUser.password_hash,
      })
    }
  } catch (error) {
    console.error("Debug admin error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

