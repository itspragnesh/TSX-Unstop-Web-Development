function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Preloader
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = `
        <div class="spinner"></div>
        <style>
            #preloader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #212529; /* Matches bg-dark theme */
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                transition: opacity 0.5s ease-out;
            }
            .spinner {
                border: 4px solid rgba(255, 255, 255, 0.1);
                border-top: 4px solid #0d6efd;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            #preloader.hidden {
                opacity: 0;
                visibility: hidden;
            }
        </style>
    `;
    document.body.prepend(preloader);

    window.addEventListener('load', () => {
        setTimeout(() => preloader.classList.add('hidden'), 5000); // Fallback after 5s
    });
});

// Smooth scrolling for navbar links
document.querySelectorAll('.nav-link').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        this.classList.add('active');

        if (targetElement) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        } else {
            console.error(`Target element ${targetId} not found`);
        }
    });
});

// Update active navbar link on scroll
const sections = document.querySelectorAll('section[id]');
const navbarLinks = document.querySelectorAll('.nav-link');
let isThrottled = false;

function updateActiveNavLink() {
    if (isThrottled) return;
    isThrottled = true;
    setTimeout(() => (isThrottled = false), 100); // Throttle to 100ms

    let currentSection = '';
    sections.forEach(section => {
        if (isInViewport(section)) {
            currentSection = section.getAttribute('id');
        }
    });

    navbarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(currentSection)) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

// Typed.js for hero section
try {
    if (typeof Typed !== 'undefined') {
        new Typed('#typed-text', {
            strings: ['Aspiring AI Engineer', 'Full-Stack Developer', 'Problem Solver', 'Innovator'],
            typeSpeed: 60,
            backSpeed: 40,
            backDelay: 1200,
            loop: true,
            showCursor: true,
            cursorChar: '|',
            autoInsertCss: true,
        });
    } else {
        console.warn('Typed.js not loaded, falling back to static text');
        document.getElementById('typed-text').textContent = 'Aspiring AI Engineer';
    }
} catch (error) {
    console.error('Error initializing Typed.js:', error);
    document.getElementById('typed-text').textContent = 'Aspiring AI Engineer';
}

// ScrollReveal for section animations
const animateProgressBars = () => {
    try {
        const progressBars = document.querySelectorAll('.animate-progress');
        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.transition = 'width 1s ease-in-out'; // Smooth animation
            bar.style.width = `${width}%`;
            bar.setAttribute('aria-valuenow', width);
        });
    } catch (error) {
        console.error('Error animating progress bars:', error);
    }
};

try {
    if (typeof ScrollReveal !== 'undefined') {
        ScrollReveal().reveal('.hero h1, .hero .lead, .hero .btn', {
            delay: 200,
            duration: 800,
            easing: 'ease-in-out',
            origin: 'bottom',
            distance: '30px',
            interval: 150
        });

        ScrollReveal().reveal('#about img, #about p', {
            delay: 200,
            duration: 700,
            easing: 'ease-in-out',
            origin: 'left',
            distance: '50px',
            interval: 100
        });

        ScrollReveal().reveal('.project-card, .skill-card, .achievement-card, .certificate-card, .timeline-item', {
            delay: 150,
            duration: 600,
            easing: 'ease-in-out',
            origin: 'bottom',
            distance: '40px',
            interval: 100
        });

        ScrollReveal().reveal('#contact .form-label, #contact .form-control, #contact .btn', {
            delay: 100,
            duration: 500,
            easing: 'ease-in-out',
            origin: 'right',
            distance: '30px',
            interval: 80
        });

        ScrollReveal().reveal('#skills', {
            afterReveal: animateProgressBars,
            reset: false,
            duration: 1
        });
    } else {
        console.warn('ScrollReveal not loaded, sections will be visible by default');
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
    }
} catch (error) {
    console.error('Error initializing ScrollReveal:', error);
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
}

// Project filter
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
        try {
            const filter = button.getAttribute('data-filter');
            const projectCards = document.querySelectorAll('.project-card');

            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                if (filter === 'all' || categories.includes(filter)) {
                    card.classList.remove('hidden');
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => card.classList.add('hidden'), 300); // Delay hiding for transition
                }
            });
        } catch (error) {
            console.error('Error applying project filter:', error);
        }
    });
});

// Initialize "All" filter on load
document.addEventListener('DOMContentLoaded', () => {
    const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
    if (allFilterBtn) {
        allFilterBtn.click();
    }
});

// Contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        try {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            const feedback = document.getElementById('formFeedback');

            if (name && email && message) {
                feedback.innerHTML = `<p class="text-success">Thank you for your message, ${name}! I will get back to you soon.</p>`;
                this.reset();
                setTimeout(() => (feedback.innerHTML = ''), 5000);
            } else {
                feedback.innerHTML = `<p class="text-danger">Please fill out all fields.</p>`;
                setTimeout(() => (feedback.innerHTML = ''), 5000);
            }
        } catch (error) {
            console.error('Error processing form:', error);
            document.getElementById('formFeedback').innerHTML = `<p class="text-danger">An error occurred. Please try again.</p>`;
        }
    });
} else {
    console.warn('Contact form not found');
}

// Scroll to Top Button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.id = 'scrollToTopBtn';
scrollToTopBtn.innerHTML = '<i class="bi bi-arrow-up-short"></i>';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: none;
    background: #0d6efd;
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 24px;
    cursor: pointer;
    z-index: 1000;
    transition: opacity 0.3s ease;
`;
document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.display = 'block';
        scrollToTopBtn.style.opacity = '1';
    } else {
        scrollToTopBtn.style.opacity = '0';
        setTimeout(() => (scrollToTopBtn.style.display = 'none'), 300);
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});