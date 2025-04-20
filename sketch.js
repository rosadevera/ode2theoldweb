let c1, c2;
let picker1, picker2;
let img = null;
let pixelationLevel = 3;
let imgWidth = 300;
let imgHeight = 300;
let imageCanvas;
let imgX = 0;
let imgY = 0;
let currentMaskType = 'none'; 
let textSettings = {
  content: "",
  size: 24,
  color: "#000000",
  font: "Comic Sans MS, cursive",
  hasShadow: false,
  shadowColor: "#000000",
  shadowBlur: 5,
  x: 100,
  y: 100
};
let pinyonScriptFont; 

 
function preload() {
    ellipseMaskImg = loadImage('./media/ellipse-mask.png');
    heartMaskImg = loadImage('./media/heart-mask.png');
    pinyonScriptFont = loadFont('PinyonScript-Regular.ttf');
}

const sparklePalette = ["#FFFFFF", "#F8EE91", "#f594c9"];
let sparkles = [];
let sparkleSettings = {
  amount: 8,
  maxSize: 0.3,
  minSize: 0.08,
  speed: 0.08,
  opacity: 50
};

function setup() {
    // Main canvas
    const container = document.getElementById('preview-canvas');
    const mainCanvas = createCanvas(container.clientWidth, container.clientHeight);
    mainCanvas.parent('preview-canvas');
    
    // Image canvas
    imageCanvas = createGraphics(width, height);
    imageCanvas.pixelDensity(1);
    
    // Color pickers
    picker1 = createColorPicker('#FFFFFF');
    picker2 = createColorPicker('#ff87c3');
    picker1.position(0, 0);
    picker2.position(0, 40);
    picker1.parent('color-picker-container');
    picker2.parent('color-picker-container');

    // Image upload
    document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
    
    // Image sliders
    document.getElementById('pixelSlider').addEventListener('input', updatePixelation);
    document.getElementById('widthSlider').addEventListener('input', updateImageSize);
    document.getElementById('heightSlider').addEventListener('input', updateImageSize);
    document.getElementById('xPosSlider').addEventListener('input', updateImagePosition);
    document.getElementById('yPosSlider').addEventListener('input', updateImagePosition);

    document.getElementById('maskType').addEventListener('change', function() {
      currentMaskType = this.value;
      if (img) drawPixelatedImage();
  });


    // Sparkle sliders (using HTML input elements)
    document.getElementById('sparkleAmount').addEventListener('input', function() {
        sparkleSettings.amount = parseInt(this.value);
        createSparkles();
    });
    
    document.getElementById('sparkleMax').addEventListener('input', function() {
        sparkleSettings.maxSize = parseInt(this.value) / 100;
        updateExistingSparkles();
    });
    
    document.getElementById('sparkleMin').addEventListener('input', function() {
        sparkleSettings.minSize = parseInt(this.value) / 100;
        updateExistingSparkles();
    });
    
    document.getElementById('sparkleSpeed').addEventListener('input', function() {
        sparkleSettings.speed = parseInt(this.value) / 100;
        updateExistingSparkles();
    });
    
    document.getElementById('sparkleOpacity').addEventListener('input', function() {
      sparkleSettings.opacity = parseInt(this.value); // Now uses 0-255 range
  });
    
    createSparkles();

    // Text controls
    document.getElementById('customText').addEventListener('input', function() {
      textSettings.content = this.value;
  });
  
  document.getElementById('textSizeSlider').addEventListener('input', function() {
      textSettings.size = parseInt(this.value);
      document.getElementById('textSizeValue').textContent = this.value;
  });
  
  document.getElementById('textColorPicker').addEventListener('input', function() {
      textSettings.color = this.value;
  });
  
  document.getElementById('fontFamilySelect').addEventListener('change', function() {
      textSettings.font = this.value;
  });
  
  document.getElementById('shadowCheckbox').addEventListener('change', function() {
      textSettings.hasShadow = this.checked;
      document.getElementById('shadowColorPicker').disabled = !this.checked;
      document.getElementById('shadowBlurSlider').disabled = !this.checked;
  });
  
  document.getElementById('shadowColorPicker').addEventListener('input', function() {
      textSettings.shadowColor = this.value;
  });
  
  document.getElementById('shadowBlurSlider').addEventListener('input', function() {
      textSettings.shadowBlur = parseInt(this.value);
  });

  document.getElementById('textXSlider').addEventListener('input', function() {
    textSettings.x = parseInt(this.value);
    document.getElementById('textXValue').textContent = this.value;
});

document.getElementById('textYSlider').addEventListener('input', function() {
    textSettings.y = parseInt(this.value);
    document.getElementById('textYValue').textContent = this.value;
});

const saveButton = select('#save');
  saveButton.mousePressed(() => {
    saveCanvas('myCanvas', 'png');
  });

}

function updateExistingSparkles() {
    for (let sparkle of sparkles) {
        sparkle.baseSize = random(sparkleSettings.minSize, sparkleSettings.maxSize);
        sparkle.speed = sparkleSettings.speed;
    }
}

function draw() {
    // Clear with slight fade for sparkle trails
    background(0, 0, 0, 25);
    
    // Draw gradient background
    c1 = picker1.color();
    c2 = picker2.color();
    for(let y = 0; y < height; y++) {
        let inter = map(y, 0, height, 0, 1);
        let gradientColor = lerpColor(c1, c2, inter);
        stroke(gradientColor);
        line(0, y, width, y);
    }
    
    // Draw image
    if (img) image(imageCanvas, 0, 0);

    // Draw text
    if (textSettings.content) {
      push();
      textSize(textSettings.size);
      
      // Apply the selected font
      if (textSettings.font === "pinyon") {
          textFont(pinyonScriptFont); // Use the loaded TTF font
      } else {
          textFont(textSettings.font); // Use system fonts
      }
      
      fill(textSettings.color);
      
      if (textSettings.hasShadow) {
          drawingContext.shadowColor = textSettings.shadowColor;
          drawingContext.shadowBlur = textSettings.shadowBlur;
          drawingContext.shadowOffsetX = 2;
          drawingContext.shadowOffsetY = 2;
      } else {
          drawingContext.shadowColor = 'transparent';
      }
      
      text(textSettings.content, textSettings.x, textSettings.y);
      pop();
  }
    
    // Draw sparkles
    drawSparkles();
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            img = loadImage(event.target.result, () => {
                // Set initial dimensions to maintain aspect ratio
                const ratio = img.width / img.height;
                imgWidth = 300;
                imgHeight = imgWidth / ratio;
                
                // Update sliders
                document.getElementById('widthSlider').value = imgWidth;
                document.getElementById('heightSlider').value = imgHeight;
                
                // Draw the image immediately after loading
                drawPixelatedImage();
            });
        };
        reader.readAsDataURL(file);
    }
}

function drawPixelatedImage() {
  if (!img) return;
  
  // Clear the image canvas
  imageCanvas.clear();
  
  const xPos = imgX;
  const yPos = imgY;
  
  // Create a temporary buffer
  let tempBuffer = createGraphics(imgWidth, imgHeight);
  tempBuffer.pixelDensity(1);
  tempBuffer.image(img, 0, 0, imgWidth, imgHeight);
  tempBuffer.loadPixels();
  
  // Draw pixelated version with mask
  const blockSize = pixelationLevel;
  
  // Adjust heart proportions if needed
  const heartWidth = currentMaskType === 'heart' ? imgWidth * 0.9 : imgWidth;
  const heartHeight = currentMaskType === 'heart' ? imgHeight * 0.8 : imgHeight;
  const heartXOffset = currentMaskType === 'heart' ? (imgWidth - heartWidth)/2 : 0;
  const heartYOffset = currentMaskType === 'heart' ? (imgHeight - heartHeight)/2 : 0;
  
  for (let x = 0; x < imgWidth; x += blockSize) {
      for (let y = 0; y < imgHeight; y += blockSize) {
          // Only draw pixels that are within the mask
          if (currentMaskType === 'none' || 
              isInMask(x - heartXOffset, y - heartYOffset, heartWidth, heartHeight, currentMaskType)) {
              
              const i = (x + y * imgWidth) * 4;
              
              if (i + 3 < tempBuffer.pixels.length) {
                  let r = tempBuffer.pixels[i];
                  let g = tempBuffer.pixels[i + 1];
                  let b = tempBuffer.pixels[i + 2];
                  let a = tempBuffer.pixels[i + 3];
                  
                  imageCanvas.fill(r, g, b, a);
                  imageCanvas.noStroke();
                  imageCanvas.rect(xPos + x, yPos + y, blockSize, blockSize);
              }
          }
      }
  }
}

function isInMask(x, y, w, h, maskType) {
  if (maskType === 'none') return true;
  
  // Convert to centered coordinates (-1 to 1 range)
  const cx = (x/w) * 2 - 1;
  const cy = (y/h) * 2 - 1;
  
  if (maskType === 'ellipse') {
      return (cx*cx + cy*cy <= 1);
  }
  else if (maskType === 'heart') {
      const x2 = cx * cx;
      const y2 = cy * cy;
      const y3 = cy * cy * cy;
      
      return Math.pow(x2 + y2 - 1, 3) - x2 * y2 * (-cy) <= 0;
  }
  return true;
}

function loadMaskImage(e, type) {
  const file = e.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
          const img = loadImage(event.target.result, () => {
              if (type === 'ellipse') {
                  customEllipseMask = img;
              } else {
                  customHeartMask = img;
              }
              if (img) drawPixelatedImage();
          });
      };
      reader.readAsDataURL(file);
  }
}

function updateImageSize() {
  // Maintain aspect ratio if shift key is held
  const maintainRatio = keyIsDown(SHIFT);
  
  if (maintainRatio) {
      const ratio = img.width / img.height;
      if (this.id === 'widthSlider') {
          imgWidth = parseInt(this.value);
          imgHeight = Math.round(imgWidth / ratio);
          document.getElementById('heightSlider').value = imgHeight;
      } else {
          imgHeight = parseInt(this.value);
          imgWidth = Math.round(imgHeight * ratio);
          document.getElementById('widthSlider').value = imgWidth;
      }
  } else {
      imgWidth = parseInt(document.getElementById('widthSlider').value);
      imgHeight = parseInt(document.getElementById('heightSlider').value);
  }
  
  if (img) drawPixelatedImage();
}

function updatePixelation() {
    pixelationLevel = parseInt(this.value);
    if (img) drawPixelatedImage();
}

function updateImagePosition() {
  imgX = parseInt(document.getElementById('xPosSlider').value);
  imgY = parseInt(document.getElementById('yPosSlider').value);
  if (img) drawPixelatedImage(); // Redraw when sliders move
}

function createSparkles() {
  sparkles = [];
  for (let i = 0; i < sparkleSettings.amount; i++) {
    sparkles.push({
      x: random(width),
      y: random(height),
      size: random(sparkleSettings.minSize, sparkleSettings.maxSize),
      type: random(3) >= 1 ? "a" : "b",
      color: floor(random(sparklePalette.length)),
      offset: random(100),
      baseSize: random(sparkleSettings.minSize, sparkleSettings.maxSize),
      speed: sparkleSettings.speed
    });
  }
}

function drawSparkles() {
  for (let sparkle of sparkles) {
    const pulse = abs(sin(sparkle.offset + frameCount * sparkle.speed));
    const currentSize = pulse * sparkle.baseSize;
    
    if (currentSize < 0.01) {
      sparkle.x = random(width);
      sparkle.y = random(height);
      sparkle.baseSize = random(sparkleSettings.minSize, sparkleSettings.maxSize);
    }
    
    drawingContext.shadowBlur = pulse * 40;
    push();
    translate(sparkle.x, sparkle.y);
    scale(currentSize);
    
    const col = color(sparklePalette[sparkle.color]);
    col.setAlpha(sparkleSettings.opacity);
    fill(col);
    stroke(col);
    drawingContext.shadowColor = sparklePalette[sparkle.color];
    
    if (sparkle.type === "a") {
      strokeWeight(5);
      beginShape();
      vertex(0, -100);
      quadraticVertex(0, 0, 100, 0);
      quadraticVertex(0, 0, 0, 100);
      quadraticVertex(0, 0, -100, 0);
      quadraticVertex(0, 0, 0, -100);
      endShape(CLOSE);
    } else {
      strokeWeight(2);
      beginShape();
      vertex(0, -100);
      bezierVertex(0, 0, 0, 0, 100, 0);
      bezierVertex(0, 0, 0, 0, 0, 100);
      bezierVertex(0, 0, 0, 0, -100, 0);
      bezierVertex(0, 0, 0, 0, 0, -100);
      endShape(CLOSE);
    }
    pop();
  }
}