
let snackbarTimeout;

async function addToHistory(oper, bID) {
  const historyItem = {
    operation: oper,
    time: new Date().toLocaleString("en-US"),
    bookId: bID,
  };
  try {
    await saveToHistory(historyItem);
    createTable();
  } catch (error) {
    showSnackbar("Error adding history item");
  }
}

async function saveToHistory(historyItem) {
  try {
    await axios.post("http://localhost:8001/history", historyItem);
  } catch (error) {
    showSnackbar("Error saving history item:");
  }
}

async function createTable() {
  const tBody = document.getElementById("tbody");
  tBody.innerHTML = "";
  try {
    const response = await axios.get("http://localhost:8001/history");
    response.data.forEach((item) => {
      tBody.innerHTML += `
        <tr>
          <td>${item.id}</td>
          <td>${item.operation}</td>
          <td>${item.time}</td>
          <td>${item.bookId}</td>
        </tr>`;
    });
  } catch (error) {
    showSnackbar("Error fetching history items");
  }
}

function showSnackbar(message) {
  let snackbarMessage = document.getElementById("snackbar");
  snackbarMessage.innerText = message;
  snackbarMessage.classList.remove("show");
  void snackbarMessage.offsetWidth;
  snackbarMessage.classList.add("show");
  if (snackbarTimeout) {
    clearTimeout(snackbarTimeout);
  }
  snackbarTimeout = setTimeout(function () {
    snackbarMessage.classList.remove("show");
  }, 2400);
}

document.addEventListener("DOMContentLoaded", function () {
  const table = document.getElementById("operations");
  const tbody = document.getElementById("tbody");
  let historyData = [];

  // Fetch data and populate the table
  async function fetchData() {
    try {
      const response = await axios.get("http://localhost:8001/history");
      historyData = response.data;
      displayTable(historyData);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }

  function displayTable(data) {
    tbody.innerHTML = "";
    data.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.operation}</td>
        <td>${new Date(item.time).toLocaleString()}</td>
        <td>${item.bookId}</td>
      `;
      tbody.appendChild(row);
    });
  }

  function sortTable(column, ascending) {
    historyData.sort((a, b) => {
      if (a[column] < b[column]) return ascending ? -1 : 1;
      if (a[column] > b[column]) return ascending ? 1 : -1;
      return 0;
    });
    displayTable(historyData);
  }

  let sortDirections = {
    id: true,
    operation: true,
    time: true,
    bookId: true,
  };

  table.querySelectorAll("th").forEach((th) => {
    th.addEventListener("click", () => {
      const column = th.id.replace("-header", "");
      sortTable(column, sortDirections[column]);
      sortDirections[column] = !sortDirections[column];
    });
  });

  function filterTable() {
    const idFilter = document.getElementById("id-filter").value.toLowerCase();
    const operationFilter = document
      .getElementById("operation-filter")
      .value.toLowerCase();
    const timeFilter = document
      .getElementById("time-filter")
      .value.toLowerCase();
    const bookIdFilter = document
      .getElementById("bookId-filter")
      .value.toLowerCase();

    const filteredData = historyData.filter((item) => {
      return (
        item.id.toLowerCase().includes(idFilter) &&
        item.operation.toLowerCase().includes(operationFilter) &&
        new Date(item.time)
          .toLocaleString()
          .toLowerCase()
          .includes(timeFilter) &&
        item.bookId.toLowerCase().includes(bookIdFilter)
      );
    });
    displayTable(filteredData);
  }

  document.querySelectorAll("input[type='text']").forEach((input) => {
    input.addEventListener("input", filterTable);
  });

  fetchData();
});

createTable();
