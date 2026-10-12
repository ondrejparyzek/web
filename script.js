document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.remove('no-js');

    /* Mobilní menu */
    const burger = document.querySelector('.burger');
    const links = document.querySelector('.nav-links');
    if (burger && links) {
        const toggle = (open) => {
            links.classList.toggle('active', open);
            burger.classList.toggle('active', open);
            document.body.style.overflow = open ? 'hidden' : '';
        };
        burger.addEventListener('click', () => toggle(!links.classList.contains('active')));
        links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));
    }

    /* Reveal při scrollu */
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach((el, i) => {
        el.style.setProperty('--d', ((i % 4) * 0.08) + 's');
        io.observe(el);
    });

    /* Světlo sledující kurzor v bento blocích */
    document.querySelectorAll('.b').forEach(b => {
        b.addEventListener('pointermove', (e) => {
            const r = b.getBoundingClientRect();
            b.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            b.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
    });

    /* Marquee – zdvojení obsahu pro plynulou smyčku */
    document.querySelectorAll('.marquee-track').forEach(t => { t.innerHTML += t.innerHTML; });

    /* FAQ */
    const faqs = document.querySelectorAll('.faq-item');
    faqs.forEach(item => {
        item.querySelector('.faq-q').addEventListener('click', () => {
            const was = item.classList.contains('active');
            faqs.forEach(o => o.classList.remove('active'));
            if (!was) item.classList.add('active');
        });
    });

    /* Modály */
    const closeModal = (m) => { if (m) { m.classList.remove('active'); document.body.style.overflow = ''; m.querySelectorAll('iframe[data-src]').forEach(f => f.src = 'about:blank'); } };
    document.querySelectorAll('[data-modal]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const m = document.getElementById(btn.dataset.modal);
            if (m) { m.classList.add('active'); document.body.style.overflow = 'hidden'; m.querySelectorAll('iframe[data-src]').forEach(f => f.src = f.dataset.src); }
        });
    });
    document.querySelectorAll('.modal').forEach(m => {
        m.addEventListener('click', (e) => { if (e.target === m || e.target.closest('.modal-x') || e.target.closest('[data-close]')) closeModal(m); });
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.querySelectorAll('.modal.active').forEach(closeModal); });

    /* Drag-scroll (kroky, recenze) */
    document.querySelectorAll('.steps, .reviews').forEach(s => {
        let down = false, sx = 0, sl = 0, moved = false;
        s.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.pageX; sl = s.scrollLeft; });
        window.addEventListener('pointerup', () => { down = false; s.classList.remove('dragging'); });
        s.addEventListener('pointermove', (e) => {
            if (!down) return;
            const dx = e.pageX - sx;
            if (Math.abs(dx) > 4) { moved = true; s.classList.add('dragging'); }
            s.scrollLeft = sl - dx;
        });
    });

    /* Počítadla */
    const fmt = (n) => n.toLocaleString('cs-CZ').replace(/\s/g, '\u00a0');
    const cio = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el = e.target, target = +el.dataset.count, dur = 1800, t0 = performance.now();
            const tick = (t) => {
                const p = Math.min((t - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 4);
                el.textContent = fmt(Math.round(target * eased));
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            cio.unobserve(el);
        });
    }, { threshold: .5 });
    document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));


    /* Reel (hero) – zdvojení obsahu pro nekonečnou smyčku */
    document.querySelectorAll('.reel-col').forEach(c => { c.innerHTML += c.innerHTML; });

    /* Progress bar + schovávání navigace + sticky CTA */
    const bar = document.querySelector('.progress'), navWrap = document.querySelector('.nav-wrap'), sticky = document.querySelector('.sticky-cta');
    const contact = document.getElementById('contact'), hero = document.querySelector('.hero, .page-hero');
    let lastY = 0, ticking = false;
    const onScroll = () => {
        const y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
        if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
        if (navWrap) navWrap.classList.toggle('hide', y > 240 && y > lastY + 4 && !(links && links.classList.contains('active')));
        if (navWrap && y < lastY - 4) navWrap.classList.remove('hide');
        if (sticky) {
            const pastHero = y > (hero ? hero.offsetHeight * 0.7 : 500);
            let nearContact = false;
            if (contact) { const r = contact.getBoundingClientRect(); nearContact = r.top < innerHeight * .6 && r.bottom > 0; }
            sticky.classList.toggle('show', pastHero && !nearContact);
        }
        lastY = y; ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();

    /* Záře za kurzorem + magnetická tlačítka (jen myš) */
    const glow = document.querySelector('.cursor-glow');
    if (glow && matchMedia('(hover:hover) and (pointer:fine)').matches) {
        window.addEventListener('pointermove', (e) => { glow.classList.add('on'); glow.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)'; }, { passive: true });
        document.querySelectorAll('.magnetic').forEach(b => {
            b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .18) + 'px,' + ((e.clientY - r.top - r.height / 2) * .28) + 'px)'; });
            b.addEventListener('pointerleave', () => { b.style.transform = ''; });
        });
    }

    /* Šipky u recenzí */
    document.querySelectorAll('.arrow').forEach(a => a.addEventListener('click', () => {
        const rv = document.querySelector('.reviews'); if (!rv) return;
        const card = rv.querySelector('.review'); rv.scrollBy({ left: a.dataset.dir * (card.offsetWidth + 16), behavior: 'smooth' });
    }));

    /* Lightbox pro obrázky */
    const zoomImgs = document.querySelectorAll('img[data-zoom]');
    if (zoomImgs.length) {
        const lb = document.createElement('div'); lb.className = 'lightbox'; lb.innerHTML = '<img alt="">'; document.body.appendChild(lb);
        zoomImgs.forEach(im => im.addEventListener('click', () => { lb.firstChild.src = im.src; lb.classList.add('on'); }));
        lb.addEventListener('click', () => lb.classList.remove('on'));
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lb.classList.remove('on'); });
    }

    /* Časová osa procesu */
    const tline = document.getElementById('timeline');
    if (tline) {
        const items = tline.querySelectorAll('.tl-item');
        const upd = () => {
            const r = tline.getBoundingClientRect(), mid = innerHeight * .55;
            const p = Math.max(0, Math.min(1, (mid - r.top) / r.height));
            tline.style.setProperty('--p', (p * 100) + '%');
            items.forEach(it => { const nr = it.querySelector('.tl-node').getBoundingClientRect(); it.classList.toggle('on', nr.top + nr.height / 2 < mid); });
        };
        window.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd); upd();
    }

    /* Rok v patičce */
    document.querySelectorAll('.js-year').forEach(el => el.textContent = new Date().getFullYear());

    /* Cookies */
    const banner = document.getElementById('cookie-banner');
    const cmodal = document.getElementById('cookie-modal');
    let stored = null;
    try { stored = localStorage.getItem('cookieConsent'); } catch (e) {}
    if (banner && !stored) banner.classList.remove('hidden');
    const save = (type) => {
        try { localStorage.setItem('cookieConsent', type); } catch (e) {}
        banner && banner.classList.add('hidden');
        cmodal && cmodal.classList.add('hidden');
    };
    const on = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };
    on('cookie-accept', () => save('all'));
    on('cookie-reject', () => save('none'));
    on('cookie-settings-btn', () => cmodal && cmodal.classList.remove('hidden'));
    on('cookie-save-preferences', () => save('custom'));
    on('cookie-close-modal', () => cmodal && cmodal.classList.add('hidden'));
    document.querySelectorAll('[data-cookie-settings]').forEach(a => a.addEventListener('click', (e) => { e.preventDefault(); cmodal && cmodal.classList.remove('hidden'); }));
});
