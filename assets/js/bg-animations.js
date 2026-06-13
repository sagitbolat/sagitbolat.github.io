/* ============================================================
   bg-animations.js  —  Background Canvas Animations
   ============================================================
   Four animation modes cycle via the header button.
   Each mode object: { start(canvas), stop(), resize() }
   Colors are pulled from CSS custom properties so they stay
   in sync with any palette changes in pixel.css.
   ============================================================ */

/* ── Config ─────────────────────────────────────────────────── */
const BG_ANIM = (() => {

  /* Read palette from CSS vars once (called inside start() so the
     document is guaranteed to be styled before we read). */
  function palette() {
    const s = getComputedStyle(document.documentElement);
    return {
      bg:     s.getPropertyValue('--c-bg').trim()     || '#0f1327',
      panel:  s.getPropertyValue('--c-panel').trim()  || '#1c1a35',
      mid:    s.getPropertyValue('--c-titlebar').trim()|| '#484267',
      accent: s.getPropertyValue('--c-border').trim() || '#9a7ca7',
      text:   s.getPropertyValue('--c-text').trim()   || '#e5dac2',
    };
  }

  /* ── Shared canvas helpers ───────────────────────────────── */
  function fillBg(ctx, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  /* ── 1. MATRIX ───────────────────────────────────────────── */
  const matrix = (() => {
    /* Each column: one falling "pixel" head + fading trail */
    const PIXEL    = 6;   /* px — size of each pixel cell         */
    const SPEED    = 0.6; /* cells per frame the head falls       */
    const TRAIL    = 26;  /* trail length in cells                */
    const FADE     = 0.85;/* opacity multiplier per trail step    */

    /* Color cycle for pixel heads — uses palette accent shades  */
    const HEAD_COLORS = ['#e5dac2', '#c5b0d4', '#9a7ca7', '#7a5c8a', '#484267'];

    let raf, ctx, cols = [], pal;

    function initCols(w, h) {
      const numCols = Math.floor(w / PIXEL);
      cols = Array.from({ length: numCols }, (_, i) => ({
        x:     i * PIXEL,
        y:     Math.random() * -h,        /* start above screen  */
        speed: SPEED * (0.6 + Math.random() * 0.8),
        color: HEAD_COLORS[Math.floor(Math.random() * HEAD_COLORS.length)],
        trail: [],
      }));
    }

    function draw() {
      const { width: w, height: h } = ctx.canvas;

      /* Dim the background slightly each frame for the trail effect */
      ctx.fillStyle = 'rgba(15,19,39,0.18)';
      ctx.fillRect(0, 0, w, h);

      cols.forEach(col => {
        /* Draw trail (oldest → newest, getting brighter) */
        col.trail.forEach((ty, i) => {
          const alpha = Math.pow(FADE, TRAIL - i) * 0.9;
          ctx.fillStyle = col.color
            .replace(/[\d.]+\)$/, `${alpha})`)
            || hexWithAlpha(col.color, alpha);
          ctx.fillRect(col.x, ty * PIXEL, PIXEL - 1, PIXEL - 1);
        });

        /* Draw head */
        ctx.fillStyle = col.color;
        ctx.fillRect(col.x, col.y, PIXEL - 1, PIXEL - 1);

        /* Advance */
        const cellY = Math.floor(col.y / PIXEL);
        col.trail.push(cellY);
        if (col.trail.length > TRAIL) col.trail.shift();

        col.y += col.speed * PIXEL;
        if (col.y > h + TRAIL * PIXEL) {
          col.y     = Math.random() * -h * 0.5;
          col.color = HEAD_COLORS[Math.floor(Math.random() * HEAD_COLORS.length)];
          col.trail = [];
        }
      });

      raf = requestAnimationFrame(draw);
    }

    function hexWithAlpha(hex, alpha) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }

    return {
      start(canvas) {
        ctx = canvas.getContext('2d');
        pal = palette();
        initCols(canvas.width, canvas.height);
        fillBg(ctx, pal.bg);
        raf = requestAnimationFrame(draw);
      },
      stop() { cancelAnimationFrame(raf); },
      resize() {
        if (!ctx) return;
        pal = palette();
        initCols(ctx.canvas.width, ctx.canvas.height);
        fillBg(ctx, pal.bg);
      },
    };
  })();


  /* ── 2. GAME OF LIFE ─────────────────────────────────────── */
  const life = (() => {
    const CELL = 6;   /* px per cell                            */
    const FPS  = 12;  /* generations per second                 */

    let raf, ctx, grid, cols, rows, pal;
    let last = 0;
    const interval = 1000 / FPS;

    /* ---- Seed patterns ------------------------------------ */
    /* Gosper Glider Gun — fires a glider every 30 generations */
    const GLIDER_GUN = [
      [24,0],
      [22,1],[24,1],
      [12,2],[13,2],[20,2],[21,2],[34,2],[35,2],
      [11,3],[15,3],[20,3],[21,3],[34,3],[35,3],
      [0,4],[1,4],[10,4],[16,4],[20,4],[21,4],
      [0,5],[1,5],[10,5],[14,5],[15,5],[16,5],[22,5],[24,5],
      [10,6],[16,6],[24,6],
      [11,7],[15,7],
      [12,8],[13,8],
    ];
    /* Acorn — tiny 7-cell seed that takes ~5200 gens to settle */
    const ACORN = [[1,0],[3,1],[0,2],[1,2],[4,2],[5,2],[6,2]];
    /* R-pentomino — chaotic, stabilises after ~1100 gens */
    const R_PENT = [[1,0],[2,0],[0,1],[1,1],[1,2]];

    function make(c, r) {
      return new Uint8Array(c * r);
    }
    function idx(x, y) { return y * cols + x; }
    function get(g, x, y) {
      return g[idx((x + cols) % cols, (y + rows) % rows)];
    }

    function place(pattern, ox, oy) {
      pattern.forEach(([x, y]) => {
        const nx = ((ox + x) % cols + cols) % cols;
        const ny = ((oy + y) % rows + rows) % rows;
        grid[ny * cols + nx] = 1;
      });
    }

    function initGrid(w, h) {
      cols = Math.floor(w / CELL);
      rows = Math.floor(h / CELL);
      grid = make(cols, rows);

      /* Gosper guns tiled across the grid, spaced so gliders
         have room to travel before hitting another gun.       */
      const GX = 60, GY = 48;
      for (let gy = 4; gy + 9 < rows; gy += GY) {
        for (let gx = 4; gx + 36 < cols; gx += GX) {
          place(GLIDER_GUN, gx, gy);
        }
      }

      /* A handful of acorns and R-pentominoes for long-running
         chaos that fills the gaps between guns.               */
      const chaos = Math.max(3, Math.floor((cols * rows) / 3000));
      for (let i = 0; i < chaos; i++) {
        const ox = 5 + Math.floor(Math.random() * (cols - 15));
        const oy = 5 + Math.floor(Math.random() * (rows - 10));
        place(i % 2 === 0 ? ACORN : R_PENT, ox, oy);
      }
    }

    function step() {
      const next = make(cols, rows);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let n = 0;
          for (let dy = -1; dy <= 1; dy++)
            for (let dx = -1; dx <= 1; dx++)
              if (dx || dy) n += get(grid, x + dx, y + dy);
          const alive = get(grid, x, y);
          next[idx(x, y)] = alive
            ? (n === 2 || n === 3 ? 1 : 0)
            : (n === 3 ? 1 : 0);
        }
      }
      grid = next;
    }

    function draw(ts) {
      raf = requestAnimationFrame(draw);
      if (ts - last < interval) return;
      last = ts;

      const { width: w, height: h } = ctx.canvas;
      fillBg(ctx, pal.bg);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (get(grid, x, y)) {
            /* Vary shade by neighbour count for visual depth */
            let n = 0;
            for (let dy = -1; dy <= 1; dy++)
              for (let dx = -1; dx <= 1; dx++)
                if (dx || dy) n += get(grid, x + dx, y + dy);
            ctx.fillStyle = n >= 5 ? pal.text : n >= 3 ? pal.accent : pal.mid;
            ctx.fillRect(x * CELL, y * CELL, CELL - 1, CELL - 1);
          }
        }
      }
      step();
    }

    return {
      start(canvas) {
        ctx = canvas.getContext('2d');
        pal = palette();
        initGrid(canvas.width, canvas.height);
        fillBg(ctx, pal.bg);
        raf = requestAnimationFrame(draw);
      },
      stop() { cancelAnimationFrame(raf); },
      resize() {
        if (!ctx) return;
        pal = palette();
        initGrid(ctx.canvas.width, ctx.canvas.height);
        fillBg(ctx, pal.bg);
      },
    };
  })();


  /* ── 3. PIXEL FIRE ───────────────────────────────────────── */
  const fire = (() => {
    /* Classic demoscene fire — bottom row = 255, each cell
       averages up neighbors then subtracts a small random decay.
       Low buf values appear at the top (cool → transparent);
       high values stay near the bottom (hot → bright orange).    */
    const CELL  = 4;    /* px per fire pixel                      */
    const DECAY = 10;   /* max random cooling per step            */
    const FPS   = 30;

    let raf, ctx, buf, cols, rows, pal;
    let last = 0;
    const interval = 1000 / FPS;

    /*
      256-entry orange ramp — complementary to the purple palette.
      Low indices (top of flame, coolest) → fully transparent.
      High indices (bottom, hottest) → bright yellow-white.
      Alpha fades in smoothly so particles dissolve at the tips.
    */
    function buildRamp() {
      const ramp = new Array(256);
      /* 0–80: invisible — tips dissolve well before reaching here */
      for (let i = 0; i <= 80; i++) {
        ramp[i] = null;
      }
      /* 81–130: dark ember, alpha fading in 0 → 0.55 */
      for (let i = 81; i <= 130; i++) {
        const t = (i - 81) / 49;
        const a = (t * 0.55).toFixed(3);
        const r = Math.round(130 + t * 80);   /* 130 → 210 */
        const g = Math.round(20  + t * 40);   /*  20 →  60 */
        ramp[i] = `rgba(${r},${g},0,${a})`;
      }
      /* 130–190: deep orange, alpha 0.55 → 0.82 */
      for (let i = 131; i <= 190; i++) {
        const t = (i - 131) / 59;
        const a = (0.55 + t * 0.27).toFixed(3);
        const r = Math.round(210 + t * 45);   /* 210 → 255 */
        const g = Math.round(60  + t * 80);   /*  60 → 140 */
        ramp[i] = `rgba(${r},${g},0,${a})`;
      }
      /* 190–225: bright orange → yellow, alpha 0.82 → 0.94 */
      for (let i = 191; i <= 225; i++) {
        const t = (i - 191) / 34;
        const a = (0.82 + t * 0.12).toFixed(3);
        const g = Math.round(140 + t * 90);   /* 140 → 230 */
        const b = Math.round(t * 20);
        ramp[i] = `rgba(255,${g},${b},${a})`;
      }
      /* 225–255: yellow → warm white, fully opaque */
      for (let i = 226; i <= 255; i++) {
        const t = (i - 226) / 29;
        const g = Math.round(230 + t * 20);   /* 230 → 250 */
        const b = Math.round(20  + t * 215);  /*  20 → 235 */
        ramp[i] = `rgba(255,${g},${b},1)`;
      }
      return ramp;
    }

    let ramp;

    function initBuf(w, h) {
      cols = Math.floor(w / CELL);
      rows = Math.floor(h / CELL) + 1; /* +1 for off-screen source row */
      buf  = new Uint8Array(cols * rows);
    }

    function spreadFire() {
      /* Bottom row always blazing */
      for (let x = 0; x < cols; x++) {
        buf[(rows - 1) * cols + x] = 255;
      }
      /* Propagate upwards with random horizontal drift + cooling */
      for (let y = 0; y < rows - 1; y++) {
        for (let x = 0; x < cols; x++) {
          const decay = Math.floor(Math.random() * (DECAY + 1));
          const nx    = (x + Math.floor(Math.random() * 3) - 1 + cols) % cols;
          const dst   = (y > 0) ? (y - 1) * cols + nx : y * cols + nx;
          buf[dst] = Math.max(0, buf[(y + 1) * cols + x] - decay);
        }
      }
    }

    function draw(ts) {
      raf = requestAnimationFrame(draw);
      if (ts - last < interval) return;
      last = ts;

      spreadFire();
      fillBg(ctx, pal.bg);

      for (let y = 0; y < rows - 1; y++) {
        for (let x = 0; x < cols; x++) {
          const v = buf[y * cols + x];
          const color = ramp[v];
          if (!color) continue;
          ctx.fillStyle = color;
          ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
        }
      }
    }

    return {
      start(canvas) {
        ctx = canvas.getContext('2d');
        pal = palette();
        ramp = buildRamp();
        initBuf(canvas.width, canvas.height);
        fillBg(ctx, pal.bg);
        raf = requestAnimationFrame(draw);
      },
      stop() { cancelAnimationFrame(raf); },
      resize() {
        if (!ctx) return;
        pal = palette();
        initBuf(ctx.canvas.width, ctx.canvas.height);
        fillBg(ctx, pal.bg);
      },
    };
  })();


  /* ── 4. FLOW FIELD ───────────────────────────────────────── */
  const flow = (() => {
    /* Perlin-noise-driven flow field — particles follow the field
       and leave fading trails.  Tiny pixel squares as particles. */
    const COUNT    = 600;   /* number of particles                */
    const SPEED    = 1.2;   /* pixels per frame                   */
    const CELL     = 3;     /* particle square size               */
    const SCALE    = 0.003; /* noise sample spacing               */
    const FADE_A   = 0.012; /* canvas fade alpha per frame        */

    /* Minimal 2D Perlin-ish noise via smoothed grid (no deps) */
    const GSIZE = 64;
    let gx, gy;

    function initNoise() {
      gx = new Float32Array(GSIZE * GSIZE);
      gy = new Float32Array(GSIZE * GSIZE);
      for (let i = 0; i < GSIZE * GSIZE; i++) {
        const a = Math.random() * Math.PI * 2;
        gx[i] = Math.cos(a);
        gy[i] = Math.sin(a);
      }
    }

    function noise(nx, ny) {
      const xi = Math.floor(nx) & (GSIZE - 1);
      const yi = Math.floor(ny) & (GSIZE - 1);
      const xf = nx - Math.floor(nx);
      const yf = ny - Math.floor(ny);
      const u  = fade(xf), v = fade(yf);
      const a  = dot(xi,       yi,       xf,     yf    );
      const b  = dot((xi+1)&(GSIZE-1), yi,       xf-1,   yf    );
      const c  = dot(xi,       (yi+1)&(GSIZE-1), xf,     yf-1  );
      const d  = dot((xi+1)&(GSIZE-1), (yi+1)&(GSIZE-1), xf-1, yf-1);
      return lerp(lerp(a, b, u), lerp(c, d, u), v);
    }
    function fade(t) { return t * t * (3 - 2 * t); }
    function lerp(a, b, t) { return a + (b - a) * t; }
    function dot(xi, yi, xf, yf) {
      const i = yi * GSIZE + xi;
      return gx[i] * xf + gy[i] * yf;
    }

    let raf, ctx, particles, pal;
    let t = 0;

    function initParticles(w, h) {
      particles = Array.from({ length: COUNT }, () => ({
        x:   Math.random() * w,
        y:   Math.random() * h,
        age: Math.floor(Math.random() * 200),
        color: null,
      }));
    }

    /* Assign colors in bands by x-position for visual variety */
    const PCOLORS = ['#e5dac2', '#c5b0d4', '#9a7ca7', '#7a5c8a', '#484267'];

    function draw() {
      const { width: w, height: h } = ctx.canvas;

      /* Fade trail — dark semitransparent wash */
      ctx.fillStyle = `rgba(15,19,39,${FADE_A})`;
      ctx.fillRect(0, 0, w, h);

      t += 0.004;

      particles.forEach(p => {
        const angle = noise(p.x * SCALE + t, p.y * SCALE) * Math.PI * 4;
        p.x += Math.cos(angle) * SPEED;
        p.y += Math.sin(angle) * SPEED;
        p.age++;

        /* Wrap at edges */
        if (p.x < 0) p.x += w;
        if (p.x > w) p.x -= w;
        if (p.y < 0) p.y += h;
        if (p.y > h) p.y -= h;

        /* Reset old particles */
        if (p.age > 300) {
          p.x   = Math.random() * w;
          p.y   = Math.random() * h;
          p.age = 0;
        }

        const ci = Math.floor((p.x / w) * PCOLORS.length);
        ctx.fillStyle = PCOLORS[Math.min(ci, PCOLORS.length - 1)];
        ctx.fillRect(Math.round(p.x), Math.round(p.y), CELL, CELL);
      });

      raf = requestAnimationFrame(draw);
    }

    return {
      start(canvas) {
        ctx = canvas.getContext('2d');
        pal = palette();
        initNoise();
        initParticles(canvas.width, canvas.height);
        fillBg(ctx, pal.bg);
        raf = requestAnimationFrame(draw);
      },
      stop() { cancelAnimationFrame(raf); },
      resize() {
        if (!ctx) return;
        pal = palette();
        initParticles(ctx.canvas.width, ctx.canvas.height);
        fillBg(ctx, pal.bg);
      },
    };
  })();


  /* ── Controller ─────────────────────────────────────────── */
  const MODES = [
    { key: 'MATRIX', label: 'MATRIX RAIN', anim: matrix },
    { key: 'LIFE',   label: 'GAME OF LIFE', anim: life   },
    { key: 'FIRE',   label: 'PIXEL FIRE',   anim: fire   },
    { key: 'FLOW',   label: 'FLOW FIELD',   anim: flow   },
  ];

  let current = 0;
  let canvas  = null;
  let onLabelChange = null; /* callback(label) when mode cycles */

  function getCanvas() {
    if (canvas) return canvas;
    canvas = document.getElementById('bg-canvas');
    if (!canvas) return null;
    resizeCanvas();
    window.addEventListener('resize', () => {
      resizeCanvas();
      MODES[current].anim.resize();
    });
    return canvas;
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  return {
    init() {
      const c = getCanvas();
      if (!c) return;
      MODES[current].anim.start(c);
    },
    cycle() {
      const c = getCanvas();
      if (!c) return;
      MODES[current].anim.stop();
      current = (current + 1) % MODES.length;
      const m = MODES[current];
      m.anim.start(c);
      if (onLabelChange) onLabelChange(m.label);
      return m.label;
    },
    currentLabel() {
      return MODES[current].label;
    },
    onLabel(fn) {
      onLabelChange = fn;
    },
  };
})();
