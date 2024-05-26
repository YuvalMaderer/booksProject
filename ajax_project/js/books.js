const url = 'http://localhost:8001/books';
const bookProperties = document.getElementById("popupBook");

document.getElementById('searchBookByStr').addEventListener('submit', async function(e) {
    e.preventDefault();
    const input = document.getElementById('searchInput').value.trim();
    const displayBooksBySearch = document.getElementById('displayBooksBySearch');
    displayBooksBySearch.innerHTML = '';
    const response = await axios.get(url);

    for (const book of response.data) {
        if (book.title.toLowerCase().includes(input.toLowerCase())) {
            displayBooksBySearch.innerHTML += 
            `
            <div class="bookCard" onclick="openBookProperties()">
                <img src="${book.img}" alt="${book.title}">
                <h2>${book.title}</h2>
                <p>Author: ${book.author}</p>
                <p>Description: ${book.description}</p>
            </div>
            `;
        }
    }
});

function openBookProperties() {
    bookProperties.style.display = 'block';
}