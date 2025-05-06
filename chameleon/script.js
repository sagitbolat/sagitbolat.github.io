const categories = [
  {
    title: "Fruits",
    words: ["Apple", "Banana", "Mango", "Orange",
            "Grape", "Melon", "Peach", "Cherry",
            "Pear", "Lemon", "Kiwi", "Plum",
            "Fig", "Guava", "Papaya", "Coconut"]
  },
  {
    title: "Animals",
    words: ["Tiger", "Elephant", "Dog", "Cat",
            "Shark", "Lion", "Giraffe", "Whale",
            "Monkey", "Eagle", "Snake", "Zebra",
            "Frog", "Panda", "Bear", "Wolf"]
  },
  {
    title: "Jobs",
    words: ["Doctor", "Lawyer", "Teacher", "Chef",
            "Pilot", "Artist", "Musician", "Farmer",
            "Engineer", "Nurse", "Writer", "Actor",
            "Dentist", "Mechanic", "Plumber", "Scientist"]
  },
  {
    title: "Majors",
    words: ["Doctor", "Lawyer", "Teacher", "Chef",
            "Pilot", "Artist", "Musician", "Farmer",
            "Engineer", "Nurse", "Writer", "Actor",
            "Dentist", "Mechanic", "Plumber", "Scientist"]
  }
];

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
    selectedCategory = categories.find(c => c.title === selected);
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
// Populate category dropdown on page load
window.onload = () => {
  const select = document.getElementById("categorySelect");
  const defaultOption = document.createElement("option");
  defaultOption.value = "random";
  defaultOption.textContent = "Random";
  select.appendChild(defaultOption);

  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.title;
    opt.textContent = cat.title;
    select.appendChild(opt);
  });
};
