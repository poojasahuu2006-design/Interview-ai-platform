const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

const allowedOrigins = [
    "http://localhost:5173",
    "https://interview-ai-7ro.pages.dev",
    "https://0bbb415b.interview-ai-7ro.pages.dev",
    /\.interview-ai-7ro\.pages\.dev$/
]

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true)
        const allowed = allowedOrigins.some(o =>
            typeof o === "string" ? o === origin : o.test(origin)
        )
        if (allowed) return callback(null, true)
        return callback(new Error("CORS not allowed: " + origin))
    },
    credentials: true
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

module.exports = app
