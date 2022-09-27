import "p5";
// Use random functions from stdio and not from p5
import { random, randomGaussian } from "@altesc/stdio";

window.setup = function () {
  createCanvas(400, 400);
  noLoop();
};

window.draw = function () {
  background(220);

  const count = randomGaussian("count", 20, 4, floor);
  const minSize = random("size/min", 10, 50, floor);
  const maxSize = random("size/max", 50, 100, floor);
  const drawShape = random("shape", {
    circle: (x, y, r) => circle(x, y, r),
    square: (x, y, len) => rect(x - len / 2, y - len / 2, len, len),
  });

  for (let i = 0; i < count; i++) {
    const x = random(width);
    const y = random(height);
    const s = random(minSize, maxSize);
    drawShape(x, y, s);
  }

  fxpreview();
};
