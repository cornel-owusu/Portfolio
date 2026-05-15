/**
 * ════════════════════════════════════════════════════════════
 *  COMFORT NTRIRIWAA OWUSU — PORTFOLIO SCRIPT
 *  script.js
 * ════════════════════════════════════════════════════════════
 */

'use strict';

/* ════════════════════════════════════════════════════════════
   UTILITY: Smooth scroll to section by ID
════════════════════════════════════════════════════════════ */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ════════════════════════════════════════════════════════════
   PRELOADER
════════════════════════════════════════════════════════════ */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // Hide after minimum 1.8s (bar fills in 1.6s + slight delay)
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      // Remove from DOM after transition
      preloader.addEventListener('transitionend', () => {
        preloader.remove();
      }, { once: true });
    }, 1800);
  });
}

/* ════════════════════════════════════════════════════════════
   SCROLL PROGRESS INDICATOR
════════════════════════════════════════════════════════════ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ════════════════════════════════════════════════════════════
   NAVBAR — sticky scroll state, active link, hamburger
════════════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const navLinkEls = document.querySelectorAll('.nav-link');

  // ── Scroll state ──
  function updateNavbar() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // ── Hamburger menu ──
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Active nav link highlighting ──
  const sections = document.querySelectorAll('section[id], .hero[id]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinkEls.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
}

/* ════════════════════════════════════════════════════════════
   SMOOTH SCROLL — anchor links
════════════════════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ════════════════════════════════════════════════════════════
   SCROLL REVEAL ANIMATIONS
════════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children of same parent
        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.querySelectorAll('.reveal')]
          : [];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = idx > 0 ? (idx * 0.08) + 's' : '0s';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

/* ════════════════════════════════════════════════════════════
   ANIMATED COUNTERS
════════════════════════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-n[data-count]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1400;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ════════════════════════════════════════════════════════════
   TYPING ANIMATION — hero role text
════════════════════════════════════════════════════════════ */
function initTypingAnimation() {
  const typingEl = document.getElementById('typing-text');
  if (!typingEl) return;

  const phrases = [
    'Digital Marketing Professional',
    'Content Strategist',
    'Social Media Manager',
    'SEO Specialist',
    'Campaign Planner',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let isDeleting = false;
  let typingTimer;

  function type() {
    const current = phrases[phraseIdx];

    if (isDeleting) {
      typingEl.textContent = current.slice(0, charIdx - 1);
      charIdx--;
    } else {
      typingEl.textContent = current.slice(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? 55 : 90;

    if (!isDeleting && charIdx === current.length) {
      // Pause at full phrase
      delay = 2200;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx  = (phraseIdx + 1) % phrases.length;
      delay = 400;
    }

    typingTimer = setTimeout(type, delay);
  }

  // Start after slight delay for UX
  setTimeout(type, 800);
}

/* ════════════════════════════════════════════════════════════
   BACK TO TOP BUTTON
════════════════════════════════════════════════════════════ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ════════════════════════════════════════════════════════════
   HERO PARTICLES
════════════════════════════════════════════════════════════ */
function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  const count = 20;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size  = Math.random() * 3 + 1;
    const left  = Math.random() * 100;
    const delay = Math.random() * 8;
    const dur   = Math.random() * 10 + 8;
    const top   = Math.random() * 100;

    p.style.cssText = `
      width:${size}px;
      height:${size}px;
      left:${left}%;
      top:${top}%;
      animation-duration:${dur}s;
      animation-delay:${delay}s;
      opacity:${Math.random() * 0.4 + 0.1};
    `;

    container.appendChild(p);
  }
}

/* ════════════════════════════════════════════════════════════
   LAZY IMAGE LOADING
════════════════════════════════════════════════════════════ */
function initLazyImages() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        // Native lazy loading handles src; we add a fade-in effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.4s ease';

        const onLoad = () => {
          img.style.opacity = '1';
        };

        if (img.complete && img.naturalHeight !== 0) {
          onLoad();
        } else {
          img.addEventListener('load', onLoad, { once: true });
        }

        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  images.forEach(img => observer.observe(img));
}

/* ════════════════════════════════════════════════════════════
   CONTACT FORM — simulated submit
════════════════════════════════════════════════════════════ */
function initContactForm() {
  const sendBtn   = document.getElementById('send-btn');
  const successEl = document.getElementById('form-success');
  if (!sendBtn || !successEl) return;

  sendBtn.addEventListener('click', () => {
    const name    = document.getElementById('name')?.value.trim();
    const email   = document.getElementById('email')?.value.trim();
    const message = document.getElementById('message')?.value.trim();

    if (!name || !email || !message) {
      // Shake the button
      sendBtn.style.animation = 'none';
      sendBtn.offsetHeight; // reflow
      sendBtn.style.animation = 'shake 0.4s ease';
      return;
    }

    sendBtn.textContent = 'Sending…';
    sendBtn.disabled = true;

    // Simulate async send
    setTimeout(() => {
      sendBtn.textContent = 'Send Message';
      sendBtn.disabled = false;
      successEl.classList.add('visible');

      // Reset form
      ['name','email','subject','message'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });

      // Hide success after 5s
      setTimeout(() => successEl.classList.remove('visible'), 5000);
    }, 1200);
  });
}

/* ════════════════════════════════════════════════════════════
   SKILL CARDS — keyboard accessibility
════════════════════════════════════════════════════════════ */
function initSkillCards() {
  document.querySelectorAll('.skill-card[tabindex]').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.add('skill-card--active');
        setTimeout(() => card.classList.remove('skill-card--active'), 200);
      }
    });
  });
}

/* ════════════════════════════════════════════════════════════
   WORKS GRID — keyboard accessibility + no-link graceful
════════════════════════════════════════════════════════════ */
function initWorksGrid() {
  // Make cards with no href behave as non-interactive for keyboard
  document.querySelectorAll('.work-card--no-link').forEach(card => {
    card.setAttribute('tabindex', '-1');
    card.setAttribute('aria-hidden', 'true');
  });

  // Keyboard: Enter opens link cards
  document.querySelectorAll('a.work-card').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter') card.click();
    });
  });
}

/* ════════════════════════════════════════════════════════════
   MICROINTERACTION — gold glow on hover for .btn-gold
════════════════════════════════════════════════════════════ */
function initButtonMicro() {
  document.querySelectorAll('.btn-gold').forEach(btn => {
    btn.addEventListener('mouseenter', function () {
      this.style.boxShadow = '0 6px 20px rgba(212,175,55,0.35)';
    });
    btn.addEventListener('mouseleave', function () {
      this.style.boxShadow = '';
    });
  });
}

/* ════════════════════════════════════════════════════════════
   ADD SHAKE KEYFRAME TO HEAD (for form validation)
════════════════════════════════════════════════════════════ */
function injectShakeKeyframe() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(6px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(style);
}

/* ════════════════════════════════════════════════════════════
   INIT — run all modules
════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  injectShakeKeyframe();
  initPreloader();
  initScrollProgress();
  initNavbar();
  initSmoothScroll();
  initScrollReveal();
  initCounters();
  initTypingAnimation();
  initBackToTop();
  initParticles();
  initLazyImages();
  initContactForm();
  initSkillCards();
  initWorksGrid();
  initButtonMicro();
});
