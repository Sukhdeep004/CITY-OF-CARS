/* ===================================
   COMMUNITY PAGE JAVASCRIPT
   =================================== */

const postBtn = document.getElementById('postBtn');
const postText = document.getElementById('postText');
const feedContainer = document.getElementById('feedContainer');

// Declare showNotification function
function showNotification(message, type) {
    alert(message); // Simple implementation using alert for demonstration
}

// Create new post
if (postBtn) {
    postBtn.addEventListener('click', () => {
        const text = postText?.value.trim();
        
        if (!text) {
            showNotification('Please write something before posting!', 'warning');
            return;
        }

        const newPost = createPostElement(text);
        feedContainer?.insertBefore(newPost, feedContainer.firstChild);
        
        if (postText) postText.value = '';
        showNotification('Post published successfully!', 'success');
    });
}

function createPostElement(text) {
    const post = document.createElement('div');
    post.className = 'community-post';
    post.innerHTML = `
        <div class="post-header">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop" alt="User Avatar" class="user-avatar">
            <div class="user-info">
                <h5>You</h5>
                <p class="text-muted">@yourname • just now</p>
            </div>
            <button class="btn btn-outline-secondary btn-sm">Following</button>
        </div>
        <div class="post-content">
            <p>${text}</p>
        </div>
        <div class="post-actions">
            <button class="btn btn-sm btn-light like-btn" onclick="likePost(this)">
                <i class="fas fa-heart"></i> <span class="like-count">0</span>
            </button>
            <button class="btn btn-sm btn-light">
                <i class="fas fa-comment"></i> 0
            </button>
            <button class="btn btn-sm btn-light">
                <i class="fas fa-share"></i> Share
            </button>
        </div>
    `;
    return post;
}

// Like functionality
function likePost(button) {
    const liked = button.classList.contains('liked');
    const countSpan = button.querySelector('.like-count');
    
    if (liked) {
        button.classList.remove('liked');
        countSpan.textContent = Math.max(0, parseInt(countSpan.textContent) - 1);
    } else {
        button.classList.add('liked');
        countSpan.textContent = parseInt(countSpan.textContent) + 1;
    }
}

// Allow Enter key to submit
if (postText) {
    postText.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            postBtn?.click();
        }
    });
}
