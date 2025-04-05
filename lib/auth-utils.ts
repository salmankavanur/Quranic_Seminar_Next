import { getServerSession } from "next-auth";
import { getCollection } from "./db";

export async function isServerAdmin(): Promise<boolean> {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) return false;

    const usersCollection = await getCollection("users");
    const user = await usersCollection.findOne({ email: session.user.email });

    return user?.role === "admin" || user?.role === "super_admin";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
} 