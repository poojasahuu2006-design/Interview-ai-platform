const request = require("supertest")
const bcrypt = require("bcryptjs")
const app = require("../src/app")
const userModel = require("../src/models/user.model")

const userData = {
  username: "testuser",
  email: "testuser@example.com",
  password: "Password123!"
}

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(userData)

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty("message", "User registered successfully")
    expect(res.body.user).toMatchObject({
      username: userData.username,
      email: userData.email
    })
    expect(res.headers["set-cookie"]).toBeDefined()
  })

  it("should not register duplicate user", async () => {
    await userModel.create({
      username: userData.username,
      email: userData.email,
      password: await bcrypt.hash(userData.password, 10)
    })

    const res = await request(app)
      .post("/api/auth/register")
      .send(userData)

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty("message", "Account already exists with this email address or username")
  })

  it("should login an existing user", async () => {
    await userModel.create({
      username: userData.username,
      email: userData.email,
      password: await bcrypt.hash(userData.password, 10)
    })

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: userData.email,
        password: userData.password
      })

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty("message", "User loggedIn successfully.")
    expect(res.body.user).toMatchObject({
      username: userData.username,
      email: userData.email
    })
    expect(res.headers["set-cookie"]).toBeDefined()
  })

  it("should protect get-me without token", async () => {
    const res = await request(app).get("/api/auth/get-me")

    expect(res.statusCode).toBe(401)
    expect(res.body).toHaveProperty("message", "Token not provided.")
  })
})
