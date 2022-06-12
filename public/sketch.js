// Canvas related variables
const referenceSize = 2000;
const hasMaxSize = true; // if true, then the canvas cannot be larger than the reference size
const isCentered = false; // if true the canvas will be vertically and horizontally centered

let w, h;
let windowScale;

// Art related variables
let margin, padding, gutterV, gutterH, rows, cols, cellSize;
let coords = [];

rows = 3;
cols = 3;

function setup() {
  pixelDensity(1);
  setDimensions();
  if (isCentered) {
    centerCanvas();
  }
  createCanvas(w, h);

  // c = createCanvas(w, w);
  angleMode(DEGREES);
  colorMode(HSB);

  margin = Math.ceil(w / 25);
  padding = 0;
  gutterH = Math.ceil(w / 100);
  gutterV = Math.ceil(h / 100);

  cellSize = (w - 2 * margin - gutterH * (cols - 1)) / cols;

  // here we populate the 2d coords array

  for (let x = 0; x < cols; x++) {
    var column = [];
    for (let y = 0; y < rows; y++) {
      column.push({
        x: margin + padding + (x > 0 ? gutterH : 0) + x * cellSize,
        y: margin + padding + (y > 0 ? gutterV : 0) + y * cellSize,
      });
    }
    coords.push(column);
  }
  //pg = createGraphics(w, w);
}

function draw() {
  // translate(-width / 2, -height / 2);
  background(50);
  noStroke();
  for (let x = 0; x < coords.length; x++) {
    for (let y = 0; y < coords[x].length; y++) {
      let rotation = 0;
      let colNum = false;

      let scaledX = coords[x][y].x;
      let scaledY = coords[x][y].y;

      console.log("DRAW", coords[x][y]);

      push();
      fill(100);
      translate(scaledX + cellSize / 2, scaledY + cellSize / 2);
      circle(0, 0, cellSize);
      pop();
    }
  }

  // pg.background(100);
  // noiseField("random", pg);
  // image(pg, 0, 0);

  const mp = margin + padding;
  stroke(100);
  line(mp, 0, mp, height);
  line(width - mp, 0, width - mp, height);
  line(0, mp, height, mp);
  line(0, height - mp, width, height - mp);

  // gutter lines
  line(mp + cellSize, 0, mp + cellSize, height);
  line(mp + cellSize + gutterH, 0, mp + cellSize + gutterH, height);
  line(0, mp + cellSize, height, mp + cellSize);
  line(0, mp + cellSize + gutterV, height, mp + cellSize + gutterV);
  noLoop();
  //saveCanvas(c, `Flowers - ${paletteNames[paletteNum]} - ${Date.now()}`, "png");
  /*   console.table({
    "Occurence:": occurence(),
    "Centered:": centered,
    "Gravity:": gravity(),
    "Mapped Shape:": mappedShape,
    "Mapped Color:": mappedCol,
    "Palette:": paletteNames[paletteNum] || paletteNum,
  }); */
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
    if (mappedShape && occurence === "always") {
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
        var r = 20 + fxrand() * 215; //random(20, 235);
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

window.$fxhashFeatures = {};

function setDimensions() {
  // This is how we constrain the canvas to the smallest dimension of the window
  h = w = min(windowWidth, windowHeight);

  if (hasMaxSize) {
    w = min(referenceSize, w);
  }

  // windowScale goes from 0.0 to 1.0 as canvasSize goes from 0.0 to referenceSize
  // if hasMaxSize is set to true, it will be clamped to 1.0 otherwise it keeps growing over 1.0
  windowScale = map(w, 0, referenceSize, 0, 1, hasMaxSize);
}
