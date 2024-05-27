// const itemsPerPage = 9;
// let pageCurrent = 1;
// let totalItems = 0;

// async function getAllBooks(page = 1) {
//   const spinner = document.querySelector(".spinner");
//   const table = document.querySelector("table");
//   try {
//     const response = await axios.get(
//       `http://localhost:8001/books?_page=${page}&_limit=${itemsPerPage}`
//     );
//     const books = response.data;

//     totalItems = parseInt(response.headers["x-total-count"]);
//     const tableBody = document.querySelector("#booksTable tbody");
//     tableBody.innerHTML = "";
//     books.forEach((book) => {
//       const row = document.createElement("tr");
//       row.innerHTML = `<td>${book.id}</td><td>${book.title}</td><td>${book.author}</td>
//       <td>${book.numPages}</td><td>${book.description}</td><td>${book.img}</td><td>${book.categories}</td>
//       <td>${book.ISBN}</td><td>${book.copies}</td>`;
//       tableBody.appendChild(row);
//     });
    
//     // Hide spinner and show table after all data is loaded
//     // if (
//     //   table.querySelectorAll("tr").length - 1 ===
//     //   response.data.length
//     // ) {
//     //   // spinner.classList.add("hidden");
//     //   // table.classList.remove("hidden");
//     // }

//     updatePaginationControls();
//   } catch (error) {
//     console.error("Error fetching books:", error);
//   }
// }

// function updatePaginationControls() {
//   document.getElementById("pageNumber").innerText = pageCurrent;

//   document.getElementById("prevPage").disabled = pageCurrent === 1; //true disabled, false enable
//   document.getElementById("nextPage").disabled =
//     pageCurrent * itemsPerPage >= totalItems;
// }

// document.getElementById("prevPage").addEventListener("click", () => {
//   if (pageCurrent > 1) {
//     pageCurrent--;
//     getAllBooks(pageCurrent);
//   }
// });

// document.getElementById("nextPage").addEventListener("click", () => {
//   if (pageCurrent * itemsPerPage < totalItems) {
//     pageCurrent++;
//     getAllBooks(pageCurrent);
//   }
// });


// getAllBooks(pageCurrent);