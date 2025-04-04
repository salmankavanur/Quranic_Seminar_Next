import { getDb } from "./db"

export async function initializeDatabase() {
  try {
    const db = await getDb()

    // Create collections if they don't exist
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((c) => c.name)

    // Create users collection
    if (!collectionNames.includes("users")) {
      await db.createCollection("users")
      await db.collection("users").createIndex({ email: 1 }, { unique: true })
    }

    // Create sessions collection
    if (!collectionNames.includes("sessions")) {
      await db.createCollection("sessions")
      await db.collection("sessions").createIndex({ expires: 1 }, { expireAfterSeconds: 0 })
    }

    // Create registrations collection
    if (!collectionNames.includes("registrations")) {
      await db.createCollection("registrations")
      await db.collection("registrations").createIndex({ email: 1 }, { unique: true })
      await db.collection("registrations").createIndex({ phone: 1 })
    }

    // Create abstracts collection
    if (!collectionNames.includes("abstracts")) {
      await db.createCollection("abstracts")
      await db.collection("abstracts").createIndex({ registration_id: 1 })
    }

    // Create papers collection
    if (!collectionNames.includes("papers")) {
      await db.createCollection("papers")
      await db.collection("papers").createIndex({ abstract_id: 1 })
      await db.collection("papers").createIndex({ registration_id: 1 })
    }

    // Create messages collection
    if (!collectionNames.includes("messages")) {
      await db.createCollection("messages")
      await db.collection("messages").createIndex({ created_at: -1 })
    }

    // Create certificates collection
    if (!collectionNames.includes("certificates")) {
      await db.createCollection("certificates")
      await db.collection("certificates").createIndex({ registration_id: 1 })
      await db.collection("certificates").createIndex({ certificate_number: 1 }, { unique: true })
    }

    // Create seminar_settings collection
    if (!collectionNames.includes("seminar_settings")) {
      await db.createCollection("seminar_settings")

      // Insert default settings if collection is empty
      const settingsCount = await db.collection("seminar_settings").countDocuments()
      if (settingsCount === 0) {
        await db.collection("seminar_settings").insertOne({
          seminar_date: new Date("2025-04-10"),
          abstract_deadline: new Date("2025-03-21"),
          paper_deadline: new Date("2025-04-08"),
          venue: "Akode Islamic Centre, Oorkadave, Kerala, India",
          contact_info: {
            email: "quraniclearningfestival@gmail.com",
            phone: "+91 7034546331",
          },
          created_at: new Date(),
        })
      }
    }

    console.log("Database initialized successfully")
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  }
}

