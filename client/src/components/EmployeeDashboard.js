import React, { useState, useEffect, useContext } from 'react';
import { EmployeeContext } from '../App';

const EmployeeDashboard = () => {
  const { currentEmployee, logout } = useContext(EmployeeContext);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [timeHistory, setTimeHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchStatus();
    fetchTimeHistory();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch(`https://clocking-out-backend.onrender.com/api/employee/${currentEmployee.id}/status`);
      if (response.ok) {
        const data = await response.json();
        setStatus(data.status);
      }
    } catch (err) {
      console.error('Error fetching status:', err);
    }
  };

  const fetchTimeHistory = async () => {
    try {
      const response = await fetch(`https://clocking-out-backend.onrender.com/api/employee/${currentEmployee.id}/history`);
      if (response.ok) {
        const data = await response.json();
        setTimeHistory(data);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const handleAction = async (action) => {
    setLoading(true);
    setMessage('');

    try {
      let endpoint = '';
      let body = { employeeId: currentEmployee.id };

      switch (action) {
        case 'clockin':
          endpoint = 'https://clocking-out-backend.onrender.com/api/time/clockin';
          break;
        case 'clockout':
          endpoint = 'https://clocking-out-backend.onrender.com/api/time/clockout';
          break;
        case 'lunchStart':
          endpoint = 'https://clocking-out-backend.onrender.com/api/time/lunch/start';
          break;
        case 'lunchEnd':
          endpoint = 'https://clocking-out-backend.onrender.com/api/time/lunch/end';
          break;
        default:
          return;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        fetchStatus();
        fetchTimeHistory();
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return new Date(timeString).toLocaleTimeString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusText = () => {
    if (!status) return 'Loading...';
    if (status.onLunch) return 'On Lunch Break';
    if (status.clockedIn) return 'Clocked In';
    return 'Clocked Out';
  };

  const getStatusClass = () => {
    if (!status) return '';
    if (status.onLunch) return 'status-lunch';
    if (status.clockedIn) return 'status-online';
    return 'status-offline';
  };

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div className="container">
          <div className="header-content">
            <a href="/" className="logo">Clocking Out</a>
            <div className="header-actions">
              <div className="employee-info">
                <span className="employee-name">{currentEmployee.name}</span>
                <span className="employee-id">({currentEmployee.id})</span>
              </div>
              <button onClick={logout} className="logout-btn">Logout</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Status Card */}
        <div className="card">
          <h2>Current Status</h2>
          <div className="flex gap-20 mb-20">
            <div>
              <span className={`status-indicator ${getStatusClass()}`}></span>
              <strong>{getStatusText()}</strong>
            </div>
            {status?.clockedIn && status?.clockInTime && (
              <div>
                Clocked in at: {formatTime(status.clockInTime)}
              </div>
            )}
          </div>

          {message && (
            <div className={`alert ${message.includes('error') ? 'alert-error' : 'alert-success'}`}>
              {message}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="card">
          <h2>Quick Actions</h2>
          <div className="grid grid-2">
            <div className="text-center">
              {!status?.clockedIn ? (
                <button
                  className="btn btn-success"
                  onClick={() => handleAction('clockin')}
                  disabled={loading}
                  style={{ fontSize: '18px', padding: '20px' }}
                >
                  {loading ? 'Processing...' : 'Clock In'}
                </button>
              ) : (
                <button
                  className="btn btn-danger"
                  onClick={() => handleAction('clockout')}
                  disabled={loading}
                  style={{ fontSize: '18px', padding: '20px' }}
                >
                  {loading ? 'Processing...' : 'Clock Out'}
                </button>
              )}
            </div>

            <div className="text-center">
              {status?.clockedIn && !status?.onLunch ? (
                <button
                  className="btn btn-warning"
                  onClick={() => handleAction('lunchStart')}
                  disabled={loading}
                  style={{ fontSize: '18px', padding: '20px' }}
                >
                  {loading ? 'Processing...' : 'Start Lunch'}
                </button>
              ) : status?.onLunch ? (
                <button
                  className="btn btn-warning"
                  onClick={() => handleAction('lunchEnd')}
                  disabled={loading}
                  style={{ fontSize: '18px', padding: '20px' }}
                >
                  {loading ? 'Processing...' : 'End Lunch'}
                </button>
              ) : (
                <button className="btn btn-warning" disabled style={{ fontSize: '18px', padding: '20px' }}>
                  Start Lunch
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Time History */}
        <div className="card">
          <div className="flex-between mb-20">
            <h2>Time History</h2>
            <button
              className="btn btn-primary"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? 'Hide History' : 'Show History'}
            </button>
          </div>

          {showHistory && (
            <div>
              {timeHistory.length === 0 ? (
                <p className="text-center" style={{ color: '#666' }}>No time entries found.</p>
              ) : (
                <div className="grid grid-1">
                  {timeHistory.map((entry) => (
                    <div key={entry.id} className="card" style={{ marginBottom: '10px', padding: '16px' }}>
                      <div className="flex-between">
                        <div>
                          <strong>Date:</strong> {formatDate(entry.clock_in)}
                        </div>
                        <div>
                          <strong>Hours:</strong> {entry.total_hours ? `${entry.total_hours.toFixed(2)}h` : 'In Progress'}
                        </div>
                      </div>
                      <div className="mt-20">
                        <div><strong>Clock In:</strong> {formatTime(entry.clock_in)}</div>
                        <div><strong>Clock Out:</strong> {formatTime(entry.clock_out)}</div>
                        {entry.lunch_start && (
                          <div><strong>Lunch:</strong> {formatTime(entry.lunch_start)} - {formatTime(entry.lunch_end)}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
