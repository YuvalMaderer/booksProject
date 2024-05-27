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
const spinner = document.getElementById("spinner");

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
  spinner.classList.remove("hidden");
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
      showSnackbar("No books found")
      spinner.classList.add("hidden");
    } else {
      displayPage(filteredBooks);
    }
  } catch (error) {
      showSnackbar("Error fetching books")
      spinner.classList.add("hidden");
  } finally {
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
              <p>Author: ${(book.author).slice(0, 10) + (book.author.length > 10 ? "..." : "")}</p>
              <p>Description: ${(book.description).slice(0, 250) + (book.description.length > 250 ? "..." : "")}</p>
          </div>
      </div>
    `

    )
    .join("");

  prevPageButton.classList.toggle("hidden", currentPage === 1);
  nextPageButton.classList.toggle("hidden", end >= totalBooks);
  pageNumberElement.innerText = currentPage;
  spinner.classList.add("hidden");
}

function changePage(direction) {
  currentPage += direction;
  const input = document.getElementById("searchInput").value;
  searchBooks(input);
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
    <p id="updateBookTitle">${response.data.title}</p>
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
    <button type="submit" onClick="updateBook(this)" class="save hidden" id="save">Save</button>
    <button type="button" onClick="deleteBook()" class="delete hidden" id="delete">Delete</button>
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
  const saveButton = document.getElementById("save");
  const deleteButton = document.getElementById("delete");

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

  const editButton = document.querySelector("#editButton");
  if (editButton) {
    editButton.classList.add("hidden");
    saveButton.classList.remove("hidden");
    deleteButton.classList.remove("hidden");
  }
}

function updateBook(svgElement) {
  document
      .getElementById("updateBookForm")
      .addEventListener("submit", async function (event) {
        console.log(event)
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
        const inputs = svgElement.parentNode.querySelectorAll('input[type="text"]');
        const editButton = document.querySelector("#editButton");
        const saveButton = document.getElementById("save");
        const deleteButton = document.getElementById("delete");
        if (numPages < 1) {
          showSnackbar('Page count must be greater than zero');
          return;
        }
        if (copies < 0) {
          showSnackbar('Number of copies must be positive');
          return;
        }
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
          inputs.forEach(input => {
            const paragraph = document.createElement('p');
            paragraph.textContent = input.value;
            paragraph.id = input.id;
            input.parentNode.replaceChild(paragraph, input);
          });
          editButton.classList.remove("hidden");
          saveButton.classList.add("hidden");
          deleteButton.classList.add("hidden");
          showSnackbar("Book updated and History item added successfully!");
          addToHistory("update",bookId);
        } catch (error) {
          showSnackbar("Error updating book");
        }
      });
}

function deleteBook() {
  const bookId = document.getElementById("updateBookId").innerText;
  const title = document.getElementById("updateBookTitle").innerText;
  const black = document.querySelector(".black");
  const showBook = document.querySelector("#showBookProperties")
  
  axios.delete(`http://localhost:8001/books/${bookId}`)
    .then(() => {
      showSnackbar(`Book ${title} deleted and History item added successfully!`);
      addToHistory("delete",bookId);
      black.classList.add("hidden");
      showBook.classList.add("hidden");
    })
    .catch((error) => {
      console.log(error);
      showSnackbar(`There was an error deleting the book ${title}`);
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


async function addToHistory(oper, bID) {
  const historyItem = {
    operation: oper,
    time: new Date().toISOString(),
    bookId: bID  
  };
  try {
    await saveToHistory(historyItem);
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
  const table = document.getElementById("operations");
  table.innerHTML = '';
  try {
    const response = await axios.get("http://localhost:8001/history");
    response.data.forEach(item => {
      table.innerHTML += `
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
