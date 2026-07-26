/* ==================================================
   TYPING.JS — Typing animation for hero role
   Cycles through role phrases with type + erase.
   ================================================== */
(() => {
  'use strict';

  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Operations Manager',
    'Banking Operations',
    'NBFC Operations',
    'Digital Lending',
    'Process Improvement',
    'Loan Operations',
    'Customer Experience',
    'Compliance',
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;

  const TYPE_SPEED = 90;
  const ERASE_SPEED = 45;
  const HOLD_MS = 1600;
  const GAP_MS = 320;

  function tick() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        return setTimeout(tick, HOLD_MS);
      }
      return setTimeout(tick, TYPE_SPEED);
    }

    // deleting
    charIdx--;
    el.textContent = current.slice(0, charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      return setTimeout(tick, GAP_MS);
    }
    setTimeout(tick, ERASE_SPEED);
  }

  // Start after a short delay so hero entrance settles
  setTimeout(tick, 900);
})();
