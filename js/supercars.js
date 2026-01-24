/* ===================================
   SUPERCARS PAGE JAVASCRIPT
   =================================== */

const supercarSearch = document.getElementById('supercarSearch');
const supercarBrand = document.getElementById('supercarBrand');
const resetFilters = document.getElementById('resetFilters');
const supercarItems = document.querySelectorAll('.supercar-item');
const bootstrap = window.bootstrap; // Declare the bootstrap variable

function filterSupercars() {
    const searchTerm = supercarSearch?.value.toLowerCase() || '';
    const brandFilter = supercarBrand?.value || '';

    supercarItems.forEach(item => {
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

if (supercarSearch) supercarSearch.addEventListener('input', filterSupercars);
if (supercarBrand) supercarBrand.addEventListener('change', filterSupercars);

if (resetFilters) {
    resetFilters.addEventListener('click', () => {
        if (supercarSearch) supercarSearch.value = '';
        if (supercarBrand) supercarBrand.value = '';
        filterSupercars();
    });
}

function openSupercarModal(title, imageSrc) {
    const modal = document.getElementById('supercarModal');
    if (modal) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalImage').src = imageSrc;
        document.getElementById('downloadBtn').href = imageSrc;
        document.getElementById('downloadBtn').download = `${title}.jpg`;
        
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
    }
}
