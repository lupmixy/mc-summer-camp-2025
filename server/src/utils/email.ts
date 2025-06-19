import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

type Program = 'youth' | 'highschool'

type EmailParams = {
  to: string
  playerName: string
  parentName: string
  program: Program
}

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

export async function sendConfirmationEmail(params: EmailParams) {
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