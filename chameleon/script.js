let snitchIndex = -1;
let snitchEnabled = true;
const builtInCategories = [
  {
    title: "Minecraft Mobs",
    words: ["Enderman", "Sheep", "Iron Golem", "Piglin",
            "Llama", "Horse", "Wither", "Creeper",
            "Slime", "Guardian", "Drowned", "Ocelot",
            "Turtle", "Phantom", "Skeleton", "Wolf"]
  },
  {
    title: "Bratislava Hangout Spots",
    words: ["Tyrsak", "Da Vinci", "Slavin", "Pizzeria Budkova",
            "Yerzhanov Basement", "McDonalds Hviezdoslavovo", "Horsky Park", "Drazdiak",
            "Storm", "Martinus", "Scherz", "Kacecko",
            "GamerLab", "For You", "Zlaty Bazant", "Eurovea"]
  },
  {
    title: "College Majors",
    words: ["Psychology", "Computer Science", "Business", "BioMed",
            "History", "Engineering", "Maths", "Literature",
            "Film", "Communications", "Music", "Visual Arts",
            "Sociology", "Chemistry", "Politics", "Economics"]
  },
  {
    title: "GOATs",
    words: ["Timo", "Samo", "Aldun", "Alisher",
            "Miki", "Majo", "Matej", "Dagi",
            "Sagit", "Kyle", "Magnus Carlsen", "Michael Jordan",
            "Messi", "Faker", "Mountain goat", "Common farm goat"]
  },
  {
    title: "Video Games",
    words: ["Skyrim", "League of Legends", "Grand Theft Auto", "FIFA",
            "Call of Duty", "Minecraft", "Warcraft", "StarCraft",
            "Among Us", "Assassin's Creed", "Tetris", "Farmville",
            "Sims", "Dark Souls", "Tekken", "Portal"]
  },
  {
    title: "Fantasy and Sci-fi Books",
    words: ["Harry Potter", "A Song of Ice and Fire", "The Lord of the Rings", "Discworld",
            "The Wizard of Oz", "Alice in Wonderland", "Chronicles of Narnia", "Dune",
            "Hitchhiker's Guide", "Wheel of Time", "Expanse", "1984",
            "Foundation", "Stormlight Archive", "The Once and Future King", "Fahrenheit 451"]
  },
  {
    title: "Rovinka Drinks",
    words: ["Pina Colada", "Captain Morgan + Coke", "Egg shot", "Kings Cup",
            "Rum shot w/ milk", "Cum shot 💦", "Desperados Beer", "Water (morning)",
            "Vodka Lavender", "Kofol", "Jager", "Straight Vodka",
            "Tatra Tea", "Apple Cider", "Pivko", "To prve"]
  },
  {
    title: "Shit white people say",
    words: ["Newsflash buddy", "You're on thin ice", "No more Mr. Nice Guy", "Hey, what's the big idea?",
            "I'm gonna lose my marbles", "The jig is up", "Be there or be square", "It's curtains for you",
            "Woopsie Daisy", "Take a chill pill", "Aww Fiddlesticks", "What the flip?",
            "Just gonna sneak right past ya", "Watch it Einstein", "Exsqueeze me", "Hate to burst your bubble"]
  },
  {
    title: "Potentially Habitable Exoplanets",
    words: ["Gliese 12b", "Gliese 667 Cc", "HD 20794 d", "K2-9b",
            "Kepler-22b", "TRAPPIST-1g", "Gliese 514b", "TOI-715 b",
            "Teegarden's Star c", "Proxima Centauri b", "Ross 508 b", "Luyten b",
            "Kepler-296e", "GJ 1061 d", "HIP 38594 b", "LP 890-9 c"]
  },
  {
    title: "Minecraft Happy Meal Items",
    words: ["Evoker", "Grass Block & Llama", "Skeleton", "Stone Block & Garrett",
            "Big Mac Crystal", "Soda Potion", "Redstone Block & Creeper", "Pink Wool & Pink Sheep",
            "Wolf", "Diamond Block & Steve", "Gold Block & Dawn", "Fry Helmet",
            "Pink Sheep", "Bee", "Grimace Egg", "Zombie Hamburglar"]
  },
  {
    title: "Numbers",
    words: ["1", "2", "3", "4",
            "5", "6", "7", "8",
            "9", "10", "11", "12",
            "13", "14", "15", "16"]
  },
  {
    title: "Random Numbers",
    words: ["3", "97", "58", "204",
            "9", "381", "6", "721",
            "82", "150", "5", "319",
            "74", "2", "608", "45"]
  },
  {
    title: "Store Chains",
    words: ["Walmart", "Home Depot", "Kaufland", "Sainsburys",
            "Tesco", "Aldi", "Target", "Amazon",
            "Billa", "Waitrose", "Marks and Spencer", "Primark",
            "CVS Pharmacy", "Best Buy", "Macys", "CostCo"]
  },
  {
    title: "League Champions",
    words: ["Shaco", "Zoe", "Annie", "Ziggs",
            "Pyke", "Alistar", "Nunu & Willump", "Rengar",
            "Yuumi", "Gangplank", "Lux", "Zac",
            "Nasus", "Fizz", "Yasuo", "Jax"]
  },
  {
    title: "Chameleon Categories",
    words: ["Cities", "Colors", "Phobias", "Authors",
            "Movies", "Afflictions", "Hobbies", "Civilizations",
            "Celebrities", "Geography", "Bands", "Disney",
            "Food", "Transport", "Games", "Film Genres"]
  },
  {
    title: "Bodily Fluids",
    words: ["Shid", "Piss", "Cum", "Spinal Fluid",
            "Blood", "Eye Goo", "Stomach Acid", "Spit",
            "Pre-cum", "Vaginal Fluid", "Earwax", "Pus",
            "Mucus", "Breast Milk", "Sweat", "Cell Coating"]
  }
];

function getCustomCategories() {
  try {
    const stored = localStorage.getItem("customCategories");
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function saveCustomCategories(categories) {
  try { localStorage.setItem("customCategories", JSON.stringify(categories)); } catch {}
}

function getAllCategories() {
  return [...builtInCategories, ...getCustomCategories()];
}

function adjustPlayers(delta) {
  const input = document.getElementById("playerCount");
  let val = parseInt(input.value) + delta;
  val = Math.max(3, Math.min(10, val));
  input.value = val;
  document.getElementById("playerCountDisplay").textContent = val;
}

function buildWordInputs() {
  const container = document.getElementById("wordInputs");
  container.innerHTML = "";
  for (let i = 1; i <= 16; i++) {
    const wrap = document.createElement("div");
    wrap.className = "word-input-wrap";
    wrap.innerHTML = `
      <span class="word-num">${i}</span>
      <input type="text" class="word-input" placeholder="Word ${i}" id="word_${i}" oninput="updateWordCounter()" />
    `;
    container.appendChild(wrap);
  }
}

function updateWordCounter() {
  const filled = Array.from({length: 16}, (_, i) =>
    document.getElementById(`word_${i+1}`)?.value.trim()
  ).filter(v => v).length;

  const el = document.getElementById("wordCounter");
  el.textContent = `${filled} / 16 filled`;
  el.classList.toggle("complete", filled === 16);
}

function addCustomCategory() {
  const title = document.getElementById("customTitle").value.trim();
  const words = Array.from({length: 16}, (_, i) =>
    document.getElementById(`word_${i+1}`)?.value.trim()
  ).filter(v => v);

  if (!title || words.length !== 16) {
    showToast("Please enter a title and all 16 words.");
    return;
  }

  const newCategory = { title, words };
  const custom = getCustomCategories();
  custom.push(newCategory);
  saveCustomCategories(custom);

  populateCategoryDropdown();
  populateDeleteDropdown();

  document.getElementById("customTitle").value = "";
  for (let i = 1; i <= 16; i++) {
    const el = document.getElementById(`word_${i}`);
    if (el) el.value = "";
  }
  updateWordCounter();
  showToast("✅ Category added!");
}

function deleteCustomCategory() {
  const select = document.getElementById("deleteSelect");
  const selectedTitle = select.value;
  if (!selectedTitle) return;

  let customCats = getCustomCategories();
  customCats = customCats.filter(cat => cat.title !== selectedTitle);
  saveCustomCategories(customCats);

  populateCategoryDropdown();
  populateDeleteDropdown();
  showToast(`🗑️ "${selectedTitle}" deleted.`);
}

// ── Toast notification ───────────────────────
function showToast(msg) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.style.cssText = `
      position:fixed; bottom:32px; left:50%; transform:translateX(-50%);
      background:#1a1a24; border:1px solid rgba(255,255,255,0.12);
      color:#f0f0f5; font-family:'DM Sans',sans-serif; font-size:14px;
      padding:12px 20px; border-radius:99px; z-index:9999;
      box-shadow:0 4px 20px rgba(0,0,0,0.4); white-space:nowrap;
      opacity:0; transition:opacity 0.25s;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = "1";
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.opacity = "0"; }, 2500);
}

// ── Game state ───────────────────────────────
let numPlayers = 0;
let currentPlayer = 1;
let chameleonIndex = -1;
let selectedCategory = null;
let secretWordIndex = -1;

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const el = document.getElementById(id);
  el.classList.add("active");
  // ensure inline display:none from old .hidden class doesn't block it
  el.style.display = "";
}

function startGame() {
  numPlayers = parseInt(document.getElementById("playerCount").value);
  snitchEnabled = document.getElementById("enableSnitch").checked;

  // Save settings for next time
  try {
    localStorage.setItem("setting_players", numPlayers);
    localStorage.setItem("setting_snitch", snitchEnabled);
  } catch {}


  if (isNaN(numPlayers) || numPlayers < 3) {
    showToast("Please enter at least 3 players.");
    return;
  }

  const selected = document.getElementById("categorySelect").value;
  const allCats = getAllCategories();

  if (selected === "random") {
    selectedCategory = allCats[Math.floor(Math.random() * allCats.length)];
  } else {
    selectedCategory = allCats.find(c => c.title === selected);
  }

  chameleonIndex = Math.floor(Math.random() * numPlayers) + 1;

  if (snitchEnabled) {
    do {
      snitchIndex = Math.floor(Math.random() * numPlayers) + 1;
    } while (snitchIndex === chameleonIndex);
  } else {
    snitchIndex = -1;
  }

  secretWordIndex = Math.floor(Math.random() * 16);

  currentPlayer = 1;
  showScreen("game");
  updatePlayerLabel();
}

function updatePlayerLabel() {
  revealed = false;
  document.getElementById("revealBtnText").textContent = "Tap to Reveal";
  document.getElementById("playerLabel").textContent = `Player ${currentPlayer}`;
  document.getElementById("playerProgress").textContent = `${currentPlayer} / ${numPlayers}`;
  const box = document.getElementById("revealBox");
  box.classList.remove("active");
  box.innerHTML = `
    <div class="reveal-prompt">
      <div class="eye-icon">👁️</div>
      <p>Hold the button to see your role</p>
    </div>`;
}

let revealed = false;

function toggleInfo() {
  if (revealed) {
    hideInfo();
  } else {
    showInfo();
  }
}

function showInfo() {
  revealed = true;
  document.getElementById("revealBtnText").textContent = "Tap to Hide";
  const revealBox = document.getElementById("revealBox");
  revealBox.classList.add("active");

  const isChameleon = currentPlayer === chameleonIndex;
  const isSnitch = currentPlayer === snitchIndex && !isChameleon;

  let roleBanner = "";
  if (isChameleon) {
    roleBanner = `<div class="role-banner chameleon">🦎 You are the CHAMELEON — blend in!</div>`;
  } else if (isSnitch) {
    roleBanner = `
      <div class="role-banner detective">🕵️ You know the secret word</div>
      <div class="role-banner snitch">🤫 You are the SNITCH — help the chameleon subtly</div>`;
  } else {
    roleBanner = `<div class="role-banner detective">🕵️ Find the chameleon!</div>`;
  }

  revealBox.innerHTML = `
    <div class="reveal-content">
      <h3>${selectedCategory.title}</h3>
      <div class="grid">
        ${selectedCategory.words.map((word, i) => {
          const isSecret = i === secretWordIndex && !isChameleon;
          return `<div class="grid-word ${isSecret ? 'highlight' : ''}">${word}</div>`;
        }).join('')}
      </div>
      ${roleBanner}
    </div>`;
}

function hideInfo() {
  revealed = false;
  document.getElementById("revealBtnText").textContent = "Tap to Reveal";
  const revealBox = document.getElementById("revealBox");
  revealBox.classList.remove("active");
  revealBox.innerHTML = `
    <div class="reveal-prompt">
      <div class="eye-icon">👁️</div>
      <p>Hold the button to see your role</p>
    </div>`;
}

function nextPlayer() {
  if (currentPlayer < numPlayers) {
    currentPlayer++;
    updatePlayerLabel();
  } else {
    showScreen("end");
    showFinalGrid();
  }
}

function showFinalGrid() {
  const endInner = document.querySelector("#end .screen-inner");

  const gridHTML = selectedCategory.words.map((word) => {
    return `<div class="grid-word">${word}</div>`;
  }).join('');

  endInner.innerHTML = `
    <div class="end-header">
      <span class="logo-icon">🦎</span>
      <h2>Time to Discuss!</h2>
      <p>Vote for who you think the Chameleon is.</p>
    </div>

    <div class="card end-grid-card">
      <h3>${selectedCategory.title}</h3>
      <div class="grid">${gridHTML}</div>
    </div>

    <div class="reveal-secret-note">
      Discuss and vote for who you think the Chameleon is.<br>
      Chameleon — if you're caught, guess the secret word to survive!
    </div>

    <button class="btn-primary" onclick="location.reload()">🔄 Play Again</button>
  `;
}

function populateCategoryDropdown() {
  const select = document.getElementById("categorySelect");
  select.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "random";
  defaultOption.textContent = "🎲 Random";
  select.appendChild(defaultOption);

  getAllCategories().forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.title;
    opt.textContent = cat.title;
    select.appendChild(opt);
  });
}

function populateDeleteDropdown() {
  const select = document.getElementById("deleteSelect");
  select.innerHTML = "";

  getCustomCategories().forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.title;
    opt.textContent = cat.title;
    select.appendChild(opt);
  });
}

window.onload = () => {
  populateCategoryDropdown();
  populateDeleteDropdown();
  buildWordInputs();

  // Restore saved settings
  try {
    const savedPlayers = localStorage.getItem("setting_players");
    if (savedPlayers) {
      document.getElementById("playerCount").value = savedPlayers;
      document.getElementById("playerCountDisplay").textContent = savedPlayers;
    }
    const savedSnitch = localStorage.getItem("setting_snitch");
    if (savedSnitch !== null) {
      document.getElementById("enableSnitch").checked = savedSnitch === "true";
    }
  } catch {}
};
