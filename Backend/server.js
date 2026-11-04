
require('dotenv').config()

const app = require('./src/app')
const connectDB = require('./src/config/database')

async function startServer() {
    try {
        await connectDB()

        const port = Number(process.env.PORT) || 3000
        app.listen(port, '0.0.0.0', () => {
            console.log(`Server started on port ${port}`)
        })
    } catch (error) {
        console.error('Failed to start server:', error)
        process.exit(1)
    }
}

startServer()
