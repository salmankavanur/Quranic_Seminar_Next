import { NextResponse } from "next/server"
import { getCollection } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function GET() {
  try {
    const usersCollection = await getCollection("users")

    // Create admin user with fixed credentials
    const email = "admin@example.com"
    const password = "password123"
    const passwordHash = await hashPassword(password)

    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ email })

    if (existingAdmin) {
      // Update existing admin
      await usersCollection.updateOne(
        { email },
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
        credentials: { email, password },
      })
    } else {
      // Create new admin
      await usersCollection.insertOne({
        name: "Admin User",
        email,
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
        credentials: { email, password },
      })
    }
  } catch (error) {
    console.error("Error creating admin user:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create admin user",
      },
      { status: 500 },
    )
  }
}

