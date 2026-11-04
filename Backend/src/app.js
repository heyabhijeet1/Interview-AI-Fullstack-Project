const express = require("express")
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: (origin, callback) => {
        const configuredOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "")
            .split(",")
            .map((url) => url.trim().replace(/\/$/, ""))
            .filter(Boolean)
        // Local Vite origins are only allowed outside production. In production,
        // set CLIENT_URL (or comma-separated CLIENT_URLS) to the deployed frontend URL.
        const isLocalDevOrigin = process.env.NODE_ENV !== "production" &&
            /^http:\/\/(localhost|127\.0\.0\.1|10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2}):517[3-9]$/.test(origin || "")
        const allowed = !origin || configuredOrigins.includes(origin.replace(/\/$/, "")) || isLocalDevOrigin
        callback(allowed ? null : new Error('Origin not allowed by CORS'), allowed)
    },
    credentials: true
}))

/* require all the routes */
const authRouter = require('./routes/auth.routes')
const interviewRouter = require('./routes/interview.routes')

app.use('/api/auth', authRouter)
app.use('/api/interview', interviewRouter)

module.exports=app
