document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Hamburger Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
        });
    }

    // Zavřít menu po kliknutí na odkaz
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // --- 2. Chytrý Slider Log ---
    const track = document.getElementById('logoTrack');
    const scroller = document.getElementById('logoScroller');
    
    const checkSlider = () => {
        if(!track || !scroller) return;

        track.classList.remove('animate');
        // Smazat klony
        const clones = track.querySelectorAll('.clone');
        clones.forEach(clone => clone.remove());

        const trackWidth = track.scrollWidth;
        const containerWidth = scroller.offsetWidth;

        // Pokud je log více, než se vejde, zapni animaci
        if (trackWidth > containerWidth) {
            const children = Array.from(track.children);
            children.forEach(child => {
                const clone = child.cloneNode(true);
                clone.classList.add('clone');
                track.appendChild(clone);
            });
            track.classList.add('animate');
        }
    };

    checkSlider();
    window.addEventListener('resize', checkSlider);

    // --- 3. Kontaktní Formulář ---
    const form = document.getElementById('contact-form');
    
    if(form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const btn = form.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Odesílám...';
            btn.style.opacity = '0.7';

            // Simulace odeslání
            setTimeout(() => {
                alert("Děkujeme za zprávu! Ozveme se vám do 24 hodin.");
                form.reset();
                btn.innerText = originalText;
                btn.style.opacity = '1';
            }, 1500);
        });
    }

    // --- 4. Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');

    if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
        cookieBanner.classList.remove('hidden');
    }

    if(acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.add('hidden');
        });
    }
});


// --- 5. FAQ AKORDEON (AUTO-CLOSE) ---
const faqCards = document.querySelectorAll('.faq-card');

faqCards.forEach(card => {
    card.addEventListener('click', () => {
        // 1. Zjistíme, jestli je tato karta už otevřená
        const isAlreadyActive = card.classList.contains('active');

        // 2. Nejprve ZAVŘEME všechny karty
        faqCards.forEach(otherCard => {
            otherCard.classList.remove('active');
        });

        // 3. Pokud karta nebyla otevřená, tak ji teď otevřeme
        // (Pokud už otevřená byla, kód výše ji zavřel a tady nic neuděláme -> zůstane zavřená)
        if (!isAlreadyActive) {
            card.classList.add('active');
        }
    });
});


// --- 6. MODÁLNÍ OKNA SLUŽEB ---
const openModalBtns = document.querySelectorAll('.open-modal-btn');
const closeModalBtns = document.querySelectorAll('.close-modal');
const overlays = document.querySelectorAll('.modal-overlay');
const closeAndScrollBtns = document.querySelectorAll('.close-and-scroll');

// Otevření modalu
openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault(); // Zabrání prokliku
        const targetId = btn.getAttribute('data-target');
        const modal = document.getElementById(targetId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Zamezí scrollování stránky na pozadí
        }
    });
});

// Funkce pro zavření modalu
function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Povolí scrollování
}

// Zavření křížkem
closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        closeModal(modal);
    });
});

// Zavření kliknutím mimo okno (do tmavého pozadí)
overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal(overlay);
        }
    });
});

// Zavření modalu tlačítkem "Mám zájem" a odscrollování na kontakt
closeAndScrollBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        closeModal(modal);
        // Hladký scroll zajistí CSS html { scroll-behavior: smooth; }
    });
});


document.addEventListener("DOMContentLoaded", function() {
    const banner = document.getElementById("cookie-banner");
    const modal = document.getElementById("cookie-modal");
    
    // Tlačítka
    const acceptBtn = document.getElementById("cookie-accept");
    const rejectBtn = document.getElementById("cookie-reject");
    const settingsBtn = document.getElementById("cookie-settings-btn");
    const saveBtn = document.getElementById("cookie-save-preferences");
    const closeModalBtn = document.getElementById("cookie-close-modal");

    // Kontrola, zda už bylo rozhodnuto (uloženo v localStorage)
    if (!localStorage.getItem("cookieConsent")) {
        banner.classList.remove("hidden"); // Pokud ne, ukaž banner
    }

    // Funkce pro schování banneru a uložení volby
    function closeBannerAndSave(type) {
        localStorage.setItem("cookieConsent", type); // Uloží např. "all", "none", "custom"
        banner.classList.add("hidden");
        modal.classList.add("hidden");
        
        // Zde by se spouštěly reálné skripty (Google Analytics atd.) podle volby
        if(type === "all" || type === "custom") {
            // Spustit skripty...
            console.log("Cookies povoleny: " + type);
        }
    }

    // 1. PŘIJMOUT VŠE
    acceptBtn.addEventListener("click", () => closeBannerAndSave("all"));

    // 2. ODMÍTNOUT (Jen nezbytné)
    rejectBtn.addEventListener("click", () => closeBannerAndSave("none"));

    // 3. OTEVŘÍT NASTAVENÍ
    settingsBtn.addEventListener("click", () => {
        modal.classList.remove("hidden");
    });

    // 4. ULOŽIT VÝBĚR Z NASTAVENÍ
    saveBtn.addEventListener("click", () => {
        // Zde byste načetli stav checkboxů
        const analytics = document.getElementById("cookie-analytics").checked;
        const marketing = document.getElementById("cookie-marketing").checked;
        
        // Uložit detailní nastavení (v praxi složitější objekt)
        closeBannerAndSave("custom");
    });

    // 5. ZAVŘÍT MODÁL (Křížek nebo tlačítko Zavřít)
    closeModalBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });
});

const processSlider = document.getElementById('process-slider');
const nextBtn = document.getElementById('process-next');
const prevBtn = document.getElementById('process-prev');

if (processSlider && nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
        // Posune o šířku jedné karty + gap
        processSlider.scrollLeft += 382; 
    });

    prevBtn.addEventListener('click', () => {
        processSlider.scrollLeft -= 382;
    });
}

