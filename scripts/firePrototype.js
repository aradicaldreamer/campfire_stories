// Fire Effect Test 2

// Julien
// https://kampeki-factory.blogspot.com/2018/03/set-your-browser-on-fire-with-p5js.html

// Matthew Deline
// Converted from P5 to P5 in NodeJS

var P5 = require('p5'); // import p5 from p5.js
require('p5/lib/addons/p5.sound.js'); 

function processingEnvironment(p) {
    
    // our global parameters
    //
    var fireElemLenght  = 6;
    var elemOpacity     = 255;

    var fireLines   = [];
    var fireWidth   = 0;
    var fireHeight  = 0;

    var nbColors    = 255;  // Nb Colors in the palette
    var palette     = [];   // our color palette for the fire

    var buffer;             // Saves buffer to screen for use

    // ======================================
    // PRELOAD method 
    // testing audio
    // ======================================

    p.preload = function () {
        campfire = p.loadSound("campfire.wav"); // https://freesound.org/people/aerror/sounds/350757/
    }

    // ======================================
    // SETUP method 
    // called 1 time during the page loading
    // ======================================
    p.setup = function () {
    
    p.colorMode(p.RGB);
    p.createCanvas(800, 600);

    // Create buffer to display other graphics

    buffer = p.createGraphics(p.width,p.height);
    
    // Play Background Audio
    campfire.loop();
    
    // 2D Fire: init size of fire
    fireWidth   = p.int(buffer.width / fireElemLenght);
    fireHeight  = p.int(buffer.height / fireElemLenght);
    p.print(fireWidth + ", " + fireHeight);
    
    // for each fire's 'lines'
    for(var i= 0; i<fireHeight; i++)
    {
        fireLines[i] = [];      // create the new line of fire pixels
        
        for(var x=0; x<fireWidth; x++)
        fireLines[i][x] = 0;  // Initialize to black
    }
    
    // generate fire colors palette
    initializePalette();
    
    // set white background
    p.background(255);
    buffer.noStroke();
    }

    // ======================================
    // MOUSEPRESSED method 
    // for universal actions when the mous is
    // pressed
    // ======================================

    p.mousePressed = function () {
        if ( campfire.isPlaying() ) { // .isPlaying() returns a boolean
            campfire.pause(); // .play() will resume from .pause() position
        } else {
            campfire.play();
        }
    }

    // ======================================
    // DRAW method
    // called in the drawing process loop 
    // ======================================
    p.draw = function () {
    
        // We clean the background each time
        buffer.background(0,0,0);
    
        // We generate a new base fire line (to make it 'move')
        initFireLine();
    
        // Compute the whole fire pixels
        fireGrow();
    
        // Draw fire to buffer
        drawFire();

        // Display the result
        p.image(buffer, 0, 0);
    }

    // ======================================
    // > Initialize Palette mehtod
    // You can update this process to change the fire colors
    // ======================================
    function initializePalette()
    {
    // generate our 255 color palette
    // try to change colors composing the fire
    for(var i=0; i<nbColors; i++)
    {
        var val   = p.exp(i/10) - 1;

        var red   = p.map(val, 0, p.exp(7.5), 0, 255);
        var green = p.map(val, 0, p.exp(10), 0, 255);
        var blue  = p.random(50);
        
        if(green > 254) // check for colors range
        {
        red   = 255;
        green = 255;
        blue  = 255;
        }
        
        // check/erase for 'noisy' blue pixels
        if(red < 20 && green < 20)
        {
        red = green = blue = 0;
        }

        // add new color
        palette[i]  = p.color(red, green, blue, elemOpacity);
    }
    }


    // ======================================
    // > initFireLine() method
    // Make a new base fire line (randomly, to make the fire 'move' when it grows)
    // Remark: Y axis is inverter on our screens ==> baseY = fireHeight-1
    // ======================================
    function initFireLine()
    {
    // generate fire base (1st line) color ('randomly')
    for(var x=0; x<fireWidth; x++)
    {
        fireLines[fireHeight-1][x] = p.random(0,nbColors);
        fireLines[fireHeight-2][x] = p.random(0,nbColors);
        fireLines[fireHeight-3][x] = p.random(0,100);
    }
    }


    // ======================================
    // > fireGrow() method
    // Compute the whole fire, line by line. Start after the base line
    // We compute each pixel color from its neighbors (a kind of median)
    // It gives a blurry effect
    // ======================================
    function fireGrow(){
    
    // for each fire line
    for(var y=fireHeight-2; y>=1; y--)
    {

    // compute new fire color line 
    // based on the bottom & top lines
    for(var x=1; x<fireWidth-1; x++)
    {
        // Get neighbors colors
        var c1 = fireLines[y+1][x];
        var c2 = fireLines[y][x-1];
        var c3 = fireLines[y][x+1];
        var c4 = fireLines[y-1][x];
        var c5 = fireLines[y][x];

        // We make a 'median' color
        var newCol = p.int((c1 + c2 + c3 + c4 + c5) / 5) - 1;
        fireLines[y - 1][x] = newCol;
    }
    }
    }


    // ======================================
    // > drawFire() method
    // Drawing pass - to draw the fire from its computed matrix
    //
    // ======================================
    function drawFire(){

    // foreach fire lines
    for(var y=fireHeight-1; y>0; y--)
    {
        // foreach pixel in the line
        for(var x=0; x<fireWidth-1; x++)
        {
        // get current pixel color index
        var idx = p.int(fireLines[y][x]);

        // check for color index limits
        if(idx<0) idx = 0;
        if(idx >= nbColors) idx = nbColors-1;
        
        // apply current pixel color
        buffer.fill(palette[idx]); 

        // Draw a square representing the current fire's pixel
        buffer.rect(p.int(x * fireElemLenght - (fireElemLenght / 2)),
            p.int(y * fireElemLenght + (fireElemLenght / 2)),
            fireElemLenght * 2 , 
            fireElemLenght * 2);
        }

    }

    }

}

new P5(processingEnvironment);