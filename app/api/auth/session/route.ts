import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getCollection, ObjectId } from "@/lib/db"

export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session_id")?.value

    if (!sessionId) {
      return NextResponse.json({
        authenticated: false,
        message: "No session found",
      })
    }

    const sessionsCollection = await getCollection("sessions")
    const session = await sessionsCollection.findOne({
      _id: sessionId,
      expires: { $gt: new Date() },
    })

    if (!session) {
      // Clear invalid session cookie
      cookieStore.delete("session_id")

      return NextResponse.json({
        authenticated: false,
        message: "Invalid or expired session",
      })
    }

    const usersCollection = await getCollection("users")
    const user = await usersCollection.findOne({
      _id: new ObjectId(session.userId),
    })

    if (!user) {
      // Clear invalid session cookie
      cookieStore.delete("session_id")

      return NextResponse.json({
        authenticated: false,
        message: "User not found",
      })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Session check error:", error)
    return NextResponse.json(
      {
        authenticated: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

