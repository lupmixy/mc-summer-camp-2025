import { VercelRequest, VercelResponse } from '@vercel/node'
import { MongoClient } from 'mongodb'
import nodemailer from 'nodemailer'

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

async function sendContactNotification(contactData: {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto; 
        }
        .container { 
          background: #ffffff; 
          border-radius: 8px; 
          overflow: hidden; 
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #003087, #001f5c); 
          color: white; 
          padding: 30px; 
          text-align: center;
        }
        .header h1 { 
          margin: 0; 
          font-size: 24px;
        }
        .header .subtitle { 
          color: #C5B358; 
          font-size: 16px; 
          margin-top: 5px;
        }
        .content { 
          padding: 30px; 
        }
        .contact-box { 
          background: #f8f9fa; 
          border-left: 4px solid #C5B358; 
          padding: 20px; 
          margin: 20px 0; 
          border-radius: 0 8px 8px 0;
        }
        .contact-box h3 { 
          color: #003087; 
          margin-top: 0; 
          font-size: 18px;
        }
        .contact-box p { 
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
          width: 60px;
          height: 60px;
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
          <h1>New Contact Form Submission</h1>
          <div class="subtitle">MC Girls Soccer Camp</div>
        </div>
        
        <div class="content">
          <p>You have received a new contact form submission:</p>
          
          <div class="contact-box">
            <h3>📩 Contact Details</h3>
            <p><strong>Name:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> ${contactData.email}</p>
            <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${contactData.subject}</p>
          </div>

          <div class="contact-box">
            <h3>💬 Message</h3>
            <p>${contactData.message}</p>
          </div>
          
          <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-US', {
            timeZone: 'America/New_York',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
        
        <div class="footer">
          <p><strong>Coach Michael Colombo</strong></p>
          <p>📧 <a href="mailto:michael@mcolombo.com">michael@mcolombo.com</a></p>
          <p>🏟️ Donovan Field, Malden Catholic High School</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    const info = await transporter.sendMail({
      from: '"Colombo Soccer Camp" <michael@mcolombo.com>',
      to: 'michael@mcolombo.com',
      bcc: 'michael@mcolombo.com',
      subject: `New Contact Form: ${contactData.subject}`,
      html: html
    })

    console.log('Contact notification email sent successfully:', info.messageId)
    return info
  } catch (error) {
    console.error('Error sending contact notification email:', error)
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
    const contactData = req.body
    console.log('Contact form submission received:', JSON.stringify(contactData, null, 2))

    // Validate required fields
    const requiredFields = {
      name: contactData.name,
      email: contactData.email,
      subject: contactData.subject,
      message: contactData.message
    }

    console.log('Checking required fields:', JSON.stringify(requiredFields, null, 2))

    const missingFields = Object.entries(requiredFields)
      .filter(([, value]) => !value || value.trim() === '')
      .map(([key]) => key)

    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields)
      return res.status(400).json({ 
        error: 'Missing required fields', 
        missingFields,
        receivedData: contactData 
      })
    }

    // Connect to MongoDB
    console.log('Attempting to connect to MongoDB...')
    client = await connectToMongoDB()
    const db = client.db('mc-soccer-camps')
    console.log('MongoDB connection successful')

    // Save contact submission
    const submissionData = {
      ...contactData,
      createdAt: new Date(),
      status: 'new'
    }

    console.log('Saving contact submission:', submissionData)

    const result = await db.collection('contact-submissions').insertOne(submissionData)

    console.log('Contact submission saved with ID:', result.insertedId)

    // Send notification email
    await sendContactNotification(contactData)

    console.log('Contact notification email sent successfully')

    res.json({ 
      success: true, 
      message: 'Contact form submitted successfully',
      submissionId: result.insertedId 
    })

  } catch (error) {
    console.error('Contact form error:', error)
    res.status(500).json({ 
      error: 'Contact form submission failed',
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
