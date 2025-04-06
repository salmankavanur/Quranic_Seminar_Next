import { getCollection } from "@/lib/db"
import { getServerSession } from "@/lib/server-auth"
import { AdminsClient } from "./admins-client"
import { AdminHeader } from "./admin-header"

async function getAdmins() {
  try {
    const usersCollection = await getCollection("users")
    const admins = await usersCollection.find({ role: "admin" }).sort({ name: 1 }).toArray()

    // Convert MongoDB objects to plain objects for serialization
    return admins.map((admin) => ({
      ...admin,
      _id: admin._id.toString(),
      created_at: admin.created_at.toISOString(),
      updated_at: admin.updated_at ? admin.updated_at.toISOString() : null,
      // Remove sensitive information
      password_hash: undefined,
    }))
  } catch (error) {
    console.error("Error fetching admins:", error)
    return []
  }
}

export default async function ManageAdminsPage() {
  const admins = await getAdmins()
  const currentUser = await getServerSession()
  const currentUserEmail = currentUser?.email || ""

  return (
    <div className="container py-8 opacity-100 transition-opacity duration-500">
      <AdminHeader />
      <AdminsClient admins={admins} currentUserEmail={currentUserEmail} />
    </div>
  )
}

