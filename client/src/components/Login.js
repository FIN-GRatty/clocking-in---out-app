import React, { useState, useContext } from 'react';
import { EmployeeContext } from '../App';

const Login = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(EmployeeContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!employeeId.trim()) {
      setError('Please enter your Employee ID');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/employee/${employeeId.trim()}/status`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Employee ID not found. Please check your ID or contact HR.');
        } else {
          setError('An error occurred. Please try again.');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      login(data.employee);
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '400px', margin: '100px auto' }}>
        <div className="text-center mb-20">
          <h1 style={{ color: '#007bff', marginBottom: '10px' }}>Clocking Out</h1>
          <p style={{ color: '#666' }}>Employee Time Tracking System</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="employeeId" className="form-label">
              Employee ID
            </label>
            <input
              type="text"
              id="employeeId"
              className="form-input"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Enter your Employee ID"
              disabled={loading}
              autoFocus
            />
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-20" style={{ fontSize: '14px', color: '#666' }}>
          <p>Default Admin: <strong>ADMIN001</strong></p>
          <p>Contact HR for your Employee ID</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
