const url = "http://localhost:8001/books";
const bookProperties = document.getElementById("popupBook");
const displayBooksBySearch = document.getElementById("displayBooksBySearch");
// const spinner = document.querySelector(".spinner");
const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");
const pageNumberElement = document.getElementById("pageNumber");
const booksPerPage = 9;
let currentPage = 1;
let totalBooks = 0;
let snackbarTimeout

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
  pageNumberElement.innerText = currentPage;
}

function changePage(direction) {
  currentPage += direction;
  const input = document.getElementById("searchInput").value;
  searchBooks(input);
}

function openBookProperties() {
  bookProperties.style.display = "block";
}

async function openBookProperties(svgElement) {
    const black = document.querySelector(".black");
    const showBook = document.querySelector("#showBookProperties")
    black.classList.remove("hidden");
    const bookId = svgElement.querySelector("#bookId").outerText;
    const response = await axios.get(`${url}/${bookId}`)
    showBook.innerHTML = `
    <div class="topCard">

      <img id="image" src="${response.data.img}" alt="${response.data.title}">
      <button onclick="editBook(this)" class="edit" id="editButton"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
      <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
    </svg></button>
      <button class="close" onClick="closeBook()"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
    </svg></button>

    </div>
    <form id="updateBookForm">
    <label>Title: </label>
    <h2 id="updateBookTitle">${response.data.title}</h2>
    <label>Author: </label>
    <p id="updateBookAuthor">${response.data.author}</p>
    <label>Description: </label>
    <p id="updateBookDescription">${response.data.description}</p>
    <label>Categories: </label>
    <p id="updateBookCategories">${response.data.categories}</p>
    <label>Page Count: </label>
    <p id="updateBookNumPages">${response.data.pageCount}</p>
    <label>ID: </label>
    <p id="updateBookId">${response.data.id}</p>
    <label>ISBN: </label>
    <p id="updateBookISBN">${response.data.ISBN}</p>
    <label>Copies: </label>
    <p id="updateBookNumCopies">${response.data.copies}</p>
    <button type="submit" onClick="updateBook()" class="save hidden" id="save">Save</button>
    </form>
    `
    showBook.classList.remove("hidden")
}
 
function closeBook() {
  const black = document.querySelector(".black");
  const showBook = document.querySelector("#showBookProperties")
  black.classList.add("hidden");
  showBook.classList.add("hidden");
}

function editBook(svgElement) {
  // Select all paragraph elements inside foreignObject elements within svgElement
  const paragraphs = svgElement.parentNode.parentNode.querySelectorAll('p');
  const h2 = svgElement.parentNode.parentNode.querySelectorAll('h2');
  const saveButton = document.getElementById("save");

  paragraphs.forEach(paragraph => {
    if (paragraph.id === "updateBookId") {
      const p = document.createElement("p");
      p.textContent = paragraph.textContent;
      p.id = paragraph.id;
      p.setAttribute('required', '');
      paragraph.parentNode.replaceChild(p, paragraph);
    } else {
      const input = document.createElement('input');
      input.setAttribute('required', '');
      input.type = 'text';
      input.value = paragraph.textContent;
      input.id = paragraph.id;
      paragraph.parentNode.replaceChild(input, paragraph);
    }

  });

  h2.forEach(h => {
    const input = document.createElement('input');
    input.type = 'text';
    input.setAttribute('required', '');
    input.value = h.textContent;
    input.id = h.id;
    h.parentNode.replaceChild(input, h);
  });

  const editButton = document.querySelector("#editButton");
  if (editButton) {
    editButton.classList.add("hidden");
    saveButton.classList.remove("hidden");
  }
}

function updateBook() {
  document
      .getElementById("updateBookForm")
      .addEventListener("submit", async function (event) {
        event.preventDefault();
        const bookId = document.getElementById("updateBookId").innerText;
        const img = document.getElementById("image").src;
        const title = document.getElementById("updateBookTitle").value;
        const author = document.getElementById("updateBookAuthor").value;
        const numPages = parseInt(document.getElementById("updateBookNumPages").value);
        const description = document.getElementById("updateBookDescription").value;
        const categories = document.getElementById("updateBookCategories").value;          
        const ISBN = document.getElementById("updateBookISBN").value;
        const copies = parseInt(document.getElementById("updateBookNumCopies").value);
        try {
          await axios.put(`http://localhost:8001/books/${bookId}`, {
            title,
            author: author.split(", "),
            numPages,
            description,
            img,
            categories: categories.split(", "),
            ISBN,
            copies
          });
          showSnackbar("Book updated successfully!");
        } catch (error) {
          showSnackbar("Error updating book");
        }
      });
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

