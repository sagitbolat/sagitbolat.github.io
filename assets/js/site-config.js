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
    quiz.questions — each question has:
      text:    the question shown to the user
      answers: array of { text, tags }
                 tags are matched against book tags to score recommendations

    quiz.books — each book has:
      title, author, description  — displayed in the result
      tags                        — array of strings matched against answer tags
      emoji                       — displayed large in the result card
  */
  quiz: {
    questions: [
      {
        text: "What kind of programmer are you?",
        answers: [
          { text: "Close to the metal, low-level",          tags: ["lowlevel", "systems"]      },
          { text: "Algorithms and elegant abstractions",     tags: ["theory", "algorithms"]     },
          { text: "Ship great products, good habits",        tags: ["craft", "pragmatic"]       },
          { text: "Big-picture system design",               tags: ["architecture", "craft"]    },
        ],
      },
      {
        text: "What excites you most?",
        answers: [
          { text: "Making a game from scratch",              tags: ["lowlevel", "gamedev"]      },
          { text: "A beautifully optimal data structure",    tags: ["theory", "algorithms"]     },
          { text: "A codebase I'm proud to show anyone",     tags: ["craft", "pragmatic"]       },
          { text: "Designing a system that scales",          tags: ["architecture", "systems"]  },
        ],
      },
      {
        text: "Pick a weekend side project:",
        answers: [
          { text: "Write a software renderer in C",          tags: ["lowlevel", "gamedev"]      },
          { text: "Implement a sorting algorithm library",   tags: ["theory", "algorithms"]     },
          { text: "Refactor and document an old codebase",   tags: ["craft", "pragmatic"]       },
          { text: "Prototype a distributed cache",           tags: ["architecture", "systems"]  },
        ],
      },
    ],
    books: [
      {
        title:       "Game Engine Black Book: Doom",
        author:      "Fabien Sanglard",
        description: "A deep dive into the id Software Doom source code. Essential for anyone fascinated by how classic games were built from the ground up.",
        tags:        ["lowlevel", "gamedev"],
        emoji:       "👾",
      },
      {
        title:       "Game Engine Architecture",
        author:      "Jason Gregory",
        description: "Thorough reference on modern game engine design — rendering, audio, physics, input. Great chapter on 3D math.",
        tags:        ["gamedev", "architecture"],
        emoji:       "🎮",
      },
      {
        title:       "Computer Systems: A Programmer's Perspective",
        author:      "Bryant & O'Hallaron",
        description: "Bridges the gap between software and hardware. Covers assembly, memory hierarchy, processes, and system-level I/O.",
        tags:        ["systems", "lowlevel"],
        emoji:       "💻",
      },
      {
        title:       "Structure and Interpretation of Computer Programs",
        author:      "Abelson & Sussman",
        description: "The legendary MIT textbook. Teaches programming through Scheme and builds rock-solid intuition for computation itself.",
        tags:        ["theory", "algorithms"],
        emoji:       "🧠",
      },
      {
        title:       "The Algorithm Design Manual",
        author:      "Steven Skiena",
        description: "Practical guide to algorithm design with an excellent problem catalog. Less formal than CLRS, more actionable.",
        tags:        ["algorithms", "pragmatic"],
        emoji:       "📐",
      },
      {
        title:       "The Pragmatic Programmer",
        author:      "Hunt & Thomas",
        description: "Timeless advice on being a better software developer. More about mindset and habits than any specific technology.",
        tags:        ["craft", "pragmatic"],
        emoji:       "🔧",
      },
      {
        title:       "Clean Architecture",
        author:      "Robert C. Martin",
        description: "Opinionated take on structuring large software systems. Useful for understanding dependency rules and architectural boundaries.",
        tags:        ["architecture", "craft"],
        emoji:       "🏗️",
      },
    ],
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
