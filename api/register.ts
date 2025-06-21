import { VercelRequest, VercelResponse } from '@vercel/node'
import { MongoClient } from 'mongodb'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mc-soccer-camps'

async function connectToMongoDB() {
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 0,
    maxPoolSize: 1,
    retryWrites: true,
    w: 'majority'
  })
  
  await client.connect()
  return client
}

// Email configuration
const transporter = nodemailer.createTransport({
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
    dates: 'August 4-7, 2025',
    time: '8:00 AM - 12:00 PM'
  },
  highschool: {
    dates: 'August 4-7, 2025',
    time: '8:00 AM - 12:00 PM'
  },
  location: 'Brother Gilbert Stadium (Donovan Field), Malden Catholic High School, 99 Crystal Street, Malden, MA 02148'
}

async function sendConfirmationEmail(params: {
  to: string
  playerName: string
  parentName: string
  program: Program
  registrationId: string
}) {
  const { to, playerName, parentName, program, registrationId } = params
  const campInfo = CAMP_DETAILS[program]
  const programName = program === 'youth' ? 'Youth Program (Ages 8-14)' : 'High School Program (Grades 8-12)'

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>MC Girls Soccer Camp Registration Confirmation</title>
      <style>
        body { 
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
          line-height: 1.6; 
          margin: 0; 
          padding: 0; 
          background-color: #f5f5f5;
        }
        .container { 
          max-width: 600px; 
          margin: 20px auto; 
          background: white; 
          border-radius: 12px; 
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #003087, #002066); 
          color: white; 
          padding: 30px 20px; 
          text-align: center; 
        }
        .header h1 { 
          margin: 0; 
          font-size: 28px; 
          font-weight: bold;
        }
        .header .subtitle { 
          color: #C5B358; 
          font-size: 16px; 
          margin-top: 5px;
        }
        .content { 
          padding: 30px; 
        }
        .welcome { 
          color: #003087; 
          font-size: 18px; 
          margin-bottom: 20px;
        }
        .details-box { 
          background: #f8f9fa; 
          border-left: 4px solid #C5B358; 
          padding: 20px; 
          margin: 20px 0; 
          border-radius: 0 8px 8px 0;
        }
        .details-box h3 { 
          color: #003087; 
          margin-top: 0; 
          font-size: 18px;
        }
        .details-box ul { 
          margin: 10px 0; 
          padding-left: 20px;
        }
        .details-box li { 
          margin: 8px 0; 
          color: #333;
        }
        .highlight { 
          color: #C5B358; 
          font-weight: bold;
        }
        .footer { 
          background: #003087; 
          color: white; 
          padding: 20px; 
          text-align: center; 
          font-size: 14px;
        }
        .footer a { 
          color: #C5B358; 
          text-decoration: none;
        }
        .logo-placeholder {
          width: 80px;
          height: 80px;
          background: #C5B358;
          border-radius: 50%;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 24px;
          color: #003087;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo-placeholder">MC</div>
          <h1>Registration Confirmed!</h1>
          <div class="subtitle">MC Girls Soccer Camp</div>
        </div>
        
        <div class="content">
          <div class="welcome">
            Dear <span class="highlight">${parentName}</span>,
          </div>
          
          <p>Thank you for registering <strong>${playerName}</strong> for the <span class="highlight">${programName}</span> at MC Girls Soccer Camp!</p>
          
          <div class="details-box">
            <h3>📅 Camp Details</h3>
            <ul>
              <li><strong>Dates:</strong> ${campInfo.dates}</li>
              <li><strong>Time:</strong> ${campInfo.time} daily</li>
              <li><strong>Location:</strong> ${CAMP_DETAILS.location}</li>
            </ul>
          </div>

          <div class="details-box">
            <h3>⚽ What to Bring</h3>
            <ul>
              <li>Soccer cleats and shin guards</li>
              <li>Water bottle (stay hydrated!)</li>
              <li>Sunscreen</li>
              <li>Light snack</li>
              <li>Positive attitude and ready to learn!</li>
            </ul>
          </div>

          <div class="details-box">
            <h3>📄 Important: Waiver Form Required</h3>
            <p style="margin-bottom: 15px;">A signed waiver form is required before camp begins. We've attached the waiver form to this email as a PDF and provided multiple ways to submit it:</p>
            <div style="background: #f0f9ff; border: 1px solid #0284c7; border-radius: 6px; padding: 15px; margin: 15px 0;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #0284c7;">📎 Waiver form attached to this email (PDF)</p>
              <p style="margin: 0; font-size: 14px; color: #374151;">Print the attached PDF and complete it with signatures</p>
            </div>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NODE_ENV === 'production' ? 'https://mc-soccer.com' : 'http://localhost:3000'}/waiver-submission?registrationId=${registrationId}&playerName=${encodeURIComponent(playerName)}" 
                 style="display: inline-block; background: linear-gradient(135deg, #C5B358, #B8A147); color: #003087; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                📄 Submit Waiver Form Online
              </a>
            </div>
            <p style="font-size: 14px; color: #666; text-align: center;">
              <strong>Two ways to submit:</strong><br>
              • Use the button above to upload your signed PDF online<br>
              • Bring the completed form on the first day of camp
            </p>
          </div>

          <p>We're excited to have <strong>${playerName}</strong> join us this summer! You will receive additional information about training groups and detailed schedule closer to the camp date.</p>
          
          <p>If you have any questions, please don't hesitate to contact us.</p>
        </div>
        
        <div class="footer">
          <p><strong>MC Girls Soccer Camp Team</strong></p>
          <p>📧 <a href="mailto:mcgirlssoccer12@gmail.com">mcgirlssoccer12@gmail.com</a></p>
          <p>🏟️ Brother Gilbert Stadium, Malden Catholic High School</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    // Use static PDF waiver attachment
    interface Attachment {
      filename: string
      content: Buffer
      contentType: string
    }
    
    let waiverAttachment: Attachment | null = null
    try {
      const waiverPdfPath = path.join(process.cwd(), 'public', 'documents', 'MC_Girls_Soccer_Camp_Waiver_2025.pdf')
      const pdfBuffer = fs.readFileSync(waiverPdfPath)
      
      waiverAttachment = {
        filename: 'MC_Girls_Soccer_Camp_Waiver_2025.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
      console.log('PDF waiver attached successfully')
    } catch (fileError) {
      console.warn('Could not read static PDF waiver for attachment:', fileError)
    }

    const mailOptions = {
      from: '"MC Girls Soccer Camp" <mcgirlssoccer12@gmail.com>',
      to: to,
      bcc: 'michael@mcolombo.com',
      subject: 'MC Girls Soccer Camp Registration Confirmation',
      html: html,
      attachments: waiverAttachment ? [waiverAttachment] : []
    }

    const info = await transporter.sendMail(mailOptions)

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

  let client: MongoClient | null = null

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
      .filter(([, value]) => !value)
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
    client = await connectToMongoDB()
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
      program: registration.program,
      registrationId: result.insertedId.toString()
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
    // Close MongoDB connection if it was established
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
