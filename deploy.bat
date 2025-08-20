@echo off
echo 🚀 Starting deployment process...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

REM Install backend dependencies
echo 📦 Installing backend dependencies...
call npm install

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd client
call npm install
cd ..

REM Build the React app
echo 🔨 Building React application...
call npm run build

REM Check if build was successful
if not exist "client\build" (
    echo ❌ Error: Build failed. client\build directory not found.
    pause
    exit /b 1
)

echo ✅ Build completed successfully!
echo.
echo 📁 Build output: client\build\
echo.
echo 🚀 Next steps for GitHub Pages deployment:
echo 1. Push the client\build folder to your GitHub repository
echo 2. Enable GitHub Pages in repository settings
echo 3. Set source to /root or /docs folder
echo.
echo 💡 For full-stack deployment:
echo 1. Deploy backend to a hosting service (Heroku, Railway, etc.)
echo 2. Update API base URL in frontend components
echo 3. Deploy frontend to GitHub Pages
echo.
echo 🎉 Deployment script completed!
pause
