const productContainer = document.getElementById('product-container');
const loadMoreButton = document.getElementById('load-more');
const searchBar = document.getElementById('search-bar');
const sortOptions = document.getElementById('sort-options');
const loadingSpinner = document.getElementById('loading-spinner');
const categoryFilters = document.getElementById('category-filters');

let products = [];
let displayedProducts = 10; 
const loadCount = 10;


async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) throw new Error('Network response was not ok.');
        products = await response.json();
        populateCategoryFilters();
        displayProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
    } finally {
        loadingSpinner.style.display = 'none';
    }
}


function populateCategoryFilters() {
    const categories = [...new Set(products.map(p => p.category))];
    categoryFilters.innerHTML = '';  
    categories.forEach(category => {
        // const pascalCaseCategory=cateory.toLowerCase().split('').map(word=>word.chatAt(0).toUpperCase()+word.slice(1)).join(' ');
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = category;
        checkbox.classList.add('category-checkbox');
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(category));
        categoryFilters.appendChild(label);
    });

   
    categoryFilters.addEventListener('change', () => {
        displayedProducts = 10;  
        displayProducts();
    });
}


function displayProducts() {
    productContainer.innerHTML = '';
    let filteredProducts = products;

    const searchQuery = searchBar.value.toLowerCase();
    const selectedCategories = Array.from(categoryFilters.querySelectorAll('input:checked')).map(cb => cb.value);
    const sortOrder = sortOptions.value;

    if (searchQuery) {
        filteredProducts = filteredProducts.filter(p =>
            p.title.toLowerCase().includes(searchQuery)
        );
    }
    if (selectedCategories.length > 0) {
        filteredProducts = filteredProducts.filter(p => selectedCategories.includes(p.category));
    }
    if (sortOrder) {
        filteredProducts.sort((a, b) => {
            if (sortOrder === 'price-asc') return a.price - b.price;
            if (sortOrder === 'price-desc') return b.price - a.price;
            return 0;
        });
    }

    const productsToDisplay = filteredProducts.slice(0, displayedProducts);
    productsToDisplay.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('role', 'article');
        card.setAttribute('aria-labelledby', `product-title-${product.id}`);
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div class="info">
                <h2 id="product-title-${product.id}">${product.title}</h2>
                <p>${product.description.substring(0, 60)}...</p>
                <div class="price">$${product.price}</div>
            </div>
        `;
        productContainer.appendChild(card);
    });

    if (filteredProducts.length > displayedProducts) {
        loadMoreButton.style.display = 'block';
    } else {
        loadMoreButton.style.display = 'none';
    }
}


function loadMoreProducts() {
    displayedProducts += loadCount;
    displayProducts();
}


searchBar.addEventListener('input', () => {
    displayedProducts = 10;  
    displayProducts();
});
sortOptions.addEventListener('change', () => {
    displayedProducts = 10;  
    displayProducts();
});
loadMoreButton.addEventListener('click', loadMoreProducts);


function init() {
    loadingSpinner.style.display = 'block';
    fetchProducts();
}

init();

document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});