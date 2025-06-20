import { VercelRequest, VercelResponse } from '@vercel/node'
import { MongoClient, ObjectId } from 'mongodb'

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
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-Admin-Key')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Check admin key
  const adminKey = req.query.adminKey || req.headers['x-admin-key']
  const expectedKey = process.env.ADMIN_KEY || 'mcsoccer2025admin'
  
  if (adminKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { id } = req.query
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Registration ID is required' })
  }

  let client: MongoClient | null = null

  try {
    console.log(`Processing ${req.method} request for registration ID: ${id}`)
    client = await connectToMongoDB()
    const db = client.db('mc-soccer-camps')
    
    if (req.method === 'PUT') {
      // Update registration
      const updateData = req.body
      console.log('Update data:', updateData)

      // Remove fields that shouldn't be updated directly
      const { _id, createdAt, ...fieldsToUpdate } = updateData
      
      const result = await db.collection('registrations').updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: {
            ...fieldsToUpdate,
            updatedAt: new Date()
          }
        }
      )

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Registration not found' })
      }

      console.log(`Registration ${id} updated successfully`)
      res.json({ 
        success: true, 
        message: 'Registration updated successfully',
        modifiedCount: result.modifiedCount
      })

    } else if (req.method === 'DELETE') {
      // Delete registration
      const result = await db.collection('registrations').deleteOne(
        { _id: new ObjectId(id) }
      )

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Registration not found' })
      }

      console.log(`Registration ${id} deleted successfully`)
      res.json({ 
        success: true, 
        message: 'Registration deleted successfully',
        deletedCount: result.deletedCount
      })

    } else {
      return res.status(405).json({ error: 'Method not allowed' })
    }

  } catch (error) {
    console.error('Admin registration operation error:', error)
    res.status(500).json({ 
      error: 'Operation failed',
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
