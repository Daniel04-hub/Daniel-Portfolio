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
        strings: ['Full Stack Developer'],
        typeSpeed: 100,
        backSpeed: 50,
        startDelay: 500,
        loop: true,
        showCursor: true,
        cursorChar: '<span style="font-weight: 100;">|</span>'
    });

    if (document.getElementById('typing-internet')) {
        new Typed('#typing-internet', {
            strings: ['live on the internet.'],
            typeSpeed: 80,
            startDelay: 1000,
            loop: false,
            showCursor: true,
            cursorChar: '<span style="color: orangered;">|</span>'
        });
    }

    const elements = document.querySelectorAll('.service-card, .project-card, .timeline-item');
    
    // Animate numbers function (ease-out curve)
    const animateValue = (obj, start, end, duration, isFloat) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // easeOutQuad curve
            const easeOutProgress = progress * (2 - progress);
            let current = start + easeOutProgress * (end - start);
            obj.innerHTML = isFloat ? current.toFixed(1) : Math.floor(current);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = isFloat ? end.toFixed(1) : end;
            }
        };
        window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                if (element.classList.contains('timeline-item')) {
                    element.classList.add('visible');
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                } else if (element.classList.contains('reveal-item')) {
                    element.classList.add('is-revealed');
                    
                    // Trigger counters if they exist inside this reveal element
                    const counters = element.querySelectorAll('.count-up');
                    counters.forEach(counter => {
                        if(!counter.classList.contains('counted')){
                            counter.classList.add('counted');
                            const endVal = parseFloat(counter.getAttribute('data-target'));
                            const isFloat = counter.getAttribute('data-decimals') === '1';
                            animateValue(counter, 0, endVal, 2000, isFloat);
                        }
                    });

                    // Trigger if the element itself is a counter
                    if(element.classList.contains('count-up') && !element.classList.contains('counted')){
                        element.classList.add('counted');
                        const endVal = parseFloat(element.getAttribute('data-target'));
                        const isFloat = element.getAttribute('data-decimals') === '1';
                        animateValue(element, 0, endVal, 2000, isFloat);
                    }
                } else {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });
    
    // Group reveal items by their section to stagger them correctly
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const items = section.querySelectorAll('.reveal-item');
        items.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(item);
        });
    });

    elements.forEach((element, index) => {
        if(!element.classList.contains('reveal-item')){
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
        }
    });

    initProjectsCarousel();
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

function initProjectsCarousel() {
    const section = document.querySelector('.projects');
    const track = document.querySelector('.carousel-track');
    const cards = Array.from(document.querySelectorAll('.project-card'));
    
    if (!section || !track || cards.length === 0) return;

    function onScroll() {
        const sectionRect = section.getBoundingClientRect();
        
        const scrollOffset = -sectionRect.top;
        const maxScroll = sectionRect.height - window.innerHeight;
        
        let progress = scrollOffset / maxScroll;
        if (progress < 0) progress = 0;
        if (progress > 1) progress = 1;
        
        const maxTranslate = track.scrollWidth - window.innerWidth;
        const translateX = -(maxTranslate * progress);
        
        track.style.transform = `translateX(${translateX}px)`;
        
        const viewportCenter = window.innerWidth / 2;
        
        cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + (cardRect.width / 2);
            
            const distFromCenter = Math.abs(viewportCenter - cardCenter);
            
            const maxDist = window.innerWidth * 0.6; 
            let normalizedDist = distFromCenter / maxDist;
            if (normalizedDist > 1) normalizedDist = 1;
            
            const scale = 1 - (normalizedDist * 0.15); // min scale 0.85
            const opacity = 1 - (normalizedDist * 0.6); // min opacity 0.4
            
            card.style.transform = `scale(${scale})`;
            card.style.opacity = opacity;
            
            // Adjust z-index so center cards are always on top of edge cards
            card.style.zIndex = Math.floor(100 - (normalizedDist * 100));
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    
    // Initial call with timeout to ensure styles/fonts are computed
    setTimeout(onScroll, 100);
}

// Scramble Text Button Logic
(function initScrambleButton() {
    const TARGET_TEXT = "Download CV";
    const CYCLES_PER_LETTER = 2;
    const SHUFFLE_TIME = 50;
    const CHARS = "!@#$%^&*():{};|,.<>/?";
    
    const btn = document.getElementById('download-cv-btn');
    if (!btn) return;
    
    const textSpan = btn.querySelector('.scramble-text');
    let intervalRef = null;
    
    function scramble() {
        let pos = 0;
        clearInterval(intervalRef);
        
        intervalRef = setInterval(() => {
            const scrambled = TARGET_TEXT.split("").map((char, index) => {
                if (pos / CYCLES_PER_LETTER > index) {
                    return char;
                }
                const randomCharIndex = Math.floor(Math.random() * CHARS.length);
                return CHARS[randomCharIndex];
            }).join("");
            
            textSpan.textContent = scrambled;
            pos++;
            
            if (pos >= TARGET_TEXT.length * CYCLES_PER_LETTER) {
                stopScramble();
            }
        }, SHUFFLE_TIME);
    }
    
    elements.forEach((element, index) => {
        if(!element.classList.contains('reveal-item')){
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
        }
    });

    initProjectsCarousel();
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

function initProjectsCarousel() {
    const section = document.querySelector('.projects');
    const track = document.querySelector('.carousel-track');
    const cards = Array.from(document.querySelectorAll('.project-card'));
    
    if (!section || !track || cards.length === 0) return;

    function onScroll() {
        const sectionRect = section.getBoundingClientRect();
        
        const scrollOffset = -sectionRect.top;
        const maxScroll = sectionRect.height - window.innerHeight;
        
        let progress = scrollOffset / maxScroll;
        if (progress < 0) progress = 0;
        if (progress > 1) progress = 1;
        
        const maxTranslate = track.scrollWidth - window.innerWidth;
        const translateX = -(maxTranslate * progress);
        
        track.style.transform = `translateX(${translateX}px)`;
        
        const viewportCenter = window.innerWidth / 2;
        
        cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + (cardRect.width / 2);
            
            const distFromCenter = Math.abs(viewportCenter - cardCenter);
            
            const maxDist = window.innerWidth * 0.6; 
            let normalizedDist = distFromCenter / maxDist;
            if (normalizedDist > 1) normalizedDist = 1;
            
            const scale = 1 - (normalizedDist * 0.15); // min scale 0.85
            const opacity = 1 - (normalizedDist * 0.6); // min opacity 0.4
            
            card.style.transform = `scale(${scale})`;
            card.style.opacity = opacity;
            
            // Adjust z-index so center cards are always on top of edge cards
            card.style.zIndex = Math.floor(100 - (normalizedDist * 100));
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    
    // Initial call with timeout to ensure styles/fonts are computed
    setTimeout(onScroll, 100);
}

// Scramble Text Button Logic
(function initScrambleButton() {
    const TARGET_TEXT = "Download CV";
    const CYCLES_PER_LETTER = 2;
    const SHUFFLE_TIME = 50;
    const CHARS = "!@#$%^&*():{};|,.<>/?";
    
    const btn = document.getElementById('download-cv-btn');
    if (!btn) return;
    
    const textSpan = btn.querySelector('.scramble-text');
    let intervalRef = null;
    
    function scramble() {
        let pos = 0;
        clearInterval(intervalRef);
        
        intervalRef = setInterval(() => {
            const scrambled = TARGET_TEXT.split("").map((char, index) => {
                if (pos / CYCLES_PER_LETTER > index) {
                    return char;
                }
                const randomCharIndex = Math.floor(Math.random() * CHARS.length);
                return CHARS[randomCharIndex];
            }).join("");
            
            textSpan.textContent = scrambled;
            pos++;
            
            if (pos >= TARGET_TEXT.length * CYCLES_PER_LETTER) {
                stopScramble();
            }
        }, SHUFFLE_TIME);
    }
    
    function stopScramble() {
        clearInterval(intervalRef);
        textSpan.textContent = TARGET_TEXT;
    }
    
    btn.addEventListener('mouseenter', scramble);
    btn.addEventListener('mouseleave', stopScramble);
    btn.addEventListener('click', scramble);
})();
