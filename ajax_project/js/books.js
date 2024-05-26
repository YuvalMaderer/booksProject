const url = "http://localhost:8001/books";
const bookProperties = document.getElementById("popupBook");
const displayBooksBySearch = document.getElementById("displayBooksBySearch");
// const spinner = document.querySelector(".spinner");
const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");
const booksPerPage = 9;
let currentPage = 1;
let totalBooks = 0;

document
  .getElementById("searchBookByStr")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    currentPage = 1; 
    const input = document.getElementById("searchInput").value;
    await searchBooks(input);
  });

prevPageButton.addEventListener("click", () => changePage(-1));
nextPageButton.addEventListener("click", () => changePage(1));

async function searchBooks(query) {
  displayBooksBySearch.innerHTML = "";
  //   spinner.classList.remove("hidden");
  displayBooksBySearch.classList.add("hidden");

  try {
    const response = await axios.get(url);
    const filteredBooks = response.data.filter((book) =>
      book.title.toLowerCase().includes(query.toLowerCase())
    );
    totalBooks = filteredBooks.length;

    if (totalBooks === 0) {
      displayBooksBySearch.innerHTML = "<p>No books found.</p>";
    } else {
      displayPage(filteredBooks);
    }
  } catch (error) {
    console.error("Error fetching books:", error.message);
    displayBooksBySearch.innerHTML =
      "<p>Error fetching books. Please try again later.</p>";
  } finally {
    // spinner.classList.add("hidden");
    displayBooksBySearch.classList.remove("hidden");
  }
}

function displayPage(books) {
  const start = (currentPage - 1) * booksPerPage;
  const end = start + booksPerPage;
  const paginatedBooks = books.slice(start, end);

  displayBooksBySearch.innerHTML = paginatedBooks
    .map(
      (book) => `
      <div class="bookCard" onclick="openBookProperties(this)">
            <span class="hidden" id="bookId">${book.id}</span>
          <img src="${book.img}" alt="${book.title}">
          <div class="bookProperties">
              <h2>${(book.title).slice(0, 40) + (book.title.length > 40 ? "..." : "")}</h2>
              <p>Author: ${book.author}</p>
              <p>Description: ${(book.description).slice(0, 250) + (book.description.length > 250 ? "..." : "")}</p>
          </div>
      </div>
    `

    )
    .join("");

  prevPageButton.classList.toggle("hidden", currentPage === 1);
  nextPageButton.classList.toggle("hidden", end >= totalBooks);
}

function changePage(direction) {
  currentPage += direction;
  const input = document.getElementById("searchInput").value;
  searchBooks(input);
}

function openBookProperties() {
  bookProperties.style.display = "block";
}

async function openBookProperties(svgElement) {
    const black = document.querySelector(".black");
    const showBook = document.querySelector("#showBookProperties")
    black.classList.remove("hidden");
    const bookId = svgElement.querySelector("#bookId").outerText;
    const response = await axios.get(`${url}/${bookId}`)
    console.log(response.data);
    showBook.innerHTML = `
    <img src="${response.data.img}" alt="${response.data.title}">
    <h2>${response.data.title}</h2>
    <p>Author: ${response.data.author}</p>
    <p>Description: ${response.data.description}</p>
    <p>Categories: ${response.data.categories}</p>
    <p>Page Count: ${response.data.pageCount}</p>
    <p>ID: ${response.data.id}</p>
    <p>ISBN: ${response.data.ISBN}</p>
    <button>close</button>
    `
    showBook.classList.remove("hidden")
}