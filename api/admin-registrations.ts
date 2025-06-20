import { VercelRequest, VercelResponse } from '@vercel/node'
import { MongoClient } from 'mongodb'

async function connectToMongoDB(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not defined')
  }

  const options = {
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    maxPoolSize: 10,
    retryWrites: true,
    w: 'majority' as const
  }

  console.log('Connecting to MongoDB with URI:', uri.replace(/\/\/([^:]+):([^@]+)@/, '//[username]:[password]@'))
  
  const client = new MongoClient(uri, options)
  await client.connect()
  
  return client
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Simple authentication check
  const adminKey = req.query.admin_key || req.headers['x-admin-key']
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-Admin-Key')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let client: MongoClient | null = null

  try {
    console.log('Connecting to MongoDB for admin registrations...')
    client = await connectToMongoDB()
    const db = client.db('mc-soccer-camps')
    
    const registrations = await db.collection('registrations')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    console.log(`Found ${registrations.length} registrations`)

    const formattedRegistrations = registrations.map(reg => ({
      id: reg._id,
      playerName: `${reg.playerFirstName} ${reg.playerLastName}`,
      parentName: `${reg.parentFirstName} ${reg.parentLastName}`,
      email: reg.email,
      phone: reg.phone,
      program: reg.program,
      position: reg.position,
      shirtSize: reg.shirtSize,
      emergencyContact: reg.emergencyContact,
      emergencyPhone: reg.emergencyPhone,
      medicalConditions: reg.medicalConditions,
      dateOfBirth: reg.dateOfBirth,
      funFact: reg.funFact,
      paymentStatus: reg.paymentStatus || 'paid',
      amount: reg.amount,
      createdAt: reg.createdAt,
      status: reg.status || 'confirmed'
    }))

    res.json({ 
      success: true, 
      count: registrations.length,
      registrations: formattedRegistrations 
    })

  } catch (error) {
    console.error('Admin registrations error:', error)
    res.status(500).json({ 
      error: 'Failed to fetch registrations',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  } finally {
    if (client) {
      try {
        await client.close()
        console.log('MongoDB connection closed')
      } catch (closeError) {
        console.error('Error closing MongoDB connection:', closeError)
      }
    }
  }
}
