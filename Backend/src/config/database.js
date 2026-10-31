const mongoose = require("mongoose")

async function connectToDB() {
    const rawUri = process.env.MONGO_URI || ""
    const cleanUri = rawUri.trim().replace(/^["']|["']$/g, "")

    if (!cleanUri) {
        console.error("CRITICAL: MONGO_URI environment variable is missing or empty!")
        return
    }

    try {
        await mongoose.connect(cleanUri, {
            serverSelectionTimeoutMS: 15000,
        })
        console.log("Successfully connected to MongoDB Database!")
    } catch (err) {
        console.error("MongoDB connection error:", err.message)
    }
}

module.exports = connectToDB
