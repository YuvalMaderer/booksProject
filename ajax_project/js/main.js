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

      document
        .getElementById("createBookForm")
        .addEventListener("submit", async function (event) {
          event.preventDefault();
          const title = document.getElementById("createBookTitle").value;
          const author = document.getElementById("createBookAuthor").value;
          latestBookId++;
          try {
            await axios.post("http://localhost:8001/books", {
              id: latestBookId,
              title,
              author,
            });
            getAllBooks(currentPage);
          } catch (error) {
            console.error("Error creating book:", error);
          }
        });

      document
        .getElementById("deleteBookForm")
        .addEventListener("submit", async function (event) {
          event.preventDefault();
          const bookId = document.getElementById("deleteBookId").value;
          try {
            await axios.delete(`http://localhost:8001/books/${bookId}`);
            getAllBooks(currentPage);
          } catch (error) {
            console.error("Error deleting book:", error);
          }
        });

      document
        .getElementById("updateBookForm")
        .addEventListener("submit", async function (event) {
          event.preventDefault();
          const bookId = document.getElementById("updateBookId").value;
          const title = document.getElementById("updateBookTitle").value;
          const author = document.getElementById("updateBookAuthor").value;
          try {
            await axios.put(`http://localhost:8001/books/${bookId}`, {
              title,
              author,
            });
            getAllBooks(currentPage);
          } catch (error) {
            console.error("Error updating book:", error);
          }
        });

        document.getElementById("displayBookDetailsForm").addEventListener("submit", async function (event) {
          event.preventDefault(); 
          const bookId = document.getElementById("displayBookDetails").value;
          try {
            const response = await axios.get(`http://localhost:8001/books/${bookId}`);
            return response.data;
          } catch (error) {
            
          }
        })

      getAllBooks(currentPage);


