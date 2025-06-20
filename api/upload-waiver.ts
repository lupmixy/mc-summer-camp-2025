import { IncomingForm } from 'formidable'
import { MongoClient, ObjectId } from 'mongodb'
import fs from 'fs'

const MONGODB_URI = process.env.MONGODB_URI!

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const client = new MongoClient(MONGODB_URI)

  try {
    const form = new IncomingForm({
      uploadDir: '/tmp',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    })

    const [fields, files] = await form.parse(req)
    
    const registrationId = Array.isArray(fields.registrationId) ? fields.registrationId[0] : fields.registrationId
    const playerName = Array.isArray(fields.playerName) ? fields.playerName[0] : fields.playerName
    
    if (!registrationId || !playerName) {
      return res.status(400).json({ error: 'Registration ID and player name are required' })
    }

    const uploadedFile = Array.isArray(files.waiver) ? files.waiver[0] : files.waiver
    
    if (!uploadedFile) {
      return res.status(400).json({ error: 'No waiver file uploaded' })
    }

    // Validate file type
    if (!uploadedFile.mimetype || !uploadedFile.mimetype.includes('pdf')) {
      return res.status(400).json({ error: 'Only PDF files are allowed' })
    }

    // Read the file
    const fileBuffer = fs.readFileSync(uploadedFile.filepath)
    
    // Connect to MongoDB
    await client.connect()
    const db = client.db('mc-soccer-camp')
    
    // Store the file data
    const waiverData = {
      registrationId,
      playerName,
      filename: uploadedFile.originalFilename || 'waiver.pdf',
      contentType: uploadedFile.mimetype || 'application/pdf',
      size: uploadedFile.size,
      uploadDate: new Date(),
      fileData: fileBuffer.toString('base64')
    }
    
    // Insert waiver record
    const result = await db.collection('waivers').insertOne(waiverData)
    
    // Update registration record to indicate waiver received
    await db.collection('registrations').updateOne(
      { _id: new ObjectId(registrationId) },
      { 
        $set: { 
          waiverUploaded: true,
          waiverUploadDate: new Date(),
          waiverDocumentId: result.insertedId
        }
      }
    )
    
    // Clean up temp file
    try {
      fs.unlinkSync(uploadedFile.filepath)
    } catch (err) {
      console.log('Failed to clean up temp file:', err)
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Waiver uploaded successfully',
      waiverDocumentId: result.insertedId
    })
    
  } catch (error) {
    console.error('Waiver upload error:', error)
    res.status(500).json({ 
      error: 'Failed to upload waiver',
      details: error?.message || 'Unknown error'
    })
  } finally {
    try {
      await client.close()
    } catch (err) {
      console.log('Failed to close MongoDB connection:', err)
    }
  }
}
