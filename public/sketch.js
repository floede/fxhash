let w, h, bgColor, border;
const aspect = 16 / 9;
const grid = [];
const listHexSizes = [1, 2, 3, 4, 6, 9, 18];
const noOfHex = listHexSizes[Math.floor(fxrand() * listHexSizes.length)];

const margin = false;

let HexSize, HexSide, padding;

let palettePick;

function setup(params) {
  w = 1000;
  h = w * aspect;

  //wh = min(aspect * windowWidth, windowHeight);
  //h = min(1000 * aspect, wh);
  //w = h / aspect;

  pixelDensity(1);
  c = createCanvas(w, h);

  border = ceil(w / 20);
  HexSize = ceil((w - 2 * border) / noOfHex);
  HexSide = Math.ceil(HexSize / Math.sqrt(3));

  console.log("SIDE:", HexSide, HexSize);

  let horizontalHexes = Math.floor(h / HexSize);
  padding =
    horizontalHexes === 1
      ? ceil(h / 2 - HexSize)
      : ceil(0.5 * (h - horizontalHexes * HexSize));

  /*   console.table({
    "Hoz hexes": horizontalHexes,
    "Hex size:": HexSize,
    "Hex side": HexSide,
    Padding: padding,
  }); */

  colorMode(HSB);
  palettePick = Math.floor(colors.length * fxrand());
  bgColor = colors[palettePick][0].hsb;
  background(bgColor);
  //noStroke();
  strokeWeight((0.5 * border) / noOfHex);
  stroke(bgColor);
  for (let j = 0; j < 1 + h / HexSize; j++) {
    let row = [];
    for (let index = 0; index <= noOfHex; index++) {
      if (j % 2 === 0) {
        row[index] = [border + index * HexSize, j * HexSize];
      } else {
        row[index] = [border + 0.5 * HexSize + index * HexSize, j * HexSize];
      }
    }
    grid[j] = row;
  }
}

function draw(params) {
  //translate(-width / 2, -height / 2);
  for (let j = 0; j < grid.length; j++) {
    for (let index = 0; index < grid[j].length; index++) {
      let x = grid[j][index][0];
      let y = padding + grid[j][index][1];
      if (noOfHex != 1) {
        if ((margin && j === 0) || (margin && j === grid.length - 1)) {
          break;
        }
      }
      if (noOfHex === 1 && j === 1 && index === 1) {
        break;
      }
      push();
      translate(ceil(x), ceil(y));
      let rot = map(y, 0, h, 0, 0.25);
      rotate(30 * (PI / 180));
      drawHalfHex(0, 0, HexSide, pickColorScheme(), x);
      rotate(PI + rot);
      drawHalfHex(0, 0, HexSide, pickColorScheme(), x);
      rotate(PI + rot);
      drawHalfHex(0, 0, HexSide * 0.75, pickColorScheme(), x);
      rotate(PI + rot);
      drawHalfHex(0, 0, HexSide * 0.75, pickColorScheme(), x);
      rotate(PI + rot);
      drawHalfHex(0, 0, HexSide * 0.5, pickColorScheme(), x);
      rotate(PI + rot);
      drawHalfHex(0, 0, HexSide * 0.5, pickColorScheme(), x);
      pop();
    }
  }

  strokeWeight(2 * border + 2);
  stroke(bgColor);
  noFill();
  rect(0, 0, width, height);
  /*   strokeWeight(3);
  stroke(20);
  rect(20, 20, width - 40, height - 40);
  stroke(100);
  strokeWeight(2);
  line(0, height / 2, width, height / 2);
  line(0, HexSize / 2, width, HexSize / 2);
  line(0, height - HexSize / 2, width, height - HexSize / 2);
  line(border, 0, border, height);
  line(width - border, 0, width - border, height);
  line(0, border, width, border);
  line(0, height - border, width, height - border);
  */
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
  let gs = ceil(0.5 * len);
  if (col.length === 1) {
    let hue = map(realX, 0, w, 0, 360);
    fill(hue, 40 + len - 20 * fxrand(), 100 - 20 * fxrand());
  } else {
    let bright = map(realX, 0, w, 0, 100);
    fill(col[0], col[1], col[2] + bright);
  }
  beginShape();
  vertex(x - gs, y - sqrt(3) * gs);
  vertex(x + gs, y - sqrt(3) * gs);
  vertex(x + 2 * gs, y);
  vertex(x + gs, y + sqrt(3) * gs);
  endShape(CLOSE);
}
