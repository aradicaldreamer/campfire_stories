// Required Libraries
var Jquery = require('jquery'); // adding jquery as needed by Tracery
var tracery = require('tracery-grammar'); // import Tracery for tacery generative text tests;
var P5 = require('p5'); // Adding p5.js libraries for Processing;
require('rita');
require('p5/lib/addons/p5.sound.js');
require('p5/lib/addons/p5.dom.js');


// Required Local Libraries

// Global Variables

// Data Functions

// Tracery code

var initialVariables = require('./grammars/story.js');

// Processing Code
// A note on Processing in nodeJS: I haven't found a way to naturally integrate processing into nodeJS
// Currently, I'm instantiating a P5 construction and calling the code declared below. It's messy, but it works
// This makes it much more difficult to actually write the code, and limits my ability to bring in functions from separate files
// I'll do my best to organize functions by task to keep this as clean as possible until (and if) I find a better solution

function processingCode(p) {

    grammar = tracery.createGrammar(initialVariables);
    var hero = grammar.flatten("#names#");
    grammar.pushRules("hero", [hero]);
    var traceryText = grammar.flatten("#story#");
    var rs = traceryText + " Who did they meet?";
    var wholeStory = traceryText;
    var bg = "#676969";
    var scene = "titleScreen";
    var input;

    // code for making image display properly


    p.preload = function () {
      f = p.loadFont("assets/Arial.ttf");
      campfire = p.loadImage("assets/campfire_HD.png");
      campfire_title_landscape = p.loadImage("assets/campfire_title_screen.png");
    }
    
    p.setup = function () {
      var canvas = p.createCanvas(p.windowWidth, p.windowHeight);
      canvas.parent("game");
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
        // p.image(campfire,0,p.windowHeight,p.windowWidth, p.windowHeight);
        p.push();
          p.translate(0,p.windowHeight);
          drawImageToBottomOrFit(campfire);
        p.pop();
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
        // p.image(campfire,0,p.windowHeight,p.windowWidth, p.windowHeight);
      p.push();
        p.translate(0,p.windowHeight);
        drawImageToBottomOrFit(campfire);
      p.pop();
      p.fill(255);
      p.textSize(32);
      p.textAlign(p.CENTER);
      p.text(wholeStory,0,0,p.windowWidth-50,p.windowHeight - 100);
      // p.background(bg);
      // //p.image(campfire,0,p.windowHeight,p.windowWidth, p.windowHeight);

      // p.fill(255);
      // p.textSize(32);
      // p.textAlign(p.CENTER);
      // p.text(wholeStory,0,0,p.windowWidth-50,p.windowHeight - 100);
      p.saveCanvas("myCampfireStory", "png");
      feedbackAlert();
    }

    // This function is used to collect user feedback
    function feedbackAlert () {
      var answer = confirm ("I hope you've enjoyed playing Campfire Tales! I'd love your feedback to make the game better. Please click OK to fill out the form or cancel to play again")
      if (answer) {
        window.location="https://goo.gl/forms/tgbSIIfrgRSOEBx23";
      }
      else {
        location.reload();
      }
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

    var portraitBorder = function () {
      if (p.windowWidth < p.windowHeight){
        p.push();
          p.translate(0,p.windowHeight * .65);
          p.fill(60,62,63);
          p.noStroke();
          p.rect(0,0,p.windowWidth,p.windowHeight);
        p.pop();
      }
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
      drawImageToBottomOrFit(campfire_title_landscape);
      portraitBorder();
    }

  }

  new P5(processingCode);
