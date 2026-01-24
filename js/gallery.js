/* ===================================
   GALLERY PAGE JAVASCRIPT
   =================================== */

// Gallery filtering
const gallerySearch = document.getElementById('gallerySearch');
const galleryBrand = document.getElementById('galleryBrand');
const galleryType = document.getElementById('galleryType');
const resetFilters = document.getElementById('resetFilters');
const galleryItems = document.querySelectorAll('.gallery-item');

function filterGallery() {
    const searchTerm = gallerySearch?.value.toLowerCase() || '';
    const brandFilter = galleryBrand?.value || '';
    const typeFilter = galleryType?.value || '';

    galleryItems.forEach(item => {
        const itemBrand = item.getAttribute('data-brand') || '';
        const itemType = item.getAttribute('data-type') || '';
        const itemText = item.textContent.toLowerCase();

        const matchesSearch = itemText.includes(searchTerm);
        const matchesBrand = !brandFilter || itemBrand === brandFilter;
        const matchesType = !typeFilter || itemType === typeFilter;

        if (matchesSearch && matchesBrand && matchesType) {
            item.style.display = 'block';
            item.style.animation = 'fadeIn 0.3s ease';
        } else {
            item.style.display = 'none';
        }
    });
}

if (gallerySearch) gallerySearch.addEventListener('input', filterGallery);
if (galleryBrand) galleryBrand.addEventListener('change', filterGallery);
if (galleryType) galleryType.addEventListener('change', filterGallery);

if (resetFilters) {
    resetFilters.addEventListener('click', () => {
        if (gallerySearch) gallerySearch.value = '';
        if (galleryBrand) galleryBrand.value = '';
        if (galleryType) galleryType.value = '';
        filterGallery();
    });
}

// Open gallery modal
function openGalleryModal(title, imageSrc) {
    const modal = document.getElementById('galleryModal');
    if (modal) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalImage').src = imageSrc;
        document.getElementById('downloadBtn').href = imageSrc;
        document.getElementById('downloadBtn').download = `${title}.jpg`;
        
        const bootstrapModal = new window.bootstrap.Modal(modal);
        bootstrapModal.show();
    }
}

// Lazy load styles
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);
