// Ref: https://cms.tecky.io/course/wef-v01/WEF008?p=02-Game-of-Life-code-along.md
// Ref: https://en.wikipedia.org/wiki/Conway's_Game_of_Life
// Ref: https://nealwang.net/JustForFun/GameOfLife.html
// Ref: https://github.com/CodingTrain/Coding-Challenges/tree/main/085_The_Game_of_Life/Processing/CC_085_The_Game_of_Life
``;
let cols;
let rows;
let unitLength = 20;
let boardWidth = document.querySelector("#canvas").offsetWidth;
// let boardHeight = document.querySelector("#canvas").offsetHeight;
let widthAdjust = 0;
let heightAdjust = 0;
let lifeColor = "#3DBC15";
let dieColor = "#EFEFA0";
let strokeColor = "#D69B29";
let currentBoard;
let nextBoard;
let stableBoard;
let stableBoardOnOff = 0;
let stableColorA = 0;
let stableColor = "rgba(0,0,0, " + stableColorA + ")";
let pause = 0;
let reproductionRate = 3;
let survivalRulesLessThan = 2;
let survivalRulesMoreThan = 3;
let fr = 10;

// initial state
let initialState = 0;
function inits() {
  let p = Math.floor(cols / 2);
  let q = Math.floor(rows / 2);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (initialState == 1) {
        //place a signal
        currentBoard[i][j] = 0;
        currentBoard[p - 1][q] = 1;
        currentBoard[p][q] = 1;
        currentBoard[p + 1][q] = 1;
      } else if (initialState == 2) {
        // place gliders
        currentBoard[i][j] = 0;
        currentBoard[2][5] = 1;
        currentBoard[3][6] = 1;
        currentBoard[1][7] = 1;
        currentBoard[2][7] = 1;
        currentBoard[3][7] = 1;

        currentBoard[7][3] = 1;
        currentBoard[8][4] = 1;
        currentBoard[6][5] = 1;
        currentBoard[7][5] = 1;
        currentBoard[8][5] = 1;
      } else {
        currentBoard[i][j] = random() > 0.75 ? 1 : 0; //floor(random(2));
      }
      nextBoard[i][j] = 0; //floor(random(2));
      stableBoard[i][j] = 0;
    }
  }
}
// initial status button
document.querySelector("#initialRandom").addEventListener("click", function () {
  initialState = 0;
  console.log("Initial State:", initialState, "Random");
});
document.querySelector("#initialSignal").addEventListener("click", function () {
  initialState = 1;
  console.log("Initial State:", initialState, "Signal");
});
document.querySelector("#initialGlider").addEventListener("click", function () {
  initialState = 2;
  console.log("Initial State:", initialState, "Glider");
});

// initial All Clear state
function initClear() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = 0;
    }
  }
}

// p5.js setup
function setup() {
  // Background
  const canvas = createCanvas(
    // (windowWidth + widthAdjust) * 0.9,
    boardWidth + widthAdjust,
    (windowHeight + heightAdjust) * 0.8
  );
  canvas.parent(document.querySelector("#canvas"));

  background(0, 0, 0, 0);
  frameRate(fr);

  // Calculate the number of cols and rows
  cols = floor(width / unitLength);
  rows = floor(height / unitLength);

  // Making both currentBoard and nextBoard 2-dimensional matrix that has (cols * rows) boxes
  currentBoard = [];
  nextBoard = [];
  stableBoard = [];
  for (let i = 0; i < cols; i++) {
    currentBoard[i] = [];
    nextBoard[i] = [];
    stableBoard[i] = [];
    // Now both currentBoard and nextBoard are array of array of undefined values
  }

  // Set the initial values of the currentBoard and nextBoard
  inits();
}

// Resize Window
function windowResized() {
  console.log("windowWidth: ", windowWidth);
  console.log("boardWidth: ", boardWidth);
  if (windowWidth <= 1400) {
    resizeCanvas(
      (windowWidth + widthAdjust) * 0.9,
      (windowHeight + heightAdjust) * 0.6
    );
  } else {
    resizeCanvas(boardWidth + widthAdjust, (windowHeight + heightAdjust) * 0.8);
  }
}

// p5.js draw
function draw() {
  // Generate the status
  generate();
  frameRate(fr);

  // Fill the color of life and death
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (currentBoard[i][j] == 1) {
        //life color
        if (lifeColor == "rainbow") {
          // fill with random RBG color
          fill(floor(random(255)), floor(random(255)), floor(random(255)));
        } else if (lifeColor == "blackWhite") {
          // fill with random black & white color
          fill(floor(random(255)));
        } else {
          // fill with fixed color
          fill(lifeColor);
        }
      }

      // die color
      else {
        if (lifeColor == "blackWhite") {
          fill(255);
        } else {
          fill(dieColor);
        }
      }
      stroke(strokeColor);
      strokeWeight(1);
      rect(i * unitLength, j * unitLength, unitLength, unitLength);

      // stable color
      if (stableBoardOnOff == 1 && stableBoard[i][j] == 1) {
        fill("rgba(0,0,0, 0.35)");
        // fill(stableColor);
        rect(i * unitLength, j * unitLength, unitLength, unitLength);
      }
    }
  }
}

function generate() {
  //Loop over every single box on the board
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      // Count all living members in the Moore neighborhood(8 boxes surrounding)
      let neighbors = 0;
      for (let i of [-1, 0, 1]) {
        for (let j of [-1, 0, 1]) {
          if (i == 0 && j == 0) {
            // the cell itself is not its own neighbor
            continue;
          }
          // The modulo operator is crucial for wrapping on the edge
          neighbors +=
            currentBoard[(x + i + cols) % cols][(y + j + rows) % rows];
        }
      }

      // Rules of Life
      if (currentBoard[x][y] == 1 && neighbors < survivalRulesLessThan) {
        // Die of Loneliness
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 1 && neighbors > survivalRulesMoreThan) {
        // Die of Overpopulation
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 0 && neighbors == reproductionRate) {
        // New life due to Reproduction
        nextBoard[x][y] = 1;
      } else {
        // Stasis
        nextBoard[x][y] = currentBoard[x][y];
      }
      if (nextBoard[x][y] == 1 && currentBoard[x][y] == 1) {
        stableBoard[x][y] = 1;
        stableColorA = stableColorA + 0.1;
      }
    }
  }

  // Swap the nextBoard to be the current Board
  [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

/** When mouse is dragged */
function mouseDragged() {
  /** If the mouse coordinate is outside the board */
  if (mouseX > unitLength * cols || mouseY > unitLength * rows) {
    return;
  }
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);
  const z = currentBoard[x][y];
  if (z == 0) {
    currentBoard[x][y] = 1;
    fill(lifeColor);
  } else {
    currentBoard[x][y] = 0;
    fill(dieColor);
  }
  stroke(strokeColor);
  rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

/** When mouse is pressed */
function mousePressed() {
  /** If the mouse coordinate is outside the board */
  if (mouseX > unitLength * cols || mouseY > unitLength * rows) {
    return;
  }
  noLoop();
  pause = 1;
  mouseDragged();
  pauseIcon();
}

/** When mouse is released*/
// function mouseReleased() {
//   loop();
// }

/** make the reset behavior with a simple event handler and a call to init().*/
/** cannot use mouseClicked or mousePressed here. Because the reset button is outside the canvas. So p5.js does not manage this button.*/
document.querySelector("#reset").addEventListener("click", function () {
  // location.reload();

  unitLength = 20;
  boardWidth = document.querySelector("#canvas").offsetWidth;
  widthAdjust = 0;
  heightAdjust = 0;
  lifeColor = "#3DBC15";
  dieColor = "#EFEFA0";
  strokeColor = "#D69B29";
  currentBoard;
  nextBoard;
  pause = 0;
  reproductionRate = 3;
  survivalRulesLessThan = 2;
  survivalRulesMoreThan = 3;
  fr = 10;

  setup();
  draw();
});

// pause Listener
document.querySelector("#pause").addEventListener("click", function () {
  if (pause == 0) {
    noLoop();
    pause = 1;
    pauseIcon();
  } else {
    loop();
    pause = 0;
    pauseIcon();
  }
});

// pause icon
function pauseIcon() {
  if (pause == 0) {
    document.querySelector("#pause").classList.remove("btn-success");
    document.querySelector("#pause").classList.add("btn-warning");
    document.querySelector("#pause").innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-circle" viewBox="0 0 16 16">' +
      '<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" alt="circle"></path>' +
      '<path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5z" alt="pause"></path>' +
      "</svg>" +
      " Pause";
  } else {
    document.querySelector("#pause").classList.remove("btn-warning");
    document.querySelector("#pause").classList.add("btn-success");
    document.querySelector("#pause").innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-circle" viewBox="0 0 16 16">' +
      '<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" alt="circle"></path>' +
      '<path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z" alt="arrow"></path>' +
      "</svg>" +
      " Play";
  }
}

// clear the board
document.querySelector("#clear").addEventListener("click", function () {
  initClear();
  loop();
  pause = 1;
  pauseIcon();
});

//natural events
//tooltip
for (let event of document.querySelectorAll(
  'button[data-bs-toggle="tooltip"]'
)) {
  event.addEventListener("mouseover", function () {
    // document.querySelector("#pause").click();
    document.querySelector("#naturalEvent").textContent =
      event.getAttribute("data-bs-title");
    event.classList.add("wider");
  });
  event.addEventListener("mouseout", function () {
    // document.querySelector("#pause").click();
    document.querySelector("#naturalEvent").textContent = "";
    event.classList.remove("wider");
  });
}
//button listener
document.querySelector("#flame").addEventListener("click", function () {
  inits();
  draw();
});
document.querySelector("#rain").addEventListener("click", function () {
  let rainLife = 0;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (currentBoard[i][j] == 0) {
        currentBoard[i][j] = Math.floor(Math.random() * 0.6 * 2);
        if (currentBoard[i][j] == 1) {
          rainLife++;
          if (rainLife > 20) {
            break;
          }
        }
      }
    }
  }
  draw();
});
document.querySelector("#lightning").addEventListener("click", function () {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (currentBoard[i][j] == 1) {
        currentBoard[i][j] = Math.floor(Math.random() * 2);
      }
    }
  }
  draw();
});
document.querySelector("#wood").addEventListener("click", function () {
  document.querySelector("#reproductionMinus").click();
  document.querySelector("#survivalRulesLessThanMinus").click();
});
document.querySelector("#pest").addEventListener("click", function () {
  document.querySelector("#survivalRulesLessThanPlus").click();
  document.querySelector("#survivalRulesMoreThanPlus").click();
});
document.querySelector("#earthquake").addEventListener("click", function () {
  widthAdjust = widthAdjust - unitLength;
  heightAdjust = heightAdjust - unitLength;
  setup();
  console.log("Changed boardWidth as:", boardWidth + widthAdjust);
  console.log("Changed boardHeight as:", (windowHeight + heightAdjust) * 0.8);
});
document.querySelector("#safari").addEventListener("click", function () {
  widthAdjust = widthAdjust + unitLength;
  heightAdjust = heightAdjust + unitLength;
  setup();
  console.log("Changed boardWidth as:", boardWidth + widthAdjust);
  console.log("Changed boardHeight as:", (windowHeight + heightAdjust) * 0.8);
});
document.querySelector("#tsunami").addEventListener("click", function () {
  unitLength++;
  setup();
  console.log("Changed unitLength as:", unitLength);
});
document.querySelector("#urbanization").addEventListener("click", function () {
  unitLength--;
  setup();
  console.log("Changed unitLength as:", unitLength);
});
document.querySelector("#blackWhite").addEventListener("click", function () {
  lifeColor = "blackWhite";
});
document.querySelector("#rainbow").addEventListener("click", function () {
  lifeColor = "rainbow";
});
document.querySelector("#slowLife").addEventListener("click", function () {
  document.querySelector("#frameRate").value--;
  frameRateInput(document.querySelector("#frameRate").value);
  console.log("Frame Rate per second:", fr);
});
document.querySelector("#fastLife").addEventListener("click", function () {
  document.querySelector("#frameRate").value++;
  frameRateInput(document.querySelector("#frameRate").value);
  console.log("Frame Rate per second:", fr);
});

// darken colors for stable cell
document.querySelector("#darkOn").addEventListener("click", function () {
  stableBoardOnOff = 1;
  document.querySelector("#darkOff").classList.remove("active");
  document.querySelector("#darkOn").classList.add("active");
  console.log("Dark ON");
});
document.querySelector("#darkOff").addEventListener("click", function () {
  stableBoardOnOff = 0;
  document.querySelector("#darkOn").classList.remove("active");
  document.querySelector("#darkOff").classList.add("active");
  console.log("Dark OFF");
});

// select color for life cell
document.querySelector("#randomColor").addEventListener("click", function () {
  let r = Math.floor(Math.random() * 255);
  let g = Math.floor(Math.random() * 255);
  let b = Math.floor(Math.random() * 255);
  lifeColor = "rgb(" + r + "," + g + "," + b + ")";
  console.log("Life with Random Color");
});
document.querySelector("#redColor").addEventListener("click", function () {
  lifeColor = "#DC3545";
  console.log("Life with Red Color");
});
document.querySelector("#greenColor").addEventListener("click", function () {
  lifeColor = "#3DBC15";
  console.log("Life with Green Color");
});

// reproduction rules
document
  .querySelector("#reproductionMinus")
  .addEventListener("click", function () {
    if (Number(document.querySelector("#reproductionRules").value) <= 0) {
      console.log("Reproduction Rate is 0 now and cannot less than 0.");
      document.querySelector("#reproductionRules").value = 0;
      reproductionRate = 0;
    } else {
      document.querySelector("#reproductionRules").value--;
      reproductionRate = Number(
        document.querySelector("#reproductionRules").value
      );
      console.log("Reproduction Rate:", reproductionRate);
    }
  });
document
  .querySelector("#reproductionPlus")
  .addEventListener("click", function () {
    if (Number(document.querySelector("#reproductionRules").value) >= 8) {
      console.log("Reproduction Rate is 8 now and cannot greater than 8.");
      document.querySelector("#reproductionRules").value = 8;
      reproductionRate = 8;
    } else {
      document.querySelector("#reproductionRules").value++;
      reproductionRate = Number(
        document.querySelector("#reproductionRules").value
      );
      console.log("Reproduction Rate:", reproductionRate);
    }
  });

// survival rules
document
  .querySelector("#survivalRulesLessThanMinus")
  .addEventListener("click", function () {
    if (Number(document.querySelector("#survivalRulesLessThan").value) <= 0) {
      console.log(
        "Survival Rules Less Than value is 0 now and cannot less than 0."
      );
      document.querySelector("#survivalRulesLessThan").value = 0;
      survivalRulesLessThan = 0;
    } else {
      document.querySelector("#survivalRulesLessThan").value--;
      survivalRulesLessThan = Number(
        document.querySelector("#survivalRulesLessThan").value
      );
      console.log("Survival Rules Less Than value:", survivalRulesLessThan);
    }
  });
document
  .querySelector("#survivalRulesLessThanPlus")
  .addEventListener("click", function () {
    if (Number(document.querySelector("#survivalRulesLessThan").value) >= 8) {
      console.log(
        "Survival Rules Less Than value is 8 now and cannot greater than 8."
      );
      document.querySelector("#survivalRulesLessThan").value = 8;
      survivalRulesLessThan = 8;
    } else {
      document.querySelector("#survivalRulesLessThan").value++;
      survivalRulesLessThan = Number(
        document.querySelector("#survivalRulesLessThan").value
      );
      console.log("Survival Rules Less Than value:", survivalRulesLessThan);
    }
  });
document
  .querySelector("#survivalRulesMoreThanMinus")
  .addEventListener("click", function () {
    if (Number(document.querySelector("#survivalRulesMoreThan").value) <= 0) {
      console.log(
        "Survival Rules More Than value is 0 now and cannot less than 0."
      );
      document.querySelector("#survivalRulesMoreThan").value = 0;
      survivalRulesMoreThan = 0;
    } else {
      document.querySelector("#survivalRulesMoreThan").value--;
      survivalRulesMoreThan = Number(
        document.querySelector("#survivalRulesMoreThan").value
      );
      console.log("Survival Rules More Than value:", survivalRulesMoreThan);
    }
  });
document
  .querySelector("#survivalRulesMoreThanPlus")
  .addEventListener("click", function () {
    if (Number(document.querySelector("#survivalRulesMoreThan").value) >= 8) {
      console.log(
        "Survival Rules More Than value is 8 now and cannot greater than 8."
      );
      document.querySelector("#survivalRulesMoreThan").value = 8;
      survivalRulesMoreThan = 8;
    } else {
      document.querySelector("#survivalRulesMoreThan").value++;
      survivalRulesMoreThan = Number(
        document.querySelector("#survivalRulesMoreThan").value
      );
      console.log("Survival Rules More Than value:", survivalRulesMoreThan);
    }
  });

// framerate slider
function frameRateInput(sliderValue) {
  fr = Number(sliderValue);
  if (sliderValue == 1) {
    document.querySelector("#frameRateLabel").textContent =
      sliderValue + " frame per second";
  } else {
    document.querySelector("#frameRateLabel").textContent =
      sliderValue + " frames per second";
  }
}

// support Keyboard
document.body.addEventListener("keydown", function (event) {
  console.log("Pressed key: ", event.key);
  if (event.key == "p" || event.key == "P") {
    document.querySelector("#pause").click();
    console.log("Pause / Play");
  } else if (event.key == "c" || event.key == "C") {
    document.querySelector("#clear").click();
    console.log("Cleared game board");
  } else if (event.key == "r" || event.key == "R") {
    document.querySelector("#reset").click();
    console.log("Reset game board");
  } else if (event.key == "<" || event.key == ",") {
    document.querySelector("#frameRate").value--;
    frameRateInput(document.querySelector("#frameRate").value);
    console.log("Frame Rate per second:", fr);
  } else if (event.key == ">" || event.key == ".") {
    document.querySelector("#frameRate").value++;
    frameRateInput(document.querySelector("#frameRate").value);
    console.log("Frame Rate per second:", fr);
  }
});
