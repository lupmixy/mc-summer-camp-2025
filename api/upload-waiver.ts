import { IncomingForm } from 'formidable'
import { MongoClient, ObjectId } from 'mongodb'
import fs from 'fs'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const MONGODB_URI = process.env.MONGODB_URI!

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Validate environment
  if (!MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not set')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  let client: MongoClient | null = null

  try {
    console.log('Starting waiver upload process...')
    
    // Ensure temp directory exists
    const tmpDir = '/tmp'
    if (!fs.existsSync(tmpDir)) {
      console.log('Creating tmp directory...')
      fs.mkdirSync(tmpDir, { recursive: true })
    }
    
    const form = new IncomingForm({
      uploadDir: tmpDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    })

    console.log('Parsing form data...')
    const [fields, files] = await form.parse(req)
    console.log('Form parsed successfully:', { fields: Object.keys(fields), files: Object.keys(files) })
    
    const registrationId = Array.isArray(fields.registrationId) ? fields.registrationId[0] : fields.registrationId
    const playerName = Array.isArray(fields.playerName) ? fields.playerName[0] : fields.playerName
    
    console.log('Extracted data:', { registrationId, playerName })
    
    if (!registrationId || !playerName) {
      console.error('Missing required fields:', { registrationId, playerName })
      return res.status(400).json({ error: 'Registration ID and player name are required' })
    }

    const uploadedFile = Array.isArray(files.waiver) ? files.waiver[0] : files.waiver
    
    if (!uploadedFile) {
      console.error('No file uploaded')
      return res.status(400).json({ error: 'No waiver file uploaded' })
    }

    console.log('File details:', {
      mimetype: uploadedFile.mimetype,
      size: uploadedFile.size,
      originalFilename: uploadedFile.originalFilename,
      filepath: uploadedFile.filepath
    })

    // Validate file type
    if (!uploadedFile.mimetype || !uploadedFile.mimetype.includes('pdf')) {
      console.error('Invalid file type:', uploadedFile.mimetype)
      return res.status(400).json({ error: 'Only PDF files are allowed' })
    }

    // Read the file
    console.log('Reading file from:', uploadedFile.filepath)
    const fileBuffer = fs.readFileSync(uploadedFile.filepath)
    console.log('File read successfully, size:', fileBuffer.length)
    
    // Connect to MongoDB with proper SSL configuration
    console.log('Connecting to MongoDB...')
    client = new MongoClient(MONGODB_URI, {
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
    })
    
    await client.connect()
    console.log('Connected to MongoDB')
    const db = client.db('mc-soccer-camp')
    
    // Store the file data
    console.log('Storing waiver data in MongoDB...')
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
    console.log('Waiver document inserted with ID:', result.insertedId)
    
    // Update registration record to indicate waiver received
    console.log('Updating registration record...')
    const updateResult = await db.collection('registrations').updateOne(
      { _id: new ObjectId(registrationId) },
      { 
        $set: { 
          waiverUploaded: true,
          waiverUploadDate: new Date(),
          waiverDocumentId: result.insertedId
        }
      }
    )
    console.log('Registration update result:', { matchedCount: updateResult.matchedCount, modifiedCount: updateResult.modifiedCount })
    
    // Clean up temp file
    try {
      fs.unlinkSync(uploadedFile.filepath)
      console.log('Temp file cleaned up successfully')
    } catch (err) {
      console.log('Failed to clean up temp file:', err)
    }
    
    console.log('Waiver upload completed successfully')
    res.status(200).json({ 
      success: true, 
      message: 'Waiver uploaded successfully',
      waiverDocumentId: result.insertedId
    })
    
  } catch (error) {
    console.error('Waiver upload error:', error)
    console.error('Error stack:', error?.stack)
    res.status(500).json({ 
      error: 'Failed to upload waiver',
      details: error?.message || 'Unknown error'
    })
  } finally {
    if (client) {
      try {
        await client.close()
        console.log('MongoDB connection closed')
      } catch (err) {
        console.log('Failed to close MongoDB connection:', err)
      }
    }
  }
}
