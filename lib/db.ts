import { MongoClient, ObjectId } from "mongodb"
import { createHash } from "crypto"

// MongoDB connection string
const uri = process.env.MONGODB_URI || "mongodb://digibayt.com:27313/numeric_seminar"
const dbName = "numeric_seminar"

// Create a MongoDB client
let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof global & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export { clientPromise, ObjectId }

// Helper function to get database connection
export async function getDb() {
  const client = await clientPromise
  return client.db(dbName)
}

// Helper function to get a collection
export async function getCollection(collectionName: string) {
  const db = await getDb()
  return db.collection(collectionName)
}

// Helper function to execute a query
export async function executeQuery(
  collectionName: string,
  operation: "find" | "findOne" | "insertOne" | "updateOne" | "deleteOne" | "aggregate",
  query: any,
  options?: any,
) {
  try {
    const collection = await getCollection(collectionName)

    switch (operation) {
      case "find":
        return await collection.find(query, options).toArray()
      case "findOne":
        return await collection.findOne(query, options)
      case "insertOne":
        return await collection.insertOne(query)
      case "updateOne":
        return await collection.updateOne(query, options)
      case "deleteOne":
        return await collection.deleteOne(query)
      case "aggregate":
        return await collection.aggregate(query).toArray()
      default:
        throw new Error(`Unsupported operation: ${operation}`)
    }
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Simple password hashing function using crypto
export async function hashPassword(password: string): Promise<string> {
  return createHash("sha256").update(password).digest("hex")
}

