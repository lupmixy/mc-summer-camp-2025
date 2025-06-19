#!/bin/bash

# Build and deployment test script for MC Girls Soccer Camp

echo "🏗️  Building MC Girls Soccer Camp..."

# Test client build
echo "📦 Building client..."
cd client
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Client build successful!"
else
    echo "❌ Client build failed!"
    exit 1
fi

cd ..

echo "🎉 Build completed successfully!"
echo ""
echo "📋 Next steps for deployment:"
echo "1. Create a new repository on GitHub"
echo "2. Push this code to the repository:"
echo "   git remote add origin <your-github-repo-url>"
echo "   git push -u origin main"
echo "3. Connect the repository to Vercel"
echo "4. Configure environment variables in Vercel:"
echo "   - MONGODB_URI"
echo "   - STRIPE_SECRET_KEY"
echo "   - VITE_STRIPE_PUBLISHABLE_KEY"
echo "   - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS"
echo "5. Deploy!"
echo ""
echo "🌐 Your site will be live at: https://your-project-name.vercel.app"
