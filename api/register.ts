import { VercelRequest, VercelResponse } from '@vercel/node'
import { MongoClient } from 'mongodb'
import nodemailer from 'nodemailer'

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mc-soccer-camps'
const client = new MongoClient(uri)

// Email configuration
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  debug: true,
})

type Program = 'youth' | 'highschool'

type CampDetails = {
  [K in Program]: {
    dates: string
    time: string
  }
} & {
  location: string
}

const CAMP_DETAILS: CampDetails = {
  youth: {
    dates: 'July 28-31, 2025',
    time: '8:00 AM - 12:00 PM'
  },
  highschool: {
    dates: 'July 28-31, 2025',
    time: '8:00 AM - 12:00 PM'
  },
  location: 'Brother Gilbert Stadium (Donovan Field), Malden Catholic High School, 99 Crystal Street, Malden, MA 02148'
}

async function sendConfirmationEmail(params: {
  to: string
  playerName: string
  parentName: string
  program: Program
}) {
  const { to, playerName, parentName, program } = params
  const campInfo = CAMP_DETAILS[program]

  const html = `
    <h1>MC Girls Soccer Camp Registration Confirmation</h1>
    <p>Dear ${parentName},</p>
    <p>Thank you for registering ${playerName} for the ${program} program at MC Girls Soccer Camp!</p>
    
    <h2>Camp Details:</h2>
    <ul>
      <li><strong>Dates:</strong> ${campInfo.dates}</li>
      <li><strong>Time:</strong> ${campInfo.time}</li>
      <li><strong>Location:</strong> ${CAMP_DETAILS.location}</li>
    </ul>

    <h2>What to Bring:</h2>
    <ul>
      <li>Soccer cleats and shin guards</li>
      <li>Water bottle</li>
      <li>Sunscreen</li>
      <li>Light snack</li>
    </ul>

    <p>We're excited to have ${playerName} join us this summer! You will receive additional information about training groups and detailed schedule closer to the camp date.</p>
    
    <p>If you have any questions, please contact us at mcgirlssoccer12@gmail.com</p>
    
    <p>Best regards,<br>MC Girls Soccer Camp Team</p>
  `

  try {
    const info = await transporter.sendMail({
      from: '"MC Girls Soccer Camp" <mcgirlssoccer12@gmail.com>',
      to: to,
      bcc: 'michael@mcolombo.com',
      subject: 'MC Girls Soccer Camp Registration Confirmation',
      html: html
    })

    console.log('Email sent successfully:', info.messageId)
    return info
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const registration = req.body
    console.log('Registration request received:', JSON.stringify(registration, null, 2))

    // Validate required fields
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

    // Connect to MongoDB
    console.log('Attempting to connect to MongoDB...')
    await client.connect()
    const db = client.db('mc-soccer-camps')
    console.log('MongoDB connection successful')

    // Save registration with combined names
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

    // Send confirmation email
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
  } finally {
    await client.close()
  }
}
