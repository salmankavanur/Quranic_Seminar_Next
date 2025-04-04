import { getCollection } from "@/lib/db"
import { MessagesClient } from "./messages-client"

async function getMessages() {
  try {
    const messagesCollection = await getCollection("messages")
    const messages = await messagesCollection.find({}).sort({ created_at: -1 }).toArray()

    // Convert MongoDB objects to plain objects for serialization
    return messages.map((message) => ({
      ...message,
      _id: message._id.toString(),
      created_at: message.created_at.toISOString(),
      updated_at: message.updated_at ? message.updated_at.toISOString() : null,
    }))
  } catch (error) {
    console.error("Error fetching messages:", error)
    return []
  }
}

export default async function MessagesPage() {
  const messages = await getMessages()

  // Count unread messages
  const unreadCount = messages.filter((m) => !m.is_read).length

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Messages</h1>
        <div className="text-sm text-muted-foreground">
          {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
        </div>
      </div>

      <MessagesClient messages={messages} unreadCount={unreadCount} />
    </div>
  )
}

