/* ============================================================
   CORE.JS – original logic + particles, typewriter, parallax,
             scroll reveal, animated counters
   ============================================================ */

/* ─── LOADER ─────────────────────────────────────────────── */
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) loader.classList.add('hidden');
    }, 900);
});

/* ─── NAVBAR SCROLL ──────────────────────────────────────── */
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 50);
});

/* ─── MOBILE MENU ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay    = document.getElementById('overlay');
    const openStructure = document.querySelector('.mobile-open-structure');
    const backBtn       = document.querySelector('.mobile-back');

    if (!hamburger || !mobileMenu || !overlay) {
        console.warn('Mobile menu: brak wymaganych elementów HTML');
        return;
    }

    function openMenu() {
        mobileMenu.classList.add('open', 'show-main');
        mobileMenu.classList.remove('show-structure');
        hamburger.classList.add('open');
        overlay.classList.add('active');
        document.body.classList.add('menu-open');
        hamburger.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
    }

    function closeMenu() {
        mobileMenu.classList.remove('open', 'show-main', 'show-structure');
        hamburger.classList.remove('open');
        overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
    }

    hamburger.addEventListener('click', () =>
        mobileMenu.classList.contains('open') ? closeMenu() : openMenu()
    );
    overlay.addEventListener('click', closeMenu);

    if (openStructure) {
        openStructure.addEventListener('click', e => {
            e.preventDefault();
            mobileMenu.classList.remove('show-main');
            mobileMenu.classList.add('show-structure');
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', e => {
            e.preventDefault();
            mobileMenu.classList.remove('show-structure');
            mobileMenu.classList.add('show-main');
        });
    }

    mobileMenu.querySelectorAll('a:not(.mobile-open-structure):not(.mobile-back)')
        .forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
    });
});

/* ─── SMOOTH SCROLL ──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

/* ─── SCROLL REVEAL ──────────────────────────────────────── */
(function initReveal() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal, .fade-in').forEach(el => obs.observe(el));
})();

/* ─── ANIMATED COUNTERS ──────────────────────────────────── */
(function initCounters() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            const isLast = target === 860;
            const duration = 1400;
            const start = performance.now();

            function tick(now) {
                const progress = Math.min((now - start) / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(ease * target) + (progress >= 1 && isLast ? '+' : '');
                if (progress < 1) requestAnimationFrame(tick);
            }

            requestAnimationFrame(tick);
            obs.unobserve(el);
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-value[data-target]').forEach(el => obs.observe(el));
})();

/* ─── TYPEWRITER ─────────────────────────────────────────── */
(function initTypewriter() {
    const el = document.getElementById('typewriter-text');
    if (!el) return;

    const phrases = [
        'Wymiar Sprawiedliwości',
        'Nadzór i Bezpieczeństwo',
        'Tworzenie Prawa',
        'Department of Justice',
    ];

    let phraseIdx = 0, charIdx = 0, deleting = false;

    function tick() {
        const current = phrases[phraseIdx];

        if (!deleting) {
            charIdx++;
            el.textContent = current.slice(0, charIdx);
            if (charIdx === current.length) {
                deleting = true;
                setTimeout(tick, 2200);
                return;
            }
            setTimeout(tick, 70);
        } else {
            charIdx--;
            el.textContent = current.slice(0, charIdx);
            if (charIdx === 0) {
                deleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                setTimeout(tick, 400);
                return;
            }
            setTimeout(tick, 35);
        }
    }

    setTimeout(tick, 1100);
})();

/* ─── PARTICLE CANVAS ────────────────────────────────────── */
(function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, particles;
    const COUNT = 75;

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = Array.from({ length: COUNT }, () => ({
            x:  Math.random() * W,
            y:  Math.random() * H,
            r:  Math.random() * 1.4 + 0.3,
            vx: (Math.random() - 0.5) * 0.28,
            vy: (Math.random() - 0.5) * 0.28,
            a:  Math.random() * 0.55 + 0.15,
        }));
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(201,162,39,${(1 - dist / 130) * 0.13})`;
                    ctx.lineWidth = 0.6;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = W;
            if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H;
            if (p.y > H) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(201,162,39,${p.a})`;
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', () => { resize(); createParticles(); });
})();

/* ─── PARALLAX (hero glow + watermark) ──────────────────── */
(function initParallax() {
    const glow      = document.getElementById('heroGlow');
    const watermark = document.querySelector('.hero-watermark');

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (glow)      glow.style.transform     = `translate(-50%, calc(-50% + ${y * 0.25}px))`;
        if (watermark) watermark.style.transform = `translateY(calc(-50% + ${y * 0.12}px))`;
    }, { passive: true });
})();
