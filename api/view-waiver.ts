import { MongoClient, ObjectId } from 'mongodb'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const MONGODB_URI = process.env.MONGODB_URI!

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { registrationId, adminKey } = req.query

  // Validate admin key
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!registrationId) {
    return res.status(400).json({ error: 'Registration ID is required' })
  }

  if (!ObjectId.isValid(registrationId as string)) {
    return res.status(400).json({ error: 'Invalid registration ID format' })
  }

  let client: MongoClient | null = null

  try {
    console.log('Fetching waiver for registration:', registrationId)
    
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI, {
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
    })
    
    await client.connect()
    const db = client.db('mc-soccer-camp')
    
    // Find the waiver document
    const waiver = await db.collection('waivers').findOne({
      registrationId: registrationId as string
    })
    
    if (!waiver) {
      return res.status(404).json({ error: 'Waiver not found' })
    }

    console.log('Found waiver:', {
      filename: waiver.filename,
      contentType: waiver.contentType,
      size: waiver.size,
      uploadDate: waiver.uploadDate
    })

    // Decode the base64 file data
    const fileBuffer = Buffer.from(waiver.fileData, 'base64')
    
    // Set appropriate headers
    res.setHeader('Content-Type', waiver.contentType || 'application/pdf')
    res.setHeader('Content-Disposition', `inline; filename="${waiver.filename || 'waiver.pdf'}"`)
    res.setHeader('Content-Length', fileBuffer.length)
    
    // Send the file
    res.send(fileBuffer)
    
  } catch (error) {
    console.error('Error fetching waiver:', error)
    res.status(500).json({ 
      error: 'Failed to fetch waiver',
      details: error?.message || 'Unknown error'
    })
  } finally {
    if (client) {
      try {
        await client.close()
      } catch (err) {
        console.log('Failed to close MongoDB connection:', err)
      }
    }
  }
}
