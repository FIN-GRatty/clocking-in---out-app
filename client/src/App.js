import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

// Context for employee authentication
export const EmployeeContext = React.createContext();

function App() {
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if employee is logged in from localStorage
    const savedEmployee = localStorage.getItem('currentEmployee');
    if (savedEmployee) {
      setCurrentEmployee(JSON.parse(savedEmployee));
    }
    setLoading(false);
  }, []);

  const login = (employee) => {
    setCurrentEmployee(employee);
    localStorage.setItem('currentEmployee', JSON.stringify(employee));
  };

  const logout = () => {
    setCurrentEmployee(null);
    localStorage.removeItem('currentEmployee');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card text-center">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <EmployeeContext.Provider value={{ currentEmployee, login, logout }}>
      <Router>
        <div className="App">
          <Routes>
            <Route 
              path="/" 
              element={
                currentEmployee ? (
                  currentEmployee.isAdmin ? (
                    <Navigate to="/admin" replace />
                  ) : (
                    <Navigate to="/dashboard" replace />
                  )
                ) : (
                  <Login />
                )
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                currentEmployee && !currentEmployee.isAdmin ? (
                  <EmployeeDashboard />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/admin" 
              element={
                currentEmployee && currentEmployee.isAdmin ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </EmployeeContext.Provider>
  );
}

export default App;
