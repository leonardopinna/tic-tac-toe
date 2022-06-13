"use strict";

let score = 0;
let gameOn = false;
let interval;

let currentTeam = "";
let player1 = "";
let player2 = "";

function getImageSource(team) {
  let imageSource = "";
  if (team === "O") {
    imageSource = "images/circle.png";
  } else if (team === "X") {
    imageSource = "images/cross.png";
  }
  return imageSource;
}

function changePlayer(p1, p2, current) {
  console.log(p1, p2, current);
  if (p1 === current) {
    current = p2;
  } else if (p2 === current) {
    current = p1;
  }
  return current;
}

function gameloop() {
  update();
}

function update(square) {
  console.log(currentTeam);
  square.insertAdjacentElement("afterbegin", printImage(getImageSource(currentTeam)));

  square.classList.add("clicked");
  square.classList.add(currentTeam);

  checkWin();

  currentTeam = changePlayer(player1, player2, currentTeam);
}

function checkWin() {
  // combinazioni: [0, 1, 2], [0, 4, 8], [0, 3, 6], [1, 4, 7], [2, 4, 6], [2, 5, 8], [3, 4, 5], [6, 7, 8]

  let circleSquareIds = [];
  let crossSquareIds = [];

  let circleSquares = document.querySelectorAll(".O");
  let crossSquares = document.querySelectorAll(".X");

  circleSquares.forEach((square) => {
    circleSquareIds.push(square.getAttribute("id"));
  });
  crossSquares.forEach((square) => {
    crossSquareIds.push(square.getAttribute("id"));
  });

  console.log(crossSquareIds, circleSquareIds);

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

  winComb.forEach((comb) => {
    if (hasSubArray(crossSquareIds, comb)) {
      console.log("VITTORIA di X!");
      gameOver(false);
    }
  });

  winComb.forEach((comb) => {
    if (hasSubArray(circleSquareIds, comb)) {
      console.log("VITTORIA di O!");
      gameOver(false);
    }
  });

  if (circleSquareIds.length + crossSquareIds.length === 9) {
    gameOver(true);
  }
}

function hasSubArray(master, sub) {
  return sub.every(
    (
      (i) => (v) =>
        (i = master.indexOf(v, i) + 1)
    )(0)
  );
}

function printImage(imgSrc) {
  let img = document.createElement("img");
  img.setAttribute("src", imgSrc);
  img.style.width = "80%";
  img.style.height = "80%";

  return img;
}

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

function intializeNewGame() {
  document.getElementsByTagName("h1")[0].innerHTML = "Gioca a TRIS!";
  document.querySelectorAll(".square").forEach((element) => {
    element.classList.remove("clicked");
    element.classList.remove("O");
    element.classList.remove("X");
  });
  let allImages = document.querySelectorAll("img");
  console.log(allImages);
  for (let index = 0; index < allImages.length; index++) {
    allImages[index].parentNode.removeChild(allImages[index]);
  }
}

// inizializza lo stato quando si preme il tasto "nuovo gioco"; rimuovere i "disabled buittons" quando creo questa funzione.

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
