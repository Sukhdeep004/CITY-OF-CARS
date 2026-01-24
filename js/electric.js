/* ===================================
   ELECTRIC CARS PAGE JAVASCRIPT
   =================================== */

const electricSearch = document.getElementById('electricSearch');
const electricBrand = document.getElementById('electricBrand');
const resetFilters = document.getElementById('resetFilters');
const electricItems = document.querySelectorAll('.electric-item');

function filterElectric() {
    const searchTerm = electricSearch?.value.toLowerCase() || '';
    const brandFilter = electricBrand?.value || '';

    electricItems.forEach(item => {
        const itemBrand = item.getAttribute('data-brand') || '';
        const itemText = item.textContent.toLowerCase();

        const matchesSearch = itemText.includes(searchTerm);
        const matchesBrand = !brandFilter || itemBrand === brandFilter;

        if (matchesSearch && matchesBrand) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

if (electricSearch) electricSearch.addEventListener('input', filterElectric);
if (electricBrand) electricBrand.addEventListener('change', filterElectric);

if (resetFilters) {
    resetFilters.addEventListener('click', () => {
        if (electricSearch) electricSearch.value = '';
        if (electricBrand) electricBrand.value = '';
        filterElectric();
    });
}

function openElectricModal(title, imageSrc) {
    const modal = document.getElementById('electricModal');
    if (modal) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalImage').src = imageSrc;
        document.getElementById('downloadBtn').href = imageSrc;
        document.getElementById('downloadBtn').download = `${title}.jpg`;
        
        const bootstrap = window.bootstrap; // Declare the bootstrap variable
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
    }
}
