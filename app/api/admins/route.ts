import { NextResponse } from "next/server"
import { getCollection } from "@/lib/db"
import { isServerAdmin } from "@/lib/server-auth"
import { hashPassword } from "@/lib/auth"

export async function GET() {
  try {
    // Check if user is admin
    const isAdmin = await isServerAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const usersCollection = await getCollection("users")
    const admins = await usersCollection.find({ role: "admin" }).sort({ name: 1 }).toArray()

    // Remove sensitive information
    const safeAdmins = admins.map((admin) => {
      const { password_hash, ...safeAdmin } = admin
      return safeAdmin
    })

    return NextResponse.json({ admins: safeAdmins })
  } catch (error) {
    console.error("Error fetching admins:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Check if user is admin
    const isAdmin = await isServerAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if email already exists
    const usersCollection = await getCollection("users")
    const existingUser = await usersCollection.findOne({ email: data.email })

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await hashPassword(data.password)

    // Insert admin into database
    const result = await usersCollection.insertOne({
      name: data.name,
      email: data.email,
      password_hash: passwordHash,
      role: "admin",
      permissions: data.permissions || {
        manage_registrations: true,
        manage_submissions: true,
        manage_admins: false,
      },
      created_at: new Date(),
    })

    return NextResponse.json({
      success: true,
      adminId: result.insertedId,
    })
  } catch (error) {
    console.error("Admin creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

