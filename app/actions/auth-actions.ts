"use server"

import { getCollection } from "@/lib/db"
import { redirect } from "next/navigation"
import { hashPassword, createSession, logout } from "@/lib/auth"

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    // Find user by email
    const usersCollection = await getCollection("users")
    const user = await usersCollection.findOne({ email })

    if (!user) {
      return { success: false, error: "Invalid email or password" }
    }

    // Check if user is an admin
    if (user.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    // Verify password
    const hashedPassword = await hashPassword(password)
    const passwordMatch = hashedPassword === user.password_hash

    if (!passwordMatch) {
      return { success: false, error: "Invalid email or password" }
    }

    // Create session
    await createSession(user._id.toString())

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "Internal server error" }
  }
}

export async function createAdminAction() {
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

      return {
        success: true,
        message: "Admin user updated successfully",
        credentials: { email, password },
      }
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

      return {
        success: true,
        message: "Admin user created successfully",
        credentials: { email, password },
      }
    }
  } catch (error) {
    console.error("Error creating admin user:", error)
    return {
      success: false,
      error: "Failed to create admin user",
    }
  }
}

export async function logoutAction() {
  await logout()
  redirect("/admin/login")
}

