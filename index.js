document.addEventListener('DOMContentLoaded', () => {
    loadPatients(5); // Load the first 5 patients by default

    document.getElementById('entriesCount').addEventListener('change', (event) => {
      loadPatients(event.target.value);
    });
  });

  function loadPatients(entriesCount) {
    window.electronAPI.getPatients(entriesCount).then((patients) => {
      console.log('Patients:', patients); // Log the data to debug
      const patientList = document.getElementById('patientList');
      patientList.innerHTML = '';
      patients.forEach((patient, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>
            <ul class="action-list">
              <li><a href="edit-patient.html?id=${patient.id}" class="btn btn-primary"><i class="fa fa-pencil-alt"></i></a></li>
              <li><button class="btn btn-danger" onclick="deletePatient(${patient.id})"><i class="fa fa-times"></i></button></li>
            </ul>
          </td>
          <td>${index + 1}</td>
          <td>${patient.name}</td>
          <td>${patient.age}</td>
          <td><a href="view-patient.html?id=${patient.id}" class="btn btn-sm btn-success"><i class="fa fa-search"></i></a></td>
        `;
        patientList.appendChild(row);
      });

      document.getElementById('currentEntries').textContent = entriesCount;
      document.getElementById('totalEntries').textContent = patients.length;
      // You can also update pagination items here if needed
    }).catch((error) => {
      console.error('Error loading patients:', error);
    });
  }

  function deletePatient(id) {
    if (confirm('Are you sure you want to delete this patient?')) {
      window.electronAPI.deletePatient(id).then(() => {
        loadPatients(document.getElementById('entriesCount').value);
      }).catch((error) => {
        console.error('Error deleting patient:', error);
      });
    }
  }