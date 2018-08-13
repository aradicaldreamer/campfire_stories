// Required Libraries
var Jquery = require('jquery'); // adding jquery as needed by Tracery
var tracery = require('tracery-grammar'); // import Tracery for tacery generative text tests;
var P5 = require('p5'); // Adding p5.js libraries for Processing;
require('rita');
require('p5/lib/addons/p5.sound.js');
require('p5/lib/addons/p5.dom.js');


// Data Functions

// Tracery code

// var initialVariables = {
//   start: "#[hero:#names#]story#",
//   names: ["Matthew", "Alex", "Ben", "Doruk", "Ece", "Hugh", "Jade", "Julia", "Phoenix", "Raymond", "Tommy"],
//   story: "This is a story about #hero# and when they met someone new. Who did they meet?",
//   sceneTwo: "#hero# met #friendName# on a bus. Where did they go?",
//   sceneThree: "#hero# and #friendName# went to #location#. They had so much fun!"
// }

var initialVariables = require('./grammars/story.js');

// function generateStory () {

//   grammar = tracery.createGrammar(initialVariables);
//   var traceryText = grammar.flatten("#start#");
//   var rs = RiString(traceryText);
//   return rs;
// }

// Processing Code

var input;

function processingCode(p) {

  // story.character[0] = 'cat'
  // story.character.push('cat')
    // console.log(p);
    // console.log(p.select);
    // console.log(p.getAudioContext);
    // console.log(lines.join('\n')); // testing to see if we have access to Improv Text in Processing
    // var improvText = lines.join('\n'); // taking Improv text and saving as a variable separated by new lines
    // var traceryText;
    // var rs;

    // var traceryText = grammar.flatten("#start#");
    // var rs = RiString(traceryText);

    grammar = tracery.createGrammar(initialVariables);
    var hero = grammar.flatten("#names#");
    grammar.pushRules("hero", [hero]);
    var traceryText = grammar.flatten("#story#");
    var rs = traceryText;

    var scene = 1;

    p.setup = function () {
      p.createCanvas(p.windowWidth, p.windowHeight);
        userInput();
    }

    p.update = function () {

    }

    p.draw = function () {
      p.background(0);
      p.fill(255);
      p.textSize(32);
      p.textAlign(p.CENTER);
      p.text(rs,0,0,p.windowWidth-50,p.windowHeight - 100);
    }

    p.windowResized = function () {
      resizeCanvas(p.windowWidth, p.windowHeight);
    }

    // This function is intended to collect user input at various points during the story
    function userInput () {
      input = p.createInput();
      input.position(50, p.height - 100);
      input.size(p.width - 100, 50);
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
        scene = 2;
      } else if (scene === 2) {
        var val = input.value();
        val = val.replace(/[#\[\]]/g, '');
        grammar.pushRules("location", [val]);
        input.value('');
        rs = grammar.flatten("#sceneThree#")
        scene = 3;
      }

    }



  }

  new P5(processingCode);
