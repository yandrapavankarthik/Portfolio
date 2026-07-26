/* ==================================================
   SCROLL.JS — Scroll-driven effects
   - IntersectionObserver reveal ([data-reveal] -> .in-view)
   - Scroll progress bar
   - Animated counters ([data-count])
   - Skill bars (.skill-chip -> .in-view)
   - 3D tilt on [data-tilt] cards (pointer-based)
   - Project card glow that follows cursor
   - Back-to-top visibility
   - Nav scrolled state + active link spy
   ================================================== */
(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !prefersReduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  /* ---------- Scroll progress bar ---------- */
  const progress = document.getElementById('scroll-progress');
  const navHeader = document.getElementById('nav-header');
  const backToTop = document.getElementById('back-to-top');

  function onScroll() {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    if (progress) progress.style.width = pct + '%';

    if (navHeader) navHeader.classList.toggle('scrolled', window.scrollY > 40);
    if (backToTop) backToTop.classList.toggle('show', window.scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10) || 0;
      const duration = 1600;
      const start = performance.now();
      function step(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        el.textContent = Math.round(target * eased).toString();
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = target.toString();
      }
      requestAnimationFrame(step);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => countObserver.observe(el));

  /* ---------- Skill bar fill ---------- */
  const skillChips = document.querySelectorAll('.skill-chip');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  skillChips.forEach((el) => skillObserver.observe(el));

  /* ---------- 3D tilt on cards ---------- */
  if (!window.matchMedia('(hover: none)').matches && !prefersReduced) {
    const tiltEls = document.querySelectorAll('[data-tilt]');
    const MAX = 8; // degrees
    tiltEls.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(800px) rotateY(${px * MAX}deg) rotateX(${-py * MAX}deg) translateY(-4px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });

    /* Project card glow follows cursor */
    document.querySelectorAll('.proj-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width) * 100 + '%');
        card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height) * 100 + '%');
      });
    });
  }

  /* ---------- Back to top ---------- */
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Active nav link spy ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((l) => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + id);
      });
    });
  }, { threshold: 0.4, rootMargin: '-20% 0px -60% 0px' });
  sections.forEach((s) => spy.observe(s));
})();
