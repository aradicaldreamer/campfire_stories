// Required Libraries
var Jquery = require('jquery'); // adding jquery as needed by Tracery
var tracery = require('tracery-grammar'); // import Tracery for tacery generative text tests;
var P5 = require('p5'); // Adding p5.js libraries for Processing;
require('rita');
require('p5/lib/addons/p5.sound.js');
require('p5/lib/addons/p5.dom.js');

/*-------------------------------------------------------------------------------------------------------*/

// Required Local Libraries

/*-------------------------------------------------------------------------------------------------------*/

// Global Variables

/*-------------------------------------------------------------------------------------------------------*/

// Data Functions

/*-------------------------------------------------------------------------------------------------------*/

// RitaJS Code
// lexicon = new 

/*-------------------------------------------------------------------------------------------------------*/

// Tracery code

var story = require('./grammars/story.js');

/*-------------------------------------------------------------------------------------------------------*/

// Processing Code
// A note on Processing in nodeJS: I haven't found a way to naturally integrate processing into nodeJS
// Currently, I'm instantiating a P5 construction and calling the code declared below. It's messy, but it works
// This makes it much more difficult to actually write the code, and limits my ability to bring in functions from separate files
// I'll do my best to organize functions by task to keep this as clean as possible until (and if) I find a better solution

function processingCode(p) {

    // Global Initial Processing Variables  

    grammar = tracery.createGrammar(story); // creates a tracery grammar object from the default story JSON
    // var hero = grammar.selectRule("names"); // selects a name 
    // grammar.pushRules("hero", [hero]);
    populateGrammar(); // function to populate the grammar with words from the RitaJS lexicon
    var traceryText = grammar.flatten("#start#");
    var displayText = traceryText;
    var wholeStory = "This is what you answered!\n";
    var bg = "#676969"; // background color
    var scene = "titleScreen"; // sets the initial state to the title screen
    var input; // used to store user text input

    


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
      switch (scene) {
        case "titleScreen":
          drawTitle();
          break;

        case "final":
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
          break;

        default:
          p.background(0);
          p.fill(255);
          p.textSize(32);
          p.textAlign(p.CENTER);
          p.text(displayText,0,0,p.windowWidth-50,p.windowHeight - 100);
      }
    }
    
    /*-------------------------------------------------------------------------------------------------------*/

    // SETUP FUNCTIONS

    // This function populates the grammar with words from the RitaJS lexicon
    // Reference for part-of-speech tags https://rednoise.org/rita/reference/PennTags.html
    function populateGrammar () {
      for (var i = 0; i < 10; i++) {
        var adj = RiTa.randomWord('jj'); // generates adjectives for the story i.e dark
        grammar.pushRules("adj" + i, [adj]);
        var compAdj = RiTa.randomWord('jjr'); // generates comparative adjectives i.e pickier
        grammar.pushRules("compAdj" + i, [compAdj]);
        var superAdj = RiTa.randomWord('jjs'); // generates comparative adjectives i.e grandest
        grammar.pushRules("superAdj" + i, [superAdj]); 
        var modal = RiTa.randomWord('md'); // generates modal ie may, should, will
        grammar.pushRules("modal" + i,[modal]); 
        var noun = RiTa.randomWord('nn'); // generates nouns ie boxing, whiff
        grammar.pushRules("noun" + i,[noun]); 
        var adverb = RiTa.randomWord('rb'); // generates adverbs ie immeasurably, triumphantly
        grammar.pushRules("adverb" + i,[adverb]);
        var verb = RiTa.randomWord('vb'); // generates verbs ie arrive, perform
        grammar.pushRules("verb" + i,[verb]);
        var pastVerb = RiTa.randomWord('vbd'); // generates past tense verbs ie alerted, pulled
        grammar.pushRules("pastVerb" + i,[pastVerb]);
        var vbg = RiTa.randomWord('vbg'); // generates present participle verbs ie anticipating
        grammar.pushRules("vbg" + i,[vbg]);
        var vbd = RiTa.randomWord('vbd'); // generates past participle verbs ie gentrified
        grammar.pushRules("vbd" + i,[vbd]);
        var vbd = RiTa.randomWord('vbd'); // generates past participle verbs ie gentrified
        grammar.pushRules("vbd" + i,[vbd]);
      }
    }
/*-------------------------------------------------------------------------------------------------------*/
    
    // USER INTERACTIONS

    p.windowResized = function () {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    }

    p.mouseReleased = function () {
      sceneManager();
    }

    p.touchEnded = function () {
      sceneManager();
    }

/*-------------------------------------------------------------------------------------------------------*/
    // BUTTONS

    function sceneManager () {
      switch (scene) {
        case "titleScreen":
          scene = 0;
          touchToContinue();
          break;
        
        case 0:
          continueButton.hide();
          displayText = grammar.flatten("#question1#");
          userInput();
          scene = 1;
          break;

        case 6:
          displayText = grammar.flatten("#dreamSequence#");
          scene = 7;
          break;

        case 7:
          continueButton.hide();
          displayText = grammar.flatten("#beginning#");
          saveStoryButton();
          break;

        default:
      }
    }

    function touchToContinue () {
      continueButton = p.createButton("Continue");
      continueButton.size(p.windowWidth - 32);
      continueButton.style("position", "absolute");
      continueButton.style("bottom", "16px");
      continueButton.style("left", "16px");
      continueButton.style("background-color", "#000000");
      continueButton.style("color", "white");
      continueButton.style("border-color", "white");
      continueButton.style("font-size", "2em");
      // continueButton.mouseReleased(sceneManager);
      // continueButton.touchEnded(sceneManager);
    }

    function touchToRestart () {
      restartButton = p.createButton("Restart?");
      restartButton.size(p.windowWidth - 32);
      restartButton.style("position", "absolute");
      restartButton.style("bottom", "16px");
      restartButton.style("left", "16px");
      restartButton.style("background-color", "#000000");
      restartButton.style("color", "white");
      restartButton.style("border-color", "white");
      restartButton.style("font-size", "2em");
      restartButton.mousePressed(restartGame);
      restartButton.touchEnded(restartGame);
    }

    function restartGame () {
      location.reload();
    }


/*-------------------------------------------------------------------------------------------------------*/
    // TEXT INPUT

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
      switch (scene) {
              
        case 1:
          var val = input.value();
          textCheck(val);
          grammar.pushRules("answer1", [val]);
          input.value('');
          displayText = grammar.flatten("#question2#");
          wholeStory = wholeStory + "\n" + val;
          scene = 2;
          break;

        case 2: 
          var val = input.value();
          textCheck(val);
          grammar.pushRules("answer2", [val]);
          input.value('');
          displayText = grammar.flatten("#question3#");
          wholeStory = wholeStory + "\n" + val;
          scene = 3;
          break;

        case 3: 
          var val = input.value();
          textCheck(val);
          grammar.pushRules("answer3", [val]);
          input.value('');
          displayText = grammar.flatten("#question4#");
          wholeStory = wholeStory + "\n" + val;
          scene = 4;
          break;

        case 4: 
          var val = input.value();
          textCheck(val);
          grammar.pushRules("answer4", [val]);
          input.value('');
          displayText = grammar.flatten("#question5#");
          wholeStory = wholeStory + "\n" + val;
          scene = 5;
          break;

          case 5: 
          var val = input.value();
          textCheck(val);
          grammar.pushRules("answer5", [val]);
          input.value('');
          input.hide();
          displayText = grammar.flatten("#transition#");
          wholeStory = wholeStory + "\n" + val;
          touchToContinue();
          scene = 6;
          break;

        default:
      }
    }

    // For now, this just checks to make sure certain characters arent in the text. In the future, it may check for swear words to set a flag to deny sharing

    function textCheck (val) {
      val = val.replace(/[#\[\]]/g, '');
    }

    /*-------------------------------------------------------------------------------------------------------*/

    // SAVING AND SHARING

    // This function should allow the user to save their entire story for sharing
    function saveStoryButton () {
      saveButton = p.createButton("Save Story?");
      saveButton.size(p.windowWidth - 32);
      saveButton.style("position", "absolute");
      saveButton.style("bottom", "16px");
      saveButton.style("left", "16px");
      saveButton.style("background-color", "#000000");
      saveButton.style("color", "white");
      saveButton.style("border-color", "white");
      saveButton.style("font-size", "2em");
      saveButton.mousePressed(saveStory);
      // saveButton.touchEnded(saveStory);
    }

    function saveStory () {
      scene = "final";
      saveButton.hide();
      //clearCanvas();
      p.resizeCanvas(p.windowWidth, p.windowHeight * 2);
      p.background(bg);
      p.push();
        p.translate(0,p.windowHeight);
        drawImageToBottomOrFit(campfire);
      p.pop();
      p.fill(255);
      p.textSize(32);
      p.textAlign(p.CENTER);
      p.text(wholeStory,0,0,p.windowWidth-50,p.windowHeight - 100);
      p.saveCanvas("myCampfireStory", "png");
      touchToRestart();
      feedbackAlert();
    }

/*-------------------------------------------------------------------------------------------------------*/

    // TESTING AND FEEDBACK

    // This function is used to collect user feedback
    function feedbackAlert () {
      var answer = confirm ("I hope you've enjoyed playing Campfire Tales! I'd love your feedback to make the game better. Please click OK to fill out the form or cancel to play again")
      if (answer) {
        window.location="https://goo.gl/forms/tgbSIIfrgRSOEBx23";
      }
      // else {
      //   location.reload();
      // }
    }

/*-------------------------------------------------------------------------------------------------------*/

    // DRAWING FUNCTIONS

    // var test = {
    //   drawTitle: function () {
    //     p.background(bg); // sets background color to standard
    //     drawImageToBottomOrFit(campfire_title_landscape);
    //   }
    // }    

    function clearCanvas () {
      p.rect(0,0, p.windowWidth, p.windowHeight);
    }
    
    // This function scales the image accordingly based on window size and device orientation

    function drawImageToBottomOrFit (imageToDraw) {
      var isLandscape = p.windowWidth > p.windowHeight;
      var aspect = imageToDraw.height / imageToDraw.width;
      var width = p.windowWidth;
      var height = width * aspect;
      var gap = (p.windowHeight - height) * 0.5;      
      p.image(imageToDraw, 0, gap, width, height);
    }

    function drawTitle () {
      p.background(bg); // sets background color to standard
      drawImageToBottomOrFit(campfire_title_landscape);
      //portraitBorder(); // adds a dark border underneath the title image. This doesn't work well
    }

    // This function adds a matching trim under the title screen

     function portraitBorder () {
      if (p.windowWidth < p.windowHeight){
        p.push();
          p.translate(0,p.windowHeight * .6);
          p.fill(60,62,63);
          p.noStroke();
          p.rect(0,0,p.windowWidth,p.windowHeight);
        p.pop();
      }
    }

/*-------------------------------------------------------------------------------------------------------*/
   // END PROCESSING CODE

  }

  new P5(processingCode);
