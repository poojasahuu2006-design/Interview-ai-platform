const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: function (origin, callback) {
        return callback(null, true)
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

// Simple health endpoint for container orchestration and load balancers
app.get("/health", (req, res) => {
    res.status(200).json({ ok: true })
})

// Global error handler
app.use((err, req, res, next) => {
    console.error("Express unhandled error:", err)
    res.status(500).json({ message: err.message || "Internal server error" })
})

module.exports = app
