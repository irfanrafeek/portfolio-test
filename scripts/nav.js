// Mobile navigation: toggle the nav links under a hamburger button.
(function () {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    if (!navbar || !toggle) return;

    const close = () => {
        navbar.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
        const isOpen = navbar.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close the menu after tapping a link, or when the viewport grows past mobile.
    navbar.querySelectorAll('.nav-links a').forEach((link) => {
        link.addEventListener('click', close);
    });
    window.matchMedia('(min-width: 641px)').addEventListener('change', (e) => {
        if (e.matches) close();
    });
})();
