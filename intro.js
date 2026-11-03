/* AppForge launch intro. Runs once per tab; no dependencies or user data collection. */
(() => {
  'use strict';

  const intro = document.getElementById('appforge-intro');
  if (!intro) return;

  const storageKey = 'appforge-intro-seen-v1';
  let alreadySeen = false;
  try { alreadySeen = sessionStorage.getItem(storageKey) === '1'; } catch {}

  const reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (alreadySeen || reduceMotion) {
    intro.remove();
    return;
  }

  const canvas = intro.querySelector('.af-intro__particles');
  const ctx = canvas && canvas.getContext('2d', { alpha: true });
  const skip = intro.querySelector('.af-intro__skip');
  let frame = 0;
  let finishTimer = 0;
  let cleanupTimer = 0;
  let width = 0;
  let height = 0;
  let previousTime = 0;
  let particles = [];
  let finished = false;

  function resize() {
    if (!ctx) return;
    width = Math.max(1, window.innerWidth);
    height = Math.max(1, window.innerHeight);
    const ratio = Math.min(window.devicePixelRatio || 1, 1.8);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.min(85, Math.max(24, Math.floor(width * height / 21000)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - .5) * .45,
      vy: (Math.random() - .5) * .42 - .12,
      radius: Math.random() * 1.55 + .45,
      alpha: Math.random() * .45 + .28
    }));
  }

  function draw(now) {
    if (finished || document.hidden || !ctx) return;
    const step = previousTime ? Math.min((now - previousTime) / 16.67, 2.3) : 1;
    previousTime = now;
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx * step;
      p.y += p.vy * step;
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;
    }

    const connectDistance = width < 620 ? 94 : 120;
    const distanceSquared = connectDistance * connectDistance;
    ctx.lineWidth = .65;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const d2 = dx * dx + dy * dy;
        if (d2 >= distanceSquared) continue;
        const a = (1 - d2 / distanceSquared) * .2;
        ctx.strokeStyle = 'rgba(93,188,255,' + a.toFixed(3) + ')';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(143,222,255,' + p.alpha.toFixed(3) + ')';
      ctx.shadowColor = '#55b9ff';
      ctx.shadowBlur = 9;
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    frame = requestAnimationFrame(draw);
  }

  function stopParticles() {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
  }

  function onVisibilityChange() {
    if (!ctx || finished) return;
    if (document.hidden) stopParticles();
    else if (!frame) frame = requestAnimationFrame(draw);
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      finish();
    } else if (event.key === 'Tab') {
      // The skip button is the only interactive control within the intro.
      event.preventDefault();
      skip?.focus({ preventScroll: true });
    }
  }

  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(finishTimer);
    stopParticles();
    window.removeEventListener('resize', resize);
    window.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    try { sessionStorage.setItem(storageKey, '1'); } catch {}

    intro.classList.add('af-intro--exit');
    // Release scroll immediately, and remove the overlay after its fade out.
    document.body.classList.remove('af-intro-active');
    cleanupTimer = window.setTimeout(() => {
      intro.remove();
      window.clearTimeout(cleanupTimer);
    }, 680);
  }

  // Keep the page usable even if canvas is unsupported.
  intro.hidden = false;
  document.body.classList.add('af-intro-active');
  skip?.addEventListener('click', finish);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', onVisibilityChange);
  if (ctx) {
    resize();
    frame = requestAnimationFrame(draw);
  }
  requestAnimationFrame(() => intro.classList.add('af-intro--play'));
  skip?.focus({ preventScroll: true });
  finishTimer = window.setTimeout(finish, 3000);
})();
