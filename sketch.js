let renderButton;

var imagelist = [];

var intensifySlider;
var intensify = 0;

var colorQuality = 100;
var palette = [];
var minHeat = 0;
var minHeatSlider;
var maxHeat = 100;
var maxHeatSlider;

var res = 10;
var resSlider;

var imgIndex = 0;
var imgIndexSlider;

function preload() {
  var img1 = loadImage("imagesfolder/man.jpg");
  var img2 = loadImage("imagesfolder/miata.jpg");
  var img3 = loadImage("imagesfolder/nightcar.jpg");
  var img4 = loadImage("imagesfolder/skeleton.jpg");
  var img5 = loadImage("imagesfolder/skeletonfire.jpg");
  var img6 = loadImage("imagesfolder/starperhaps.jpg");
  var img7 = loadImage("imagesfolder/supra.jpg");
  var img8 = loadImage("imagesfolder/wheels.jpg");
  imagelist = [img1, img2, img3, img4, img5, img6, img7, img8];
}

function setup() {
  createCanvas(200, 200);
  pixelDensity(1);
  makeInterface();
  createPalette();
  //background(0,255,0);
  image(imagelist[imgIndex], 0, 0, width, height);
  noLoop();
}

function draw() {}


function doThermal() {
  background(255,0,0);
  res = resSlider.value();
  imgIndex = imgIndexSlider.value();
  intensify = intensifySlider.value();
  let intensifyFLOAT = intensify / 100.0;
  minHeat = minHeatSlider.value();
  maxHeat = maxHeatSlider.value();
  createPalette();
  image(imagelist[imgIndex], 0, 0, width, height);
  
  loadPixels();
  for (let y = 0; y < height; y += res) {
    for (let x = 0; x < width; x += res) {
      //get pixel color
      let colortemp = color(get(x, y));
      //make it grayscale (not accurate)
      let graytemp = (red(colortemp) + green(colortemp) + blue(colortemp)) / 3;
      //map color range to colorQuality --lenght of the palette[]-- and
      //get the thermal color based on grayscaled pixel value
      let paletteIndex = int(map(graytemp, 0, 255, 0, colorQuality));
      let processedColor = lerpColor(
        colortemp,
        palette[paletteIndex],
        intensifyFLOAT
      );

      for (let i = 0; i < res; i++) {
        //resolution respect assigning colors
        for (let j = 0; j < res; j++) {
          set(x + i, y + j, processedColor);
        }
      }
    }
  }
  updatePixels();
}

function createPalette() {
  //one time computing
  let heatValue = 0.0;
  let low = color(0, 255, 0); //init
  let high = color(0, 255, 0); //init
  let lerpVal = 0;

  let col = [
    [color(0, 0, 0), map(0.0, 0, 1, minHeat, maxHeat)],
    [color(52, 0, 137), map(0.1, 0, 1, minHeat, maxHeat)],
    [color(188, 3, 142), map(0.35, 0, 1, minHeat, maxHeat)],
    [color(235, 79, 10), map(0.6, 0, 1, minHeat, maxHeat)],
    [color(251, 184, 0), map(0.9, 0, 1, minHeat, maxHeat)],
    [color(255, 255, 255), map(1, 0, 1, minHeat, maxHeat)],
  ];

  let colLength = col.length;
  let heatValueINT;

  for (var i = 0; i < colorQuality + 1; i++) {
    heatValueINT = heatValue * 100;
    for (var j = 1; j < colLength; j++) {
      if (col[j][1] > heatValueINT) {
        low = col[j - 1][0];
        high = col[j][0];
        lerpVal = map(heatValueINT, col[j - 1][1], col[j][1], 0, 1);
        j = colLength;
      }
    }

    palette[i] = lerpColor(low, high, lerpVal);
    heatValue = float(i) / colorQuality;
  }
  print(palette);
}

function makeInterface() {
  //one time computing
  //Sliders and texts
  var x = 10;
  var y = height + 10;
  var xoff = 0;
  var yoff = 10;
  var margin = 25;

  renderButton = createButton("Render");
  renderButton.position(x, y + yoff);
  renderButton.style("width", "260px");
  renderButton.mousePressed(doThermal);
  //xoff += margin;
  yoff += margin;
  
  
  imgIndexSlider = createSlider(0, 7, 0); //image index
  imgIndexSlider.position(x + xoff, y + yoff);
  imgIndexSlider.style("width", "260px");
  var msgimgIndex = createP("change image");
  msgimgIndex.style("color", "#9b9b9b");
  msgimgIndex.position(260 + 20, y + yoff - 13);
  //xoff += margin;
  yoff += margin;

  resSlider = createSlider(1, 20, 10); //resolution
  resSlider.position(x + xoff, y + yoff);
  resSlider.style("width", "260px");
  var msgres = createP("resolution (1,20)");
  msgres.style("color", "#9b9b9b");
  msgres.position(260 + 20, y + yoff - 13);
  //xoff += margin;
  yoff += margin;

  intensifySlider = createSlider(0, 100, 0); //intensify
  intensifySlider.position(x + xoff, y + yoff);
  intensifySlider.style("width", "260px");
  var msgintensify = createP("Intensify (0,100)");
  msgintensify.style("color", "#9b9b9b");
  msgintensify.position(260 + 20, y + yoff - 13);
  //xoff += margin;
  yoff += margin;

  minHeatSlider = createSlider(0, 100, 0); //minHeat
  minHeatSlider.position(x + xoff, y + yoff);
  minHeatSlider.style("width", "260px");
  var msgminHeat = createP("minHeat (0,100)");
  msgminHeat.style("color", "#9b9b9b");
  msgminHeat.position(260 + 20, y + yoff - 13);
  //xoff += margin;
  yoff += margin;

  maxHeatSlider = createSlider(0, 100, 100); //maxHeat
  maxHeatSlider.position(x + xoff, y + yoff);
  maxHeatSlider.style("width", "260px");
  var msgmaxHeat = createP("maxHeat (0,100)");
  msgmaxHeat.style("color", "#9b9b9b");
  msgmaxHeat.position(260 + 20, y + yoff - 13);
  //xoff += margin;
  yoff += margin;

  /*
  TEMPLATE
  Slider = createSlider(0, 100, 0); //desc
  Slider.position(x + xoff, y + yoff);
  Slider.style("width", "260px");
  var msg = createP("text text");
  msg.style("color", "#9b9b9b");
  msg.position(260 + 20, y + yoff - 13);
  //xoff += margin;
  yoff += margin;
  */
}
