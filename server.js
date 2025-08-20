const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// Database setup
const db = new sqlite3.Database('./clocking.db');

// Initialize database tables
db.serialize(() => {
  // Employees table
  db.run(`CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    is_admin BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Time entries table
  db.run(`CREATE TABLE IF NOT EXISTS time_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT NOT NULL,
    clock_in DATETIME,
    clock_out DATETIME,
    total_hours REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees (id)
  )`);

  // Lunch breaks table
  db.run(`CREATE TABLE IF NOT EXISTS lunch_breaks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT NOT NULL,
    start_time DATETIME,
    end_time DATETIME,
    duration_minutes INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees (id)
  )`);

  // Insert default admin user
  db.run(`INSERT OR IGNORE INTO employees (id, name, email, is_admin) VALUES (?, ?, ?, ?)`, 
    ['ADMIN001', 'Admin User', 'admin@company.com', 1]);
});

// API Routes

// Clock in
app.post('/api/time/clockin', (req, res) => {
  const { employeeId } = req.body;
  
  if (!employeeId) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }

  // Check if employee exists
  db.get('SELECT * FROM employees WHERE id = ?', [employeeId], (err, employee) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Check if already clocked in
    db.get('SELECT * FROM time_entries WHERE employee_id = ? AND clock_out IS NULL', [employeeId], (err, entry) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (entry) {
        return res.status(400).json({ error: 'Already clocked in' });
      }

      // Create new time entry
      db.run('INSERT INTO time_entries (employee_id, clock_in) VALUES (?, ?)', 
        [employeeId, new Date().toISOString()], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to clock in' });
        }
        res.json({ 
          message: 'Successfully clocked in',
          entryId: this.lastID,
          clockIn: new Date().toISOString()
        });
      });
    });
  });
});

// Clock out
app.post('/api/time/clockout', (req, res) => {
  const { employeeId } = req.body;
  
  if (!employeeId) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }

  // Find active time entry
  db.get('SELECT * FROM time_entries WHERE employee_id = ? AND clock_out IS NULL', [employeeId], (err, entry) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!entry) {
      return res.status(400).json({ error: 'Not clocked in' });
    }

    const clockOut = new Date();
    const clockIn = new Date(entry.clock_in);
    const totalHours = (clockOut - clockIn) / (1000 * 60 * 60);

    // Update time entry
    db.run('UPDATE time_entries SET clock_out = ?, total_hours = ? WHERE id = ?', 
      [clockOut.toISOString(), totalHours, entry.id], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to clock out' });
      }
      res.json({ 
        message: 'Successfully clocked out',
        totalHours: totalHours.toFixed(2),
        clockOut: clockOut.toISOString()
      });
    });
  });
});

// Start lunch break
app.post('/api/time/lunch/start', (req, res) => {
  const { employeeId } = req.body;
  
  if (!employeeId) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }

  // Check if already on lunch break
  db.get('SELECT * FROM lunch_breaks WHERE employee_id = ? AND end_time IS NULL', [employeeId], (err, lunch) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (lunch) {
      return res.status(400).json({ error: 'Already on lunch break' });
    }

    // Create new lunch break
    db.run('INSERT INTO lunch_breaks (employee_id, start_time) VALUES (?, ?)', 
      [employeeId, new Date().toISOString()], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to start lunch break' });
      }
      res.json({ 
        message: 'Lunch break started',
        lunchId: this.lastID,
        startTime: new Date().toISOString()
      });
    });
  });
});

// End lunch break
app.post('/api/time/lunch/end', (req, res) => {
  const { employeeId } = req.body;
  
  if (!employeeId) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }

  // Find active lunch break
  db.get('SELECT * FROM lunch_breaks WHERE employee_id = ? AND end_time IS NULL', [employeeId], (err, lunch) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!lunch) {
      return res.status(400).json({ error: 'Not on lunch break' });
    }

    const endTime = new Date();
    const startTime = new Date(lunch.start_time);
    const durationMinutes = Math.round((endTime - startTime) / (1000 * 60));

    // Update lunch break
    db.run('UPDATE lunch_breaks SET end_time = ?, duration_minutes = ? WHERE id = ?', 
      [endTime.toISOString(), durationMinutes, lunch.id], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to end lunch break' });
      }
      res.json({ 
        message: 'Lunch break ended',
        durationMinutes: durationMinutes,
        endTime: endTime.toISOString()
      });
    });
  });
});

// Create employee
app.post('/api/employee/create', (req, res) => {
  const { id, name, email } = req.body;
  
  if (!id || !name) {
    return res.status(400).json({ error: 'Employee ID and name are required' });
  }

  db.run('INSERT INTO employees (id, name, email) VALUES (?, ?, ?)', 
    [id, name, email], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Employee ID already exists' });
      }
      return res.status(500).json({ error: 'Failed to create employee' });
    }
    res.json({ 
      message: 'Employee created successfully',
      employeeId: id
    });
  });
});

// Admin overview
app.get('/api/admin/overview', (req, res) => {
  const queries = {
    totalEmployees: 'SELECT COUNT(*) as count FROM employees',
    activeClockIns: 'SELECT COUNT(*) as count FROM time_entries WHERE clock_out IS NULL',
    onLunch: 'SELECT COUNT(*) as count FROM lunch_breaks WHERE end_time IS NULL',
    todayEntries: 'SELECT COUNT(*) as count FROM time_entries WHERE DATE(clock_in) = DATE("now")'
  };

  const results = {};
  let completed = 0;
  const totalQueries = Object.keys(queries).length;

  Object.keys(queries).forEach(key => {
    db.get(queries[key], (err, row) => {
      if (err) {
        results[key] = 0;
      } else {
        results[key] = row.count;
      }
      completed++;
      
      if (completed === totalQueries) {
        res.json(results);
      }
    });
  });
});

// Get employee status
app.get('/api/employee/:id/status', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM employees WHERE id = ?', [id], (err, employee) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Get current status
    db.get('SELECT * FROM time_entries WHERE employee_id = ? AND clock_out IS NULL', [id], (err, timeEntry) => {
      db.get('SELECT * FROM lunch_breaks WHERE employee_id = ? AND end_time IS NULL', [id], (err, lunchBreak) => {
        res.json({
          employee: {
            id: employee.id,
            name: employee.name,
            email: employee.email,
            isAdmin: Boolean(employee.is_admin)
          },
          status: {
            clockedIn: !!timeEntry,
            onLunch: !!lunchBreak,
            clockInTime: timeEntry ? timeEntry.clock_in : null
          }
        });
      });
    });
  });
});

// Get employee time history
app.get('/api/employee/:id/history', (req, res) => {
  const { id } = req.params;
  
  db.all(`
    SELECT 
      te.id,
      te.clock_in,
      te.clock_out,
      te.total_hours,
      lb.start_time as lunch_start,
      lb.end_time as lunch_end,
      lb.duration_minutes
    FROM time_entries te
    LEFT JOIN lunch_breaks lb ON te.employee_id = lb.employee_id 
      AND DATE(te.clock_in) = DATE(lb.start_time)
    WHERE te.employee_id = ?
    ORDER BY te.clock_in DESC
    LIMIT 30
  `, [id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Reset database (for testing)
app.post('/api/admin/reset', (req, res) => {
  db.serialize(() => {
    db.run('DELETE FROM lunch_breaks');
    db.run('DELETE FROM time_entries');
    db.run('DELETE FROM employees');
    
    // Recreate admin user
    db.run(`INSERT INTO employees (id, name, email, is_admin) VALUES (?, ?, ?, ?)`, 
      ['ADMIN001', 'Admin User', 'admin@company.com', 1], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to reset database' });
      }
      res.json({ message: 'Database reset successfully' });
    });
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Admin user created: ADMIN001`);
});
