var canvas = document.getElementById('canvas'); // Accède à L'id Canvas
var ctx = canvas.getContext('2d'); /* permet de dessiner des rectangles, du texte etc sur l'élément Canvas, (rendu 2d) */
var sizeInput = document.getElementById('size'); //Accède à L'id Size
var changeSize = document.getElementById('change-size'); // Accède à L'id Change-size
var scoreLabel = document.getElementById('score'); // Accède à l'id Score
var score = 0; // Le score est à 0 au début et peut changer à chaque coups dans le jeu 
var size = 4; // la taille de la grille peut être modifiée en changeant la valeur de Size qui est intialement à 4
var width = canvas.width / size - 6; // ici la valeur est 119, (500/4-6) 
var cells = []; // délcaration de la variable cells
var fontSize; // déclaration de la variable fontSize
var loss = false; // la variable loss est initiée à fausse, et se changera en vraie si la partie est perdue
startGame(); // fonction startGame

changeSize.onclick = function () {   
  if (sizeInput.value >= 2 && sizeInput.value <= 20) { //définie une limite de entre 2 et 20 pour la valeur sizeInput
    size = sizeInput.value; // prend en compte la valeur entrée 
    width = canvas.width / size - 6; // modifie en fonction de la valeur entrée
    console.log(sizeInput.value); // log de la valeur 
    canvasClean(); //réinitialisation du canvas
    startGame();
  }
}

function cell(row, coll) { //création d'une grille 
  this.value = 0; // valeur initiale 
  this.x = coll * width + 5 * (coll + 1); 
  this.y = row * width + 5 * (row + 1);
}

function createCells() { //fonction createCells
  var i, j; // mise en place d'une variable i et j 
  for(i = 0; i < size; i++) { /* boucle for qui initialise i à 0 en premier, qui vérifie que i est stricement inférieur à la variable size et qui incrémente 1 à i */
    cells[i] = []; 
    for(j = 0; j < size; j++) {
      cells[i][j] = new cell(i, j);
    }
  }
}

function drawCell(cell) {
  ctx.beginPath();
  ctx.rect(cell.x, cell.y, width, width);
  switch (cell.value){
    case 0 : ctx.fillStyle = '#A9A9A9'; break;
    case 2 : ctx.fillStyle = '#D2691E'; break;
    case 4 : ctx.fillStyle = '#FF7F50'; break;
    case 8 : ctx.fillStyle = '#ffbf00'; break;
    case 16 : ctx.fillStyle = '#bfff00'; break;
    case 32 : ctx.fillStyle = '#40ff00'; break;
    case 64 : ctx.fillStyle = '#00bfff'; break;
    case 128 : ctx.fillStyle = '#FF7F50'; break;
    case 256 : ctx.fillStyle = '#0040ff'; break;
    case 512 : ctx.fillStyle = '#ff0080'; break;
    case 1024 : ctx.fillStyle = '#D2691E'; break;
    case 2048 : ctx.fillStyle = '#FF7F50'; break;
    case 4096 : ctx.fillStyle = '#ffbf00'; break;
    default : ctx.fillStyle = '#ff0080';  // Les couleurs de chaque case 
  }
  ctx.fill(); 
  if (cell.value) {
    fontSize = width / 2; // taille de la police
    ctx.font = fontSize + 'px Arial'; //taille de la police + la police
    ctx.fillStyle = 'white'; // couleur de la police
    ctx.textAlign = 'center';  // mise en pagne, alignement de texte 
    ctx.fillText(cell.value, cell.x + width / 2, cell.y + width / 2 + width/7);
  }
}

function canvasClean() {
  ctx.clearRect(0, 0, 500, 500); // fonction permettant la réinitialisation du canvas
}

document.onkeydown = function (event) { // onkeydown permet d'utiliser les touches du clavier
  if (!loss) {
    if (event.keyCode === 38 || event.keyCode === 87) {
      moveUp(); 
    } else if (event.keyCode === 39 || event.keyCode === 68) {
      moveRight();
    } else if (event.keyCode === 40 || event.keyCode === 83) {
      moveDown(); 
    } else if (event.keyCode === 37 || event.keyCode === 65) {
      moveLeft(); 
    }
      
      /* Chaque touche du clavier correspond à un keycode, 38,39,40 et 37 correspondent aux flèches, les quatres autres chiffres permettent aussi de jouer au jeu via certaines touches du clavier */
    scoreLabel.innerHTML = 'Score : ' + score; //la modification du score en temps réel en fonction du mouvement effectué 
  }
}

function startGame() {
  createCells();
  drawAllCells();
  pasteNewCell(); 
  pasteNewCell(); // la fonction lance les autres fonctions dans l'ordre et démarre ainsi une partie
}

function finishGame() { // cette fonction sera appellée lorsque la partie sera perdue
  canvas.style.opacity = '0.5'; //lorsque la partie se termine l'opacité se set à à 0,5, donnant un effet de style
  loss = true; //la variable loss se change en true, finissant ainsi la partie
}

function drawAllCells() { 
  var i, j;
  for(i = 0; i < size; i++) {
    for(j = 0; j < size; j++) {
      drawCell(cells[i][j]);
    }
  }
}

function pasteNewCell() {
  var countFree = 0; //creation d'une nouvelle variable countFree
  var i, j;
  for(i = 0; i < size; i++) { 
    for(j = 0; j < size; j++) {
      if(!cells[i][j].value) {
        countFree++; // incrémantion de 1 à countFree
      }
    }
  }
  if(!countFree) {
    finishGame();
    return; //condition qui terminera le jeu 
  }
  while(true) { 
    var row = Math.floor(Math.random() * size);
    var coll = Math.floor(Math.random() * size);
    if(!cells[row][coll].value) {
      cells[row][coll].value = 2 * Math.ceil(Math.random() * 2);
      drawAllCells();
      return;
    }
  }
}

function moveRight () {
  var i, j;
  var coll;
  for(i = 0; i < size; i++) {
    for(j = size - 2; j >= 0; j--) {
      if(cells[i][j].value) {
        coll = j;
        while (coll + 1 < size) {
          if (!cells[i][coll + 1].value) {
            cells[i][coll + 1].value = cells[i][coll].value;
            cells[i][coll].value = 0;
            coll++;
          } else if (cells[i][coll].value == cells[i][coll + 1].value) {
            cells[i][coll + 1].value *= 2;
            score +=  cells[i][coll + 1].value;
            cells[i][coll].value = 0;
            break;
          } else {
            break;
          }
        }
      }
    }
  }
  pasteNewCell();
}
/* Chacune des fonctions suivantes sont le resultat d'un mouvement, soit haut,bas,gauche ou droite, chaque mouvement va générer une nouvelle tuile à un endroit aléatoire et va faire bouger toutes les autres tuiles, en changeant le score */ 
function moveLeft() {
  var i, j;
  var coll;
  for(i = 0; i < size; i++) {
    for(j = 1; j < size; j++) {
      if(cells[i][j].value) {
        coll = j;
        while (coll - 1 >= 0) {
          if (!cells[i][coll - 1].value) {
            cells[i][coll - 1].value = cells[i][coll].value;
            cells[i][coll].value = 0;
            coll--;
          } else if (cells[i][coll].value == cells[i][coll - 1].value) {
            cells[i][coll - 1].value *= 2;
            score +=   cells[i][coll - 1].value;
            cells[i][coll].value = 0;
            break;
          } else {
            break; 
          }
        }
      }
    }
  }
  pasteNewCell();
}

function moveUp() {
  var i, j, row;
  for(j = 0; j < size; j++) {
    for(i = 1; i < size; i++) {
      if(cells[i][j].value) {
        row = i;
        while (row > 0) {
          if(!cells[row - 1][j].value) {
            cells[row - 1][j].value = cells[row][j].value;
            cells[row][j].value = 0;
            row--;
          } else if (cells[row][j].value == cells[row - 1][j].value) {
            cells[row - 1][j].value *= 2;
            score +=  cells[row - 1][j].value;
            cells[row][j].value = 0;
            break;
          } else {
            break; 
          }
        }
      }
    }
  }
  pasteNewCell();
}

function moveDown() {
  var i, j, row;
  for(j = 0; j < size; j++) {
    for(i = size - 2; i >= 0; i--) {
      if(cells[i][j].value) {
        row = i;
        while (row + 1 < size) {
          if (!cells[row + 1][j].value) {
            cells[row + 1][j].value = cells[row][j].value;
            cells[row][j].value = 0;
            row++;
          } else if (cells[row][j].value == cells[row + 1][j].value) {
            cells[row + 1][j].value *= 2;
            score +=  cells[row + 1][j].value;
            cells[row][j].value = 0;
            break;
          } else {
            break; 
          }
        }
      }
    }
  }
  pasteNewCell();
}
