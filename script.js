// Intersection Observer para animaciones al hacer scroll
document.addEventListener('DOMContentLoaded', function() {
    // Configurar el Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observar todos los elementos con la clase fade-in-scroll
    const animatedElements = document.querySelectorAll('.fade-in-scroll');
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Smooth scroll para enlaces (si los agregas en el futuro)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Efecto parallax suave en el hero
    let ticking = false;
    const heroImage = document.querySelector('.hero-image');
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });

    // Añadir efecto hover a las tarjetas
    const cards = document.querySelectorAll('.collaborator-card, .ingredient-card, .extract-card, .reason-card, .contact-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // Contador animado para los porcentajes (si quieres agregar estadísticas)
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.textContent = Math.floor(progress * (end - start) + start) + '%';
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Precargar imágenes
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        }
    });

    // Añadir clase para navegación sticky (si agregas nav en el futuro)
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            document.body.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !document.body.classList.contains('scroll-down')) {
            document.body.classList.remove('scroll-up');
            document.body.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && document.body.classList.contains('scroll-down')) {
            document.body.classList.remove('scroll-down');
            document.body.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Mejorar la accesibilidad con el teclado
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.classList.add('keyboard-focus');
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('keyboard-focus');
        });
    });

    // Lazy loading para imágenes (ya que Unsplash puede tardar)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Añadir animación de entrada más suave
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    console.log('PureNature website loaded successfully! 🌿');
});

// Función para manejar el formulario de contacto (si lo agregas)
function handleContactForm(event) {
    event.preventDefault();
    // Aquí puedes agregar la lógica para enviar el formulario
    alert('¡Gracias por tu interés! Nos pondremos en contacto contigo pronto.');
}

// Función para cambiar el tema (día/noche) si lo necesitas en el futuro
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// Cargar tema guardado
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

// Detectar preferencia del sistema
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !savedTheme) {
    document.body.classList.add('dark-mode');
}

// Agregar soporte para gestos táctiles en móviles
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
        // Deslizar a la izquierda
        console.log('Swipe left');
    }
    if (touchEndX > touchStartX + swipeThreshold) {
        // Deslizar a la derecha
        console.log('Swipe right');
    }
}

// Performance: reducir animaciones en dispositivos lentos
if (navigator.hardwareConcurrency < 4) {
    document.body.classList.add('reduce-motion');
}

// Analítica simple (puedes reemplazar con Google Analytics, etc.)
function trackEvent(category, action, label) {
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
    // Aquí puedes integrar Google Analytics, Facebook Pixel, etc.
}

// Trackear clics en enlaces importantes
document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', function() {
        trackEvent('Contact', 'Click', this.getAttribute('href'));
    });
});

// Trackear clics en redes sociales
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', function() {
        trackEvent('Social', 'Click', this.getAttribute('href'));
    });
});
