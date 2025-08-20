# 🚀 Deployment Guide - Clocking Out Application

This guide covers deploying your Clocking Out application to various platforms, with special focus on GitHub Pages.

## 📋 Prerequisites

- Node.js 16+ installed
- Git repository set up
- npm or yarn package manager

## 🏠 Local Development Setup

### 1. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..
```

### 2. Start Development Server
```bash
# Start both frontend and backend
npm run dev

# Or start separately:
npm start          # Backend on port 5000
npm run client     # Frontend on port 3000
```

### 3. Test the Application
```bash
# Test API endpoints
npm test

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

## 🌐 GitHub Pages Deployment (Frontend Only)

### Option 1: Deploy Build Folder to Root

1. **Build the React App**
   ```bash
   npm run build
   ```

2. **Copy Build Contents to Root**
   ```bash
   # Copy all files from client/build to root
   cp -r client/build/* .
   
   # Or on Windows:
   xcopy client\build\* . /E /I
   ```

3. **Commit and Push**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

4. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
   - Click Save

### Option 2: Deploy to /docs Folder

1. **Build the React App**
   ```bash
   npm run build
   ```

2. **Rename Build Folder**
   ```bash
   mv client/build docs
   ```

3. **Commit and Push**
   ```bash
   git add docs/
   git commit -m "Deploy to GitHub Pages docs folder"
   git push origin main
   ```

4. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: /docs
   - Click Save

## 🖥️ Full-Stack Deployment

### Backend Deployment Options

#### 1. Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add buildpack for Node.js
heroku buildpacks:set heroku/nodejs

# Deploy
git push heroku main

# Open app
heroku open
```

#### 2. Railway
- Connect your GitHub repository
- Railway will auto-detect Node.js
- Set environment variables if needed
- Deploy automatically on push

#### 3. Render
- Connect your GitHub repository
- Choose Node.js service
- Set build command: `npm install && npm run build`
- Set start command: `npm start`

### Frontend Configuration for Deployed Backend

1. **Update API Base URL**
   ```javascript
   // In your React components, replace:
   fetch('/api/...')
   
   // With your deployed backend URL:
   fetch('https://your-backend.herokuapp.com/api/...')
   ```

2. **Environment Variables** (Recommended)
   ```javascript
   // Create .env file in client folder
   REACT_APP_API_URL=https://your-backend.herokuapp.com
   
   // Use in components:
   fetch(`${process.env.REACT_APP_API_URL}/api/...`)
   ```

3. **Build and Deploy Frontend**
   ```bash
   npm run build
   # Deploy client/build folder to GitHub Pages
   ```

## 🔧 Production Configuration

### Environment Variables
```bash
# Backend (.env)
NODE_ENV=production
PORT=5000

# Frontend (client/.env)
REACT_APP_API_URL=https://your-backend-url.com
```

### Database Configuration
- SQLite is fine for small to medium applications
- For production, consider PostgreSQL or MySQL
- Update database connection in `server.js`

### Security Considerations
- Enable HTTPS in production
- Set up proper CORS configuration
- Add rate limiting
- Implement proper authentication

## 📱 Mobile Deployment

### Progressive Web App (PWA)
1. **Add PWA manifest** in `client/public/manifest.json`
2. **Register service worker** in `client/src/index.js`
3. **Test on mobile devices**

### Native App Wrappers
- **Capacitor**: Convert to iOS/Android apps
- **Electron**: Desktop application wrapper

## 🧪 Testing Deployment

### 1. Test API Endpoints
```bash
# Test your deployed backend
curl https://your-backend.herokuapp.com/api/admin/overview
```

### 2. Test Frontend
- Open your GitHub Pages URL
- Test login functionality
- Test all user interactions
- Check mobile responsiveness

### 3. Common Issues
- **CORS errors**: Update CORS configuration in backend
- **API 404**: Check API base URL in frontend
- **Build errors**: Verify Node.js version and dependencies

## 📊 Monitoring and Maintenance

### 1. Logs
- Monitor backend logs for errors
- Set up error tracking (Sentry, LogRocket)

### 2. Performance
- Use Lighthouse for performance audits
- Monitor API response times
- Optimize database queries

### 3. Updates
- Regular dependency updates
- Security patches
- Feature additions

## 🆘 Troubleshooting

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 16+
```

### Deployment Issues
- Verify GitHub Pages is enabled
- Check build output in Actions tab
- Ensure build folder contains index.html
- Check for JavaScript errors in browser console

### API Issues
- Verify backend is running
- Check CORS configuration
- Test endpoints with Postman or curl
- Review server logs

## 📚 Additional Resources

- [GitHub Pages Documentation](https://pages.github.com/)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)
- [Express.js Production Best Practices](https://expressjs.com/en/advanced/best-practices-production.html)
- [SQLite Documentation](https://www.sqlite.org/docs.html)

---

**Need help?** Check the main README.md for more detailed information and troubleshooting steps.
