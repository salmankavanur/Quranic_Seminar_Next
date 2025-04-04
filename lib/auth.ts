"use server"

import { cookies } from "next/headers"
import { getCollection, ObjectId } from "./db"
import type { NextRequest } from "next/server"
import { createHash } from "crypto"

// Use crypto for password hashing - make all functions async
export async function hashPassword(password: string): Promise<string> {
  return createHash("sha256").update(password).digest("hex")
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  const hashedInput = createHash("sha256").update(password).digest("hex")
  return hashedInput === hashedPassword
}

export async function createSession(userId: string): Promise<string> {
  const sessionId = crypto.randomUUID()
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  const sessionsCollection = await getCollection("sessions")
  await sessionsCollection.insertOne({
    _id: sessionId,
    userId,
    expires,
  })

  cookies().set({
    name: "session_id",
    value: sessionId,
    expires,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  })

  return sessionId
}

export async function getCurrentUser(request?: NextRequest) {
  const cookieStore = cookies()
  const sessionId = request ? request.cookies.get("session_id")?.value : cookieStore.get("session_id")?.value

  if (!sessionId) return null

  const sessionsCollection = await getCollection("sessions")
  const session = await sessionsCollection.findOne({
    _id: sessionId,
    expires: { $gt: new Date() },
  })

  if (!session) return null

  const usersCollection = await getCollection("users")
  const user = await usersCollection.findOne({ _id: new ObjectId(session.userId) })

  return user
}

export async function isAdmin(request?: NextRequest) {
  const user = await getCurrentUser(request)
  return user?.role === "admin"
}

export async function logout() {
  const cookieStore = cookies()
  cookieStore.delete("session_id")
}

