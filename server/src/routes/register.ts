import express, { Request, Response, Router } from 'express'
import { connectDB } from '../utils/db'
import { sendConfirmationEmail } from '../utils/email'

// Create router instance with proper typing
const router: Router = express.Router()

router.post('/register', async (req: Request, res: Response) => {
  try {
    const registration = req.body
    console.log('Registration request received:', JSON.stringify(registration, null, 2))

    // Validate required fields with detailed logging
    const requiredFields = {
      email: registration.email,
      playerFirstName: registration.playerFirstName,
      playerLastName: registration.playerLastName,
      program: registration.program,
      parentFirstName: registration.parentFirstName,
      parentLastName: registration.parentLastName,
      phone: registration.phone,
      emergencyContact: registration.emergencyContact,
      emergencyPhone: registration.emergencyPhone,
      shirtSize: registration.shirtSize
    }

    console.log('Checking required fields:', JSON.stringify(requiredFields, null, 2))

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key)

    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields)
      return res.status(400).json({ 
        error: 'Missing required fields', 
        missingFields,
        receivedData: registration 
      })
    }

    // Log MongoDB connection attempt
    console.log('Attempting to connect to MongoDB...')
    const db = await connectDB()
    console.log('MongoDB connection successful')

    // Log email configuration
    console.log('Email configuration:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      // Don't log the actual password
      hasPassword: !!process.env.SMTP_PASS
    })

    // Connect to MongoDB and save registration with combined names
    const registrationData = {
      ...registration,
      playerName: `${registration.playerFirstName} ${registration.playerLastName}`,
      parentName: `${registration.parentFirstName} ${registration.parentLastName}`,
      createdAt: new Date(),
      status: 'confirmed'
    }

    console.log('Saving registration data:', registrationData)

    const result = await db.collection('registrations').insertOne(registrationData)

    console.log('Registration saved with ID:', result.insertedId)

    // Send confirmation email with combined names
    await sendConfirmationEmail({
      to: registration.email,
      playerName: `${registration.playerFirstName} ${registration.playerLastName}`,
      parentName: `${registration.parentFirstName} ${registration.parentLastName}`,
      program: registration.program
    })

    console.log('Confirmation email sent successfully')

    res.json({ 
      success: true, 
      message: 'Registration successful',
      registrationId: result.insertedId 
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ 
      error: 'Registration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

export default router