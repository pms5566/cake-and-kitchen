/*
 * Cake & Kitchen — Restaurant & Cake Shop
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
    // 4. Dynamic Content Loading & Rendering
    // ==========================================
    const menuGrid = document.getElementById('menu-grid');
    const galleryGrid = document.getElementById('gallery-grid');

    function renderMenu(menuItems) {
        if (!menuGrid) return;
        menuGrid.innerHTML = '';
        menuItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'menu-card';
            card.setAttribute('data-category', item.category);

            const badgeHtml = item.badge ? `<span class="menu-card-badge">${item.badge}</span>` : '';

            card.innerHTML = `
                <div class="menu-card-img-wrapper">
                    ${badgeHtml}
                    <img src="${item.image}" alt="${item.title}" class="menu-card-img" loading="lazy">
                </div>
                <div class="menu-card-body">
                    <h4 class="menu-card-title">${item.title}</h4>
                    <p class="menu-card-desc">${item.desc}</p>
                    <div class="menu-card-footer">
                        <a href="#" class="menu-card-order-btn" data-item="${item.title}" aria-label="Order ${item.title} via WhatsApp">
                            <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.455h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        </a>
                    </div>
                </div>
            `;
            menuGrid.appendChild(card);
        });
    }

    function renderGallery(galleryItems) {
        if (!galleryGrid) return;
        galleryGrid.innerHTML = '';
        galleryItems.forEach(item => {
            const el = document.createElement('div');
            el.className = 'gallery-item';
            el.setAttribute('data-caption', item.caption);
            el.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="gallery-info">
                    <h4>${item.title}</h4>
                    <p>${item.category}</p>
                </div>
            `;
            galleryGrid.appendChild(el);
        });
    }

    async function loadDynamicContent() {
        try {
            const res = await fetch('/api/data');
            if (res.ok) {
                const data = await res.json();
                if (data.menu) renderMenu(data.menu);
                if (data.gallery) renderGallery(data.gallery);
            }
        } catch (err) {
            console.error("Error loading data from API, using fallback static HTML:", err);
        }
    }

    loadDynamicContent();

    // ==========================================
    // 5. Menu Filtering & Event Delegation
    // ==========================================
    const tabButtons = document.querySelectorAll('.menu-tab-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.getAttribute('data-category');
            const menuCards = document.querySelectorAll('.menu-card');

            menuCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'flex';
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

    // WhatsApp Order Action (Delegated)
    if (menuGrid) {
        menuGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('.menu-card-order-btn');
            if (!btn) return;
            e.preventDefault();
            
            const itemName = btn.getAttribute('data-item');
            const basePhoneNumber = '9779840859591'; // Nepali country code prefix + 9840859591
            
            const messageText = `Hello Cake & Kitchen! I would like to order: \n\n🛍️ *Item:* ${itemName}\n\nPlease let me know the estimated delivery/pickup time. Thank you!`;
            const encodedText = encodeURIComponent(messageText);
            
            const whatsappUrl = `https://wa.me/${basePhoneNumber}?text=${encodedText}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // ==========================================
    // 6. Gallery Lightbox Modal (Delegated)
    // ==========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    if (galleryGrid) {
        galleryGrid.addEventListener('click', (e) => {
            const item = e.target.closest('.gallery-item');
            if (!item) return;
            
            const img = item.querySelector('img');
            const caption = item.getAttribute('data-caption');
            
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || '';
            lightboxCaption.textContent = caption || '';
            
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }

    const closeLightbox = () => {
        if (lightbox) {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
        }
    };

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) {
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