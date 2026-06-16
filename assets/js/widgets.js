/* ============================================================
   widgets.js  —  Dashboard Rendering & Widget Logic
   ============================================================
   Reads from SITE (defined in site-config.js) and builds all
   DOM content.  The HTML file is structural scaffolding only;
   all data flows from site-config.js.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  BG_ANIM.init();
  renderHeader();
  renderWidgetsColumn();
  renderBlogColumn();
  renderProjectsColumn();
  initArticleView();
});


/* ── Helpers ──────────────────────────────────────────────── */

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls)  e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

/* Map a tag string from SITE config to a CSS class name. */
function tagClass(tag) {
  const map = {
    'C/C++':      'tag-cpp',
    'Python':     'tag-python',
    'C#':         'tag-csharp',
    'JavaScript': 'tag-javascript',
  };
  return map[tag] || 'tag-default';
}

/*
  Returns day-of-year (1–366) for today.
  Used to pick the daily song deterministically.
*/
function dayOfYear() {
  const now   = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / 86_400_000);
}


/* ── 1. Header ────────────────────────────────────────────── */

function renderHeader() {
  const nav = document.getElementById('header-nav');
  if (!nav) return;

  /* Animation cycle button */
  const btn = el('button', 'px-btn anim-cycle-btn');
  const indicator = el('span', 'anim-label', BG_ANIM.currentLabel());
  btn.appendChild(el('span', '', '◈ '));
  btn.appendChild(indicator);

  btn.addEventListener('click', () => {
    const label = BG_ANIM.cycle();
    indicator.textContent = label;
  });

  nav.appendChild(btn);
}


/* ── 2. Widgets Column ────────────────────────────────────── */

function renderWidgetsColumn() {
  const col = document.getElementById('col-widgets');
  if (!col) return;

  col.appendChild(buildAboutWidget());
  col.appendChild(buildCatWidget());
  // col.appendChild(buildSongWidget());
  col.appendChild(buildQuizWidget());
}

/* --- About --- */
function buildAboutWidget() {
  const panel = buildPanel('ABOUT ME');

  const body = panel.querySelector('.panel-body');

  const bio = el('p', 'bio-text', SITE.bio);
  body.appendChild(bio);

  const links = el('div', 'bio-links');
  if (SITE.links.github) {
    const a = el('a', 'px-btn');
    a.href   = SITE.links.github;
    a.target = '_blank';
    a.rel    = 'noopener';
    a.innerHTML = '<i class="fa-brands fa-github"></i> GitHub';
    links.appendChild(a);
  }
  if (SITE.links.linkedin) {
    const a = el('a', 'px-btn');
    a.href   = SITE.links.linkedin;
    a.target = '_blank';
    a.rel    = 'noopener';
    a.innerHTML = '<i class="fa-brands fa-linkedin"></i> LinkedIn';
    links.appendChild(a);
  }
  body.appendChild(links);

  return panel;
}

/* --- Dymka Picture --- */
function buildCatWidget() {
  const panel = buildPanel('PICTURE OF DYMKA');
  const body  = panel.querySelector('.panel-body');
  body.style.padding = '0';

  const url = SITE.dymka[Math.floor(Math.random() * SITE.dymka.length)];
  const img = el('img');
  img.id  = 'cat-img';
  img.src = url;
  img.alt = 'Dymka';
  body.appendChild(img);

  return panel;
}

/* --- Song of the Day --- */
function buildSongWidget() {
  const panel = buildPanel('SONG OF THE DAY');
  const body  = panel.querySelector('.panel-body');

  const song  = SITE.playlist[dayOfYear() % SITE.playlist.length];

  const title  = el('div', 'song-title',  song.title);
  const artist = el('div', 'song-artist', song.artist);
  const note   = el('div', 'song-note',   '♩ FROM MY PLAYLIST');

  body.appendChild(title);
  body.appendChild(artist);
  body.appendChild(note);

  if (song.url) {
    const link  = el('a', 'px-btn');
    link.href   = song.url;
    link.target = '_blank';
    link.rel    = 'noopener';
    link.style.marginTop = 'var(--s3)';
    link.textContent = '▶ LISTEN';
    body.appendChild(link);
  }

  return panel;
}

/* --- Book Quiz --- */
function buildQuizWidget() {
  const panel = buildPanel('BOOK RECOMMENDER');
  const body  = panel.querySelector('.panel-body');

  const history = []; /* stack for back navigation */
  let node = SITE.quiz.tree;

  function render() {
    body.innerHTML = '';

    if (node.book) {
      /* ── Result ── */
      const result = el('div', 'quiz-result');
      result.appendChild(el('div', 'result-book-title', node.book));
      result.appendChild(el('div', 'result-book-author', `by ${node.author}`));

      const btns = el('div', 'quiz-result-btns');

      const back = el('button', 'quiz-ans-btn', '◀ BACK');
      back.addEventListener('click', () => { node = history.pop(); render(); });

      const restart = el('button', 'quiz-ans-btn', '↺ START OVER');
      restart.addEventListener('click', () => { history.length = 0; node = SITE.quiz.tree; render(); });

      btns.appendChild(back);
      btns.appendChild(restart);
      result.appendChild(btns);
      body.appendChild(result);

    } else {
      /* ── Question ── */
      if (history.length > 0) {
        const back = el('button', 'quiz-back-btn', '◀ BACK');
        back.addEventListener('click', () => { node = history.pop(); render(); });
        body.appendChild(back);
      }

      body.appendChild(el('div', 'quiz-question', node.q));

      const list = el('div', 'quiz-answers');
      node.answers.forEach(ans => {
        const btn = el('button', 'quiz-ans-btn', ans.text);
        btn.addEventListener('click', () => { history.push(node); node = ans.next; render(); });
        list.appendChild(btn);
      });
      body.appendChild(list);
    }
  }

  render();
  return panel;
}

/* --- Panel builder helper --- */
function buildPanel(title) {
  const panel = el('div', 'pixel-panel');

  const bar = el('div', 'panel-titlebar');
  bar.appendChild(el('span', 'panel-title', title));
  panel.appendChild(bar);

  panel.appendChild(el('div', 'panel-body'));
  return panel;
}


/* ── 3. Blog Column ───────────────────────────────────────── */

function renderBlogColumn() {
  const col = document.getElementById('col-blog');
  if (!col) return;

  const panel = buildPanel('BLOG POSTS');
  const body  = panel.querySelector('.panel-body');

  SITE.posts.forEach(post => {
    const card = buildBlogCard(post);
    body.appendChild(card);
  });

  col.appendChild(panel);
}

function buildBlogCard(post) {
  const card  = el('div', 'blog-card');

  const thumb = el('img', 'blog-thumb');
  thumb.src = post.thumb;
  thumb.alt = post.title;
  card.appendChild(thumb);

  const info    = el('div', 'blog-card-body');
  const title   = el('div', 'blog-card-title',   post.title);
  const excerpt = el('div', 'blog-card-excerpt',  post.excerpt);
  const date    = el('div', 'blog-card-date',     post.date);

  info.appendChild(title);
  info.appendChild(excerpt);
  info.appendChild(date);
  card.appendChild(info);

  /* Clicking either opens an embedded article or follows href */
  if (post.href) {
    card.addEventListener('click', () => { window.location.href = post.href; });
  } else if (post.articleId) {
    card.addEventListener('click', () => openArticle(post.articleId, post.title));
  }

  return card;
}


/* ── 4. Projects Column ───────────────────────────────────── */

function renderProjectsColumn() {
  const col = document.getElementById('col-projects');
  if (!col) return;

  const panel = buildPanel('PROJECTS & GAMES');
  const body  = panel.querySelector('.panel-body');
  body.style.padding = 'var(--s3)';

  const grid = el('div', 'project-grid');

  SITE.projects.forEach(proj => {
    grid.appendChild(buildProjectCard(proj));
  });

  body.appendChild(grid);
  col.appendChild(panel);
}

function buildProjectCard(proj) {
  /* Use an <a> when linking out; <div> for embedded articles */
  const card = proj.href ? el('a', 'project-card') : el('div', 'project-card');

  if (proj.href) {
    card.href   = proj.href;
    card.target = proj.href.startsWith('http') ? '_blank' : '_self';
    card.rel    = 'noopener';
  } else if (proj.articleId) {
    card.addEventListener('click', () => openArticle(proj.articleId, proj.title));
  }

  const img  = el('img', 'project-card-img');
  img.src = proj.thumb;
  img.alt = proj.title;
  card.appendChild(img);

  const info  = el('div', 'project-card-info');
  const tag   = el('span', `project-tag ${tagClass(proj.tag)}`, proj.tag);
  const title = el('div', 'project-card-title', proj.title);
  const desc  = el('div', 'project-card-desc',  proj.desc);

  info.appendChild(tag);
  info.appendChild(title);
  info.appendChild(desc);
  card.appendChild(info);

  return card;
}


/* ── 5. Article View ──────────────────────────────────────── */

function initArticleView() {
  const btn = document.getElementById('btn-back');
  if (btn) {
    btn.addEventListener('click', closeArticle);
  }
}

function openArticle(articleId, title) {
  const tpl    = document.getElementById(articleId);
  const view   = document.getElementById('article-view');
  const inner  = document.getElementById('article-inner');
  const dash   = document.getElementById('dashboard');

  if (!tpl || !view || !inner || !dash) return;

  inner.innerHTML = tpl.innerHTML;
  dash.style.display  = 'none';
  view.classList.add('active');

  /* Update browser title for context */
  document.title = `${title} — ${SITE.name}`;
  window.scrollTo(0, 0);
}

function closeArticle() {
  const view  = document.getElementById('article-view');
  const inner = document.getElementById('article-inner');
  const dash  = document.getElementById('dashboard');

  if (!view || !dash) return;

  view.classList.remove('active');
  dash.style.display = '';
  inner.innerHTML    = '';
  document.title     = `${SITE.name}`;
  window.scrollTo(0, 0);
}
