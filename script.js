document.addEventListener('DOMContentLoaded', () => {
const doc = document.documentElement, body = document.body;
doc.classList.remove('no-js');
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => r.querySelectorAll(s);
const burger = $('.burger'), links = $('.nav-links');
if (burger && links) {
const toggle = (open) => {
links.classList.toggle('active', open);
burger.classList.toggle('active', open);
body.style.overflow = open ? 'hidden' : '';
};
burger.addEventListener('click', () => toggle(!links.classList.contains('active')));
$$('a', links).forEach(a => a.addEventListener('click', () => toggle(false)));
}
if ('IntersectionObserver' in window) {
const io = new IntersectionObserver((entries) => {
entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: .08, rootMargin: '0px 0px -30px 0px' });
$$('.reveal').forEach((el, i) => { el.style.transitionDelay = ((i % 4) * 0.07) + 's'; io.observe(el); });
} else { $$('.reveal').forEach(el => el.classList.add('in')); }
$$('.marquee-track').forEach(t => { t.innerHTML += t.innerHTML; });
$$('.reel-col').forEach(c => { c.innerHTML += c.innerHTML; });
const faqs = $$('.faq-item');
faqs.forEach(item => {
item.querySelector('.faq-q').addEventListener('click', () => {
const was = item.classList.contains('active');
faqs.forEach(o => o.classList.remove('active'));
if (!was) item.classList.add('active');
});
});
const closeModal = (m) => { if (m) { m.classList.remove('active'); body.style.overflow = ''; $$('iframe[data-src]', m).forEach(f => f.src = 'about:blank'); } };
$$('[data-modal]').forEach(btn => {
btn.addEventListener('click', (e) => {
e.preventDefault();
const m = document.getElementById(btn.dataset.modal);
if (m) { m.classList.add('active'); body.style.overflow = 'hidden'; $$('iframe[data-src]', m).forEach(f => f.src = f.dataset.src); }
});
});
$$('.modal').forEach(m => {
m.addEventListener('click', (e) => { if (e.target === m || e.target.closest('.modal-x') || e.target.closest('[data-close]')) closeModal(m); });
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') $$('.modal.active').forEach(closeModal); });
$$('.reviews').forEach(s => {
let down = false, sx = 0, sl = 0;
s.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; sx = e.pageX; sl = s.scrollLeft; });
window.addEventListener('pointerup', () => { down = false; s.classList.remove('dragging'); });
s.addEventListener('pointermove', (e) => {
if (!down) return;
const dx = e.pageX - sx;
if (Math.abs(dx) > 4) s.classList.add('dragging');
s.scrollLeft = sl - dx;
});
});
const fmt = (n) => n.toLocaleString('cs-CZ').replace(/\s/g, ' ');
const counters = $$('[data-count]');
if (counters.length && 'IntersectionObserver' in window) {
const cio = new IntersectionObserver((entries) => {
entries.forEach(e => {
if (!e.isIntersecting) return;
const el = e.target, target = +el.dataset.count, dur = 1600, t0 = performance.now();
const tick = (t) => {
const p = Math.min((t - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 4);
el.textContent = fmt(Math.round(target * eased));
if (p < 1) requestAnimationFrame(tick);
};
requestAnimationFrame(tick);
cio.unobserve(el);
});
}, { threshold: .5 });
counters.forEach(el => cio.observe(el));
} else { counters.forEach(el => el.textContent = fmt(+el.dataset.count)); }
const bar = $('.progress'), navWrap = $('.nav-wrap'), sticky = $('.sticky-cta');
const contact = document.getElementById('contact'), footer = $('footer'), hero = $('.hero, .page-hero');
const tline = document.getElementById('timeline'), tItems = tline ? $$('.tl-item', tline) : [];
let lastY = 0, ticking = false, vh = innerHeight, docH = doc.scrollHeight, heroH = hero ? hero.offsetHeight : 500;
const measure = () => { vh = innerHeight; docH = doc.scrollHeight; heroH = hero ? hero.offsetHeight : 500; };
const frame = () => {
const y = window.scrollY, max = docH - vh;
if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
if (navWrap) {
if (y > 240 && y > lastY + 4 && !(links && links.classList.contains('active'))) navWrap.classList.add('hide');
else if (y < lastY - 4 || y <= 240) navWrap.classList.remove('hide');
}
if (sticky) {
let near = false;
const t = contact || footer;
if (t) near = t.getBoundingClientRect().top < vh * (contact ? .6 : .8);
sticky.classList.toggle('show', y > heroH * .7 && !near);
}
if (tline) {
const r = tline.getBoundingClientRect(), mid = vh * .55;
if (r.bottom > -200 && r.top < vh + 200) {
tline.style.setProperty('--p', (Math.max(0, Math.min(1, (mid - r.top) / r.height)) * 100) + '%');
tItems.forEach(it => { const nr = it.firstElementChild.getBoundingClientRect(); it.classList.toggle('on', nr.top + nr.height / 2 < mid); });
}
}
lastY = y; ticking = false;
};
window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
window.addEventListener('resize', () => { measure(); frame(); });
window.addEventListener('load', () => { measure(); frame(); });
frame();
if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
$$('.magnetic').forEach(b => {
b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .18) + 'px,' + ((e.clientY - r.top - r.height / 2) * .28) + 'px)'; });
b.addEventListener('pointerleave', () => { b.style.transform = ''; });
});
}
$$('.arrow').forEach(a => a.addEventListener('click', () => {
const rv = $('.reviews'); if (!rv) return;
const card = rv.querySelector('.review'); rv.scrollBy({ left: a.dataset.dir * (card.offsetWidth + 16), behavior: 'smooth' });
}));
const zoomImgs = $$('img[data-zoom]');
if (zoomImgs.length) {
const lb = document.createElement('div'); lb.className = 'lightbox'; lb.innerHTML = '<img alt="">'; body.appendChild(lb);
zoomImgs.forEach(im => im.addEventListener('click', () => { lb.firstChild.src = im.dataset.full || im.currentSrc || im.src; lb.classList.add('on'); }));
lb.addEventListener('click', () => lb.classList.remove('on'));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lb.classList.remove('on'); });
}
const embedLinks = $$('[data-embed]');
if (embedLinks.length) {
const m = document.createElement('div'); m.className = 'modal'; m.id = 'modal-embed';
m.innerHTML = '<div class="modal-card embed-card"><button class="modal-x" aria-label="Zavřít">&times;</button><iframe title="Video" allow="autoplay; encrypted-media; fullscreen" allowfullscreen scrolling="no"></iframe><a class="embed-open" target="_blank" rel="noopener"><i><svg class="ic" aria-hidden="true"><use href="#b-instagram"/></svg></i> Otevřít na Instagramu</a></div>';
body.appendChild(m);
const fr = $('iframe', m), ext = $('.embed-open', m);
embedLinks.forEach(a => a.addEventListener('click', (e) => {
if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
e.preventDefault(); fr.src = a.dataset.embed; ext.href = a.href; m.classList.add('active'); body.style.overflow = 'hidden';
}));
const shut = () => { m.classList.remove('active'); body.style.overflow = ''; fr.src = 'about:blank'; };
m.addEventListener('click', (e) => { if (e.target === m || e.target.closest('.modal-x')) shut(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') shut(); });
}
$$('.js-year').forEach(el => el.textContent = new Date().getFullYear());
const banner = document.getElementById('cookie-banner'), cmodal = document.getElementById('cookie-modal');
let stored = null;
try { stored = localStorage.getItem('cookieConsent'); } catch (e) {}
const showBanner = (v) => { if (!banner) return; banner.classList.toggle('hidden', !v); body.classList.toggle('has-cookie', v); };
showBanner(!stored);
const save = (type) => {
try { localStorage.setItem('cookieConsent', type); } catch (e) {}
showBanner(false);
cmodal && cmodal.classList.add('hidden');
};
const on = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };
on('cookie-accept', () => save('all'));
on('cookie-reject', () => save('none'));
on('cookie-settings-btn', () => cmodal && cmodal.classList.remove('hidden'));
on('cookie-save-preferences', () => save('custom'));
on('cookie-close-modal', () => cmodal && cmodal.classList.add('hidden'));
$$('[data-cookie-settings]').forEach(a => a.addEventListener('click', (e) => { e.preventDefault(); cmodal && cmodal.classList.remove('hidden'); }));
});