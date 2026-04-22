/* ===================================
   ABOUT PAGE JAVASCRIPT
   Self-Loading jQuery + rAF + Reload
   =================================== */

(function() {
    // 1. AUTO-RELOAD (Vanilla JS - Works even if jQuery fails)
    // Reloads every 5 seconds
    setInterval(() => {
        console.log("Reloading...");
        location.reload();
    }, 8000);

    // 2. requestAnimationFrame ANIMATION (Vanilla JS)
    // Creates a smooth scroll progress bar at the top
    const progressBar = document.createElement('div');
    progressBar.style.cssText = "position:fixed;top:0;left:0;height:4px;background:#ff4b2b;z-index:9999;width:0%;transition:width 0.1s linear;";
    document.body.prepend(progressBar);

    function updateScrollProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        progressBar.style.width = scrolled + "%";
        requestAnimationFrame(updateScrollProgress);
    }
    requestAnimationFrame(updateScrollProgress);

    // 3. DYNAMIC JQUERY LOADER
    // This part checks if jQuery exists. If not, it pulls it from a CDN.
    if (typeof jQuery === 'undefined') {
        var script = document.createElement('script');
        script.src = "https://code.jquery.com/jquery-3.7.1.min.js";
        script.type = 'text/javascript';
        script.onload = function() {
            console.log("jQuery loaded dynamically.");
            initJQueryLogic();
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {
        initJQueryLogic();
    }

    // 4. JQUERY DEPENDENT LOGIC
    function initJQueryLogic() {
        $(document).ready(function() {
            // Smooth scroll for nav links
            $('.nav-link').on('click', function(e) {
                if (this.hash !== "") {
                    e.preventDefault();
                    $('html, body').animate({
                        scrollTop: $(this.hash).offset().top
                    }, 600);
                }
            });

            // jQuery Hover effect on Team Cards
            $('.team-card').hover(
                function() { $(this).css({'transform': 'translateY(-10px)', 'transition': '0.3s'}); },
                function() { $(this).css('transform', 'translateY(0)'); }
            );

            // Contact Form Handling
            $('#contactForm').on('submit', function(e) {
                e.preventDefault();
                alert("Message sent! (Note: Page will reload in 5 seconds)");
                this.reset();
            });
            
            console.log("jQuery features initialized!");
        });
    }
})();