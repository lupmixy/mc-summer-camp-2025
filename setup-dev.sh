#!/bin/bash

# Development environment setup for MC Girls Soccer Camp

echo "🔧 Setting up development environment..."

# Check if .env files exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local and add your actual environment variables"
fi

echo "📦 Installing dependencies..."
npm install

echo "🏗️  Building application..."
npm run build

echo "✅ Development environment ready!"
echo ""
echo "🚀 To start development:"
echo "   npm run dev"
echo ""
echo "📋 Don't forget to:"
echo "1. Set up your MongoDB database"
echo "2. Configure your Stripe keys"
echo "3. Set up your SMTP email settings"
echo "4. Update environment variables in .env.local and client/.env.local"
