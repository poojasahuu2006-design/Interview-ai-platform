require("dotenv").config({ path: "./.env" })
const mongoose = require("mongoose")

jest.setTimeout(30000)

beforeAll(async () => {
  const uri = process.env.MONGO_URI_TEST || process.env.MONGO_URI
  if (!uri) {
    throw new Error("MONGO_URI_TEST or MONGO_URI must be set for tests")
  }
  await mongoose.connect(uri)
})

afterEach(async () => {
  const collections = Object.values(mongoose.connection.collections)
  for (const collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
})
