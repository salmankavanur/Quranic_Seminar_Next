"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageActions } from "./message-actions"
import { useState } from "react"

interface MessagesClientProps {
  messages: any[]
  unreadCount: number
}

export function MessagesClient({ messages, unreadCount }: MessagesClientProps) {
  const [filter, setFilter] = useState("all")

  const filteredMessages =
    filter === "all"
      ? messages
      : filter === "unread"
        ? messages.filter((m) => !m.is_read)
        : messages.filter((m) => m.is_read)

  return (
    <>
      <div className="mb-6">
        <div className="relative">
          <Input placeholder="Search messages..." className="pl-10" />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <Button variant="outline" className="absolute right-0 top-0">
            Filter
          </Button>
        </div>
      </div>

      <div className="mb-4 flex space-x-2">
        <Button variant={filter === "all" ? "secondary" : "outline"} size="sm" onClick={() => setFilter("all")}>
          All ({messages.length})
        </Button>
        <Button variant={filter === "unread" ? "secondary" : "outline"} size="sm" onClick={() => setFilter("unread")}>
          Unread ({unreadCount})
        </Button>
        <Button variant={filter === "read" ? "secondary" : "outline"} size="sm" onClick={() => setFilter("read")}>
          Read ({messages.length - unreadCount})
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-5 bg-muted p-4 font-medium">
          <div className="w-6"></div>
          <div>Sender</div>
          <div>Subject</div>
          <div>Date</div>
          <div className="text-right">Actions</div>
        </div>

        {filteredMessages.length > 0 ? (
          filteredMessages.map((message: any) => (
            <div key={message._id} className="grid grid-cols-5 p-4 border-t items-center">
              <div>
                <div className={`w-2 h-2 rounded-full ${message.is_read ? "bg-transparent" : "bg-blue-500"}`}></div>
              </div>
              <div>
                <div className={message.is_read ? "" : "font-medium"}>{message.sender_name}</div>
                <div className="text-sm text-muted-foreground">{message.sender_email}</div>
              </div>
              <div>
                <div className={message.is_read ? "" : "font-medium"}>{message.subject}</div>
                <div className="text-sm text-muted-foreground truncate max-w-xs">
                  {message.message.substring(0, 60)}...
                </div>
              </div>
              <div>{new Date(message.created_at).toLocaleDateString()}</div>
              <MessageActions message={message} />
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">No messages found</div>
        )}
      </div>
    </>
  )
}

