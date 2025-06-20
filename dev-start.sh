#!/bin/bash

echo "🚀 Starting MC Girls Soccer Camp Development Server..."

# Check if .env.local files are configured
if grep -q "your_" .env.local 2>/dev/null; then
    echo "⚠️  WARNING: Please configure your environment variables in .env.local"
    echo "   You need to set up:"
    echo "   - MongoDB URI (local or MongoDB Atlas)"
    echo "   - Stripe TEST keys"
    echo "   - SMTP email settings"
    echo ""
fi

if grep -q "your_" .env.local 2>/dev/null; then
    echo "⚠️  WARNING: Please configure .env.local with your environment variables"
    echo ""
fi

echo "📋 For full functionality, you'll need:"
echo "1. 🗄️  MongoDB running (local or cloud)"
echo "2. 🔑 Stripe TEST account keys"
echo "3. 📧 SMTP email settings"
echo "4. 🌐 Run with Vercel CLI for API routes"
echo ""

echo "🔧 Starting Vercel development server..."
echo "This will serve both the client and API routes locally"
echo ""

# Use Vercel dev to run both client and API
vercel dev
