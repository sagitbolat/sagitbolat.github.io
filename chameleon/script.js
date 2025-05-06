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
            "Among Us", "Assassin’s Creed", "Tetris", "Farmville",
            "Sims", "Dark Souls", "Tekken", "Portal"]
  },
  {
    title: "Fantasy and Sci-fi Books",
    words: ["Harry Potter", "A Song of Ice and Fire (Game of Thrones)", "The Lord of the Rings", "Discworld",
            "The Wizard of Oz", "Alice’s Adventures in Wonderland", "Chronicles of Narnia", "Dune",
            "Hitchhiker’s Guide to the Galaxy", "Wheel of Time", "Expanse", "1984",
            "Foundation", "Stormlight Archive", "The Once and Future King", "Fahrenheit 451"]
  },
  {
    title: "Rovinka Drinks",
    words: ["Pina Colada", "Captain Morgan + Coke", "Egg shot", "Kings Cup (rum + whiskey + cider + raw egg)",
            "Rum shot w/ milk", "Cum shot 💦🤤🤤🤤", "Desperados Beer", "Water (when hungover in the morning)",
            "Vodka Lavender", "Kofol", "Jager", "Straight Vodka (water chaser)",
            "Tatra Tea", "Apple Cider", "Pivko", "To prve"]
  },
  {
    title: "Shit white people say",
    words: ["Newsflash buddy", "You’re on thin ice", "No more Mr. Nice Guy", "Hey, what’s the big idea?",
            "I’m gonna lose my marbles", "The jig is up", "Be there or be square", "It’s curtains for you",
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
    words: ["Evoker", "Grass Block and Llama", "Skeleton", "Stone Block and Garrett",
            "Big Mac Crystal", "Soda Potion", "Redstone Block And Creeper", "Pink Wool Block And Pink Sheep",
            "Wolf", "Diamond Block And Steve", "Gold Block and Dawn", "Fry Helmet",
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
            "Pyke", "Alistar", "Nunu and Willump", "Rengar",
            "Yuumi", "Gankplank", "Lux", "Zac",
            "Nasus", "Fizz", "Yasuo", "Jax"]
  }
];

function getCustomCategories() {
  const stored = localStorage.getItem("customCategories");
  return stored ? JSON.parse(stored) : [];
}

function saveCustomCategories(categories) {
  localStorage.setItem("customCategories", JSON.stringify(categories));
}

function getAllCategories() {
  return [...builtInCategories, ...getCustomCategories()];
}

function addCustomCategory() {
  const title = document.getElementById("customTitle").value.trim();
  const wordsText = document.getElementById("customWords").value.trim();
  const words = wordsText.split(",").map(w => w.trim()).filter(w => w);

  if (!title || words.length !== 16) {
    alert("Please enter a title and exactly 16 words.");
    return;
  }

  const newCategory = { title, words };
  const custom = getCustomCategories();
  custom.push(newCategory);
  saveCustomCategories(custom);

  // Refresh dropdown
  populateCategoryDropdown();
  populateDeleteDropdown();

  // Clear input fields
  document.getElementById("customTitle").value = "";
  document.getElementById("customWords").value = "";
  alert("Custom category added!");
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
  alert(`Category "${selectedTitle}" deleted.`);
}

let numPlayers = 0;
let currentPlayer = 1;
let chameleonIndex = -1;
let selectedCategory = null;
let secretWordIndex = -1;

function startGame() {
  numPlayers = parseInt(document.getElementById("playerCount").value);
  if (isNaN(numPlayers) || numPlayers < 3) {
    alert("Please enter at least 3 players.");
    return;
  }

  const selected = document.getElementById("categorySelect").value;
  if (selected === "random") {
    selectedCategory = categories[Math.floor(Math.random() * categories.length)];
  } else {
    selectedCategory = getAllCategories().find(c => c.title === selected);
  }
  chameleonIndex = Math.floor(Math.random() * numPlayers) + 1;
  secretWordIndex = Math.floor(Math.random() * 16);

  document.getElementById("setup").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  updatePlayerLabel();
}


function updatePlayerLabel() {
  document.getElementById("playerLabel").innerText = `Player ${currentPlayer}`;
  document.getElementById("revealBox").innerHTML = '';
}

function showInfo() {
  const revealBox = document.getElementById("revealBox");
  revealBox.innerHTML = `
    <h3>Category: ${selectedCategory.title}</h3>
    <div class="grid">
      ${selectedCategory.words.map((word, i) => {
        const isSecret = i === secretWordIndex && currentPlayer !== chameleonIndex;
        const className = isSecret ? 'highlight' : '';
        return `<div class="grid-word ${className}">${word}</div>`;
      }).join('')}
    </div>
    ${currentPlayer === chameleonIndex ? `<p class="chameleon-msg">You are the CHAMELEON 🦎</p>` : ''}
  `;
}

function hideInfo() {
  document.getElementById("revealBox").innerHTML = '';
}

function nextPlayer() {
  if (currentPlayer < numPlayers) {
    currentPlayer++;
    updatePlayerLabel();
  } else {
    document.getElementById("game").classList.add("hidden");
    document.getElementById("end").classList.remove("hidden");
    showFinalGrid();
  }
}

function showFinalGrid() {
  const endSection = document.getElementById("end");
  const gridHTML = selectedCategory.words.map(word => {
    return `<div class="grid-word">${word}</div>`;
  }).join('');

  const html = `
    <h3>Category: ${selectedCategory.title}</h3>
    <div class="grid">${gridHTML}</div>
    <p>Now everyone discusses. Chameleon, try to guess the secret word!</p>
    <button onclick="location.reload()">Play Again</button>
  `;

  endSection.innerHTML = html;
}
function populateCategoryDropdown() {
  const select = document.getElementById("categorySelect");
  select.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "random";
  defaultOption.textContent = "Random";
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
};

