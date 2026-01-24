/* ===================================
   ABOUT PAGE JAVASCRIPT
   =================================== */

// Function to show notifications
function showNotification(message, type) {
    alert(message); // Simple alert for demonstration purposes
}

// Form submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[placeholder="Your Name"]').value;
        const email = contactForm.querySelector('input[placeholder="Your Email"]').value;
        const subject = contactForm.querySelector('input[placeholder="Subject"]').value;
        const message = contactForm.querySelector('textarea[placeholder="Your Message"]').value;
        
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields!', 'warning');
            return;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email!', 'warning');
            return;
        }

        // Simulate form submission
        console.log('Form submitted:', {
            name, email, subject, message
        });

        showNotification('Thank you for your message! We will get back to you soon.', 'success');
        contactForm.reset();
    });
}

// Smooth scroll to sections
document.querySelectorAll('a[href^="#section"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Social media link handlers
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Social media link!', 'info');
    });
});
