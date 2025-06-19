# MC Girls Soccer Camp Registration Website

A modern, responsive website for girls soccer camp registration featuring:

- **Program Information**: Youth (ages 8-14) and High School (grades 8-12) programs
- **Online Registration**: Complete registration form with validation
- **Payment Processing**: Secure Stripe integration
- **Email Confirmations**: Automated confirmation emails
- **Photo Gallery**: Showcase camp photos and activities
- **MongoDB Database**: Secure registration data storage

## Architecture

This project is built for deployment on Vercel with:

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Vercel Serverless Functions (API routes)
- **Database**: MongoDB
- **Payments**: Stripe
- **Email**: Nodemailer with SMTP

## Project Structure

```
/
├── api/                     # Vercel serverless functions
│   ├── create-payment-intent.ts
│   ├── register.ts
│   ├── media.ts
│   └── package.json
├── client/                  # React frontend
│   ├── public/
│   │   ├── branding/       # Logo and brand assets
│   │   ├── images/hero/    # Hero section images
│   │   └── media/gallery/  # Gallery images
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utility functions
│   └── package.json
├── vercel.json             # Vercel deployment configuration
└── package.json            # Root package.json
```

## API Endpoints

- `POST /api/register` - Submit registration data
- `POST /api/create-payment-intent` - Create Stripe payment intent
- `GET /api/media` - Get gallery images

## Environment Variables

### Required for Production (Vercel)

```bash
MONGODB_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=sk_live_...
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
```

### Required for Client (Vercel)

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## Development Setup

1. **Clone and install dependencies:**
   ```bash
   npm run install-all
   ```

2. **Set up environment variables:**
   ```bash
   # Copy and configure environment files
   cp .env.example .env.local
   cp client/.env.local.example client/.env.local
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## Deployment to Vercel

1. **Connect GitHub repository to Vercel**

2. **Configure environment variables in Vercel dashboard:**
   - Add all production environment variables
   - Ensure `VITE_STRIPE_PUBLISHABLE_KEY` is set for the client

3. **Deploy:**
   - Vercel will automatically build and deploy on push to main branch
   - Build command: `cd client && npm run build`
   - Output directory: `client/dist`

## Key Features

### Registration Flow
1. User selects program (Youth or High School)
2. Fills out comprehensive registration form
3. Provides payment information via Stripe
4. Receives confirmation email
5. Registration stored in MongoDB

### Payment Processing
- Secure Stripe integration with payment intents
- Support for cards, Apple Pay, Google Pay
- Real-time payment validation

### Email Confirmations
- Automated confirmation emails with camp details
- Custom email templates with branding
- BCC to camp organizers

### Gallery
- Dynamic photo gallery
- Responsive grid layout
- Touch/swipe support for mobile

## Security Features

- Environment variables for sensitive data
- Secure MongoDB connections
- PCI compliant payment processing via Stripe
- Input validation and sanitization
- CORS configuration

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Payment**: Stripe Elements, Payment Intents API
- **Database**: MongoDB with native driver
- **Email**: Nodemailer with SMTP
- **Deployment**: Vercel with serverless functions
- **Build**: Vite with TypeScript compilation

## Support

For questions or issues, contact: mcgirlssoccer12@gmail.com
