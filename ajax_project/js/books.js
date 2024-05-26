const url = 'http://localhost:8001/books'
const bookProperties = document.getElementById("popupBook")

document.getElementById('searchBookByStr').addEventListener('submit', async function(e) {
    e.preventDefault();
    const input = document.getElementById('searchInput').value;
    const displayBooksBySearch = document.getElementById('displayBooksBySearch');
    const spinner = document.querySelector(".spinner");
    displayBooksBySearch.innerHTML = ''
    const response = await axios.get(url);
    console.log(response.data);
    for (const book of response.data) {
        if (book.title.includes(input)) {
            displayBooksBySearch.innerHTML += 
            `
            <div class="bookCard" onclick="openBookProperties()">
                <img src=${book.img}
                <h2>${book.title}</h2>
                <p>Author: ${book.author}</p>
                <p>Author: ${book.description}</p>
            </div>
            `;
        }
    }
})

function openBookProperties() {
    bookProperties.style.display = 'block';
}