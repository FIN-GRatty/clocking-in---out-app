# Clocking Out - Employee Time Tracking Application

A complete, production-ready employee clock-in/out application built with Node.js/Express backend and React frontend. Features employee time tracking, lunch break management, and admin oversight capabilities.

## 🚀 Features

### Backend (Node.js/Express)
- **Simple Express server** with minimal dependencies
- **SQLite database** with automatic table creation
- **Complete API endpoints** for all time tracking operations
- **Default admin user** (ADMIN001) pre-created
- **Database reset functionality** for testing

### Frontend (React 18)
- **Modern React** with hooks and context
- **Clean, professional UI** with responsive design
- **Employee dashboard** with clock in/out and lunch break controls
- **Admin dashboard** with overview stats and employee management
- **Mobile-responsive** design for all devices

### API Endpoints
- `POST /api/time/clockin` - Clock in employee
- `POST /api/time/clockout` - Clock out employee
- `POST /api/time/lunch/start` - Start lunch break
- `POST /api/time/lunch/end` - End lunch break
- `POST /api/employee/create` - Create new employee
- `GET /api/admin/overview` - Get system overview stats
- `GET /api/employee/:id/status` - Get employee status
- `GET /api/employee/:id/history` - Get employee time history
- `POST /api/admin/reset` - Reset database (admin only)

## 🛠️ Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd clocking_out
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd client && npm install
   cd ..
   ```

3. **Start the application**
   ```bash
   # Development mode (both frontend and backend)
   npm run dev
   
   # Or start separately:
   npm start          # Backend only
   npm run client     # Frontend only
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔐 Default Credentials

- **Admin User**: `ADMIN001`
- **Test Employee**: `EMP001` (create via admin panel)

## 📱 Usage

### Employee Dashboard
1. Login with your Employee ID
2. Use the **Clock In/Out** button to track work hours
3. Use the **Start/End Lunch** button during breaks
4. View your **Time History** for past entries

### Admin Dashboard
1. Login with `ADMIN001`
2. View **System Overview** statistics
3. **Create new employees** as needed
4. **Reset database** for testing purposes

## 🚀 Deployment to GitHub Pages

### Option 1: Static Frontend Only (Recommended for GitHub Pages)

1. **Build the React app**
   ```bash
   npm run build
   ```

2. **Deploy the build folder**
   - Push the `client/build` folder to your GitHub repository
   - Enable GitHub Pages in repository settings
   - Set source to `/root` or `/docs` folder

3. **Update API base URL**
   - Modify the fetch calls in React components to point to your deployed backend
   - Or use environment variables for different environments

### Option 2: Full Stack Deployment

1. **Deploy backend to a hosting service** (Heroku, Railway, Render, etc.)
2. **Update frontend API calls** to point to your deployed backend URL
3. **Build and deploy frontend** to GitHub Pages

## 🔧 Configuration

### Environment Variables
- `PORT` - Backend server port (default: 5000)
- `NODE_ENV` - Environment mode (development/production)

### Database
- SQLite database file: `clocking.db`
- Automatically created on first run
- Tables: `employees`, `time_entries`, `lunch_breaks`

## 📁 Project Structure

```
clocking_out/
├── server.js              # Express server and API endpoints
├── package.json           # Backend dependencies
├── client/                # React frontend
│   ├── public/           # Static files
│   ├── src/              # React source code
│   │   ├── components/   # React components
│   │   ├── App.js        # Main app component
│   │   └── index.js      # React entry point
│   └── package.json      # Frontend dependencies
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🧪 Testing

### Create Test Employees
1. Login as admin (`ADMIN001`)
2. Use the admin dashboard to create test employees
3. Test clock in/out functionality with different users

### Reset Database
1. Login as admin
2. Click "Reset Database" button
3. Confirm the action
4. All data will be cleared (admin user preserved)

## 🔒 Security Features

- **Input validation** on all API endpoints
- **SQL injection protection** with parameterized queries
- **Employee authentication** via Employee ID
- **Admin-only actions** properly protected

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the port in `server.js` or kill existing processes
   - Use `lsof -i :5000` to find processes using port 5000

2. **Database errors**
   - Delete `clocking.db` file and restart server
   - Check file permissions in the project directory

3. **Frontend not connecting to backend**
   - Verify backend is running on port 5000
   - Check CORS settings in `server.js`
   - Ensure proxy is set correctly in `client/package.json`

4. **Build errors**
   - Clear `node_modules` and reinstall dependencies
   - Ensure Node.js version is 16+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the API endpoints and error messages
3. Check the browser console for frontend errors
4. Check the server console for backend errors

---

**Built with ❤️ using Node.js, Express, React, and SQLite**
