import { MongoClient, Db } from 'mongodb'
import dotenv from 'dotenv'

// Ensure environment variables are loaded
dotenv.config()

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mc-soccer-camps'
const client = new MongoClient(uri)
let db: Db | null = null

export async function connectDB() {
  if (!db) {
    try {
      await client.connect()
      db = client.db('mc-soccer-camps')
      console.log('Connected to MongoDB successfully')
    } catch (error) {
      console.error('MongoDB connection error:', error)
      throw error
    }
  }
  return db
}

export async function closeDB() {
  if (client) {
    await client.close()
    db = null
    console.log('Disconnected from MongoDB')
  }
}

export type Registration = {
  playerName: string
  dateOfBirth: Date
  program: 'youth' | 'highschool'
  parentName: string
  email: string
  phone: string
  emergencyContact: string
  emergencyPhone: string
  medicalConditions?: string
  shirtSize: string
  paymentStatus: string
  amount: number
  createdAt: Date
}