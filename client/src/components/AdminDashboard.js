import React, { useState, useEffect, useContext } from 'react';
import { EmployeeContext } from '../App';

const AdminDashboard = () => {
  const { currentEmployee, logout } = useContext(EmployeeContext);
  const [overview, setOverview] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ id: '', name: '', email: '' });
  const [selectedView, setSelectedView] = useState('overview'); // 'overview', 'employees', 'clockedIn', 'onLunch'
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeTimeHistory, setEmployeeTimeHistory] = useState([]);

  useEffect(() => {
    fetchOverview();
    fetchEmployees();
  }, []);

  const fetchOverview = async () => {
    try {
      const response = await fetch('https://clocking-out-backend.onrender.com/api/admin/overview');
      if (response.ok) {
        const data = await response.json();
        setOverview(data);
      }
    } catch (err) {
      console.error('Error fetching overview:', err);
    }
  };

  const fetchEmployees = async () => {
    try {
      // For now, we'll create a mock list since we don't have a get all employees endpoint
      // In a real app, you'd fetch this from the API
      const mockEmployees = [
        { id: 'ADMIN001', name: 'Admin User', email: 'admin@company.com', isAdmin: true },
        { id: 'EMP001', name: 'John Doe', email: 'john@company.com', isAdmin: false },
        { id: 'EMP002', name: 'Jane Smith', email: 'jane@company.com', isAdmin: false }
      ];
      setEmployees(mockEmployees);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const fetchEmployeeTimeHistory = async (employeeId) => {
    try {
      const response = await fetch(`https://clocking-out-backend.onrender.com/api/employee/${employeeId}/history`);
      if (response.ok) {
        const data = await response.json();
        setEmployeeTimeHistory(data);
      }
    } catch (err) {
      console.error('Error fetching employee history:', err);
    }
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('https://clocking-out-backend.onrender.com/api/employee/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setNewEmployee({ id: '', name: '', email: '' });
        setShowCreateForm(false);
        fetchEmployees();
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm('Are you sure you want to reset the database? This will delete all data except the admin user.')) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('https://clocking-out-backend.onrender.com/api/admin/reset', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        fetchOverview();
        fetchEmployees();
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

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div className="container">
          <div className="header-content">
            <a href="/" className="logo">Clocking Out - Admin</a>
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
                 {/* Overview Stats */}
         <div className="card">
           <h2>System Overview</h2>
           {overview ? (
             <div className="grid grid-3">
               <div 
                 className="text-center clickable-stat" 
                 onClick={() => setSelectedView('employees')}
                 style={{ cursor: 'pointer', padding: '10px', borderRadius: '8px', transition: 'background-color 0.2s' }}
                 onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                 onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
               >
                 <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#007bff' }}>
                   {overview.totalEmployees}
                 </div>
                 <div style={{ color: '#666' }}>Total Employees</div>
                 <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>Click to view all</div>
               </div>
               <div 
                 className="text-center clickable-stat" 
                 onClick={() => setSelectedView('clockedIn')}
                 style={{ cursor: 'pointer', padding: '10px', borderRadius: '8px', transition: 'background-color 0.2s' }}
                 onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                 onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
               >
                 <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#28a745' }}>
                   {overview.activeClockIns}
                 </div>
                 <div style={{ color: '#666' }}>Currently Clocked In</div>
                 <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>Click to view</div>
               </div>
               <div 
                 className="text-center clickable-stat" 
                 onClick={() => setSelectedView('onLunch')}
                 style={{ cursor: 'pointer', padding: '10px', borderRadius: '8px', transition: 'background-color 0.2s' }}
                 onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                 onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
               >
                 <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ffc107' }}>
                   {overview.onLunch}
                 </div>
                 <div style={{ color: '#666' }}>On Lunch Break</div>
                 <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>Click to view</div>
               </div>
             </div>
           ) : (
             <p>Loading overview...</p>
           )}
         </div>

                 {/* Navigation Tabs */}
         <div className="card">
           <div className="flex gap-20 mb-20">
             <button
               className={`btn ${selectedView === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
               onClick={() => setSelectedView('overview')}
             >
               Overview
             </button>
             <button
               className={`btn ${selectedView === 'employees' ? 'btn-primary' : 'btn-secondary'}`}
               onClick={() => setSelectedView('employees')}
             >
               All Employees
             </button>
             <button
               className={`btn ${selectedView === 'clockedIn' ? 'btn-primary' : 'btn-secondary'}`}
               onClick={() => setSelectedView('clockedIn')}
             >
               Clocked In
             </button>
             <button
               className={`btn ${selectedView === 'onLunch' ? 'btn-primary' : 'btn-secondary'}`}
               onClick={() => setSelectedView('onLunch')}
             >
               On Lunch
             </button>
           </div>
         </div>

         {/* Employee Management */}
         <div className="card">
           <div className="flex-between mb-20">
             <h2>Employee Management</h2>
             <button
               className="btn btn-primary"
               onClick={() => setShowCreateForm(!showCreateForm)}
             >
               {showCreateForm ? 'Cancel' : 'Add Employee'}
             </button>
           </div>

          {showCreateForm && (
            <div className="card" style={{ marginBottom: '20px', backgroundColor: '#f8f9fa' }}>
              <h3>Create New Employee</h3>
              <form onSubmit={handleCreateEmployee}>
                <div className="grid grid-2 gap-20">
                  <div className="form-group">
                    <label htmlFor="empId" className="form-label">Employee ID</label>
                    <input
                      type="text"
                      id="empId"
                      className="form-input"
                      value={newEmployee.id}
                      onChange={(e) => setNewEmployee({ ...newEmployee, id: e.target.value })}
                      placeholder="Enter Employee ID"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="empName" className="form-label">Name</label>
                    <input
                      type="text"
                      id="empName"
                      className="form-input"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                      placeholder="Enter Employee Name"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="empEmail" className="form-label">Email (Optional)</label>
                  <input
                    type="email"
                    id="empEmail"
                    className="form-input"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    placeholder="Enter Email Address"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Employee'}
                </button>
              </form>
            </div>
          )}

          {message && (
            <div className={`alert ${message.includes('error') ? 'alert-error' : 'alert-success'}`}>
              {message}
            </div>
          )}

                     {/* Conditional Views */}
           {selectedView === 'overview' && (
             <div className="grid grid-1">
               {employees.map((employee) => (
                 <div key={employee.id} className="card" style={{ marginBottom: '10px', padding: '16px' }}>
                   <div className="flex-between">
                     <div>
                       <strong>{employee.name}</strong>
                       <div style={{ color: '#666', fontSize: '14px' }}>
                         ID: {employee.id}
                         {employee.email && ` • ${employee.email}`}
                         {employee.isAdmin && ' • Admin'}
                       </div>
                     </div>
                     <div>
                       <span className={`status-indicator ${employee.isAdmin ? 'status-online' : 'status-offline'}`}></span>
                       {employee.isAdmin ? 'Admin' : 'Employee'}
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           )}

           {selectedView === 'employees' && (
             <div className="grid grid-1">
               {employees.map((employee) => (
                 <div key={employee.id} className="card" style={{ marginBottom: '10px', padding: '16px' }}>
                   <div className="flex-between">
                     <div>
                       <strong>{employee.name}</strong>
                       <div style={{ color: '#666', fontSize: '14px' }}>
                         ID: {employee.id}
                         {employee.email && ` • ${employee.email}`}
                         {employee.isAdmin && ' • Admin'}
                       </div>
                     </div>
                     <div className="flex gap-10">
                       <button
                         className="btn btn-primary btn-sm"
                         onClick={() => {
                           setSelectedEmployee(employee);
                           fetchEmployeeTimeHistory(employee.id);
                         }}
                       >
                         View History
                       </button>
                       <span className={`status-indicator ${employee.isAdmin ? 'status-online' : 'status-offline'}`}></span>
                       {employee.isAdmin ? 'Admin' : 'Employee'}
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           )}

           {selectedView === 'clockedIn' && (
             <div className="grid grid-1">
               {employees.filter(emp => !emp.isAdmin).map((employee) => (
                 <div key={employee.id} className="card" style={{ marginBottom: '10px', padding: '16px' }}>
                   <div className="flex-between">
                     <div>
                       <strong>{employee.name}</strong>
                       <div style={{ color: '#666', fontSize: '14px' }}>
                         ID: {employee.id}
                         {employee.email && ` • ${employee.email}`}
                       </div>
                     </div>
                     <div className="flex gap-10">
                       <button
                         className="btn btn-primary btn-sm"
                         onClick={() => {
                           setSelectedEmployee(employee);
                           fetchEmployeeTimeHistory(employee.id);
                         }}
                       >
                         View History
                       </button>
                       <span className="status-indicator status-online"></span>
                       Clocked In
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           )}

           {selectedView === 'onLunch' && (
             <div className="grid grid-1">
               {employees.filter(emp => !emp.isAdmin).map((employee) => (
                 <div key={employee.id} className="card" style={{ marginBottom: '10px', padding: '16px' }}>
                   <div className="flex-between">
                     <div>
                       <strong>{employee.name}</strong>
                       <div style={{ color: '#666', fontSize: '14px' }}>
                         ID: {employee.id}
                         {employee.email && ` • ${employee.email}`}
                       </div>
                     </div>
                     <div className="flex gap-10">
                       <button
                         className="btn btn-primary btn-sm"
                         onClick={() => {
                           setSelectedEmployee(employee);
                           fetchEmployeeTimeHistory(employee.id);
                         }}
                       >
                         View History
                       </button>
                       <span className="status-indicator status-lunch"></span>
                       On Lunch
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           )}
        </div>

        {/* System Actions */}
        <div className="card">
          <h2>System Actions</h2>
          <div className="text-center">
            <button
              className="btn btn-danger"
              onClick={handleResetDatabase}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Reset Database'}
            </button>
            <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
              This will reset all time entries and employee data. Admin user will be preserved.
            </p>
          </div>
        </div>

        {/* Quick Access */}
        <div className="card">
          <h2>Quick Access</h2>
          <div className="grid grid-2">
            <div className="text-center">
              <h3>Test Employee</h3>
              <p style={{ marginBottom: '15px', color: '#666' }}>
                Use this ID to test the employee dashboard:
              </p>
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '15px', 
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                EMP001
              </div>
            </div>
            <div className="text-center">
              <h3>Admin Access</h3>
              <p style={{ marginBottom: '15px', color: '#666' }}>
                Current admin credentials:
              </p>
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '15px', 
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                ADMIN001
              </div>
            </div>
          </div>
        </div>

        {/* Employee Detail Modal */}
        {selectedEmployee && (
          <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div className="modal-content" style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              maxWidth: '800px',
              maxHeight: '80vh',
              overflow: 'auto',
              position: 'relative'
            }}>
              <button
                onClick={() => setSelectedEmployee(null)}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
              
              <h2>{selectedEmployee.name} - Time History</h2>
              <div style={{ marginBottom: '20px', color: '#666' }}>
                Employee ID: {selectedEmployee.id}
                {selectedEmployee.email && ` • ${selectedEmployee.email}`}
              </div>

              {employeeTimeHistory.length === 0 ? (
                <p className="text-center" style={{ color: '#666' }}>No time entries found for this employee.</p>
              ) : (
                <div className="grid grid-1">
                  {employeeTimeHistory.map((entry, index) => (
                    <div key={index} className="card" style={{ marginBottom: '15px', padding: '20px' }}>
                      <div className="flex-between mb-15">
                        <div>
                          <strong>Date:</strong> {new Date(entry.clock_in).toLocaleDateString()}
                        </div>
                        <div>
                          <strong>Total Hours:</strong> 
                          <span style={{ 
                            color: entry.total_hours ? '#28a745' : '#ffc107',
                            fontWeight: 'bold',
                            marginLeft: '5px'
                          }}>
                            {entry.total_hours ? `${entry.total_hours.toFixed(2)}h` : 'In Progress'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-2 gap-20">
                        <div>
                          <strong>Clock In:</strong> {new Date(entry.clock_in).toLocaleTimeString()}
                        </div>
                        <div>
                          <strong>Clock Out:</strong> {entry.clock_out ? new Date(entry.clock_out).toLocaleTimeString() : 'Not clocked out'}
                        </div>
                      </div>
                      
                      {entry.lunch_start && (
                        <div className="mt-15">
                          <strong>Lunch Break:</strong> {new Date(entry.lunch_start).toLocaleTimeString()} - {entry.lunch_end ? new Date(entry.lunch_end).toLocaleTimeString() : 'In Progress'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
