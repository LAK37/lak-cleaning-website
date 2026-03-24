/* ============================================================
   LAK CLEANING SERVICE — Premium Interactions & Animations
   ============================================================ */

'use strict';

/* ── 1. LOADER ────────────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  const fill   = document.getElementById('loaderFill');
  let progress = 0;

  const tick = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(tick);
      setTimeout(() => loader.classList.add('hidden'), 300);
    }
    fill.style.width = progress + '%';
  }, 80);

  window.addEventListener('load', () => {
    progress = 100;
    fill.style.width = '100%';
    clearInterval(tick);
    setTimeout(() => loader.classList.add('hidden'), 400);
  });
})();

/* ── 2. CUSTOM CURSOR ─────────────────────────────────────── */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  (function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  })();

  document.querySelectorAll('a, button, .service-card, .review-card, input, textarea, select').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

/* ── 3. NAV SCROLL ────────────────────────────────────────── */
(function initNav() {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const mobile = document.getElementById('navMobile');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobile.classList.toggle('open');
  });

  document.querySelectorAll('.nav-mobile a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      mobile.classList.remove('open');
    });
  });
})();

/* ── 4. PARTICLE CANVAS ───────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3 - 0.1;
      this.r  = Math.random() * 1.8 + 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.life  = 0;
      this.maxLife = Math.random() * 300 + 200;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.life++;
      if (this.life > this.maxLife || this.y < -10) this.reset();
    }
    draw() {
      const progress = this.life / this.maxLife;
      const fade = progress < 0.1 ? progress / 0.1 : progress > 0.8 ? 1 - (progress - 0.8) / 0.2 : 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,151,58,${this.alpha * fade})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  // Draw connecting lines between nearby particles
  const drawLines = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(201,151,58,${(1 - dist / 120) * 0.06})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  };

  (function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  })();
})();

/* ── 5. SCROLL REVEAL ─────────────────────────────────────── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || '0');
      setTimeout(() => el.classList.add('visible'), delay);
      observer.unobserve(el);
    });
  }, { threshold: 0, rootMargin: '0px 0px 100px 0px' });

  elements.forEach(el => observer.observe(el));

  // Fallback: alle Elemente nach 1,5s sichtbar machen falls Animation nicht ausgelöst wurde
  setTimeout(() => {
    elements.forEach(el => el.classList.add('visible'));
  }, 1500);
})();

/* ── 6. COUNTER ANIMATION ─────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num, .counter-num');

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target);
    // Show year instantly — no animation for large numbers like 2023
    if (target >= 2000) { el.textContent = target; return; }
    const duration = 2000;
    const start = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.round(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ── 7. SMOOTH ANCHOR SCROLL ──────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── 8. FAQ ACCORDION ─────────────────────────────────────── */
(function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

/* ── 8b. COOKIE BANNER & DSGVO ───────────────────────────── */
(function initCookie() {
  const banner      = document.getElementById('cookieBanner');
  const acceptBtn   = document.getElementById('cookieAccept');
  const declineBtn  = document.getElementById('cookieDecline');
  const mapConsentBtn = document.getElementById('mapConsentBtn');
  if (!banner) return;

  const CONSENT_KEY = 'lak_cookie_consent';

  /* Externe Dienste aktivieren (Google Fonts + Google Maps) */
  function activateExternalServices() {
    // 1. Google Fonts dynamisch laden
    if (!document.getElementById('google-fonts-link')) {
      const preconnect1 = document.createElement('link');
      preconnect1.rel = 'preconnect';
      preconnect1.href = 'https://fonts.googleapis.com';
      document.head.appendChild(preconnect1);

      const preconnect2 = document.createElement('link');
      preconnect2.rel = 'preconnect';
      preconnect2.href = 'https://fonts.gstatic.com';
      preconnect2.crossOrigin = 'anonymous';
      document.head.appendChild(preconnect2);

      const fontLink = document.createElement('link');
      fontLink.id = 'google-fonts-link';
      fontLink.rel = 'stylesheet';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&display=swap';
      document.head.appendChild(fontLink);
    }

    // 2. Google Maps aktivieren
    const map         = document.getElementById('googleMap');
    const placeholder = document.getElementById('mapPlaceholder');
    if (map && map.dataset.src) {
      map.src = map.dataset.src;
      map.style.display = 'block';
      if (placeholder) placeholder.style.display = 'none';
    }

    // 3. Google Tag Manager aktivieren
    if (!document.getElementById('gtm-script')) {
      const gtmScript = document.createElement('script');
      gtmScript.id = 'gtm-script';
      gtmScript.async = true;
      gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-PBWP3VZ9';
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
      document.head.appendChild(gtmScript);
    }
  }

  /* Beim Laden prüfen ob Consent bereits gespeichert */
  const saved = localStorage.getItem(CONSENT_KEY);
  if (saved === 'accepted') {
    banner.classList.add('hidden');
    activateExternalServices();
    return;
  }
  if (saved === 'declined') {
    banner.classList.add('hidden');
    return;
  }

  /* Banner anzeigen (noch keine Entscheidung) */
  banner.classList.remove('hidden');

  /* Akzeptieren */
  acceptBtn && acceptBtn.addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    banner.classList.add('hidden');
    activateExternalServices();
  });

  /* Ablehnen */
  declineBtn && declineBtn.addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    banner.classList.add('hidden');
  });

  /* Karte manuell freischalten (auch ohne Cookie-Banner) */
  mapConsentBtn && mapConsentBtn.addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    banner.classList.add('hidden');
    activateExternalServices();
  });
})();

/* ── 8c. FORM SUBMIT → Web3Forms (handled in index.html) ──── */

/* ── 9. SERVICE CARD TILT ─────────────────────────────────── */
(function initTilt() {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top  + rect.height / 2;
      const rotateX = (e.clientY - centerY) / rect.height * -8;
      const rotateY = (e.clientX - centerX) / rect.width  *  8;
      card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ── 10. NAV ACTIVE STATE ─────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    });
  }, { threshold: 0.5 });

  sections.forEach(s => observer.observe(s));
})();

/* ── 11. HERO TEXT ANIMATION ──────────────────────────────── */
(function initHeroText() {
  const lines = document.querySelectorAll('.hero-title .line');
  lines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(40px)';
    line.style.transition = 'opacity 0.9s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)';
    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
    }, 600 + i * 180);
  });

  document.querySelectorAll('.hero-badge, .hero-sub, .hero-actions, .hero-stats').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)';
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 400 + i * 150);
  });
})();

/* ── 12. MAGNETIC BUTTON EFFECT ───────────────────────────── */
(function initMagnetic() {
  document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)';
      setTimeout(() => btn.style.transition = '', 400);
    });
  });
})();

/* ── 13. NAV ACTIVE STYLE ─────────────────────────────────── */
const style = document.createElement('style');
style.textContent = `.nav-link.active { color: var(--white) !important; } .nav-link.active::after { width: 100% !important; }`;
document.head.appendChild(style);

console.log('%c LAK Cleaning Service — Premium Website ', 'background:#C9973A;color:#000;font-weight:bold;padding:8px 16px;border-radius:4px;');
