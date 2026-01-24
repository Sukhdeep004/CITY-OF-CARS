/* ===================================
   WALLPAPERS PAGE JAVASCRIPT
   =================================== */

const wallpaperSearch = document.getElementById('wallpaperSearch');
const wallpaperCategory = document.getElementById('wallpaperCategory');
const resetFilters = document.getElementById('resetFilters');
const wallpaperItems = document.querySelectorAll('.wallpaper-item');

function filterWallpapers() {
    const searchTerm = wallpaperSearch?.value.toLowerCase() || '';
    const categoryFilter = wallpaperCategory?.value || '';

    wallpaperItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category') || '';
        const itemText = item.textContent.toLowerCase();

        const matchesSearch = itemText.includes(searchTerm);
        const matchesCategory = !categoryFilter || itemCategory === categoryFilter;

        if (matchesSearch && matchesCategory) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

if (wallpaperSearch) wallpaperSearch.addEventListener('input', filterWallpapers);
if (wallpaperCategory) wallpaperCategory.addEventListener('change', filterWallpapers);

if (resetFilters) {
    resetFilters.addEventListener('click', () => {
        if (wallpaperSearch) wallpaperSearch.value = '';
        if (wallpaperCategory) wallpaperCategory.value = '';
        filterWallpapers();
    });
}

function downloadWallpaper(title, imageSrc) {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `${title}-wallpaper.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.showNotification(`${title} downloaded successfully!`, 'success');
}

function showNotification(message, type) {
    // Simple notification function implementation
    alert(message);
}
