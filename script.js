document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('search-form');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        search(); // Call the search function
    });
});

// Existing JavaScript functions

function toggleSearchOptions() {
    const category = document.getElementById('search-category').value;
    const genreOptions = document.getElementById('genre-dropdown');
    const searchInput = document.getElementById('search-input');

    console.log(`Category selected: ${category}`);

    if (category === 'genre') {
        genreOptions.style.display = 'block'; // Show genre dropdown
        searchInput.style.display = 'none'; // Hide search input
    } else {
        genreOptions.style.display = 'none'; // Hide genre dropdown
        searchInput.style.display = 'block'; // Show search input
        searchInput.placeholder = category === 'author' ? 'Search by Author Name' : 'Search by Book Name';
    }
}

function search() {
    const category = document.getElementById('search-category').value;
    const query = document.getElementById('search-input').value.trim();
    const genre = document.getElementById('genre-dropdown').value;

    console.log(`Searching with category: ${category}, query: ${query}, genre: ${genre}`);

    if (category === 'book-name' && query) {
        searchByBookName(query);
    } else if (category === 'genre' && genre) {
        searchByGenre(genre);
    } else if (category === 'author' && query) {
        searchByAuthor(query);
    } else {
        console.warn('No valid search parameters provided.');
        alert('Please enter a book name, select a genre, or enter an author\'s name.');
    }
}

function searchByBookName(bookName) {
    const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(bookName)}`;

    console.log(`Fetching books by name from URL: ${url}`);

    fetch(url)
        .then(response => {
            console.log('Response received:', response);
            return response.json();
        })
        .then(data => {
            console.log('Data received for book search:', data);
            displayBooks(data.docs);
        })
        .catch(error => console.error('Error:', error));
}

function searchByGenre(genre) {
    const url = `https://openlibrary.org/subjects/${genre}.json`;

    console.log(`Fetching books by genre from URL: ${url}`);

    fetch(url)
        .then(response => {
            console.log('Response received:', response);
            return response.json();
        })
        .then(data => {
            console.log('Data received for genre search:', data);
            displayBooks(data.works);
        })
        .catch(error => console.error('Error:', error));
}

function searchByAuthor(author) {
    const url = `https://openlibrary.org/search.json?author=${encodeURIComponent(author)}`;

    console.log(`Fetching books by author from URL: ${url}`);

    fetch(url)
        .then(response => {
            console.log('Response received:', response);
            return response.json();
        })
        .then(data => {
            console.log('Data received for author search:', data);
            displayBooks(data.docs);
        })
        .catch(error => console.error('Error:', error));
}

function displayBooks(books) {
    console.log('Displaying books:', books);

    // Ensure main element exists
    const mainElement = document.querySelector('main');
    if (!mainElement) {
        console.error('Main element not found.');
        return;
    }

    const container = document.getElementById('book-container') || createBookContainer(mainElement);

    container.innerHTML = ''; // Clear existing content

    if (books && Array.isArray(books) && books.length > 0) {
        books.forEach(book => {
            const bookDiv = document.createElement('div');
            bookDiv.className = 'book';
            bookDiv.style.cursor = 'pointer';

            const bookKey = book.key ? book.key.split('/').pop() : null;
            console.log('Book key:', bookKey);

            bookDiv.addEventListener('click', () => {
                if (bookKey) {
                    fetchBookDetails(bookKey); // Fetch and display book details
                }
            });

            bookDiv.innerHTML = `
                <img src="${getCoverImageUrl(book)}" alt="Cover for ${book.title}" style="width: 100%; height: 120px;">
                <h2 style="font-weight: bold; font-size: 12px;">${book.title || 'No title available'}</h2>
                <p style="font-weight: bold; font-size: 12px;"><strong>Published Year:</strong> ${book.first_publish_year || 'Unknown'}</p>
                <p style="font-weight: bold; font-size: 12px;"><strong>Authors:</strong> ${book.author_name ? book.author_name.join(', ') : 'Unknown'}</p>
                <p style="font-size: 12px;"><strong>Print Disabled:</strong> ${book.printdisabled ? 'Yes' : 'No'}</p>
                <p style="font-size: 12px;"><strong>Public Scan:</strong> ${book.public_scan ? 'Yes' : 'No'}</p>
                <p style="font-size: 12px;"><strong>Description:</strong> ${book.description || 'No description available'}</p>
            `;

            container.appendChild(bookDiv);
        });
    } else {
        container.innerHTML = '<p>No works found</p>';
    }
}

function createBookContainer(mainElement) {
    const container = document.createElement('div');
    container.id = 'book-container';
    mainElement.appendChild(container);
    return container;
}

function getCoverImageUrl(book) {
    if (book.cover_id) {
        return `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`;
    } else if (book.cover_edition_key) {
        return `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`;
    } else if (book.isbn && Array.isArray(book.isbn) && book.isbn.length > 0) {
        return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg`;
    }
    return 'https://via.placeholder.com/120x180.png?text=No+Cover+Available';
}

function fetchBookDetails(workKey) {
    const url = `https://openlibrary.org/works/${workKey}.json`;

    console.log(`Fetching book details from URL: ${url}`);

    fetch(url)
        .then(response => {
            console.log('Response received:', response);
            return response.json();
        })
        .then(data => {
            console.log('Book details data:', data);
            const container = document.getElementById('book-container');
            if (container) {
                container.innerHTML = `
                    <div class="book-details-container">
                        <h1>${data.title || 'No title available'}</h1>
                        <div class="book-cover-images">
                            ${data.covers ? data.covers.map(id => `<img src="https://covers.openlibrary.org/b/id/${id}-L.jpg" alt="${data.title} cover">`).join('') : ''}
                        </div>
                        <p><strong>Description:</strong> ${data.description || 'No description available'}</p>
                        <p><strong>Subjects:</strong> ${data.subjects ? data.subjects.join(', ') : 'No subjects available'}</p>
                        <p><strong>Authors:</strong> ${data.authors ? data.authors.map(author => author.author.key).join(', ') : 'No authors available'}</p>
                        <p><strong>Publication Date:</strong> ${data.first_publish_date || 'No publication date available'}</p>
                        <p><strong>Subject People:</strong> ${data.subject_people ? data.subject_people.join(', ') : 'No subject people available'}</p>
                        <p><strong>Subject Places:</strong> ${data.subject_places ? data.subject_places.join(', ') : 'No subject places available'}</p>
                        <p><strong>Subject Times:</strong> ${data.subject_times ? data.subject_times.join(', ') : 'No subject times available'}</p>
                        <p><strong>Key:</strong> ${data.key || 'No key available'}</p>
                    </div>
                `;
            } else {
                console.error('Book container not found.');
            }
        })
        .catch(error => console.error('Error fetching book details:', error));
}
