import { NextResponse } from "next/server"
import { getCollection, ObjectId } from "@/lib/db"
import { isServerAdmin } from "@/lib/server-auth"
import { hashPassword } from "@/lib/auth"
import { getServerSession } from "next-auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    const isAdmin = await isServerAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const id = params.id

    // Validate ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const usersCollection = await getCollection("users")
    const admin = await usersCollection.findOne({ _id: new ObjectId(id), role: "admin" })

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    // Remove sensitive information
    const { password_hash, ...safeAdmin } = admin

    return NextResponse.json({ admin: safeAdmin })
  } catch (error) {
    console.error("Error fetching admin:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    const isAdmin = await isServerAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const id = params.id

    // Validate ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if email already exists (for another user)
    const usersCollection = await getCollection("users")
    const existingUser = await usersCollection.findOne({
      email: data.email,
      _id: { $ne: new ObjectId(id) },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 })
    }

    // Prepare update data
    const updateData: any = {
      name: data.name,
      email: data.email,
      permissions: data.permissions,
      updated_at: new Date(),
    }

    // If password is provided, hash it
    if (data.password) {
      updateData.password_hash = await hashPassword(data.password)
    }

    const result = await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating admin:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    const isAdmin = await isServerAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const id = params.id

    // Validate ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    // Get current user
    const session = await getServerSession()
    const currentUser = session?.user

    // Prevent deleting yourself
    if (currentUser?._id?.toString() === id) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 })
    }

    const usersCollection = await getCollection("users")
    const result = await usersCollection.deleteOne({ _id: new ObjectId(id), role: "admin" })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting admin:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

