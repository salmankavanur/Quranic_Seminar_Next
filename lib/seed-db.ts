import { getDb } from "./db"
import { ObjectId } from "mongodb"
import { createHash } from "crypto"

// Simple password hashing function using crypto
function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex")
}

export async function seedDatabase() {
  try {
    const db = await getDb()

    // Seed admin user
    const usersCollection = db.collection("users")
    const adminExists = await usersCollection.findOne({ email: "admin@example.com" })

    if (!adminExists) {
      const passwordHash = hashPassword("password123")
      await usersCollection.insertOne({
        name: "Admin User",
        email: "admin@example.com",
        password_hash: passwordHash,
        role: "admin",
        permissions: {
          manage_registrations: true,
          manage_submissions: true,
          manage_admins: true,
        },
        created_at: new Date(),
      })
    }

    // Seed registrations
    const registrationsCollection = db.collection("registrations")
    const registrationsCount = await registrationsCollection.countDocuments()

    if (registrationsCount === 0) {
      const registrations = [
        {
          _id: new ObjectId(),
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@example.com",
          phone: "+91 9876543210",
          institution: "University of Kerala",
          participant_type: "Presenter",
          special_requirements: "",
          status: "confirmed",
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
        {
          _id: new ObjectId(),
          first_name: "Jane",
          last_name: "Smith",
          email: "jane.smith@example.com",
          phone: "+91 9876543211",
          institution: "Calicut University",
          participant_type: "Attendee",
          special_requirements: "Vegetarian food",
          status: "pending",
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
        {
          _id: new ObjectId(),
          first_name: "Ahmed",
          last_name: "Khan",
          email: "ahmed.khan@example.com",
          phone: "+91 9876543212",
          institution: "Jamia Millia Islamia",
          participant_type: "Presenter",
          special_requirements: "",
          status: "confirmed",
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
        {
          _id: new ObjectId(),
          first_name: "Fatima",
          last_name: "Rahman",
          email: "fatima.rahman@example.com",
          phone: "+91 9876543213",
          institution: "Aligarh Muslim University",
          participant_type: "Student",
          special_requirements: "",
          status: "pending",
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          _id: new ObjectId(),
          first_name: "Mohammed",
          last_name: "Ali",
          email: "mohammed.ali@example.com",
          phone: "+91 9876543214",
          institution: "Akode Islamic Centre",
          participant_type: "Presenter",
          special_requirements: "Wheelchair access",
          status: "confirmed",
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
      ]

      await registrationsCollection.insertMany(registrations)

      // Seed abstracts
      const abstractsCollection = db.collection("abstracts")
      const abstracts = [
        {
          registration_id: registrations[0]._id,
          title: "Numerical Patterns in Quranic Verses: A Statistical Analysis",
          sub_theme: "Patterns and Frequencies of Words and Numbers in the Quran",
          keywords: "numerical patterns, statistical analysis, divine precision",
          content:
            "This abstract explores the statistical significance of numerical patterns found in Quranic verses...",
          status: "accepted",
          created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        },
        {
          registration_id: registrations[2]._id,
          title: "The Golden Ratio in Quranic Structure: Myth or Reality?",
          sub_theme: "The Quran and the Golden Ratio: Myth or Reality?",
          keywords: "golden ratio, mathematical structure, divine architecture",
          content:
            "This research examines the presence of the golden ratio in the structural composition of the Quran...",
          status: "pending",
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          registration_id: registrations[4]._id,
          title: "Digital Analysis of Quranic Numerical Inimitability",
          sub_theme: "The Role of Digital Tools in Analyzing Quranic Numbers",
          keywords: "digital analysis, computational linguistics, numerical patterns",
          content:
            "Using modern computational tools, this research investigates the numerical patterns in the Quran...",
          status: "accepted",
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
      ]

      await abstractsCollection.insertMany(abstracts)

      // Seed papers
      const papersCollection = db.collection("papers")
      await papersCollection.insertOne({
        abstract_id: (await abstractsCollection.findOne({ registration_id: registrations[0]._id }))?._id,
        registration_id: registrations[0]._id,
        title: "Numerical Patterns in Quranic Verses: A Statistical Analysis",
        content: "Full paper content here...",
        file_path: "/uploads/papers/sample.pdf",
        status: "accepted",
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      })

      // Seed messages
      const messagesCollection = db.collection("messages")
      await messagesCollection.insertMany([
        {
          sender_name: "Rahul Kumar",
          sender_email: "rahul.kumar@example.com",
          phone: "+91 9876543215",
          subject: "Question about Registration",
          message: "I would like to know if there is a discount for students from international universities.",
          is_read: true,
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
        {
          sender_name: "Aisha Begum",
          sender_email: "aisha.begum@example.com",
          phone: "+91 9876543216",
          subject: "Abstract Submission Query",
          message: "I am having trouble submitting my abstract through the website. Can you please assist?",
          is_read: false,
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          sender_name: "David Wilson",
          sender_email: "david.wilson@example.com",
          phone: "+91 9876543217",
          subject: "Accommodation Information",
          message: "Could you please provide information about accommodation options near the seminar venue?",
          is_read: false,
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
      ])
    }

    console.log("Database seeded successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  }
}

