/* ===================================
   PARTS PAGE JAVASCRIPT
   =================================== */

let cartCount = 0;
let cartTotal = 0;

const partsSearch = document.getElementById('partsSearch');
const categoryFilter = document.getElementById('categoryFilter');
const resetFilters = document.getElementById('resetFilters');
const partsList = document.getElementById('partsList');

function filterParts() {
    const searchTerm = partsSearch?.value.toLowerCase() || '';
    const category = categoryFilter?.value || '';
    const items = document.querySelectorAll('[data-category]');

    items.forEach(item => {
        const itemCategory = item.getAttribute('data-category') || '';
        const itemText = item.textContent.toLowerCase();

        const matchesSearch = itemText.includes(searchTerm);
        const matchesCategory = !category || itemCategory === category;

        if (matchesSearch && matchesCategory) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

if (partsSearch) partsSearch.addEventListener('input', filterParts);
if (categoryFilter) categoryFilter.addEventListener('change', filterParts);

if (resetFilters) {
    resetFilters.addEventListener('click', () => {
        if (partsSearch) partsSearch.value = '';
        if (categoryFilter) categoryFilter.value = '';
        filterParts();
    });
}

// Cart functionality
document.addEventListener('click', (e) => {
    if (e.target.closest('.product-overlay .btn-primary')) {
        const productCard = e.target.closest('.product-card');
        if (productCard) {
            const productName = productCard.querySelector('h5')?.textContent;
            const priceText = productCard.querySelector('.price')?.textContent;
            const price = parseInt(priceText?.replace(/[^0-9]/g, '')) || 0;

            cartCount++;
            cartTotal += price;

            updateCartDisplay();
            window.showNotification(`${productName} added to cart!`, 'success');
        }
    }
});

function updateCartDisplay() {
    const cartCountEl = document.getElementById('cartCount');
    const cartTotalEl = document.getElementById('cartTotal');
    
    if (cartCountEl) cartCountEl.textContent = cartCount;
    if (cartTotalEl) cartTotalEl.textContent = `$${cartTotal.toLocaleString()}`;
}

// Initialize cart display
updateCartDisplay();

function showNotification(message, type) {
    console.log(`Notification (${type}): ${message}`);
}
