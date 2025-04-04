import { NextResponse } from "next/server"
import { getCollection } from "@/lib/db"
import { createHash } from "crypto"
import { createSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Find user by email
    const usersCollection = await getCollection("users")
    const user = await usersCollection.findOne({ email })

    if (!user) {
      console.log("User not found:", email)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Check if user is an admin
    if (user.role !== "admin") {
      console.log("User is not an admin:", email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Verify password
    const hashedPassword = createHash("sha256").update(password).digest("hex")
    const passwordMatch = hashedPassword === user.password_hash

    console.log("Password check:", {
      inputHash: hashedPassword,
      storedHash: user.password_hash,
      match: passwordMatch,
    })

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Create session
    const sessionId = await createSession(user._id.toString())

    // Create response with redirect
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    })

    // Set cookie with proper attributes
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    response.cookies.set({
      name: "session_id",
      value: sessionId,
      expires,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

