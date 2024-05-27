const itemsPerPage = 5;
let currentPage = 1;
let totalItems = 0;

async function getAllBooks(page = 1) {
  const spinner = document.querySelector(".spinner");
  const table = document.querySelector("table");
  try {
    const response = await axios.get(
      `http://localhost:8001/books?_page=${page}&_limit=${itemsPerPage}`
    );
    const books = response.data;

    totalItems = parseInt(response.headers["x-total-count"]);
    const tableBody = document.querySelector("#booksTable tbody");
    tableBody.innerHTML = "";
    books.forEach((book) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${book.id}</td><td>${book.title}</td><td>${book.author}</td>`;
      tableBody.appendChild(row);
    });
    
    // Hide spinner and show table after all data is loaded
    if (
      table.querySelectorAll("tr").length - 1 ===
      response.data.length
    ) {
      spinner.classList.add("hidden");
      table.classList.remove("hidden");
    }

    updatePaginationControls();
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

function updatePaginationControls() {
  document.getElementById("pageNumber").innerText = currentPage;

  document.getElementById("prevPage").disabled = currentPage === 1; //true disabled, false enable
  document.getElementById("nextPage").disabled =
    currentPage * itemsPerPage >= totalItems;
}

document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    getAllBooks(currentPage);
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  if (currentPage * itemsPerPage < totalItems) {
    currentPage++;
    getAllBooks(currentPage);
  }
});


getAllBooks(currentPage);