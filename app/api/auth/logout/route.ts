import { NextResponse } from "next/server"
import { logoutAction } from "@/app/actions/auth-actions"

export async function GET() {
  try {
    await logoutAction()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

