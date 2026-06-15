/*
 * Cake & Kitchen — Restaurant & Bakery
 * Dhangadhi, Nepal
 * Primary JavaScript Functionality
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Page Loader & Hero Entrance
    // ==========================================
    const hero = document.getElementById('home');
    if (hero) {
        // Subtle delay to allow resources to paint before starting entrance transitions
        setTimeout(() => {
            hero.classList.add('loaded');
        }, 150);
    }

    // ==========================================
    // 2. Sticky Navbar & Scroll-To-Top FAB
    // ==========================================
    const navbar = document.getElementById('navbar');
    const scrollTopBtn = document.getElementById('scroll-top-btn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            scrollTopBtn.classList.add('show');
        } else {
            navbar.classList.remove('scrolled');
            scrollTopBtn.classList.remove('show');
        }
    });

    // ==========================================
    // 3. Mobile Hamburger Menu Drawer
    // ==========================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const bodyOverlay = document.getElementById('body-overlay');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        hamburgerBtn.classList.toggle('open');
        navMenu.classList.toggle('open');
        bodyOverlay.classList.toggle('show');
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    };

    const closeMenu = () => {
        hamburgerBtn.classList.remove('open');
        navMenu.classList.remove('open');
        bodyOverlay.classList.remove('show');
        document.body.style.overflow = '';
    };

    hamburgerBtn.addEventListener('click', toggleMenu);
    bodyOverlay.addEventListener('click', closeMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ==========================================
    // 4. Menu Filtering Logic
    // ==========================================
    const tabButtons = document.querySelectorAll('.menu-tab-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from other buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.getAttribute('data-category');

            menuCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'flex';
                    // Trigger fade-in animation by toggling state
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                        card.style.transition = 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ==========================================
    // 5. WhatsApp Custom Order Link Helper
    // ==========================================
    const orderButtons = document.querySelectorAll('.menu-card-order-btn');
    const basePhoneNumber = '9779840859491'; // Nepali country code prefix + 9840859491

    orderButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const itemName = button.getAttribute('data-item');
            const price = button.previousElementSibling.textContent; // Fetch text inside .menu-card-price
            
            // Format WhatsApp pre-filled text
            const messageText = `Hello Cake & Kitchen! I would like to order: \n\n🛍️ *Item:* ${itemName}\n💰 *Price:* ${price}\n\nPlease let me know the estimated delivery/pickup time. Thank you!`;
            const encodedText = encodeURIComponent(messageText);
            
            // Redirect
            const whatsappUrl = `https://wa.me/${basePhoneNumber}?text=${encodedText}`;
            window.open(whatsappUrl, '_blank');
        });
    });

    // ==========================================
    // 6. Gallery Lightbox Modal Logic
    // ==========================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const caption = item.getAttribute('data-caption');
            
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCaption.textContent = caption;
            
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close lightbox when clicking outside the image container
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Support escape key to close lightbox
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('open')) {
            closeLightbox();
        }
    });

    // ==========================================
    // 7. Scroll-Reveal Intersection Observer
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, {
        root: null, // Viewport
        threshold: 0.1, // Trigger when 10% is visible
        rootMargin: '0px 0px -50px 0px' // Offset bottom check
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ==========================================
    // 8. Active Nav Link Scroll Tracker
    // ==========================================
    const sections = document.querySelectorAll('section, footer');
    const navLinkItems = document.querySelectorAll('.nav-link');

    const navObserverOptions = {
        root: null,
        threshold: 0.25, // Highlight when 25% of the section is visible
        rootMargin: '-10% 0px -40% 0px' // Vertical window cuts
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                if (!id) return;

                navLinkItems.forEach(link => {
                    link.classList.remove('active');
                    const linkHref = link.getAttribute('href');
                    if (linkHref === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(sec => {
        navObserver.observe(sec);
    });

    // Double check active state for home link on complete top scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY === 0) {
            navLinkItems.forEach(link => link.classList.remove('active'));
            const homeLink = document.querySelector('.nav-link[href="#home"]');
            if (homeLink) homeLink.classList.add('active');
        }
    });
});
