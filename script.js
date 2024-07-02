let currentPage = 0; // Initialize currentPage to track the current page number, index being 0
const limit = 15; // Number of GIFs to fetch per page

// Event listener for form submission to handle keyword search
document.getElementById('search-form').addEventListener('submit',(event) => {
    event.preventDefault(); // Prevent default form submission
    currentPage = 0; // Reset currentPage to the first page on new search
    const keyword = document.getElementById('keyword').value; // Get search keyword
    fetchGifs(keyword, currentPage); // Fetch GIFs based on the keyword submitted for the first page
});

// Event listener for pagination links
document.getElementById("pagination").addEventListener("click",(event) =>{
    if (event.target.classList.contains("page-link")) { // Check if clicked element is a pagination link
        event.preventDefault(); // Prevent default link behavior, (to implement custom pagination behavior)

        const keyword = document.getElementById("keyword").value; // Get current search keyword
        const ariaLabel = event.target.getAttribute("aria-label"); // Get aria-label attribute of clicked link

        console.log('Clicked:', event.target.textContent); // Log which page link was clicked

        // Determine action based on aria-label (Previous, Next) or page number
        if (ariaLabel === "Previous") {
            if (currentPage > 0) { // Decrement currentPage for Previous button, if not on the first page
                currentPage--;
            }
        } else if (ariaLabel === "Next") {
            currentPage++; // Increment currentPage for Next button
        } else {
            currentPage = parseInt(event.target.textContent) - 1; // Set currentPage to clicked page number
        }

        fetchGifs(keyword, currentPage); // Fetch GIFs for updated currentPage
    }
});

// Function to fetch GIFs from Giphy API based on keyword and page number
function fetchGifs(keyword, page) {
    const apiKey = 'WVh1G4MHalGoeWgBfwE7W2xq4pNDLA34'; // Your Giphy API key
    const offset = (page * limit); // Calculate offset based on current page and limit (page 0 * 18 = offset of 0, page 1 * 18 = offset of 18, page 2 *18 = offset of 36 ...)
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${keyword}&limit=${limit}&offset=${offset}`;

    console.log('Fetching Gifs for page:', page, 'with offset:', offset); // Log API fetch details

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayGifs(data.data); // Call displayGifs function with fetched data
            updatePagination(data.pagination.total_count, page); // Update pagination based on total count and current page
        })
        .catch(error => console.error('Error fetching data:', error)); // Log error if fetch fails - console.error will send error msg to the console for debugging purposes
}

// Function to display fetched GIFs in the results section
function displayGifs(gifs) {
    const results = document.getElementById('results'); // Get results container
    results.innerHTML = ''; // Clear previous results

    gifs.forEach(gif => {
        const img = document.createElement('img'); // Create <img> element for each GIF
        img.src = gif.images.fixed_width.url; // Set image source from API data
        img.alt = gif.title; // Set alt text from API data
        results.appendChild(img); // Append image to results container
    });
}

// Function to update pagination controls based on total GIF count and current page
function updatePagination(totalCount, page) {
    const pagination = document.getElementById("pagination"); // Get pagination container
    const totalPages = Math.ceil(totalCount / limit); // Calculate total pages based on total GIFs and limit
    const maxPagesToShow = 5; // Limit to 5 page links

    pagination.innerHTML = ""; // Clear previous pagination links

    // Create Previous button
    const prevLi = document.createElement("li");
    prevLi.className = `page-item ${page === 0 ? "disabled" : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`;
    pagination.appendChild(prevLi);

    // Determine start and end pages to show, centered around current page
    let startPage = Math.max(0, page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, page + Math.floor(maxPagesToShow / 2));

    // Adjust startPage and endPage if not enough pages are available
    if (endPage - startPage < maxPagesToShow - 1) {
        if (startPage === 0) {
            endPage = Math.min(totalPages - 1, endPage + (maxPagesToShow - (endPage - startPage + 1)));
        } else {
            startPage = Math.max(0, startPage - (maxPagesToShow - (endPage - startPage + 1)));
        }
    }

    // Create pagination links for visible pages
    for (let i = startPage; i <= endPage; i++) {
        const pageLi = document.createElement("li");  // create a new <li> element (pagination link)
        pageLi.className = `page-item ${page === i ? 'active' : ""}`; // Set the class attribute based on whether this is the active page (is the page i? -> active, otherwise set to "")
        pageLi.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`; // Set the inner HTML content of the <li> with a link to the page number
        pagination.appendChild(pageLi); // Append the <li> element to the pagination container
    }

    // Create Next button
    const nextLi = document.createElement("li"); // again creating a new <li> element (for next)
    nextLi.className = `page-item ${page === totalPages - 1 ? "disabled" : ''}`; 
    nextLi.innerHTML = `<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>`;
    pagination.appendChild(nextLi);

    console.log('Pagination updated for page:', page, 'Total pages:', totalPages); // Log pagination update
}

