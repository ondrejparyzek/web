document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 1. MOBILNÍ MENU (HAMBURGER)
    // =========================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            // Zamezí scrollování, když je menu otevřené
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
        });
        
        // Zavřít menu po kliknutí na odkaz
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // =========================================
    // 2. LOGO SLIDER (ANIMACE)
    // =========================================
    const track = document.getElementById('logoTrack');
    const scroller = document.getElementById('logoScroller');
    
    const checkSlider = () => {
        if(!track || !scroller) return;

        track.classList.remove('animate');
        // Smazat staré klony, aby se nekupily
        track.querySelectorAll('.clone').forEach(clone => clone.remove());

        const trackWidth = track.scrollWidth;
        const containerWidth = scroller.offsetWidth;

        // Pokud je log více, než se vejde na obrazovku, zapni animaci
        if (trackWidth > containerWidth) {
            Array.from(track.children).forEach(child => {
                const clone = child.cloneNode(true);
                clone.classList.add('clone');
                track.appendChild(clone);
            });
            track.classList.add('animate');
        }
    };

    // Spustit hned a pak při změně velikosti okna
    checkSlider();
    window.addEventListener('resize', checkSlider);


    // =========================================
    // 3. FAQ AKORDEON
    // =========================================
    const faqCards = document.querySelectorAll('.faq-card');
    
    faqCards.forEach(card => {
        card.addEventListener('click', () => {
            // Zjistíme, jestli je tato karta už otevřená
            const isAlreadyActive = card.classList.contains('active');
            
            // Zavřeme všechny ostatní
            faqCards.forEach(other => other.classList.remove('active'));
            
            // Pokud nebyla otevřená, otevřeme ji
            if (!isAlreadyActive) card.classList.add('active');
        });
    });


    // =========================================
    // 4. MODÁLNÍ OKNA (SLUŽBY & TÝM)
    // =========================================
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const overlays = document.querySelectorAll('.modal-overlay');

    const closeModal = (modal) => {
        if(modal) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Povolí scrollování stránky
        }
    };

    // Otevření modalu
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Získáme ID modalu z atributu data-target (např. "modal-social")
            const targetId = btn.getAttribute('data-target');
            const modal = document.getElementById(targetId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Zablokuje scrollování stránky
            }
        });
    });

    // Zavření křížkem nebo tlačítkem uvnitř
    document.querySelectorAll('.close-modal, .close-and-scroll').forEach(btn => {
        btn.addEventListener('click', function() {
            closeModal(this.closest('.modal-overlay'));
        });
    });

    // Zavření kliknutím mimo okno (do tmavého pozadí)
    overlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal(overlay);
        });
    });


    // =========================================
    // 5. SLIDER PROCESU (ŠIPKY)
    // =========================================
    const processSlider = document.getElementById('process-slider');
    const nextBtn = document.getElementById('process-next');
    const prevBtn = document.getElementById('process-prev');

    if (processSlider && nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            // Vypočítá šířku karty dynamicky + mezera
            const card = processSlider.querySelector('.process-card');
            const scrollAmount = card ? card.offsetWidth + 32 : 350;
            processSlider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            const card = processSlider.querySelector('.process-card');
            const scrollAmount = card ? card.offsetWidth + 32 : 350;
            processSlider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }


    // =========================================
    // 6. COOKIES (VYLEPŠENÁ LOGIKA)
    // =========================================
    const banner = document.getElementById("cookie-banner");
    const cookieModal = document.getElementById("cookie-modal");
    
    // Tlačítka
    const acceptBtn = document.getElementById("cookie-accept");
    const rejectBtn = document.getElementById("cookie-reject");
    const settingsBtn = document.getElementById("cookie-settings-btn");
    const savePreferencesBtn = document.getElementById("cookie-save-preferences");
    const closeCookieModalBtn = document.getElementById("cookie-close-modal");

    // A) KONTROLA PŘI NAČTENÍ
    // Pokud v paměti NENÍ uloženo rozhodnutí, ukážeme banner.
    // Pokud tam JE (uživatel už kliknul), banner zůstane skrytý (má třídu .hidden z HTML).
    if (!localStorage.getItem("cookieConsent")) {
        if(banner) banner.classList.remove("hidden");
    }

    // Funkce pro uložení volby a zavření všeho
    function saveAndClose(type) {
        // 1. Uložíme do paměti prohlížeče
        localStorage.setItem("cookieConsent", type);
        
        // 2. Skryjeme banner i modální okno
        if(banner) banner.classList.add("hidden");
        if(cookieModal) cookieModal.classList.add("hidden");

        // 3. Zde by se spouštěly měřící kódy (Google Analytics, Pixel)
        // Příklad: if (type === 'all') { spustitAnalytics(); }
        console.log("Cookies nastaveny na:", type);
    }

    // PŘIJMOUT VŠE
    if(acceptBtn) {
        acceptBtn.addEventListener("click", () => saveAndClose("all"));
    }

    // ODMÍTNOUT (Jen nezbytné)
    if(rejectBtn) {
        rejectBtn.addEventListener("click", () => saveAndClose("none"));
    }

    // OTEVŘÍT NASTAVENÍ (Z banneru)
    if(settingsBtn) {
        settingsBtn.addEventListener("click", () => {
            if(cookieModal) cookieModal.classList.remove("hidden");
        });
    }

    // ULOŽIT Z NASTAVENÍ
    if(savePreferencesBtn) {
        savePreferencesBtn.addEventListener("click", () => saveAndClose("custom"));
    }

    // ZAVŘÍT KŘÍŽKEM (Jen zavře okno nastavení, neukládá souhlas)
    if(closeCookieModalBtn) {
        closeCookieModalBtn.addEventListener("click", () => {
            if(cookieModal) cookieModal.classList.add("hidden");
        });
    }

});

