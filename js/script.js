/* ==================================================
   SCRIPT.JS — Entry point & orchestration
   - Hero name letter-by-letter reveal on load
   - Mobile nav toggle + close on link click
   - Contact form validation + feedback
   - Footer year
   ================================================== */
(() => {
  'use strict';

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Hero name: split into letters for reveal ---------- */
  const nameLines = document.querySelectorAll('.name-line');
  nameLines.forEach((line) => {
    const text = line.dataset.text || line.textContent;
    line.textContent = '';
    const frag = document.createDocumentFragment();
    [...text].forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'letter';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.animationDelay = (0.05 * i + 0.2) + 's';
      frag.appendChild(span);
    });
    line.appendChild(frag);
  });

  /* ---------- Mobile nav ---------- */
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Smooth-scroll offset for sticky nav ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (form && status) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();

      if (!name || !email || !message) {
        status.style.color = 'var(--warning)';
        status.textContent = 'Please fill in all fields.';
        return;
      }
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        status.style.color = 'var(--warning)';
        status.textContent = 'Please enter a valid email address.';
        return;
      }

      status.style.color = 'var(--success)';
      status.textContent = `Thank you, ${name}! Your message has been queued. I'll get back to you soon.`;
      form.reset();
      setTimeout(() => { status.textContent = ''; }, 6000);
    });
  }
})();
