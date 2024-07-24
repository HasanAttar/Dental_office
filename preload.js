const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  addPatient: (patient) => ipcRenderer.invoke('add-patient', patient),
  getPatients: (limit) => ipcRenderer.invoke('get-patients', limit),
  deletePatient: (id) => ipcRenderer.invoke('delete-patient', id),
  getPatientById: (id) => ipcRenderer.invoke('get-patient-by-id', id),
  updatePatient: (patient) => ipcRenderer.invoke('update-patient', patient),
  saveAppointment: (appointment) => ipcRenderer.invoke('saveAppointment', appointment),
  getAppointments: () => ipcRenderer.invoke('getAppointments'),
  getAppointmentById: (id) => ipcRenderer.invoke('get-Appointment-by-id', id), // Corrected method name
  updateAppointment: (appointment) => ipcRenderer.invoke('update-appointment', appointment),
  deleteAppointment: (id) => ipcRenderer.invoke('delete-appointment', id),

});
