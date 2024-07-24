const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(app.getPath('userData'), 'patients.db');
let db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    db.run(`CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      age INTEGER,
      contact TEXT,
      teeth TEXT
    )`, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      }
    });

    db.run(`CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patientName TEXT,
      phoneNumber TEXT,
      date TEXT,
      startTime TEXT,
      endTime TEXT,
      note TEXT
    )`, (err) => {
      if (err) {
        console.error('Error creating appointments table:', err.message);
      }
    });

    db.run(`ALTER TABLE patients ADD COLUMN teeth TEXT`, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error('Error adding column:', err.message);
      }
      
    });
  
   
  }
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  mainWindow.loadFile('index.html');
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('add-patient', async (event, name, age, contact,  teeth) => {
  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO patients (name, age, contact, teeth) VALUES (?, ?, ?, ?)`,
      [name, age, contact, illness, next_appointment, teeth],
      function (err) {
        if (err) {
          reject(err.message);
        } else {
          resolve();
        }
      });
  });
});


ipcMain.handle('get-patients', async (event, limit) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM patients LIMIT ?`;
    db.all(sql, [limit], (err, rows) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(rows);
      }
    });
  });
});

ipcMain.handle('delete-patient', async (event, id) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM patients WHERE id = ?`;
    db.run(sql, [id], function (err) {
      if (err) {
        reject(err.message);
      } else {
        resolve();
      }
    });
  });
});
ipcMain.handle('delete-appointment', async (event, id) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM appointments WHERE id = ?`;
    db.run(sql, [id], function (err) {
      if (err) {
        reject(err.message);
      } else {
        resolve();
      }
    });
  });
});

ipcMain.handle('get-patient-by-id', async (event, id) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM patients WHERE id = ?`, [id], (err, row) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(row);
      }
    });
  });
});

ipcMain.handle('update-patient', async (event, patient) => {
  return new Promise((resolve, reject) => {
    const { id, name, age, contact, illness, next_appointment, teeth } = patient;
    db.run(`UPDATE patients SET name = ?, age = ?, contact = ?, teeth = ? WHERE id = ?`,
      [name, age, contact, illness, next_appointment, JSON.stringify(teeth), id],
      function (err) {
        if (err) {
          reject(err.message);
        } else {
          resolve();
        }
      });
  });
});
// Appointment handlers
ipcMain.handle('saveAppointment', async (event, appointment) => {
  return new Promise((resolve, reject) => {
    const { patientName, phoneNumber, date, startTime, endTime, note } = appointment;
    db.run(`INSERT INTO appointments (patientName, phoneNumber, date, startTime, endTime, note) 
            VALUES (?, ?, ?, ?, ?, ?)`,
      [patientName, phoneNumber, date, startTime, endTime, note],
      function (err) {
        if (err) {
          reject(err.message);
        } else {
          resolve({ id: this.lastID });
        }
      });
  });
});

ipcMain.handle('getAppointments', async () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM appointments', [], (err, rows) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(rows);
      }
    });
  });
});
ipcMain.handle('get-Appointment-by-id', async (event, id) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM appointments WHERE id = ?`, [id], (err, row) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(row);
      }
    });
  });
});

ipcMain.handle('update-appointment', async (event, appointment) => {
  return new Promise((resolve, reject) => {
    const { id, patientName, phoneNumber, date, startTime, endTime, note } = appointment;
    db.run(`UPDATE appointments SET patientName = ?, phoneNumber = ?, date = ?, startTime = ?, endTime = ?, note = ? WHERE id = ?`,
      [patientName, phoneNumber, date, startTime, endTime, note, id],
      function (err) {
        if (err) {
          reject(err.message);
        } else {
          resolve();
        }
      });
  });
});


const isDev = !app.isPackaged;
if (isDev) {
  console.log('Running in development mode');
} else {
  console.log('Running in production mode');
}

console.log(`Database path: ${dbPath}`);
