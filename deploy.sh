#!/bin/bash

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client && npm install && cd ..

# Build the React app
echo "🔨 Building React application..."
npm run build

# Check if build was successful
if [ ! -d "client/build" ]; then
    echo "❌ Error: Build failed. client/build directory not found."
    exit 1
fi

echo "✅ Build completed successfully!"
echo ""
echo "📁 Build output: client/build/"
echo ""
echo "🚀 Next steps for GitHub Pages deployment:"
echo "1. Push the client/build folder to your GitHub repository"
echo "2. Enable GitHub Pages in repository settings"
echo "3. Set source to /root or /docs folder"
echo ""
echo "💡 For full-stack deployment:"
echo "1. Deploy backend to a hosting service (Heroku, Railway, etc.)"
echo "2. Update API base URL in frontend components"
echo "3. Deploy frontend to GitHub Pages"
echo ""
echo "🎉 Deployment script completed!"
