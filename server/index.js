import express from "express"
import cors from "cors"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import mongoSanitize from "express-mongo-sanitize"

import config from "./config.js"
import db from "./db/index.js"
import routes from "./routes/index.js"
import { app } from "./socket/index.js"

const PORT = config.PORT || 8080

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://newFreedomaz.com"
    ]

// =========================
// CORE HARDENING
// =========================
app.disable("x-powered-by")

// =========================
// SECURITY HEADERS
// =========================
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
)

// =========================
// CORS (production safe)
// =========================
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error("CORS blocked"))
    },
    credentials: true
  })
)

// =========================
// BODY PARSING LIMITS
// =========================
app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded({ extended: false, limit: "10kb" }))

// =========================
// COOKIES
// =========================
app.use(cookieParser())

// =========================
// NOSQL INJECTION PROTECTION
// (scoped to API routes only)
// =========================
app.use("/api", mongoSanitize())

// =========================
// ROUTES
// =========================
app.use(routes)

app.get("/", (req, res) => {
  res.json({ message: `Server is running at ${PORT}` })
})

// =========================
// ERROR HANDLER (MUST BE LAST)
// =========================
app.use((err, req, res, next) => {
  console.error(err)

  res.status(err.status || 500).json({
    message: "Internal server error"
  })
})

// =========================
// DB CONNECT
// =========================
db.connect(app)

export default app