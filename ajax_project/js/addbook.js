
document
        .getElementById("createBookForm")
        .addEventListener("submit", async function (event) {
          event.preventDefault();
          const fetchedNewBook = document.getElementById("fetchedNewBook");
          fetchedNewBook.innerHTML = '<div class="fetchedNewBook"></div>';
          const title = document.getElementById("createBookTitle").value;
          const author = document.getElementById("createBookAuthor").value;
          const numPages = document.getElementById("createBookNumPages").valueAsNumber;
          const description = document.getElementById("createBookDescription").value;
          const img = document.getElementById("createBookImage").value;          
          const categories = document.getElementById("createBookCategories").value;          
          const ISBN = document.getElementById("createBookISBN").value;
          const copies = document.getElementById("createBookNumCopies").valueAsNumber;
          try {
            if (getAllBooksISBN(ISBN)) {
              fetchedNewBook.innerHTML += `<p>Book ${title} Already Exists, Please Try Again!</p>`;
              return;
            }
            await axios.post("http://localhost:8001/books", {
              title,
              author: author.split(", "),
              numPages,
              description,
              img,
              categories: categories.split(", "),
              ISBN,
              copies
            });
            fetchedNewBook.innerHTML += `<p>Book ${title} Added Successfully</p>`;
            // getAllBooks(currentPage);
          } catch (error) {
            console.error("Error creating book:", error);
            fetchedNewBook.innerHTML += `<p>Error Adding New Book ${title}</p>`;
          }
        });

async function getAllBooksISBN(isbn) {
  const dataISBN = await axios.get("http://localhost:8001/books");
  dataISBN.data.forEach(element => {
    if(element.ISBN == isbn) {
      return true;
    }
    return false;
  });
  
}        

getAllBooksISBN();