"use strict";

// Inizializzazione variabili
let gameOn = false;

let currentTeam = "";
let player1 = "";
let player2 = "";

// Calcolo delle compbinazioni vincenti
let winComb = [
  [0, 1, 2],
  [0, 4, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 4, 6],
  [2, 5, 8],
  [3, 4, 5],
  [6, 7, 8],
];

winComb.forEach((e, i) => {
  winComb[i] = e.map((x) => "sq-" + x);
});

// Inserisce l'immagine nella caselle del gioco in funzione della squadra attuale
function getImageSource(team) {
  let imageSource = "";
  if (team === "O") {
    imageSource = "images/circle.png";
  } else if (team === "X") {
    imageSource = "images/cross.png";
  }
  return imageSource;
}

// Cambia il giocatore attuale
function changePlayer(p1, p2, current) {
  console.log(p1, p2, current);
  if (p1 === current) {
    current = p2;
  } else if (p2 === current) {
    current = p1;
  }
  return current;
}

// Aggiorna il gioco: è il motore dell'app
function update(square) {
  square.insertAdjacentElement("afterbegin", printImage(getImageSource(currentTeam)));

  // Aggiungo alla casella premuta lo status "clicked" e la classe della squadra
  square.classList.add("clicked");
  square.classList.add(currentTeam);

  checkWin();

  currentTeam = changePlayer(player1, player2, currentTeam);
}

// Verifica se in un determinato turno, un giocatore ha vinto valutando le combinazioni vincenti e quelle attuali
function checkWin() {
  // combinazioni: [0, 1, 2], [0, 4, 8], [0, 3, 6], [1, 4, 7], [2, 4, 6], [2, 5, 8], [3, 4, 5], [6, 7, 8]

  // Creazione degli array delle caselle già selezionate, divisi per squadra
  let circleSquareIds = [];
  let crossSquareIds = [];
  let noWin = true;

  let circleSquares = document.querySelectorAll(".O");
  let crossSquares = document.querySelectorAll(".X");

  circleSquares.forEach((square) => {
    circleSquareIds.push(square.getAttribute("id"));
  });
  crossSquares.forEach((square) => {
    crossSquareIds.push(square.getAttribute("id"));
  });

  //   confronto tra stato attuale e combinazioni vincenti
  winComb.forEach((comb) => {
    if (hasSubArray(crossSquareIds, comb)) {
      console.log("VITTORIA di X!");
      noWin = false;
      gameOver(false);
    }
  });

  winComb.forEach((comb) => {
    if (hasSubArray(circleSquareIds, comb)) {
      console.log("VITTORIA di O!");
      noWin = false;
      gameOver(false);
    }
  });

  // in caso di casella finale, se non c'è stato un vincitore si decreta un pareggio
  if (circleSquareIds.length + crossSquareIds.length === 9 && noWin) {
    gameOver(true);
  }
}

// funzione che determina se un array "master" contiene una combinazione di elementi dell'array "sub"
function hasSubArray(master, sub) {
  return sub.every(
    (
      (i) => (v) =>
        (i = master.indexOf(v, i) + 1)
    )(0)
  );
}

// inserisce un elemento img nel div corrispondente
function printImage(imgSrc) {
  let img = document.createElement("img");
  img.setAttribute("src", imgSrc);
  img.style.width = "80%";
  img.style.height = "80%";

  return img;
}

// evento click su ogni casella
document.querySelectorAll(".square").forEach((element) => {
  {
    element.addEventListener("click", () => {
      if (gameOn) {
        if (!element.classList.contains("clicked")) {
          update(element);
        }
      }
    });
  }
});

let circleButton = document.getElementById("circle");
let crossButton = document.getElementById("cross");

// funzione che inizializza una nuova partita
function intializeNewGame() {
  // riporta le classi allo stato iniziale
  document.getElementsByTagName("h1")[0].innerHTML = "Gioca a TRIS!";
  document.querySelectorAll(".square").forEach((element) => {
    element.classList.remove("clicked");
    element.classList.remove("O");
    element.classList.remove("X");
  });

  // elimina le immagini inserite nella partita precedente
  let allImages = document.querySelectorAll("img");
  for (let index = 0; index < allImages.length; index++) {
    allImages[index].parentNode.removeChild(allImages[index]);
  }
}

// evento click sul tasto nuova partita
document.getElementById("start-game-button").addEventListener("click", () => {
  intializeNewGame();
  gameOn = true;
  if (circleButton.checked) {
    player1 = "O";
    player2 = "X";
  } else if (crossButton.checked) {
    player1 = "X";
    player2 = "O";
  } else {
    alert("Scegli la squadra!");
  }
  currentTeam = player1;
});

// funzione game over
function gameOver(isDraw) {
  if (!isDraw) {
    if (player1 === currentTeam) {
      document.getElementsByTagName("h1")[0].innerHTML = `Il Giocatore 1 Vince! La Squadra ${currentTeam} vince!`;
    } else if (player2 === currentTeam) {
      document.getElementsByTagName("h1")[0].innerHTML = `Il Giocatore 2 Vince! La Squadra ${currentTeam} vince!`;
    }
  } else {
    document.getElementsByTagName("h1")[0].innerHTML = `PAREGGIO!`;
  }
  gameOn = false;
}
