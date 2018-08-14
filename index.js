// Required Libraries
var Jquery = require('jquery'); // adding jquery as needed by Tracery
var tracery = require('tracery-grammar'); // import Tracery for tacery generative text tests;
var P5 = require('p5'); // Adding p5.js libraries for Processing;
require('rita');
require('p5/lib/addons/p5.sound.js');
require('p5/lib/addons/p5.dom.js');


// Data Functions

// Tracery code

var initialVariables = require('./grammars/story.js');

// Processing Code

var input;



function processingCode(p) {

    grammar = tracery.createGrammar(initialVariables);
    var hero = grammar.flatten("#names#");
    grammar.pushRules("hero", [hero]);
    var traceryText = grammar.flatten("#story#");
    var rs = traceryText + " Who did they meet?";
    var wholeStory = traceryText;
    var bg = "#676969";
    var r;
    var message = "Campfire Tales - Click to Play";
    var scene = "titleScreen";

    // code for making image display properly
    var gap = p.windowHeight - p.windowWidth;


    p.preload = function () {
      f = p.loadFont("assets/Arial.ttf");
      campfire = p.loadImage("assets/campfire_background.png");
      campfire_title_landscape = p.loadImage("assets/campfire_title_screen.png");
    }
    
    p.setup = function () {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.textFont(f);
      p.textSize(60);
      p.textAlign(p.CENTER);
      p.smooth();
    }

    p.update = function () {

    }

    p.draw = function () {
      if (scene === "titleScreen"){
        drawTitle();
      }
      else if (scene === "final") {
        p.background(bg);
        p.image(campfire,0,p.windowHeight,p.windowWidth, p.windowHeight);
        p.fill(255);
        p.textSize(32);
        p.textAlign(p.CENTER);
        p.text(wholeStory,0,0,p.windowWidth-50,p.windowHeight - 100);
      }
      else {
        p.background(0);
        p.fill(255);
        p.textSize(32);
        p.textAlign(p.CENTER);
        p.text(rs,0,0,p.windowWidth-50,p.windowHeight - 100);
      }
    }

    p.windowResized = function () {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    }

    p.mouseClicked = function () {
      if (scene === "titleScreen") {
        userInput();
        scene = 1;
      }
    }

    p.touchEnded = function () {
      if (scene === "titleScreen") {
        userInput();
        scene = 1;
      }
    }

    // This function should allow the user to save their entire story for sharing
    function saveStoryButton () {
      button = p.createButton("Save Story?");
      button.position(p.windowWidth / 2 - 50, p.windowHeight / 2);
      // button.style("position", "absolute");
      // button.style("bottom", "100px");
      // button.style("left", "200px");
      button.style("background-color", "#fff");
      button.size(100, 100);
      button.mousePressed(saveStory);
      button.touchEnded(saveStory);
    }

    function saveStory () {
      scene = "final";
      button.hide();
      clearCanvas();
      p.resizeCanvas(p.windowWidth, p.windowHeight * 2);
      p.background(bg);
      p.image(campfire,0,p.windowHeight,p.windowWidth, p.windowHeight);
      p.fill(255);
      p.textSize(32);
      p.textAlign(p.CENTER);
      p.text(wholeStory,0,0,p.windowWidth-50,p.windowHeight - 100);
      p.saveCanvas("myCampfireStory", "png");
    }

    // This function is intended to collect user input at various points during the story
    function userInput () {
      input = p.createInput();
      // input.position(50, p.height - 100);
      input.size(p.windowWidth - 32);
      input.style("position", "absolute");
      input.style("bottom", "16px");
      input.style("left", "16px");
      // input.style("right", "16px");
      input.style("background-color", "#000000");
      input.style("color", "white");
      input.style("border-color", "white");
      input.style("font-size", "2em");
      input.changed(newStoryElement);
    }

    function newStoryElement () {
      // Removing all special characters from input
      //rs = "This is a story about when " + characterName.text() + " met " + grammar.flatten("#friendName#");
      if (scene === 1) {
        var val = input.value();
        val = val.replace(/[#\[\]]/g, '');
        grammar.pushRules("friendName", [val]);
        input.value('');
        rs = grammar.flatten("#sceneTwo#");
        wholeStory = wholeStory + "\n" + rs;
        rs = rs + " Where did they go?";
        scene = 2;
      } else if (scene === 2) {
        var val = input.value();
        val = val.replace(/[#\[\]]/g, '');
        grammar.pushRules("location", [val]);
        input.value('');
        input.hide();
        rs = grammar.flatten("#sceneThree#");
        wholeStory = wholeStory + "\n" + rs;
        saveStoryButton();
        scene = 3;
      }

    }

    function clearCanvas () {
      p.rect(0,0, p.windowWidth, p.windowHeight);
    }

    function drawImageToBottomOrFit (imageToDraw) {
      var isLandscape = p.windowWidth > p.windowHeight
      // if (isLandscape) {
      //   var gap = (p.windowHeight - p.windowWidth) * 0.40
      // } else {
      //   var gap = p.windowHeight - p.windowWidth 
      // }
      var aspect = imageToDraw.height / imageToDraw.width
      var width = p.windowWidth
      var height = width * aspect
      var gap = (p.windowHeight - height) * 0.5
      // if (isLandscape) {
        
      // } else {
      //   var gap = p.windowHeight - height 
      // }
      
      p.image(imageToDraw, 0, gap, width, height);
    }

    function drawTitle () {
      p.background(bg);
      // p.image(campfire,0,,p.windowWidth, p.windowWidth);
      drawImageToBottomOrFit(campfire_title_landscape);
      // r = p.windowHeight * .4;
      // // Start in the center and draw the circle
      // p.translate(p.width / 2, p.height / 2);
      // p.noFill();
      // p.noStroke();
      // p.ellipse(0, 0, r*2, r*2);
      // p.stroke(255);

      // // We must keep track of our position along the curve
      // var arclength = 0.0;

      // // For every box
      // for (var i = 0; i < message.length; i++)
      // {
      //   // Instead of a constant width, we check the width of each character.
      //   var currentChar = message.charAt(i);
      //   var w = p.textWidth(currentChar);

      //   // Each box is centered so we move half the width
      //   arclength += w/2;
      //   // Angle in radians is the arclength divided by the radius
      //   // Starting on the left side of the circle by adding PI
      //   var theta = p.PI + arclength / r;    

      //   p.push();
      //   // Polar to cartesian coordinate conversion
      //   p.translate(r*p.cos(theta), r*p.sin(theta));
      //   // Rotate the box
      //   p.rotate(theta+p.PI/2); // rotation is offset by 90 degrees
      //   // Display the character
      //   p.fill(255);
      //   p.text(currentChar,0,0);
      //   p.pop();
      //   // Move halfway again
      //   arclength += w/2;
      // }
    }

  }

  new P5(processingCode);
