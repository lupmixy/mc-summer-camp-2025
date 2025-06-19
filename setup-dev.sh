#!/bin/bash

# Development environment setup for MC Girls Soccer Camp

echo "🔧 Setting up development environment..."

# Check if .env files exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local and add your actual environment variables"
fi

if [ ! -f "client/.env.local" ]; then
    echo "📝 Creating client/.env.local from template..."
    cp client/.env.local.example client/.env.local
    echo "⚠️  Please edit client/.env.local and add your Stripe publishable key"
fi

echo "📦 Installing dependencies..."
npm run install-all

echo "🏗️  Building client..."
cd client && npm run build && cd ..

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
