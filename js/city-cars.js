/* ===================================
   CITY CARS PAGE JAVASCRIPT
   =================================== */

const citySearch = document.getElementById('citySearch');
const cityBrand = document.getElementById('cityBrand');
const resetFilters = document.getElementById('resetFilters');
const cityCars = document.querySelectorAll('.city-car-item');
const bootstrap = window.bootstrap; // Declare the bootstrap variable

function filterCityCars() {
    const searchTerm = citySearch?.value.toLowerCase() || '';
    const brandFilter = cityBrand?.value || '';

    cityCars.forEach(item => {
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

if (citySearch) citySearch.addEventListener('input', filterCityCars);
if (cityBrand) cityBrand.addEventListener('change', filterCityCars);

if (resetFilters) {
    resetFilters.addEventListener('click', () => {
        if (citySearch) citySearch.value = '';
        if (cityBrand) cityBrand.value = '';
        filterCityCars();
    });
}

function openCityModal(title, imageSrc) {
    const modal = document.getElementById('cityModal');
    if (modal) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalImage').src = imageSrc;
        
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
    }
}
