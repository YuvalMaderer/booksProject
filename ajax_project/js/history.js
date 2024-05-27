let snackbarTimeout

async function addToHistory(oper, bID) {
  const historyItem = {
    operation: oper,
    time: new Date().toISOString(),
    bookId: bID  
  };
  try {
    await saveToHistory(historyItem);
    // showSnackbar('History item added successfully.');
    createTable(); 
  } catch (error) {
    showSnackbar('Error adding history item');
  }
}

async function saveToHistory(historyItem) {
  try {
    return await axios.post('http://localhost:8001/history', historyItem);
  } catch (error) {
    showSnackbar('Error saving history item:');
  }
}

async function createTable() {
  const tBody = document.getElementById("tbody");
  tBody.innerHTML = '';
  try {
    const response = await axios.get("http://localhost:8001/history");
    response.data.forEach(item => {
      tBody.innerHTML += `
        <tr>
          <td>${item.id}</td>
          <td>${item.operation}</td>
          <td>${item.time}</td>
          <td>${item.bookId}</td>
        </tr>`;
    });
  } catch (error) {
    showSnackbar('Error fetching history items');
  }
}

function showSnackbar(message) {
  let snackbarMessage = document.getElementById('snackbar');
  snackbarMessage.innerText = message;
  snackbarMessage.classList.remove('show');
  void snackbarMessage.offsetWidth; 
  snackbarMessage.classList.add('show');
  if (snackbarTimeout) {
      clearTimeout(snackbarTimeout);
  }
  snackbarTimeout = setTimeout(function() {
      snackbarMessage.classList.remove("show");
  }, 2400);
}

createTable();

