// Canvas related variables
const referenceSize = 1080;
const hasMaxSize = true; // if true, then the canvas cannot be larger than the reference size
const isCentered = false; // if true the canvas will be vertically and horizontally centered

var canvasSize;
var windowScale;

// Art related variables
let centered = fxrand() < 0.85;
const mappedShape = fxrand() < 0.1;
const mappedCol = fxrand() < 0.1;
const occurenceRoll = fxrand() * 100;
const gravityRoll = fxrand() * 100;
const cellSizes = [10, 16, 20];
const cellSize = cellSizes[Math.floor(cellSizes.length * fxrand())];

const golden = (1 + Math.sqrt(5)) / 2;
const smallGold = -golden + 2;

const paletteNum = Math.floor(fxrand() * colors.length);
const palette = colors[paletteNum];

const gravity = function () {
  if (gravityRoll < 50) {
    return "center";
  } else if (gravityRoll < 62.5) {
    return "vertical";
  } else if (gravityRoll < 75) {
    return "horizontal";
  } else if (gravityRoll < 87.5) {
    return "tl2br";
  } else return "tr2bl";
};

const occurence = () => {
  if (occurenceRoll <= 2.5) {
    return "always";
  } else if (occurenceRoll < 85) {
    return "mapped";
  } else {
    return "random";
  }
};

if (occurence() === "random") {
  centered = true;
}

function setup() {
  pixelDensity(1);
  setDimensions();
  if (isCentered) {
    centerCanvas();
  }
  c = createCanvas(canvasSize, canvasSize);
  let w = canvasSize;

  angleMode(DEGREES);
  colorMode(HSB);

  padding = Math.ceil(w / 25);

  gridSpacingX = (w - padding * 2) / cellSize;
  gridSpacingY = (w - padding * 2) / cellSize;

  pg = createGraphics(w, w);
}

function draw() {
  //translate(-width / 2, -height / 2);
  background(palette[0].hsb);
  noStroke();
  for (let x = 0; x < cellSize; x++) {
    for (let y = 0; y < cellSize; y++) {
      let distances = { max: 0, d: 0 };
      let colNum = false;

      let scaledX = padding + 0.5 * gridSpacingX + x * gridSpacingX;
      let scaledY = padding + 0.5 * gridSpacingY + y * gridSpacingY;

      findDistances(distances, scaledX, scaledY, gravity());

      push();
      translate(scaledX, scaledY);
      let rollBig = 100 * fxrand();
      let rollSmall = 100 * fxrand();

      let showBig, showSmall;

      if (occurence() === "mapped") {
        let percentage = (distances.d / distances.max) * 100;
        showBig = centered
          ? rollBig > 30 + percentage
          : rollBig < 15 + percentage;
        showSmall = centered
          ? rollSmall > 15 + percentage
          : rollSmall < 5 + percentage;
      } else if (occurence() === "random") {
        showBig = fxrand() > 0.55;
        showSmall = fxrand() > 0.65;
      } else {
        showBig = true;
        showSmall = true;
      }

      let BigType;
      if (mappedShape) {
        BigType = floor(map(distances.d, gridSpacingX, distances.max, 5, 1)); //  - 2 * padding
      }

      if (mappedCol) {
        colNum = floor(
          map(
            distances.d,
            2 * gridSpacingX,
            distances.max - padding,
            palette.length - 1,
            1,
            true
          )
        );
      }

      if (showBig) {
        rotate(90 * floor(4 * fxrand()));
        let bigCircle = new BigCircle(BigType, colNum);
      }

      if (showSmall) {
        let smallCircle = new SmallCircle(BigType, colNum);
      }

      pop();
    }
  }

  pg.background(100);
  noiseField("random", pg);
  image(pg, 0, 0);

  noLoop();
  fxpreview();
  console.table({
    "Occurence:": occurence(),
    "Centered:": centered,
    "Gravity:": gravity(),
    "Mapped Shape:": mappedShape,
    "Mapped Color:": mappedCol,
    "Palette:": paletteNames[paletteNum],
  });
}

class BigCircle {
  constructor(type = 0, colNum = false) {
    this.sizeX = ceil(gridSpacingX);
    this.sizeY = ceil(gridSpacingY);
    this.type = type;
    this.randCol = 1 + floor(fxrand() * (palette.length - 1));
    let shapeRoll = fxrand();
    if (type === 5 || (type === 0 && shapeRoll > 0.5)) {
      fill(palette[colNum || this.randCol].hsb);
      rectMode(CENTER);
      rect(
        0,
        0,
        this.sizeX,
        this.sizeY,
        0.5 * this.sizeX,
        0.5 * this.sizeX,
        0.5 * this.sizeX,
        0
      );
    } else if (type === 4 || type === 3 || (type === 0 && shapeRoll <= 0.5)) {
      if (type === 4 || (type === 0 && fxrand() > 0.5)) {
        let col = palette[colNum || this.randCol].hsb;
        fill(col);
        stroke(col);
      } else if (type === 3 || type === 0) {
        noFill();
        stroke(palette[colNum || this.randCol].hsb);
      }
      strokeWeight(0.05 * this.sizeX);
      let circleSize = this.sizeX - 0.05 * this.sizeX;
      ellipse(0, 0, circleSize, circleSize, 50);
    }
  }
}

class SmallCircle {
  constructor(type = 0, colNum = false) {
    this.type = type;

    if (mappedShape && occurence() === "always") {
      this.col = colNum || 1 + floor(fxrand() * (palette.length - 1));
    } else {
      this.col = colNum || floor(fxrand() * palette.length);
    }
    if (type < 3) {
      if (type === 2 || (type === 0 && fxrand() > 0.5)) {
        noStroke();
        fill(palette[this.col].hsb);
      } else if (type === 1 || type === 0) {
        noFill();
        stroke(palette[this.col].hsb);
      }
      strokeWeight(0.05 * gridSpacingX);
      // ellipse(0, 0, gridSpacingX / 2, gridSpacingX / 2);
      ellipse(0, 0, gridSpacingX / golden, gridSpacingX / golden);
      //ellipse(0, 0, gridSpacingX * smallGold, gridSpacingX * smallGold);
    }
  }
}

function findDistances(distances, x, y, type) {
  switch (type) {
    case "center":
      distances.max = dist(0, 0, width / 2, height / 2);
      distances.d = dist(x, y, width / 2, height / 2);
      break;

    case "vertical":
      distances.max = dist(0, 0, width / 2, 0);
      distances.d = dist(x, y, width / 2, y);
      break;

    case "horizontal":
      distances.max = dist(0, 0, 0, height / 2);
      distances.d = dist(x, y, x, height / 2);
      break;

    case "tl2br":
      distances.max = dist(0, 0, 0, width);
      distances.d = dist(x, y, x, x);
      break;

    case "tr2bl":
      distances.max = dist(0, 0, 0, width);
      distances.d = dist(x, y, x, width - x);
      break;

    default:
      break;
  }

  return distances;
}

const noiseField = (noiseType, element) => {
  if (noiseType === "random") {
    element.loadPixels();
    for (let x = 0; x < element.width; x++) {
      for (let y = 0; y < element.height; y++) {
        let index = (x + y * width) * 4;
        var r = 20 + fxrand() * 215;
        element.pixels[index + 0] = r;
        element.pixels[index + 1] = r;
        element.pixels[index + 2] = r;
        element.pixels[index + 3] = fxrand() * 20;
      }
    }
    element.updatePixels();
  }
  return element;
};

window.$fxhashFeatures = {
  "Occurence:": occurence(),
  "Centered:": centered,
  "Gravity:": gravity(),
  "Mapped Shape:": mappedShape,
  "Mapped Color:": mappedCol,
  "Palette:": paletteNames[paletteNum],
};

function setDimensions() {
  // This is how we constrain the canvas to the smallest dimension of the window
  canvasSize = 1080; // min(windowWidth, windowHeight);

  if (hasMaxSize) {
    canvasSize = min(referenceSize, canvasSize);
  }

  // windowScale goes from 0.0 to 1.0 as canvasSize goes from 0.0 to referenceSize
  // if hasMaxSize is set to true, it will be clamped to 1.0 otherwise it keeps growing over 1.0
  windowScale = map(canvasSize, 0, referenceSize, 0, 1, hasMaxSize);
}

function keyPressed() {
  if (key === "s") {
    saveCanvas(
      c,
      `In Search of Flowers - ${paletteNames[paletteNum]} - ${Date.now()}`,
      "png"
    );
  }
}
