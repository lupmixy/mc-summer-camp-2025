import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './utils/db'
import registerRouter from './routes/register'
import mediaRouter from './routes/media'
import paymentsRouter from './routes/payments'
import path from 'path'

dotenv.config()

const app = express()
const port = process.env.PORT || 3002

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())

// Configure static file serving
app.use('/media', express.static(path.join(__dirname, '../public/media')))

// Mount API routes
app.use('/api', registerRouter)
app.use('/api', mediaRouter)
app.use('/api', paymentsRouter)

// Initialize MongoDB connection
connectDB().catch(console.error)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})