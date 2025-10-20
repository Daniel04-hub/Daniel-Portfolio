// DOM Elements
const menuToggle = document.getElementById('menu-toggle');
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');
const downloadCvBtn = document.getElementById('download-cv');

// Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Active nav link highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.getBoundingClientRect().top + scrollY - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            current = sectionId;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add click event listeners to nav links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Contact form submission
contactForm.addEventListener('submit', function(e){
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const message = formData.get('message');
    
    // Validate form
    if (!validateForm(formData)) {
        return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Create email body
    const messageBody = `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        
        Message:
        ${message}
    `;
    
   // Send email using EmailJS
emailjs.send("service_m98kioi", "template_tghh2ki", {
    from_name: name,
    from_email: email,
    phone: phone,
    message: message
}).then(
    function(response) {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
        contactForm.reset();
       },
    function(error) {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        console.error('EmailJS error:', error);
        showNotification('Oops! Something went wrong. Please try again later.', 'error');
    }
);

// ← add this to close the submit handler
});

// Notification system
function showNotification(message, type) {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 16px 20px;
            border-radius: 8px;
            color: white;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .notification.success {
            background: #4CAF50;
        }
        
        .notification.error {
            background: #f44336;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        @media (max-width: 480px) {
            .notification {
                right: 10px;
                left: 10px;
                max-width: none;
                top: 90px;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
        style.remove();
    });
}
// CV Download functionality
downloadCvBtn.addEventListener('click', function() {
    const link = document.createElement('a');
    link.href = 'assests/Naveen_Daniel_cv.pdf'; // Path to your PDF file
    link.download = 'Naveen_Daniel_CV.pdf'; // File name when downloaded
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('CV downloaded successfully!', 'success');
});


// Scroll animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .project-card, .timeline-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
            // Special handling for education timeline items
            if (element.classList.contains('timeline-item')) {
                element.classList.add('visible');
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
            } else {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        }
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.service-card, .project-card, .timeline-item');
    let timelineIndex = 0;
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.willChange = 'opacity, transform';
        // Timeline items: slide from left/right, with subtle stagger
        if (element.classList.contains('timeline-item')) {
            const fromLeft = element.classList.contains('left');
            element.style.transform = `translateX(${fromLeft ? '-60px' : '60px'})`;
            element.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
            element.style.transitionDelay = `${(timelineIndex++) * 0.08}s`;
        } else {
            // Default cards slide up
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
    });
    
    // Initial check
    animateOnScroll();
});

window.addEventListener('scroll', animateOnScroll);

// Header background change on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.9)';
    }
});

// Typing animation for hero text
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Looping type + delete animation
function typeLoop(element, text, {
    typeSpeed = 70,
    deleteSpeed = 45,
    delayBeforeStart = 400,
    pauseAfterType = 1500,
    pauseAfterDelete = 800
} = {}) {
    let i = 0;
    let typing = true;

    element.textContent = '';

    function step() {
        if (typing) {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(step, typeSpeed);
            } else {
                // Finished typing, pause then start deleting
                setTimeout(() => {
                    typing = false;
                    step();
                }, pauseAfterType);
            }
        } else {
            if (i > 0) {
                i--;
                element.textContent = text.substring(0, i);
                setTimeout(step, deleteSpeed);
            } else {
                // Finished deleting, pause then start typing again
                setTimeout(() => {
                    typing = true;
                    step();
                }, pauseAfterDelete);
            }
        }
    }

    setTimeout(step, delayBeforeStart);
}

// Initialize looping typing animation for name
window.addEventListener('DOMContentLoaded', () => {
    const nameEl = document.querySelector('#typing-name');
    if (nameEl) {
        const fullText = nameEl.textContent.trim();
        nameEl.textContent = '';
        nameEl.classList.add('typing-caret'); // keep caret while looping

        // Inject or update minimal caret CSS (smaller, thinner caret)
        const css = `
            .typing-caret { position: relative; }
            .typing-caret::after {
                content: '';
                position: absolute;
                right: -2px;
                top: 0.1em;
                width: 2px;
                height: 0.8em;
                background: currentColor;
                border-radius: 1px;
                animation: blink 1s steps(1) infinite;
            }
            @keyframes blink { 50% { opacity: 0; } }
        `;
        const existingStyle = document.getElementById('typing-caret-style');
        if (existingStyle) {
            existingStyle.textContent = css;
        } else {
            const style = document.createElement('style');
            style.id = 'typing-caret-style';
            style.textContent = css;
            document.head.appendChild(style);
        }

        typeLoop(nameEl, fullText, {
            typeSpeed: 70,
            deleteSpeed: 45,
            delayBeforeStart: 400,
            pauseAfterType: 1500,
            pauseAfterDelete: 800
        });
    }
});

// Smooth scrolling for all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add CSS for loading animation
    const style = document.createElement('style');
    style.textContent = `
        body:not(.loaded) {
            opacity: 0;
        }
        
        body.loaded {
            opacity: 1;
            transition: opacity 0.5s ease;
        }
    `;
    document.head.appendChild(style);
});

// Contact form validation
function validateForm(formData) {
    const email = formData.get('email');
    const phone = formData.get('phone');
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone) || phone.length < 10) {
        showNotification('Please enter a valid phone number.', 'error');
        return false;
    }
    
    return true;
}

// ==========================
// Particle cursor (arrow trail)
// ==========================
(function setupParticleCursor() {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (prefersReduced || isTouch) return; // skip to save perf on touch/low-motion prefs

    let lastX = null, lastY = null;
    let lastTime = 0;
    const throttleMs = 16; // ~60fps
    const maxPerMove = 2; // spawn count per move
    const colors = ['orangered', '#ff7a45', '#ff4d4f'];

    function spawnParticle(x, y, angleDeg) {
        const el = document.createElement('span');
        el.className = 'cursor-particle';

        // Small random drift and duration for variety
        const drift = 12 + Math.random() * 12; // 12-24px
        const driftAngle = angleDeg + (Math.random() * 40 - 20); // +/- 20deg from direction
        const dx = Math.cos(driftAngle * Math.PI / 180) * drift;
        const dy = Math.sin(driftAngle * Math.PI / 180) * drift;
        const dur = 450 + Math.random() * 400; // 450-850ms
        const hue = colors[Math.floor(Math.random() * colors.length)];

        el.style.setProperty('--x', x + 'px');
        el.style.setProperty('--y', y + 'px');
        el.style.setProperty('--dx', dx.toFixed(1) + 'px');
        el.style.setProperty('--dy', dy.toFixed(1) + 'px');
        el.style.setProperty('--rot', angleDeg + 'deg');
        el.style.setProperty('--dur', dur + 'ms');
        el.style.setProperty('--color', hue);

        el.addEventListener('animationend', () => {
            el.remove();
        });

        document.body.appendChild(el);
    }

    function onMove(e) {
        const now = performance.now();
        if (now - lastTime < throttleMs) return;
        lastTime = now;

        const x = e.clientX;
        const y = e.clientY;
        let angleDeg = 0;
        if (lastX !== null && lastY !== null) {
            const dx = x - lastX;
            const dy = y - lastY;
            if (dx !== 0 || dy !== 0) {
                angleDeg = Math.atan2(dy, dx) * 180 / Math.PI;
            }
        }
        lastX = x; lastY = y;

        // Spawn a couple particles per event for a smooth trail
        for (let i = 0; i < maxPerMove; i++) {
            spawnParticle(x, y, angleDeg);
        }
    }

    window.addEventListener('mousemove', onMove, { passive: true });
})();