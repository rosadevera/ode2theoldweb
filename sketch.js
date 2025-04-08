let c1, c2;
let picker1, picker2;

function setup() {
  const container = document.getElementById('preview-canvas');
  const canvas = createCanvas(container.clientWidth, container.clientHeight);
  canvas.parent('preview-canvas');

  // Create two color pickers
  picker1 = createColorPicker('#FFFFFF');
  picker2 = createColorPicker('#ff87c3');
  
  picker1.position(0, 0);
  picker2.position(0, 40);
  
  // Parent them to the canvas container
  picker1.parent('color-picker-container');
  picker2.parent('color-picker-container');
}

function draw() {
  // Update colors from pickers
  c1 = picker1.color();
  c2 = picker2.color();
  
  // Draw gradient
  for(let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let gradientColor = lerpColor(c1, c2, inter);
    stroke(gradientColor);
    line(0, y, width, y);
  }
}

function windowResized() {
  const container = document.getElementById('preview-canvas');
  resizeCanvas(container.clientWidth, container.clientHeight);
}