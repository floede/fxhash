//const w = window.innerWidth; //1000;
//const h = window.innerHeight; //1000;

var w, h;

var wh = (w = h = Math.min(window.innerWidth, window.innerHeight));

function setup(params) {
  c = createCanvas(wh, wh);
  colorMode(HSB, 100);
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let col = [i * 10, j * 10, 100];
      let col2 = [i * 10 * fxrand(), j * 10 * fxrand(), 100];
      let sqr1 = new Square(0.1 * w * i, 0.1 * h * j, col);
      let sqr2 = new Square(0.05 * w + 0.1 * w * i, 0.1 * h * j, col2);
      sqr1.show();
      sqr2.show();
    }
  }
}

function draw(params) {
  noLoop();
  fxpreview();
}

class Square {
  constructor(x, y, col) {
    this.x = x;
    this.y = y;
    this.col = col;

    this.show = function () {
      fill(this.col);
      noStroke();
      rect(this.x, this.y, 0.05 * w, 0.1 * w);
    };
  }
}
