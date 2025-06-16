const game = document.querySelector("#game");
const tile = document.querySelectorAll(".tile");
const size= 4;
const tiles = [];
const board = [];
let score = 0;
let container = document.querySelector(".container");
document.querySelector(".allgame").classList.remove("hidden");

container.addEventListener("touchmove",
  function(e){
    e.preventDefault();
  },{passive: false});
 
for  (let i = 0; i < 16; i++){
    const tile = document.createElement("div");
    tile.classList.add("tile");

    game.append(tile);
    tiles.push(tile);
};

for (let r = 0; r < size; r++) {
    board[r] = [];

    for (let c = 0; c < size; c++){
        board[r][c] = 0;
    }
}



const placeRandomTile = () => {
     const emptyTiles = [];

     for (let i = 0; i < size; i++){
        for(let j = 0; j < size; j++){
            if(board[i][j] === 0){
                emptyTiles.push({row:i, col:j});
            }
        }
     }

     if (emptyTiles.length > 0){
        const randomIndex = Math.floor(Math.random() * emptyTiles.length);
        const {row,col} = emptyTiles[randomIndex];

        const randomNumber = Math.random() < 0.7 ? 2 : 4;
        board[row][col] = randomNumber;

        const index = row * size + col;
        tiles[index].innerText = randomNumber;
        updateScore (randomNumber);
     }

}

const updateBoardUI = () => {
    for(let i = 0; i < size; i++){
        for(let j = 0; j < size; j++){
            const index = i * size +j;
            const value = board[i][j];
            const tile = tiles[index];

            tile.innerText = value === 0 ? "" : value;

            tile.className = "tile"; // remove css
            if(value > 0){
                tile.classList.add(`tile-${value}`);  // add new style 
            }
        }
    }
}

const moveTile = (direction, row, col, distance) => {
  if (board[row][col] === 0) return;

  let r = row, c = col;
  let value = board[r][c];
  let moved = false;

  const dr = { up: -1, down: 1, left: 0, right: 0 };
  const dc = { up: 0, down: 0, left: -1, right: 1 };

  for (let i = 0; i < distance; i++) {
    const nr = r + dr[direction];
    const nc = c + dc[direction];

    if (nr < 0 || nr >= size || nc < 0 || nc >= size) break;

    if (board[nr][nc] === 0) {
      board[nr][nc] = value;
      board[r][c] = 0;
      r = nr;
      c = nc;
      moved = true;
    } else if (board[nr][nc] === value) {
      board[nr][nc] *= 2;
      board[r][c] = 0;
      moved = true;
      updateScore(board[nr][nc]);
      break;
    } else {
      break;
    }
  }

  if (moved) {
    updateBoardUI();
    placeRandomTile();
  }

  gameOver();
};


// dx = end-x -start-x
const handleSwipe = (dx, dy, row, col) => {
  const tileSize = 75;
  let direction = "";
  let distance = 0;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) {
      direction = "right";
      distance = Math.min(size - 1 - col, Math.floor(dx / tileSize));
    } else if (dx < 0) {
      direction = "left";
      distance = Math.min(col, Math.floor(Math.abs(dx) / tileSize));
    }
  } else {
    if (dy > 0) {
      direction = "down";
      distance = Math.min(size - 1 - row, Math.floor(dy / tileSize));
    } else if (dy < 0) {
      direction = "up";
      distance = Math.min(row, Math.floor(Math.abs(dy) / tileSize));
    }
  }

  if (direction && distance > 0) {
    moveTile(direction, row, col, distance);
  }
};



let startX = 0;
let startY = 0;
let selectedRow = -1;
let selectedCol = -1;

tiles.forEach((tile, index) => {
  tile.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    selectedRow = Math.floor(index / size);
    selectedCol = index % size;
  });

  tile.addEventListener("touchend", (e) => {
    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    handleSwipe(endX - startX, endY - startY, selectedRow, selectedCol);
  });

  tile.addEventListener("mousedown", (e) => {
    startX = e.clientX;
    startY = e.clientY;
    selectedRow = Math.floor(index / size);
    selectedCol = index % size;
  });

  tile.addEventListener("mouseup", (e) => {
    const endX = e.clientX;
    const endY = e.clientY;
    handleSwipe(endX - startX, endY - startY, selectedRow, selectedCol);
  });
});


const updateScore = (points) => {
  score += points;
  document.querySelector("#score").innerText =  `Score : ${score}`;
}

const resetGame = () => {
     
  for(let r = 0; r < size; r++){
    for(let c = 0; c < size; c++){
      board[r][c] = 0;
    }
  }

  score = 0;
  document.querySelector("#score").innerText = ` Score : ${score}`;
  
  placeRandomTile();
  placeRandomTile();
  placeRandomTile();
  updateBoardUI();


}
document.querySelector("#reset-btn").addEventListener("click",() => {
  resetGame();
});

const gameOver = () => {
  for(let r = 0; r < size; r++){
    for(let c =0; c < size; c++){
      const value = board[r][c];
      if(value === 0){
          return false;
      }
    
      if(r+1 < size && board[r][c] === board[r+1][c] ||
         c+1 < size && board[r][c] === board[r][c+1] ){
              return false;
      }
    }
  }
   document.querySelector(".game-over").classList.remove("hide");
   document.querySelector(".allgame").classList.add("hidden");
  return true;
}



const restartGame = () => {
   document.querySelector(".game-over").classList.add("hide");
   document.querySelector(".allgame").classList.remove("hidden");
   resetGame();
}

document.querySelector("#restart-btn").addEventListener("click",() => {
  restartGame();
});



placeRandomTile();
placeRandomTile();
placeRandomTile();
updateBoardUI();

















  


