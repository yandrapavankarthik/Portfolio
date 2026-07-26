/* ==================================================
   CURSOR.JS — Custom glowing cursor + magnetic buttons
   - Dot follows pointer instantly
   - Ring trails with easing
   - Grows on hoverable elements
   - Magnetic pull on .magnetic elements
   - Ripple effect on .btn clicks
   ================================================== */
(() => {
  'use strict';

  // Skip on touch / coarse-pointer devices
  if (window.matchMedia('(hover: none)').matches) return;

  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let raf = null;

  function render() {
    // Eased trail for the ring
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    raf = requestAnimationFrame(render);
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!raf) raf = requestAnimationFrame(render);
  }, { passive: true });

  // Grow ring over interactive elements
  const hoverSel = 'a, button, .tilt, [data-tilt], input, textarea, .nav-toggle';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSel)) ring.classList.add('hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSel)) ring.classList.remove('hover');
  });

  // Hide system cursor only on devices that have a fine pointer
  document.body.style.cursor = 'none';
  document.querySelectorAll('a, button, input, textarea, .nav-toggle').forEach((el) => {
    el.style.cursor = 'none';
  });

  /* ---------- Magnetic buttons ---------- */
  const magnets = Array.from(document.querySelectorAll('.magnetic'));
  const STRENGTH = 0.35;

  magnets.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * STRENGTH;
      const dy = (e.clientY - cy) * STRENGTH;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

  /* ---------- Ripple on .btn ---------- */
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
      ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
})();
