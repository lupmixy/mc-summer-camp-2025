#!/bin/bash

echo "🔧 Setting up MC Girls Soccer Camp for Production-Like Development"
echo ""

# Check if environment files exist and have been configured
echo "📋 Environment Configuration Checklist:"
echo ""

echo "1. 🗄️  MongoDB Configuration:"
if grep -q "mongodb://127.0.0.1" .env.local 2>/dev/null; then
    echo "   ⚠️  Currently set to local MongoDB"
    echo "   📝 For production-like dev, consider using MongoDB Atlas:"
    echo "      - Create free cluster at https://cloud.mongodb.com"
    echo "      - Get connection string"
    echo "      - Update MONGODB_URI in .env.local"
elif grep -q "your_mongodb" .env.local 2>/dev/null; then
    echo "   ❌ MongoDB URI not configured"
    echo "   📝 Set up MongoDB Atlas free tier or local MongoDB"
else
    echo "   ✅ MongoDB appears to be configured"
fi

echo ""
echo "2. 💳 Stripe Configuration:"
if grep -q "your_stripe" .env.local 2>/dev/null || grep -q "your_stripe" client/.env.local 2>/dev/null; then
    echo "   ❌ Stripe keys not configured"
    echo "   📝 Get TEST keys from https://dashboard.stripe.com/test/apikeys"
    echo "      - Update STRIPE_SECRET_KEY in .env.local"
    echo "      - Update VITE_STRIPE_PUBLISHABLE_KEY in client/.env.local"
else
    echo "   ✅ Stripe keys appear to be configured"
fi

echo ""
echo "3. 📧 Email Configuration:"
if grep -q "your-email" .env.local 2>/dev/null; then
    echo "   ❌ Email settings not configured"
    echo "   📝 For Gmail setup:"
    echo "      - Enable 2FA on your Gmail account"
    echo "      - Generate App Password: https://myaccount.google.com/apppasswords"
    echo "      - Update SMTP_USER and SMTP_PASS in .env.local"
else
    echo "   ✅ Email settings appear to be configured"
fi

echo ""
echo "🚀 Ready to start development?"
echo ""
echo "Commands:"
echo "  npm run dev          - Full production-like development with API"
echo "  npm run dev-client   - Client-only (for UI testing)"
echo "  npm run build        - Test production build"
echo ""
echo "For full functionality, make sure all environment variables above are configured!"
