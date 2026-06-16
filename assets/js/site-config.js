/* ============================================================
   site-config.js  —  All Site Content & Configuration
   ============================================================
   THIS IS THE ONLY FILE YOU NEED TO EDIT for content updates.
   No HTML or other JS file needs to change just to add a post,
   project, song, or book.
   ============================================================ */

const SITE = {

  /* ── Personal Info ──────────────────────────────────────── */
  name:     "Sagit Bolat",
  subtitle: "Software Developer",
  bio:      "Professional game developer, writing personal solo projects in my spare time.",

  /* ── Dymka Photos ──────────────────────────────────────────── */
  dymka: [
    "dymka_images/dymka (1).jpg",
    "dymka_images/dymka (2).jpg",
    "dymka_images/dymka (3).jpg",
    "dymka_images/dymka (4).jpg",
    "dymka_images/dymka (5).jpg",
    "dymka_images/dymka (6).jpg",
    "dymka_images/dymka (7).jpg",
    "dymka_images/dymka (8).jpg",
    "dymka_images/dymka (9).jpg",
    "dymka_images/dymka (10).jpg",
    "dymka_images/dymka (11).jpg",
    "dymka_images/dymka (12).jpg",
    "dymka_images/dymka (13).jpg",
    "dymka_images/dymka (14).webp",
  ],

  email:   "sagitbolat@gmail.com",
  links: {
    github:   "https://github.com/sagitbolat?tab=repositories",
    linkedin: "https://www.linkedin.com/in/sagit-bolat/",
    cv:       "Sagit_Bolat_CV.pdf",
    itchio:   "https://swagit.itch.io",
  },


  /* ── Song of the Day ────────────────────────────────────── */
  /*
    One song is picked per calendar day (cycles through the list).
    Fields:
      title   — song name
      artist  — artist name
      url     — optional link (Spotify, YouTube, etc.); leave "" to omit
  */
  playlist: [
    { title: "Aquatic Ambience",         artist: "David Wise",               url: "" },
    { title: "Metal Gear Solid Main Theme", artist: "Rika Muranaka",         url: "" },
    { title: "Dire Dire Docks",          artist: "Koji Kondo",               url: "" },
    { title: "Snake Eater",              artist: "Cynthia Harrell",          url: "" },
    { title: "Moon Theme (DuckTales)",   artist: "Hiroshige Tonomura",       url: "" },
    { title: "Megalovania",              artist: "Toby Fox",                 url: "" },
    { title: "Gerudo Valley",            artist: "Koji Kondo",               url: "" },
    { title: "Terra's Theme",            artist: "Nobuo Uematsu",            url: "" },
    { title: "Bloody Tears",             artist: "Kenichi Matsubara",        url: "" },
    { title: "Hollow Knight Main Theme", artist: "Christopher Larkin",       url: "" },
    { title: "Resurrections",            artist: "Lena Raine (Celeste)",     url: "" },
    { title: "Bramble Blast",            artist: "David Wise",               url: "" },
    { title: "One-Winged Angel",         artist: "Nobuo Uematsu",            url: "" },
    { title: "Fear Factory",             artist: "Robin Beanland (DKC2)",    url: "" },
  ],


  /* ── Book Recommender Quiz ──────────────────────────────── */
  /*
    Decision tree: each node is either a question or a leaf.
      Question: { q: "...", answers: [ { text: "...", next: node }, ... ] }
      Leaf:     { book: "...", author: "..." }
  */
  quiz: { tree:
    { q: "Fantasy or Contemporary?", answers: [
      { text: "Fantasy", next:
        { q: "How dark do you want the setting to be?", answers: [
          { text: "Cozy", next:
            { q: "Set in our world or a fictional one?", answers: [
              { text: "Our world",
                next: { book: "A Very Secret Society of Irregular Witches", author: "Sangu Mandanna" } },
              { text: "Fictional world", next:
                { q: "Romance or no romance?", answers: [
                  { text: "Romance", next:
                    { q: "Do you prefer Coffee or Tea?", answers: [
                      { text: "Coffee", next: { book: "Legends and Lattes",  author: "Travis Baldree"    } },
                      { text: "Tea",    next: { book: "The Spellshop",        author: "Sarah Beth Durst"  } },
                    ] } },
                  { text: "No Romance",
                    next: { book: "The Girl Who Drank The Moon", author: "Kelly Barnhill" } },
                ] } },
            ] } },
          { text: "Grimdark", next:
            { q: "High Magic or Low Magic?", answers: [
              { text: "High", next:
                { q: "Eastern or western culture inspired?", answers: [
                  { text: "Eastern", next: { book: "The Poppy War",            author: "R.F. Kuang"      } },
                  { text: "Western", next: { book: "The Book of the Ancestor", author: "Mark Lawrence"   } },
                ] } },
              { text: "Low",
                next: { book: "The First Law Trilogy", author: "Joe Abercrombie" } },
            ] } },
          { text: "Somewhere in between", next:
            { q: "Low Magic or High Magic settings?", answers: [
              { text: "Low Magic", next:
                { q: "Epic Battles or Gritty Skirmishes?", answers: [
                  { text: "Epic Battles",
                    next: { book: "The Faithful and the Fallen", author: "John Gwynne" } },
                  { text: "Gritty Skirmishes", next:
                    { q: "Series or standalones?", answers: [
                      { text: "Series",      next: { book: "Bloodborne Saga",                    author: "John Gwynne"     } },
                      { text: "Standalones", next: { book: "Kings of the Wyld and Bloody Rose",  author: "Nicholas Eames"  } },
                    ] } },
                ] } },
              { text: "High Magic", next:
                { q: "Hard magic system or soft magic system?", answers: [
                  { text: "Hard System", next:
                    { q: "Do you enjoy long Shonen anime?", answers: [
                      { text: "Yes", next: { book: "Cradle", author: "Will Wight" } },
                      { text: "No",  next:
                        { q: "Do you like heist stories? (Think Ocean's Eleven)", answers: [
                          { text: "Yes", next: { book: "Mistborn Era 1 Trilogy", author: "Brandon Sanderson" } },
                          { text: "No",  next:
                            { q: "Combat or non-combat oriented magic system?", answers: [
                              { text: "Combat",     next: { book: "Rise of Kyoshi and Shadow of Kyoshi", author: "F.C. Yee"           } },
                              { text: "Non-combat", next: { book: "Elantris",                             author: "Brandon Sanderson" } },
                            ] } },
                        ] } },
                    ] } },
                  { text: "Soft System", next:
                    { q: "Complex narrative or beginner friendly?", answers: [
                      { text: "Beginner friendly", next: { book: "The Lord of the Rings",       author: "J.R.R. Tolkien"  } },
                      { text: "Complex",           next: { book: "Malazan Book of the Fallen",  author: "Steve Erikson"   } },
                    ] } },
                ] } },
            ] } },
        ] } },
      { text: "Contemporary", next:
        { q: "Romance or Literary?", answers: [
          { text: "Romance", next:
            { q: "Historic or modern setting?", answers: [
              { text: "Historic",
                next: { book: "Last Night at the Telegraph Club", author: "Malinda Lo" } },
              { text: "Modern", next:
                { q: "Tragic or comforting?", answers: [
                  { text: "Tragic",     next: { book: "Looking for Alaska", author: "John Green"    } },
                  { text: "Comforting", next: { book: "Loveless",           author: "Alice Oseman"  } },
                ] } },
            ] } },
          { text: "Literary", next:
            { q: "Heartwarming or Eerie?", answers: [
              { text: "Heartwarming", next: { book: "A Man Called Ove", author: "Frederik Backman" } },
              { text: "Eerie",        next: { book: "Beartown",         author: "Frederik Backman" } },
            ] } },
        ] } },
    ] },
  },


  /* ── Blog Posts ─────────────────────────────────────────── */
  /*
    Fields:
      title     — post title
      date      — display date string
      thumb     — thumbnail image path
      excerpt   — short teaser shown on the card
      articleId — matches an <article id="..."> in index.html's
                  #article-templates div.  The article body stays
                  in the HTML; only metadata lives here.
      href      — if set, overrides articleId and links out directly.
  */
  posts: [
    {
      title:     "Writing a Game Engine Part I: Introduction",
      date:      "Nov 9, 2022",
      thumb:     "images/posts/2.jpg",
      excerpt:   "Background on my second serious attempt at a game engine and what I'm doing differently this time.",
      articleId: "tpl-post-1",
    },
    {
      title:     "Writing a Game Engine Part II: Platform Layer",
      date:      "Nov 10, 2022",
      thumb:     "images/posts/3.jpg",
      excerpt:   "How the platform layer is structured and why I chose SDL over Win32 for cross-platform support.",
      articleId: "tpl-post-2",
    },
  ],


  /* ── Projects ───────────────────────────────────────────── */
  /*
    Fields:
      title     — project name (shown on card)
      tag       — language/tech tag  (see CSS .tag-* classes for colours)
                  valid values: "C/C++", "Python", "C#", "JavaScript"
      thumb     — card image path
      desc      — short description shown on card
      href      — if set, card links here directly (external or local page)
      articleId — if set (no href), clicking shows an embedded article
                  panel inside index.html
  */
  projects: [
    {
      title:     "Ludus Chromatic",
      tag:       "C/C++",
      thumb:     "images/ludus_chromatic.png",
      desc:      "Sokoban-style puzzle game built on SkyEngine. All about colour.",
      href:      "ludus_chromatic.html",
    },
    {
      title:     "SkyEngine",
      tag:       "C/C++",
      thumb:     "images/engine_background.png",
      desc:      "Custom 2D game engine — SDL, OpenGL, OpenAL backends.",
      href:      "projects/engine.html",
    },
    {
      title:     "Galaga Shooter",
      tag:       "C/C++",
      thumb:     "images/asteroids_0.PNG",
      desc:      "Arcade shooter built with SkyEngine. Available on itch.io.",
      href:      "https://swagit.itch.io/skyengine-proj1",
    },
    {
      title:     "sPiet Interpreter",
      tag:       "Python",
      thumb:     "images/piet.jpg",
      desc:      "Interpreter for Piet, the visual programming language.",
      href:      "projects/piet.html",
    },
    {
      title:     "Sudoku Solver",
      tag:       "C#",
      thumb:     "images/posts/image32.png",
      desc:      "WPF app with generation, solving, and a playable UI.",
      href:      "projects/sudoku.html",
    },
    {
      title:     "The Chameleon",
      tag:       "JavaScript",
      thumb:     "images/berkeley_pc.png",
      desc:      "Browser-based party deduction game. Who is the Chameleon?",
      href:      "chameleon/index.html",
    },
  ],
};
