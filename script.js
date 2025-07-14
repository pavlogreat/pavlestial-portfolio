window.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show');
        });
    }

    const sections = document.querySelectorAll('main section[id]');
    const links = document.querySelectorAll('#nav a');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                links.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + e.target.id);
                });
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' });
    sections.forEach(s => observer.observe(s));
});
