"use server"

import { cookies } from "next/headers"
import { getCollection, ObjectId } from "./db"

export async function getSession() {
  const cookieStore = cookies()
  const sessionId = cookieStore.get("session_id")?.value

  if (!sessionId) {
    return null
  }

  try {
    const sessionsCollection = await getCollection("sessions")
    const session = await sessionsCollection.findOne({
      _id: sessionId,
      expires: { $gt: new Date() },
    })

    if (!session) {
      return null
    }

    const usersCollection = await getCollection("users")
    const user = await usersCollection.findOne({
      _id: new ObjectId(session.userId),
    })

    return user
  } catch (error) {
    console.error("Session retrieval error:", error)
    return null
  }
}

export async function verifySession(sessionId: string) {
  try {
    const sessionsCollection = await getCollection("sessions")
    const session = await sessionsCollection.findOne({
      _id: sessionId,
      expires: { $gt: new Date() },
    })

    if (!session) return null

    const usersCollection = await getCollection("users")
    const user = await usersCollection.findOne({
      _id: new ObjectId(session.userId),
      role: "admin",
    })

    return user
  } catch (error) {
    console.error("Session verification error:", error)
    return null
  }
}

