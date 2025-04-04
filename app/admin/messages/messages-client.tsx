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

      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-muted text-left">
              <th className="px-4 py-3 font-medium w-6"></th>
              <th className="px-4 py-3 font-medium">Sender</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMessages.length > 0 ? (
              filteredMessages.map((message: any) => (
                <tr key={message._id} className="border-t hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div className={`w-2 h-2 rounded-full ${message.is_read ? "bg-transparent" : "bg-blue-500"}`}></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className={message.is_read ? "" : "font-medium"}>{message.sender_name}</div>
                    <div className="text-sm text-muted-foreground">{message.sender_email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className={message.is_read ? "" : "font-medium"}>{message.subject}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                      {message.message.substring(0, 60)}...
                    </div>
                  </td>
                  <td className="px-4 py-3">{new Date(message.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <MessageActions message={message} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  No messages found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}