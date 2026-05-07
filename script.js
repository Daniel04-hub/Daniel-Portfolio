const menuToggle = document.getElementById('menu-toggle');
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');

menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

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

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

contactForm.addEventListener('submit', function(e){
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const message = formData.get('message');
    
    if (!validateForm(formData)) {
        return;
    }
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    const messageBody = `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        
        Message:
        ${message}
    `;
    
    emailjs.send("service_m98kioi", "template_tghh2ki", {
        from_name: name,
        from_email: email,
        phone: phone,
        message: message
    }).then(
        function(response) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
            contactForm.reset();
        },
        function(error) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            console.error('EmailJS error:', error);
            showNotification('Oops! Something went wrong. Please try again later.', 'error');
        }
    );
});

function showNotification(message, type) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
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
        
        .notification.success { background: #4CAF50; }
        .notification.error { background: #f44336; }
        .notification.show { transform: translateX(0); }
        
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
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 5000);
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
        style.remove();
    });
}

document.addEventListener('DOMContentLoaded', function() {
    new Typed('#typing-name', {
        strings: ['Naveen Daniel'],
        typeSpeed: 150,
        backSpeed: 80,
        startDelay: 500,
        loop: true,
        showCursor: true,
        cursorChar: '<span style="font-weight: 100;">|</span>'
    });

    const elements = document.querySelectorAll('.service-card, .project-card, .timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                if (element.classList.contains('timeline-item')) {
                    element.classList.add('visible');
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                } else {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px 50px 0px" // Trigger slightly before the item scrolls fully into view
    });
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.willChange = 'opacity, transform';
        if (element.classList.contains('timeline-item')) {
            const fromLeft = element.classList.contains('left');
            element.style.transform = `translateX(${fromLeft ? '-60px' : '60px'})`;
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        } else {
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
        observer.observe(element);
    });
});

window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    header.style.background = window.scrollY > 100
        ? 'rgba(0, 0, 0, 0.95)'
        : 'rgba(0, 0, 0, 0.9)';
});

function validateForm(formData) {
    const email = formData.get('email');
    const phone = formData.get('phone');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone) || phone.length < 10) {
        showNotification('Please enter a valid phone number.', 'error');
        return false;
    }
    
    return true;
}

(function setupParticleCursor() {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (prefersReduced || isTouch) return;

    let lastX = null, lastY = null;
    let lastTime = 0;
    const throttleMs = 16;
    const maxPerMove = 2;
    const colors = ['orangered', '#ff7a45', '#ff4d4f'];

    function spawnParticle(x, y, angleDeg) {
        const el = document.createElement('span');
        el.className = 'cursor-particle';

        const drift = 12 + Math.random() * 12;
        const driftAngle = angleDeg + (Math.random() * 40 - 20);
        const dx = Math.cos(driftAngle * Math.PI / 180) * drift;
        const dy = Math.sin(driftAngle * Math.PI / 180) * drift;
        const dur = 450 + Math.random() * 400;
        const hue = colors[Math.floor(Math.random() * colors.length)];

        el.style.setProperty('--x', x + 'px');
        el.style.setProperty('--y', y + 'px');
        el.style.setProperty('--dx', dx.toFixed(1) + 'px');
        el.style.setProperty('--dy', dy.toFixed(1) + 'px');
        el.style.setProperty('--rot', angleDeg + 'deg');
        el.style.setProperty('--dur', dur + 'ms');
        el.style.setProperty('--color', hue);

        el.addEventListener('animationend', () => el.remove());
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

        lastX = x;
        lastY = y;

        for (let i = 0; i < maxPerMove; i++) {
            spawnParticle(x, y, angleDeg);
        }
    }

    window.addEventListener('mousemove', onMove, { passive: true });
})();
