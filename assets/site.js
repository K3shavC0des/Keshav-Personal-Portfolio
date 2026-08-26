/* Keshav Kumar — portfolio behaviour.
   Every block guards on its element existing, so one file serves every page.
   Motion is one authored moment per page; everything degrades to a legible
   static page under prefers-reduced-motion. */
document.documentElement.classList.add('js');

(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const $ = s => document.querySelector(s);

  /* ---------- reveals ---------- */
  const io = new IntersectionObserver(es => {
    for (const e of es) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.rv,.head').forEach(el => io.observe(el));

  /* ---------- counters ---------- */
  const cio = new IntersectionObserver(es => {
    for (const e of es) {
      if (!e.isIntersecting) continue;
      cio.unobserve(e.target);
      const el = e.target, to = +el.dataset.count, sfx = el.dataset.suffix || '';
      if (reduced) { el.textContent = to + sfx; continue; }
      const t0 = performance.now(), dur = 900;
      (function step(now) {
        const k = clamp((now - t0) / dur, 0, 1);
        el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + sfx;
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    }
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(c => cio.observe(c));

  /* ---------- nav inverts over ink-field regions ---------- */
  const nav = $('#nav'), reg = $('#reg');
  const inkSecs = [...document.querySelectorAll('.mast,.dark-plate,footer')];
  function navState() {
    if (nav && inkSecs.length) {
      const y = 27;
      nav.classList.toggle('on-ink', inkSecs.some(s => {
        const r = s.getBoundingClientRect();
        return r.top <= y && r.bottom >= y;
      }));
    }
    if (reg) {
      const docH = document.documentElement.scrollHeight - innerHeight;
      reg.style.width = (docH > 0 ? (scrollY / docH) * 100 : 0).toFixed(2) + '%';
    }
  }
  addEventListener('scroll', navState, { passive: true });
  addEventListener('resize', navState);
  navState();

  /* ---------- skeleton renderer (shared by hero + pipeline) ---------- */
  const P = window.POSES;
  function makeView(canvas, host, opts) {
    const ctx = canvas.getContext('2d');
    const R = P.rig, F = P.frames, N = F.length;
    let W = 0, H = 0;
    const o = Object.assign({ yaw: -0.55, pitch: 0.2, dist: 2.15, ox: 0.5, depth: 1.7 }, opts);
    const GHOST = R.bones.map(b => [b[0], b[1]])
      .concat(R.torso.map((v, i) => [v, R.torso[(i + 1) % R.torso.length]]));
    function size() {
      const d = Math.min(devicePixelRatio || 1, 2);
      W = host.clientWidth; H = host.clientHeight;
      if (!W || !H) return;
      canvas.width = W * d; canvas.height = H * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    }
    const toModel = (kp, fi) => ({ x: kp[0] - 0.37, y: -(kp[1] - 0.5), z: (fi / (N - 1) - 0.5) * o.depth });
    function project(p) {
      const cy = Math.cos(o.yaw), sy = Math.sin(o.yaw);
      let x = p.x * cy + p.z * sy, z = -p.x * sy + p.z * cy;
      const cp = Math.cos(o.pitch), sp = Math.sin(o.pitch);
      let y = p.y * cp - z * sp; z = p.y * sp + z * cp; z += o.dist;
      if (z < 0.05) z = 0.05;
      const k = Math.min(W, H) * 0.95 / z;
      return { sx: W * o.ox + x * k, sy: H / 2 - y * k, z, k };
    }
    const fp = fi => F[fi].map(kp => project(toModel(kp, fi)));
    function capsule(A, B, wA, wB) {
      const dx = B.sx - A.sx, dy = B.sy - A.sy, len = Math.hypot(dx, dy) || 1;
      const cap = len * 0.4;
      const rA = Math.min(wA * R.scale * A.k, cap), rB = Math.min(wB * R.scale * B.k, cap);
      const nx = -dy / len, ny = dx / len;
      ctx.beginPath();
      ctx.moveTo(A.sx + nx * rA, A.sy + ny * rA); ctx.lineTo(B.sx + nx * rB, B.sy + ny * rB);
      ctx.lineTo(B.sx - nx * rB, B.sy - ny * rB); ctx.lineTo(A.sx - nx * rA, A.sy - ny * rA);
      ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.arc(A.sx, A.sy, rA, 0, 6.2832); ctx.fill();
      ctx.beginPath(); ctx.arc(B.sx, B.sy, rB, 0, 6.2832); ctx.fill();
    }
    function body(pts, fill) {
      ctx.fillStyle = fill;
      ctx.beginPath();
      R.torso.forEach((i2, i) => { const p = pts[i2]; i ? ctx.lineTo(p.sx, p.sy) : ctx.moveTo(p.sx, p.sy); });
      ctx.closePath(); ctx.fill();
      capsule(pts[R.neck], pts[R.pelvis], R.spineW[0], R.spineW[1]);
      for (const [a, b, w0, w1] of R.bones) capsule(pts[a], pts[b], w0, w1);
      const neck = pts[R.neck], pel = pts[R.pelvis];
      const hx = neck.sx - pel.sx, hy = neck.sy - pel.sy, hl = Math.hypot(hx, hy) || 1;
      const hr = R.headR * neck.k, nl = R.scale * 0.22 * neck.k, d = nl + hr * 0.85;
      const cx = neck.sx + hx / hl * d, cy = neck.sy + hy / hl * d;
      capsule(neck, { sx: cx, sy: cy, k: neck.k }, 0.095, 0.085);
      ctx.beginPath(); ctx.arc(cx, cy, hr, 0, 6.2832); ctx.fill();
    }
    return { size, fp, project, toModel, body, capsule, ctx, GHOST, N, R,
             get W() { return W; }, get H() { return H; } };
  }

  /* ---------- home: scroll draws the bow ---------- */
  const sculpt = $('#sculpt'), mast = $('.mast'), mastOuter = $('.mast-outer');
  if (sculpt && mast && P) {
    const v = makeView(sculpt, mast, { dist: 2.15, ox: 0.68 });
    const { N, R } = v;
    let cur = reduced ? Math.floor(N * 0.62) : 0, target = cur;
    function draw() {
      const ctx = v.ctx; if (!v.W) return;
      ctx.fillStyle = '#10151c'; ctx.fillRect(0, 0, v.W, v.H);
      const idx = Math.round(cur), order = [];
      for (let i = 0; i < N; i++) {
        const pts = v.fp(i); let zs = 0; for (const p of pts) zs += p.z;
        order.push({ i, pts, z: zs / pts.length });
      }
      order.sort((a, b) => b.z - a.z);
      for (const { i, pts } of order) {
        if (i === idx) continue;
        const a = i < idx ? Math.max(0.05, 0.26 - (idx - i) * 0.006) : 0.05;
        ctx.strokeStyle = 'rgba(160,175,198,' + a.toFixed(3) + ')';
        ctx.lineWidth = 1; ctx.beginPath();
        for (const [p, q] of v.GHOST) { ctx.moveTo(pts[p].sx, pts[p].sy); ctx.lineTo(pts[q].sx, pts[q].sy); }
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(255,212,0,.5)'; ctx.lineWidth = 1.5; ctx.beginPath();
      for (let i = 0; i <= idx; i++) {
        const p = v.project(v.toModel(P.frames[i][R.lWrist], i));
        i ? ctx.lineTo(p.sx, p.sy) : ctx.moveTo(p.sx, p.sy);
      }
      ctx.stroke();
      const pts = v.fp(idx);
      v.body(pts, '#eef0f3');
      const w = pts[R.lWrist];
      ctx.fillStyle = '#ffd400';
      ctx.beginPath(); ctx.arc(w.sx, w.sy, R.handR * w.k, 0, 6.2832); ctx.fill();
    }
    new ResizeObserver(() => { v.size(); draw(); }).observe(mast);
    v.size();
    if (reduced) draw();
    else {
      addEventListener('scroll', () => {
        const span = mastOuter ? mastOuter.offsetHeight - innerHeight : mast.offsetHeight;
        const p = span > 0 ? clamp(scrollY / span, 0, 1) : 0;
        target = p * (N - 1);
      }, { passive: true });
      (function loop() {
        cur += (target - cur) * 0.16;
        if (Math.abs(target - cur) < 0.02) cur = target;
        draw(); requestAnimationFrame(loop);
      })();
    }
  }

  /* ---------- research: pinned pipeline ---------- */
  const pipeCv = $('#pipe'), pipeView = $('.pipe-view'), outer = $('.pipe-outer');
  if (pipeCv && pipeView && outer && P) {
    const v = makeView(pipeCv, pipeView, { dist: 2.5, ox: 0.42, depth: 0.9 });
    const { N, R } = v;
    const stageEls = [...document.querySelectorAll('.stages li')];
    const stageCopy = $('#stageCopy'), roL = $('#roLeft'), roR = $('#roRight');
    const COPY = [
      'Raw practice clip. Nothing is labelled — an archer, a bow, and a camera at the end of the line.',
      'Pose estimation recovers 17 body keypoints per frame. Bone lengths are locked to their median so the skeleton stops flickering.',
      'The shot is split into phases. Pose heuristics narrow the window, then binary-search VLM queries find each boundary without labelling all 733 frames.',
      'Timing, alignment and stability are measured per phase — draw-to-release time, spine angle, draw-force elbow angle, post-release bow-arm travel.',
      'Each shot is scored against the archer’s own prior attempts, then an LLM turns the numbers into a drill a coach would actually prescribe.'
    ];
    const PHASES = ['STANCE', 'DRAW', 'ANCHOR', 'RELEASE', 'FOLLOW'];
    let pipeP = 0;
    function draw() {
      const ctx = v.ctx; if (!v.W) return;
      const W = v.W, H = v.H;
      ctx.fillStyle = '#10151c'; ctx.fillRect(0, 0, W, H);
      const stage = clamp(Math.floor(pipeP * 5), 0, 4);
      const local = clamp(pipeP * 5 - stage, 0, 1);
      const idx = Math.round(clamp(pipeP, 0, 1) * (N - 1));
      if (stage >= 1) {
        for (let i = 0; i <= idx; i += 3) {
          const pts = v.fp(i);
          ctx.strokeStyle = 'rgba(160,175,198,' + (0.05 + 0.05 * (i / N)).toFixed(3) + ')';
          ctx.lineWidth = 1; ctx.beginPath();
          for (const [p, q] of v.GHOST) { ctx.moveTo(pts[p].sx, pts[p].sy); ctx.lineTo(pts[q].sx, pts[q].sy); }
          ctx.stroke();
        }
      }
      const pts = v.fp(idx);
      v.body(pts, stage === 0 ? '#39424f' : '#eef0f3');
      if (stage >= 1) {
        const t = stage === 1 ? local : 1;
        ctx.fillStyle = '#3fa9da';
        for (let k = 0; k < 17; k++) {
          if (k / 17 > t) break;
          const p = pts[k];
          ctx.beginPath(); ctx.arc(p.sx, p.sy, 3, 0, 6.2832); ctx.fill();
        }
        const w = pts[R.lWrist];
        ctx.fillStyle = '#ffd400';
        ctx.beginPath(); ctx.arc(w.sx, w.sy, R.handR * w.k, 0, 6.2832); ctx.fill();
      }
      if (stage >= 2) {
        const t = stage === 2 ? local : 1;
        const x0 = W * 0.06, x1 = W * 0.94, y = H - 68, h = 9;
        ctx.strokeStyle = '#2b3542'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x0, y + h / 2); ctx.lineTo(x1, y + h / 2); ctx.stroke();
        const live = Math.min(4, Math.floor((idx / N) * 5));
        for (let s = 0; s < 5; s++) {
          const a = x0 + (x1 - x0) * (s / 5), b = x0 + (x1 - x0) * ((s + 1) / 5);
          const shown = clamp(t * 5 - s, 0, 1);
          if (shown <= 0) continue;
          ctx.fillStyle = s === live ? '#ffd400' : '#3a4553';
          ctx.fillRect(a + 2, y, (b - a - 4) * shown, h);
          if (shown > 0.9) {
            ctx.fillStyle = '#6c7688'; ctx.font = '9px ui-monospace,Menlo,monospace';
            ctx.fillText(PHASES[s], a + 2, y - 7);
          }
        }
        const px = x0 + (x1 - x0) * (idx / (N - 1));
        ctx.strokeStyle = '#eef0f3'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px, y - 4); ctx.lineTo(px, y + h + 4); ctx.stroke();
      }
      if (stage >= 3) {
        const t = stage === 3 ? local : 1;
        const bx = W * 0.06, by = 26, bw = Math.min(160, W * 0.28), bh = 5, gap = 13;
        const vals = [0.86, 0.72, 0.93, 0.64, 0.81, 0.77];
        ctx.font = '9px ui-monospace,Menlo,monospace';
        for (let i = 0; i < 6; i++) {
          const shown = clamp(t * 6 - i, 0, 1);
          if (shown <= 0) continue;
          const y = by + i * gap;
          ctx.fillStyle = '#232c38'; ctx.fillRect(bx, y, bw, bh);
          ctx.fillStyle = '#3fa9da'; ctx.fillRect(bx, y, bw * vals[i] * shown, bh);
        }
        ctx.fillStyle = '#6c7688'; ctx.fillText('CONSISTENCY METRICS', bx, by - 8);
      }
      if (stage >= 4) {
        const line = 'Release was late by 1.23s vs your average. Try a metronome drill.';
        const shown = Math.floor(line.length * clamp(local * 1.6, 0, 1));
        ctx.fillStyle = '#eef0f3'; ctx.font = '12.5px ui-monospace,Menlo,monospace';
        ctx.fillText(line.slice(0, shown), W * 0.06, H - 34);
      }
      if (roL) roL.textContent = 'FRAME ' + String(idx + 1).padStart(3, '0') + ' / ' + N;
      if (roR) roR.innerHTML = 'STAGE <b>' + String(stage + 1).padStart(2, '0') + '</b> / 05';
      stageEls.forEach(el => el.classList.toggle('on', +el.dataset.s === stage));
      if (stageCopy && stageCopy.dataset.s !== String(stage)) {
        stageCopy.dataset.s = String(stage);
        stageCopy.textContent = COPY[stage];
      }
    }
    new ResizeObserver(() => { v.size(); draw(); }).observe(pipeView);
    v.size();
    if (reduced) { pipeP = 0.55; draw(); }
    else {
      let ticking = false;
      addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const span = outer.offsetHeight - innerHeight;
          const p = span > 0 ? clamp((scrollY - outer.offsetTop) / span, 0, 1)
                             : (scrollY > outer.offsetTop ? 1 : 0);
          if (Math.abs(p - pipeP) > 0.0005) { pipeP = p; draw(); }
          ticking = false;
        });
      }, { passive: true });
      draw();
    }
  }

  /* ---------- archery: arrows land ---------- */
  const target = $('#target'), arrows = $('#arrows');
  if (target && arrows) {
    const GROUP = [[196,193],[205,199],[199,206],[191,201],[208,190],[186,196]];
    const shoot = new IntersectionObserver(es => {
      if (!es[0].isIntersecting) return;
      shoot.disconnect();
      GROUP.forEach(([x, y], i) => {
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 3.4);
        if (!reduced) {
          c.style.opacity = '0'; c.style.transition = 'opacity .3s ease-out';
          setTimeout(() => { c.style.opacity = '1'; }, 220 + i * 130);
        }
        arrows.appendChild(c);
      });
    }, { threshold: 0.3 });
    shoot.observe(target);
  }
})();
