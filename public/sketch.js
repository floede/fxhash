// Canvas related variables
const referenceSize = 2000;
const hasMaxSize = true; // if true, then the canvas cannot be larger than the reference size
const isCentered = false; // if true the canvas will be vertically and horizontally centered

const golden = (1 + Math.sqrt(5)) / 2;
const smallGold = -golden + 2;

const goldenFactor = 1;

let w, h;
let windowScale;

// Art related variables
let margin, gutterV, gutterH, rows, cols, cellSize, goldenCell;
let coords = [];
let elements = [];

const shapeRules = ["uniform", "pairs", "random"];
const shapes = [0, 1, 2, 3, 4, 5, 6, 7];
const shapeRule = shapeRules[Math.floor(shapeRules.length * fxrand())];
let pickedShapes = [0, 0];

let shapePool = shapes;
pickedShapes.forEach((pick, index) => {
  pickedShapes[index] = shapePool.splice(
    Math.floor(fxrand() * shapePool.length),
    1
  )[0];
});

const colorRules = ["duo", "quad", "random"];
const colorRule = colorRules[Math.floor(colorRules.length * fxrand())];
const palette = colors[Math.floor(colors.length * fxrand())];
let colorPool = [];
palette.forEach((color, index) => {
  colorPool[index] = color.hsb;
});

console.log("COLOR POOL: ", colorPool);

let pickedColors = [0, 0, 0, 0];
pickedColors.forEach((color, index) => {
  pickedColors[index] = colorPool.splice(
    Math.floor(fxrand() * colorPool.length),
    1
  )[0];
});

console.log("COLOR PICK: ", pickedColors);

function setup() {
  pixelDensity(1);
  setDimensions();
  if (isCentered) {
    centerCanvas();
  }
  c = createCanvas(w, h);

  angleMode(DEGREES);
  colorMode(HSB);

  goldenCell =
    goldenFactor > 0 ? goldenCellSize(width * smallGold) : width * smallGold;

  let tempSpace = width % goldenCell;

  rows = int(width / goldenCell);
  cols = int(height / goldenCell);

  const spaceUnit = tempSpace / (4 + (cols - 1));
  gutterH = spaceUnit;
  gutterV = spaceUnit;

  margin = 2 * spaceUnit;

  // here we populate the 2d coords array
  for (let x = 0; x < cols; x++) {
    var column = [];
    for (let y = 0; y < rows; y++) {
      let chosenShape = shapeBuilder(x, y);
      let chosenColors = colorBuilder(x, y);
      console.log("COLOR:", chosenColors);
      column.push({
        x: margin + (x > 0 ? x * gutterH : 0) + x * goldenCell,
        y: margin + (y > 0 ? y * gutterV : 0) + y * goldenCell,
        shape: chosenShape,
        pattern: 1,
        palette: chosenColors,
      });
    }
    coords.push(column);
  }
  //pg = createGraphics(w, w);
}

function draw() {
  // translate(-width / 2, -height / 2);
  background(10);
  noStroke();
  for (let x = 0; x < coords.length; x++) {
    for (let y = 0; y < coords[x].length; y++) {
      let rotation = 0;
      let colNum = false;

      let scaledX = coords[x][y].x;
      let scaledY = coords[x][y].y;

      push();
      translate(scaledX + goldenCell / 2, scaledY + goldenCell / 2);
      elements.push(
        new BaseElement(
          scaledX,
          scaledY,
          coords[x][y].shape,
          coords[x][y].pattern,
          coords[x][y].palette
        )
      );
      pop();
    }
  }

  // pg.background(100);
  // noiseField("random", pg);
  // image(pg, 0, 0);

  /*
  const mp = margin + ;
  stroke(100);
  line(mp, 0, mp, height);
  line(width - mp, 0, width - mp, height);
  line(0, mp, height, mp);
  line(0, height - mp, width, height - mp);

  // gutter lines
  line(mp + goldenCell, 0, mp + goldenCell, height);
  line(mp + goldenCell + gutterH, 0, mp + goldenCell + gutterH, height);
  line(0, mp + goldenCell, height, mp + goldenCell);
  line(0, mp + goldenCell + gutterV, height, mp + goldenCell + gutterV);

  // Golden ratio lines
  stroke(20);
  line(width / golden, 0, width / golden, height);
  line(width - width / golden, 0, width - width / golden, height);
  */
  noLoop();
  // saveCanvas(c, `The D - Super Ellipse`, "png");
  console.table({
    "Shape rule": shapeRule,
    "Color rule": colorRule,
  });
}

class BaseElement {
  constructor(scaledX, scaledY, shape, pattern, palette) {
    this.realX = scaledX;
    this.realY = scaledY;
    this.shape = shape;
    this.pattern = pattern;
    this.palette = palette;

    baseShape(this.shape, this.pattern, this.palette);
  }
}

const baseShape = (shape, pattern, palette) => {
  console.log("BASE PALETTE: ", palette);
  switch (shape) {
    case 1:
      push();
      translate(0, -goldenCell / 2);
      patternChoser(pattern, (c = { one: palette[0] }));
      pop();

      push();
      translate(0, 0);
      patternChoser(pattern, (c = { one: palette[1] }));
      pop();
      break;

    case 2:
      push();
      translate(0, 0);
      rotate(180);
      patternChoser(pattern, (c = { one: palette[0] }));
      pop();

      push();
      translate(0, goldenCell / 2);
      rotate(180);
      patternChoser(pattern, (c = { one: palette[1] }));
      pop();
      break;

    case 3:
      push();
      translate(0, -goldenCell / 2);
      patternChoser(pattern, (c = { one: palette[0] }));
      pop();

      push();
      translate(0, goldenCell / 2);
      rotate(180);
      patternChoser(pattern, (c = { one: palette[1] }));
      pop();

      break;

    case 4:
      push();
      translate(0, 0);
      rotate(180);
      patternChoser(pattern, (c = { one: palette[0] }));
      pop();

      push();
      translate(0, 0);
      patternChoser(pattern, (c = { one: palette[1] }));
      pop();
      break;

    case 5:
      push();
      rotate(90);
      patternChoser(pattern, (c = { one: palette[0] }));
      pop();

      push();
      translate(goldenCell / 2, 0);
      rotate(90);
      patternChoser(pattern, (c = { one: palette[1] }));
      pop();

      break;

    case 6:
      push();
      translate(-goldenCell / 2, 0);
      rotate(-90);
      patternChoser(pattern, (c = { one: palette[0] }));
      pop();

      push();
      rotate(-90);
      patternChoser(pattern, (c = { one: palette[1] }));
      pop();
      break;

    case 7:
      push();
      rotate(90);
      patternChoser(pattern, (c = { one: palette[0] }));
      pop();

      push();
      rotate(-90);
      patternChoser(pattern, (c = { one: palette[1] }));
      pop();

      break;

    default:
      push();
      translate(-goldenCell / 2, 0);
      rotate(-90);
      patternChoser(pattern, (c = { one: palette[0] }));
      pop();

      push();
      translate(goldenCell / 2, 0);
      rotate(90);
      patternChoser(pattern, (c = { one: palette[1] }));
      pop();
      break;
  }
};

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

let count = 0;
function goldenCellSize(n) {
  let size = n / golden;
  count++;
  if (count < goldenFactor) {
    return goldenCellSize(size);
  }
  return size;
}

const patternChoser = (pattern, c) => {
  switch (pattern) {
    case 1:
      pattern1(goldenCell, 0, 180, c);
      break;

    case 2:
      if (pattern === 2) {
        arc(
          0,
          -goldenCell / 2,
          goldenCell / golden,
          goldenCell / golden,
          0,
          180
        );
      }
      if (pattern === 2) {
        fill(palette[2]);
        arc(0, 0, goldenCell / golden, goldenCell / golden, 0, 180);
      }
      break;

    default:
      break;
  }
};

const pattern1 = (size, start, end, col) => {
  fill(col.one);

  let n = 2.5;
  let a = size / 2;
  let b = size / 2;

  noStroke();
  beginShape();
  for (let t = 0; t <= 180; t += 5) {
    let x = pow(abs(cos(t)), 2 / n) * a * sgn(cos(t));
    let y = pow(abs(sin(t)), 2 / n) * b * sgn(sin(t));
    vertex(x, y);
  }
  endShape(CLOSE);
};

function sgn(w) {
  if (w < 0) {
    return -1;
  } else if (w === 0) {
    return 0;
  } else {
    return 1;
  }
}

function shapeBuilder(x, y) {
  if (shapeRule === "uniform") {
    return pickedShapes[0];
  } else if (shapeRule === "pairs") {
    if ((x % 2 == 0 && y % 2 == 0) || (x % 2 != 0 && y % 2 != 0)) {
      return pickedShapes[0];
    } else {
      return pickedShapes[1];
    }
  } else {
    return floor(fxrand() * shapes.length);
  }
}

function colorBuilder(x, y) {
  if (colorRule === "duo") {
    return [pickedColors[0], pickedColors[1]];
  } else if (colorRule === "quad") {
    if ((x % 2 == 0 && y % 2 == 0) || (x % 2 != 0 && y % 2 != 0)) {
      return [pickedColors[0], pickedColors[1]];
    } else {
      return [pickedColors[2], pickedColors[3]];
    }
  } else {
    return [
      pickedColors[floor(fxrand() * pickedColors.length)],
      pickedColors[floor(fxrand() * pickedColors.length)],
    ];
  }
}
