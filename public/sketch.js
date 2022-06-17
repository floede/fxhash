// Canvas related variables
const referenceSize = 1080;
const hasMaxSize = true; // if true, then the canvas cannot be larger than the reference size
const isCentered = false; // if true the canvas will be vertically and horizontally centered

const golden = (1 + Math.sqrt(5)) / 2;
const smallGold = -golden + 2;

const goldenFactor = fxrand() > 0.5 ? 1 : 0;

const border = fxrand() > 0.5 ? 1 : 0;

let w, h;
let windowScale;

// Art related variables
let margin, spaceUnit, gutterV, gutterH, rows, cols, cellSize, goldenCell, bg;
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

let pickedColors = [0, 0, 0, 0];
pickedColors.forEach((color, index) => {
  pickedColors[index] = colorPool.splice(
    Math.floor(fxrand() * colorPool.length),
    1
  )[0];
});

const patternRules = ["uniform", "double", "pair", "random"];
const patternRule = patternRules[3]; //[Math.floor(patternRules.length * fxrand())];
const patterns = [1, 2, 3, 4];
const patternPool = shuffle(patterns);

const Y_AXIS = 1;
const X_AXIS = 2;
let b1, b2, c1, c2;

function setup() {
  pixelDensity(1);
  setDimensions();
  if (isCentered) {
    centerCanvas();
  }
  c = createCanvas(w, h);

  angleMode(DEGREES);
  colorMode(HSB);

  goldenCell = ceil(
    goldenFactor > 0
      ? goldenCellSize(0.9 * width * smallGold)
      : width * smallGold
  );

  let tempSpace = width % goldenCell;

  rows = int(width / goldenCell);
  cols = int(height / goldenCell);

  spaceUnit = ceil(tempSpace / (4 + (cols - 1)));

  bg = border ? (0, 0, 95) : (0, 0, 10);

  // here we populate the 2d coords array
  for (let x = 0; x < cols; x++) {
    var column = [];
    for (let y = 0; y < rows; y++) {
      let chosenShape = shapeBuilder(x, y);
      let chosenColors = colorBuilder(x, y);
      let chosenPatterns = patternBuilder(x, y);
      column.push({
        //x: margin + (x > 0 ? x * gutterH : 0) + x * goldenCell,
        //y: margin + (y > 0 ? y * gutterV : 0) + y * goldenCell,
        shape: chosenShape,
        pattern: chosenPatterns,
        palette: chosenColors,
      });
    }
    coords.push(column);
  }
  pg = createGraphics(w, h);
}

function draw() {
  // translate(-width / 2, -height / 2);
  background(bg);
  noStroke();

  gutterH = spaceUnit;
  gutterV = spaceUnit;

  margin = 2 * spaceUnit;

  for (let x = 0; x < coords.length; x++) {
    for (let y = 0; y < coords[x].length; y++) {
      let scaledX = ceil(margin + (x > 0 ? x * gutterH : 0) + x * goldenCell);
      let scaledY = ceil(margin + (y > 0 ? y * gutterV : 0) + y * goldenCell);

      push();
      translate(ceil(scaledX + goldenCell / 2), ceil(scaledY + goldenCell / 2));
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
    noLoop();
  }

  pg.background(100);
  noiseField("random", pg);
  image(pg, 0, 0);

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
    "Pattern rule": patternRule,
  });
  fxpreview();
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
  if (border) {
    strokeWeight(spaceUnit / 2);
    stroke(10);
    rectMode(CENTER);
    rect(0, 0, goldenCell, goldenCell);
  }
  const offset = ceil(goldenCell / 2 - (border ? spaceUnit / 4 : 0));
  switch (shape) {
    case 1:
      push();
      translate(0, -offset);
      patternChoser(pattern[0], (c = { one: palette[0], two: palette[1] }));
      pop();

      push();
      translate(0, 0);
      patternChoser(pattern[1], (c = { one: palette[1], two: palette[0] }));
      pop();
      break;

    case 2:
      push();
      translate(0, 0);
      rotate(180);
      patternChoser(pattern[0], (c = { one: palette[0], two: palette[1] }));
      pop();

      push();
      translate(0, offset);
      rotate(180);
      patternChoser(pattern[1], (c = { one: palette[1], two: palette[0] }));
      pop();
      break;

    case 3:
      push();
      translate(0, -offset);
      patternChoser(pattern[0], (c = { one: palette[0], two: palette[1] }));
      pop();

      push();
      translate(0, offset);
      rotate(180);
      patternChoser(pattern[1], (c = { one: palette[1], two: palette[0] }));
      pop();

      break;

    case 4:
      push();
      translate(0, 0);
      rotate(180);
      patternChoser(pattern[0], (c = { one: palette[0], two: palette[1] }));
      pop();

      push();
      translate(0, 0);
      patternChoser(pattern[1], (c = { one: palette[1], two: palette[0] }));
      pop();
      break;

    case 5:
      push();
      rotate(90);
      patternChoser(pattern[0], (c = { one: palette[0], two: palette[1] }));
      pop();

      push();
      translate(offset, 0);
      rotate(90);
      patternChoser(pattern[1], (c = { one: palette[1], two: palette[0] }));
      pop();

      break;

    case 6:
      push();
      translate(-offset, 0);
      rotate(-90);
      patternChoser(pattern[0], (c = { one: palette[0], two: palette[1] }));
      pop();

      push();
      rotate(-90);
      patternChoser(pattern[1], (c = { one: palette[1], two: palette[0] }));
      pop();
      break;

    case 7:
      push();
      rotate(90);
      patternChoser(pattern[0], (c = { one: palette[0], two: palette[1] }));
      pop();

      push();
      rotate(-90);
      patternChoser(pattern[1], (c = { one: palette[1], two: palette[0] }));
      pop();

      break;

    default:
      push();
      translate(-offset, 0);
      rotate(-90);
      patternChoser(pattern[0], (c = { one: palette[0], two: palette[1] }));
      pop();

      push();
      translate(offset, 0);
      rotate(90);
      patternChoser(pattern[1], (c = { one: palette[1], two: palette[0] }));
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

window.$fxhashFeatures = {
  "Shape rule": shapeRule,
  "Color rule": colorRule,
  "Pattern rule": patternRule,
};

function setDimensions() {
  // This is how we constrain the canvas to the smallest dimension of the window
  h = w = referenceSize; // min(windowWidth, windowHeight);

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
  return ceil(size);
}

const patternChoser = (pattern, col) => {
  const size = goldenCell;
  let n = 2.5;
  let a = size / 2 - (border ? spaceUnit / 4 : 0);
  let b = size / 2 - (border ? spaceUnit / 4 : 0);
  switch (pattern) {
    case 1:
      fill(col.one);
      noStroke();
      beginShape();
      for (let t = 0; t <= 180; t += 5) {
        let x = pow(abs(cos(t)), 2 / n) * a * sgn(cos(t));
        let y = pow(abs(sin(t)), 2 / n) * b * sgn(sin(t));
        vertex(x, y);
      }
      endShape(CLOSE);
      break;

    case 2:
      fill(col.one);
      noStroke();
      beginShape();
      for (let t = 0; t <= 180; t += 5) {
        let x = pow(abs(cos(t)), 2 / n) * a * sgn(cos(t));
        let y = pow(abs(sin(t)), 2 / n) * b * sgn(sin(t));
        vertex(x, y);
      }
      endShape(CLOSE);

      a = a / golden;
      b = b / golden;

      fill(col.two);
      noStroke();
      beginShape();
      for (let t = 0; t <= 180; t += 5) {
        let x = pow(abs(cos(t)), 2 / n) * a * sgn(cos(t));
        let y = pow(abs(sin(t)), 2 / n) * b * sgn(sin(t));
        vertex(x, y);
      }
      endShape(CLOSE);
      break;

    case 3:
      fill(col.one);
      noStroke();
      beginShape();
      for (let t = 0; t <= 180; t += 5) {
        let x = pow(abs(cos(t)), 2 / n) * a * sgn(cos(t));
        let y = pow(abs(sin(t)), 2 / n) * b * sgn(sin(t));
        vertex(x, y);
      }
      endShape(CLOSE);

      a = a / golden;
      b = b / golden;

      fill(col.two);
      noStroke();
      beginShape();
      for (let t = 0; t <= 180; t += 5) {
        let x = pow(abs(cos(t)), 2 / n) * a * sgn(cos(t));
        let y = pow(abs(sin(t)), 2 / n) * b * sgn(sin(t));
        vertex(x, y);
      }
      endShape(CLOSE);

      a = a * smallGold;
      b = b * smallGold;

      fill(col.one);
      noStroke();
      //strokeWeight(1.5 * spaceUnit);
      beginShape();
      for (let t = 0; t <= 180; t += 5) {
        let x = pow(abs(cos(t)), 2 / n) * a * sgn(cos(t));
        let y = pow(abs(sin(t)), 2 / n) * b * sgn(sin(t));
        vertex(x, y);
      }
      endShape(CLOSE);
      break;

    default:
      push();
      noStroke();
      fill(bg);
      beginShape();
      for (let t = 0; t <= 180; t += 5) {
        let x = pow(abs(cos(t)), 2 / n) * a * sgn(cos(t));
        let y = pow(abs(sin(t)), 2 / n) * b * sgn(sin(t));
        vertex(x, y);
      }
      endShape(CLOSE);
      drawingContext.clip();
      setGradient(
        -size / 2 + (border ? spaceUnit / 2 : 0),
        0,
        size - (border ? spaceUnit : 0),
        size / 2 - (border ? spaceUnit / 4 : 0),
        col,
        Y_AXIS
      );

      pop();
      break;
  }
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

function patternBuilder(x, y) {
  if (patternRule === "uniform") {
    return [patternPool[0], patternPool[0]];
  } else if (patternRule === "double") {
    let pick = floor(fxrand() * patternPool.length);
    return [pick, pick];
  } else if (patternRule === "pair") {
    if ((x % 2 == 0 && y % 2 == 0) || (x % 2 != 0 && y % 2 != 0)) {
      return [patternPool[0], patternPool[1]];
    } else {
      return [patternPool[2], patternPool[3]];
    }
  } else {
    return [
      patternPool[floor(fxrand() * patternPool.length)],
      patternPool[floor(fxrand() * patternPool.length)],
    ];
  }
}

function setGradient(x, y, w, h, col, axis) {
  noFill();
  push();
  col.bg = [...col.one];
  if (border) col.bg[1] = 30;
  col.bg[2] = border ? 95 : 20;

  // Define colors
  c1 = color(col.one);
  c2 = color(col.bg);

  if (axis === Y_AXIS) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  }
  pop();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(fxrand() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
