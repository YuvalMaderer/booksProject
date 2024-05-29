let snackbarTimeout

document
        .getElementById("createBookForm")
        .addEventListener("submit", async function (event) {
          event.preventDefault();
          const title = document.getElementById("createBookTitle").value;
          const author = document.getElementById("createBookAuthor").value;
          const pageCount = parseInt(document.getElementById("createBookNumPages").value);
          const description = document.getElementById("createBookDescription").value;
          const img = document.getElementById("createBookImage").value;          
          const categories = document.getElementById("createBookCategories").value;          
          const ISBN = document.getElementById("createBookISBN").value;
          const copies = parseInt(document.getElementById("createBookNumCopies").value);
          if (pageCount < 1) {
            showSnackbar('Page count must be greater than zero');
            return;
          }
          if (copies < 0) {
            showSnackbar('Number of copies must be positive');
            return;
          }
          try {
            if (await getAllBooksISBN(ISBN)) {
              showSnackbar(`Book ${title} Already Exists, Please Try Again!`)
              return;
            }
            await axios.post("http://localhost:8001/books", {
              title,
              author: author.split(", "),
              pageCount,
              description,
              img,
              categories: categories.split(", "),
              ISBN,
              copies
            });
            addToHistory("create", ISBN);
            showSnackbar(`Book ${title} Added and 
            History Updated Successfully`)
            resetInputs()
          } catch (error) {
            showSnackbar(`Error Adding New Book ${title}`)
          }
        });

async function getAllBooksISBN(isbn) {
  try {
    const response = await axios.get("http://localhost:8001/books");
    const books = response.data;

    const exists = books.some(book => book.ISBN === isbn);
    return exists;
  } catch (error) {
    console.error('Error fetching books:', error);
    return false; 
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

function resetInputs() {
  document.getElementById("createBookTitle").value = "";
  document.getElementById("createBookAuthor").value = "";
  document.getElementById("createBookNumPages").value = "";
  document.getElementById("createBookDescription").value = "";
  document.getElementById("createBookImage").value = "";          
  document.getElementById("createBookCategories").value = "";          
  document.getElementById("createBookISBN").value = "";
  document.getElementById("createBookNumCopies").value = "";
}

async function addToHistory(oper, bID) {
  const historyItem = {
    operation: oper,
    time: new Date().toISOString(),
    bookId: bID  
  };
  try {
    await saveToHistory(historyItem);
  } catch (error) {
    showSnackbar('Error adding history item');
  }
}

async function saveToHistory(historyItem) {
  try {
    await axios.post('http://localhost:8001/history', historyItem);
  } catch (error) {
    showSnackbar('Error saving history item:');
  }
}


