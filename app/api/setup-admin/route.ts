import { NextResponse } from "next/server"
import { getCollection } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const usersCollection = await getCollection("users")

    // Check if admin already exists
    const adminExists = await usersCollection.findOne({ email: "admin@example.com" })

    if (adminExists) {
      // Update existing admin's password
      const passwordHash = await hashPassword("password123")

      await usersCollection.updateOne(
        { email: "admin@example.com" },
        {
          $set: {
            password_hash: passwordHash,
            role: "admin",
            permissions: {
              manage_registrations: true,
              manage_submissions: true,
              manage_admins: true,
            },
          },
        },
      )

      return NextResponse.json({
        success: true,
        message: "Admin user updated successfully",
        credentials: {
          email: "admin@example.com",
          password: "password123",
        },
      })
    } else {
      // Create new admin
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
        success: true,
        message: "Admin user created successfully",
        credentials: {
          email: "admin@example.com",
          password: "password123",
        },
      })
    }
  } catch (error) {
    console.error("Setup admin error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

