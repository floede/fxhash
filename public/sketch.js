let w, h, bgColor;
const aspect = 16 / 9;
const grid = [];
const listHexSizes = [1, 2, 4, 5, 10, 20];
const noOfHex = 5; // listHexSizes[Math.floor(fxrand() * listHexSizes.length)];

const margin = false;
const border = 50;

let HexSize, HexSide, padding;

let palettePick;

function setup(params) {
  //w = 1000;
  //h = w * aspect;

  h = min(aspect * windowWidth, windowHeight);
  w = h / aspect;

  c = createCanvas(w, h, WEBGL);

  HexSize = (w - 2 * border) / noOfHex;
  HexSide = Math.ceil(HexSize / Math.sqrt(3));

  let horizontalHexes = Math.floor(h / HexSize);
  padding =
    horizontalHexes === 1
      ? -(1 / 9) * HexSize
      : 0.5 * (h - horizontalHexes * HexSize);

  if (fxrand() < 0.5) {
    bgColor = 20;
  } else {
    bgColor = 240;
  }
  colorMode(HSB);
  palettePick = Math.floor(colors.length * fxrand());
  bgColor = colors[palettePick][0].hsb;
  background(bgColor);
  noStroke();
  for (let j = 0; j < h / HexSize; j++) {
    let row = [];
    for (let index = 0; index <= noOfHex; index++) {
      if (j % 2 === 0) {
        row[index] = [border + 0.5 * HexSize + index * HexSize, j * HexSize];
      } else {
        row[index] = [border + index * HexSize, j * HexSize];
      }
    }
    grid[j] = row;
  }
}

function draw(params) {
  translate(-width / 2, -height / 2);
  for (let j = 0; j < grid.length; j++) {
    for (let index = 0; index < grid[j].length; index++) {
      let x = grid[j][index][0];
      let y = padding + grid[j][index][1];
      if (noOfHex != 1) {
        if ((margin && j === 0) || (margin && j === grid.length - 1)) {
          break;
        }
      }
      push();
      translate(x, y);
      rotate(30 * (PI / 180));
      drawHalfHex(0, 0, HexSide, pickColorScheme(), x);
      rotate(PI);
      drawHalfHex(0, 0, HexSide, pickColorScheme(), x);
      rotate(PI);
      drawHalfHex(0, 0, HexSide * 0.75, pickColorScheme(), x);
      rotate(PI);
      drawHalfHex(0, 0, HexSide * 0.75, pickColorScheme(), x);
      rotate(PI);
      drawHalfHex(0, 0, HexSide * 0.5, pickColorScheme(), x);
      rotate(PI);
      drawHalfHex(0, 0, HexSide * 0.5, pickColorScheme(), x);
      pop();
    }
  }
  /*   
  strokeWeight(border);
  stroke(bgColor);
  noFill();
  rect(0, 0, width, height);
  strokeWeight(3);
  stroke(20);
  rect(20, 20, width - 40, height - 40); */
  stroke(100);
  strokeWeight(2);
  line(border, 0, border, height);
  line(width - border, 0, width - border, height);
  line(0, border, width, border);
  line(0, height - border, width, height - border);
  noLoop();
  fxpreview();
}

function pickColorScheme() {
  let colPick, color;
  colPick = colors[palettePick];
  color = colPick[Math.floor(colPick.length * fxrand())].hsb;
  return color;
}

function drawHalfHex(x, y, len, col, realX) {
  let gs = 0.5 * len;
  if (col.length === 1) {
    let hue = map(realX, 0, w, 0, 360);
    fill(hue, 40 + len - 20 * fxrand(), 100 - 20 * fxrand());
  } else {
    fill(col);
  }
  beginShape();
  vertex(x - gs, y - sqrt(3) * gs);
  vertex(x + gs, y - sqrt(3) * gs);
  vertex(x + 2 * gs, y);
  vertex(x + gs, y + sqrt(3) * gs);
  endShape(CLOSE);
}
