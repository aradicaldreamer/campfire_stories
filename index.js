/*-------------------------------------------------------------------------------------------------------*/

// Required Libraries
var Jquery = require('jquery'); // adding jquery as needed by Tracery
var tracery = require('tracery-grammar'); // import Tracery for tacery generative text tests;
var P5 = require('p5'); // Adding p5.js libraries for Processing;
require('rita');
require("p5/lib/addons/p5.sound");
require("p5/lib/addons/p5.dom");

/*-------------------------------------------------------------------------------------------------------*/

// Credit to External Sources

// 1. Julien G. of Kampeki Factory "Set Your Brower on Fire with p5js"
// Credit to Julien G. of Kampeki Factory
// https://kampeki-factory.blogspot.com/2018/03/set-your-browser-on-fire-with-p5js.html

// 2. Credit to oksmith for original public domain source image "Bonfire"
// https://openclipart.org/detail/300895/bonfire

// 3. Credit to Alex Fletcher for "Magical Forest" from the a.Wake() project

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
    grammar.addModifiers(tracery.baseEngModifiers); // this is critical and allows the use of tracery modifier functions like capitalize
    // var hero = grammar.selectRule("names"); // selects a name 
    // grammar.pushRules("hero", [hero]);
    populateGrammar(); // function to populate the grammar with words from the RitaJS lexicon
    // var traceryText = new RiString('');
    // traceryText.text(grammar.flatten("#start#"));
    // var foo = new RiString('This @is a test');
    // var test = resultsText(foo);
    // var displayText = traceryText.text();
    var traceryText = grammar.flatten("#start#");
    var displayText = traceryText;
    displayText = textFilter(displayText);
    var wholeStory = "";
    var fontSize = 32;
    var bg = "#676969"; // background color
    var scene = "titleScreen"; // sets the initial state to the title screen
    var input; // used to store user text input
    p.pixelDensity(1); // fix for scaling issues with buffer usage on Retina Displays
    var countdown = 1000;

    // variables for manipulating canvas
    var stretch = 3; // This value is used in the final scene to create a stretch by multiplying the window height with this value

    // variables for storing and manipulating offscreen graphics buffer

    var buffer;             // Saves buffer to screen for use
    var yScale = 2;         // used to scale the fire image to give the impression of growing or shrinking, and to start it to give the appearance of being low

    // Parameters for Fire Effect
    // Credit to Julien G. of Kampeki Factory
    // https://kampeki-factory.blogspot.com/2018/03/set-your-browser-on-fire-with-p5js.html

    var fireElemLenght  = 6;
    var elemOpacity     = 255;

    var fireLines   = [];
    var fireWidth   = 0;
    var fireHeight  = 0;

    var nbColors    = 255;  // Nb Colors in the palette
    var palette     = [];   // our color palette for the fire

    // END FIRE EFFECT
/*-------------------------------------------------------------------------------------------------------*/
    // PRELOAD METHOD

    p.preload = function () {
      gameFont = p.loadFont("assets/Arial.ttf");
      campfire = p.loadImage("assets/campfire_HD.png");
      campfire_title_landscape = p.loadImage("assets/campfire_title_screen.png");
      campfireSound = p.loadSound("assets/campfire-sound.mp3"); // https://freesound.org/people/aerror/sounds/350757/
      // forestAtDawn = p.loadSound("assets/forest-at-dawn.mp3") // Felix Blume "Forest at dawn" https://freesound.org/people/felix.blume/sounds/328296/
      magicalForest = p.loadSound("assets/MagicalForest.mp3"); // Credit to Alex Fletcher for "Magical Forest" from the a.Wake() project
      forestAtNight = p.loadSound("assets/forest-at-night.mp3"); // Felix Blume "Forest at night" https://freesound.org/people/felix.blume/sounds/328293/
    }
    
    function customPreload () {      
      preloadFont(gameFont, "assets/Arial.ttf");
      preloadImage(campfire_title_landscape, "assets/campfire_title_screen.png");
      preloadImage(campfire, "assets/campfire_HD.png");
      preloadSound(campfireSound, "assets/campfire-sound.mp3"); // https://freesound.org/people/aerror/sounds/350757/
      preloadSound(forestAtDawn, "assets/forest-at-dawn.mp3"); // Felix Blume "Forest at dawn" https://freesound.org/people/felix.blume/sounds/328296/
      preloadSound(magicalForest, "assets/MagicalForest.mp3"); // Credit to Alex Fletcher for "Magical Forest" from the a.Wake() project
      preloadSound(forestAtNight, "assets/forest-at-night.mp3"); // Felix Blume "Forest at night" https://freesound.org/people/felix.blume/sounds/328293/
    }

/*-------------------------------------------------------------------------------------------------------*/

    // SETUP METHOD

    p.setup = function () {
      // customPreload();
      var canvas = p.createCanvas(p.windowWidth, p.windowHeight);
      canvas.parent("game");
      // p.textFont(gameFont);
      p.textSize(fontSize);
      p.textAlign(p.CENTER);
      p.smooth();
      p.colorMode(p.RGB);
      backgroundAudio("loop");
      buffer = p.createGraphics(400, 300);
      mic = new P5.AudioIn();
      mic.start();

      initalizeFire();
    
      // generate fire colors palette
      initializePalette();
    
      buffer.noStroke();    
      // var results = p.createP(textFilter(test.text()));
      // results.parent('results');
    }

/*-------------------------------------------------------------------------------------------------------*/

    // DRAW METHOD

    p.draw = function () {
      switch (scene) {
        case "titleScreen":
          drawTitle();
          break;

        case "intro":
          defaultScene();
          introCheck();
          break;

        case "final":
          p.background(bg);
          // p.image(campfire,0,p.windowHeight,p.windowWidth, p.windowHeight);
          p.push();
            p.translate(0,p.windowHeight * (stretch - 1));
            drawImageToBottomOrFit(campfire, 1);
          p.pop();
          p.fill(255);
          p.textSize(32);
          p.textAlign(p.CENTER);
          p.text(wholeStory,0,100,p.windowWidth-50,(p.windowHeight * stretch) - 100);
          break;

        default:
          defaultScene();
      }
    }

    function defaultScene () {
                // Run function that checks for continuous microphone input to decrease the scale, and thus bring back the fire
                stokeFireWithMicrophone();
                // console.log(yScale);
      
                // checks to make sure that the mic is enabled before decreasing fire size
                // check the yScale to make sure it doesn't exceed the boundary
                if (yScale <= 4 && mic.enabled) {
                  yScale += 0.001;
                }
                else {
                  yScale = 1;
                }
      
                // We clean the buffer and background each time
                p.background(0);
                buffer.background(0,0,0);
          
                // We generate a new base fire line (to make it 'move')
                initFireLine();
          
                // Compute the whole fire pixels
                fireGrow();
          
                // Draw fire to buffer
                drawFire();
      
                // Display the buffer as a background
                p.push();
                  //p.image(buffer, 0, 0);
                  p.translate(0, p.windowHeight / 4);
                  p.scale(1, yScale);
                  drawImageToBottomOrFit(buffer, 1);
                p.pop();
      
                // Draw Text on Top
                p.fill(255);
                p.textSize('1em');
                p.textAlign(p.CENTER);
                p.text(displayText,0,p.windowHeight / 6,p.windowWidth-50,p.windowHeight - 100);
    }


    // CUSTOM TEXT FUNCTIONS
    
    // To be used with Rita JS to change the text color of specific words in an HTML Paragraph
    function resultsText(txt) {
      var words = txt.words();
      for (i = 0; i < words.length; i++) {
        if (words[i].startsWith('@')) {
          txt.replaceWord(i+1, words[i+1].fontcolor('white'));
        }
      }
      console.log(words);
      return txt;
    }

    function textFilter(txt) {
      txt = txt.replace('@','');
      return txt.split('.').join('.\n\n').split(',').join(',\n\n');
    }
    
/*-------------------------------------------------------------------------------------------------------*/

    // INITIALIZING FUNCTIONS

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

    // CUSTOM PRELOAD FUNCTIONS

    // function preloadFont(fontName, filename) {
    //   p.loadFont(filename, fontLoaded);
      
    //   function fontLoaded(font) {
    //     console.log(filename);
    //     fontName = font;
    //     p.textFont(fontName);
    //     counter++;
    //     if (counter == totalAssets) {
    //       loading = false;
    //     }
    //   }
    // }

    // function preloadImage(imageName, filename) {
    //   p.loadImage(filename, imageLoaded);
      
    //   function imageLoaded(image) {
    //     console.log(filename);
    //     imageName = image;
    //     counter++;
    //     if (counter == totalAssets) {
    //       loading = false;
    //     }
    //   }
    // }

    // function preloadSound(song, filename) {
    //   p.loadSound(filename, soundLoaded);
      
    //   function soundLoaded(sound) {
    //     console.log(filename);
    //     song = sound;
    //     song.loop();
    //     counter++;
    //     if (counter == totalAssets) {
    //       loading = false;
    //     }
    //   }
    // }

/*-------------------------------------------------------------------------------------------------------*/

    // FIRE EFFECT FUNCTIONS

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

    function initalizeFire() {
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
    }

/*-------------------------------------------------------------------------------------------------------*/
    
    // USER INTERACTIONS

    p.mouseReleased = function () {
      // sceneManager();
      if (scene === "titleScreen") {
        scene = "intro";
        touchToContinue();
        backgroundAudio("pause");
      }
    }

    p.touchEnded = function () {
      if (scene === "titleScreen") {
        scene = "intro";
        touchToContinue();
        backgroundAudio("pause");
      }
    }

/*-------------------------------------------------------------------------------------------------------*/
    // SCENE FUNCTIONS

    // This function checks to see if the player has passed a check
    function introCheck () {
      if (yScale <= 1) {
        displayText = grammar.flatten("#opening#");
        // touchToContinue();
        backgroundAudio("play");
        displayText = textFilter(displayText);
        scene = "sceneOne";
      }
    }
    
    // this function is called in scenes that do not require text entry from the player

    function sceneManager () {
      switch (scene) {
        case "titleScreen":
          // scene = "introScene";
          // touchToContinue();
          break;
        
        case "sceneOne":
          continueButton.hide();
          userInput();
          displayText = grammar.flatten("#sceneOne#");
          displayText = textFilter(displayText);
          scene = "questionOne";
          break;

        case "sceneTwo":
          displayText = grammar.flatten("#sceneThree#");
          wholeStory += displayText + "\n" + "\n";
          displayText = textFilter(displayText);
          scene = "sceneThree";
          break;
        
        case "sceneThree":
          displayText = grammar.flatten("#sceneFour#");
          wholeStory += displayText + "\n" + "\n";
          displayText = textFilter(displayText);
          scene = "sceneFour";
          break;

        case "sceneFour":
          displayText = grammar.flatten("#sceneFive#");
          wholeStory += displayText + "\n" + "\n";
          displayText = textFilter(displayText);
          scene = "sceneFive";
          break;

        case "sceneFive":
          continueButton.hide();
          input.show();
          displayText = grammar.flatten("#questionFour#");
          wholeStory += displayText + "\n" + "\n";
          displayText = textFilter(displayText);
          scene = "questionFour";
          break;

        case "sceneSix":
          displayText = grammar.flatten("#sceneSeven#");
          wholeStory += displayText + "\n" + "\n";
          displayText = textFilter(displayText);
          scene = "sceneSeven";
          break;

        case "sceneSeven":
          displayText = grammar.flatten("#sceneEight#");
          wholeStory += displayText + "\n" + "\n";
          displayText = textFilter(displayText);
          scene = "sceneEight";
          break;

        case "sceneEight":
          displayText = grammar.flatten("#sceneNine#");
          wholeStory += displayText + "\n" + "\n";
          displayText = textFilter(displayText);
          scene = "sceneNine";
          break;

        case "sceneNine":
          displayText = grammar.flatten("#sceneTen#");
          wholeStory += displayText + "\n" + "\n";
          displayText = textFilter(displayText);
          scene = "sceneTen";
          break;

        case "sceneTen":
          displayText = grammar.flatten("#endingOne#");
          wholeStory += displayText + "\n" + "\n";
          displayText += "\n" + "\n" + "Run";
          displayText = textFilter(displayText);
          scene = "endingOne";
          break;

        case "endingOne":
          displayText = grammar.flatten("#endingTwo#");
          wholeStory += displayText + "\n" + "\n";
          displayText += "\n" + "\n" + "GET OUT NOW";
          displayText = textFilter(displayText);
          scene = "endingTwo";
          break;

        case "endingTwo":
          continueButton.hide();
          input.show();
          displayText = grammar.flatten("#endingQuestion#");
          // wholeStory += displayText + "\n" + "\n";
          displayText = textFilter(displayText);
          scene = "endingQuestion";
          break;

        case "endingThree":
          continueButton.hide();
          saveStoryButton();
          displayText = grammar.flatten("#endingFour#");
          displayText = textFilter(displayText);
          // wholeStory += displayText + "\n" + "\n";
          // scene = "endingFour";
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

        case 50:
          displayText = grammar.flatten("#warning#");
          scene = 51;
          break;

        case 51:
        displayText = grammar.flatten("#warning.capitalize#");
        scene = 52;
        break;

        case 52:
        displayText = grammar.flatten("#warning.capitalizeAll#");
        scene = 53;
        break;
        
        default:
      }
    }

    // This function is called in scenes with text input from the player

    function newStoryElement () {
      // Removing all special characters from input
      switch (scene) {
              
        case "questionOne":
          var val = input.value();
          textCheck(val);
          grammar.pushRules("likedName", [val]);
          input.value('');
          displayText = grammar.flatten("#question1#");
          // wholeStory = wholeStory + "\n" + val;
          displayText = textFilter(displayText);
          scene = "questionTwo";
          break;

        case "questionTwo": 
          var val = input.value();
          textCheck(val);
          grammar.pushRules("dislikedName", [val]);
          input.value('');
          displayText = grammar.flatten("#question2#");
          // wholeStory = wholeStory + "\n" + val;
          displayText = textFilter(displayText);
          scene = "questionThree";
          break;

        case "questionThree": 
          var val = input.value();
          textCheck(val);
          grammar.pushRules("reasonWhy", [val]);
          input.value('');
          displayText = grammar.flatten("#sceneTwo#");
          // wholeStory = wholeStory + "\n" + val;
          wholeStory += displayText + "\n" + "\n";
          input.hide();
          continueButton.show();
          displayText = textFilter(displayText);
          scene = "sceneTwo";
          break;

        case "questionFour": 
          var val = input.value();
          textCheck(val);
          grammar.pushRules("playerFear", [val]);
          input.value('');
          displayText = grammar.flatten("#sceneSix#");
          wholeStory += displayText + "\n" + "\n";
          input.hide();
          continueButton.show();
          displayText = textFilter(displayText);
          scene = "sceneSix";
          break;

        case "endingQuestion": 
          var val = input.value();
          textCheck(val);
          grammar.pushRules("trueName", [val]);
          input.value('');
          displayText = grammar.flatten("#endingThree#");
          wholeStory += displayText + "\n" + "\n";
          input.hide();
          continueButton.show();
          displayText = textFilter(displayText);
          scene = "endingThree";
          break;

        case 500: 
          var val = input.value();
          textCheck(val);
          grammar.pushRules("answer5", [val]);
          input.value('');
          input.hide();
          displayText = grammar.flatten("#transition#");
          wholeStory = wholeStory + "\n" + val;
          // touchToContinue();
          displayText = textFilter(displayText);
          scene = 6;
          break;

        default:
      }
    }

/*-------------------------------------------------------------------------------------------------------*/
    // BUTTONS

    function touchToContinue () {
      continueButton = p.createButton("Continue");
      continueButton.size(p.windowWidth - 50);
      continueButton.style("position", "absolute");
      continueButton.style("bottom", "16px");
      continueButton.style("left", "22px");
      // continueButton.style("right", "16px");
      continueButton.style("background-color", "black");
      continueButton.style("color", "white");
      continueButton.style("border-color", "white");
      continueButton.style("font-size", "2em");
      continueButton.mouseReleased(sceneManager);
      continueButton.touchEnded(sceneManager);
    }

    function touchToRestart () {
      restartButton = p.createButton("Restart?");
      //restartButton.parent("game");
      restartButton.size(p.windowWidth - 50);
      restartButton.style("position", "absolute");
      restartButton.style("top", "16px");
      restartButton.style("left", "16px");
      restartButton.style("background-color", bg);
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
    // AUDIO FUNCTIONS

    function backgroundAudio (playbackState) {
      switch (playbackState) {
        case "loop":
          campfireSound.loop();
          // forestAtDawn.loop();
          forestAtNight.loop();
          magicalForest.loop();
          break;
        
        case "pause":
          campfireSound.pause();
          // forestAtDawn.pause();
          forestAtNight.pause();
          magicalForest.pause();
          break;

        case "play":
          campfireSound.play();
          // forestAtDawn.play();
          forestAtNight.play();
          magicalForest.play();
          break;

        default:
          break;
      }
    }
    
    // function randomizeStartupAudio () {
    //   var selector = p.random(3);
    //   console.log(selector);
    // }

/*-------------------------------------------------------------------------------------------------------*/
    // MICROPHONE INTERACTION

    function stokeFireWithMicrophone () {
      var vol = mic.getLevel();
      
      // if (vol > .13 && counter < 10) {
      //     counter ++;
      // }
      // else if (vol > .13 && counter === 10) {
      //   if (yScale < 1.2) yScale = 1;  
      //   else if (yScale >= 1.2) yScale -= .2;
      //     counter = 0;
      // }
      // else {
      //     counter = 0;
      // }
      // this doesn't work as well because it doesn't have an immediate response. Intermittent external audio doesn't affect the program if the scale delta is very small

      if (vol > .13) {
        if (yScale > 1) yScale -= .02;
      }
    }

/*-------------------------------------------------------------------------------------------------------*/
    // TEXT INPUT

    // This function is intended to collect user input at various points during the story
    function userInput () {
      input = p.createInput();
      // input.position(50, p.height - 100);
      input.size(p.windowWidth - 50);
      input.style("position", "absolute");
      input.style("bottom", "16px");
      input.style("left", "24px");
      // input.style("right", "16px");
      input.style("background-color", "#000000");
      input.style("color", "white");
      input.style("border-color", "white");
      input.style("font-size", "2em");
      input.changed(newStoryElement);
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
      saveButton.mouseReleased(saveStory);
      saveButton.touchEnded(saveStory);
    }

    function saveStory () {
      scene = "final";
      saveButton.hide();
      //clearCanvas();
      p.resizeCanvas(p.windowWidth, p.windowHeight * stretch);
      p.background(bg);
      p.push();
        p.translate(0,p.windowHeight * (stretch - 1));
        drawImageToBottomOrFit(campfire, 1);
      p.pop();
      p.fill(255);
      p.textSize(32);
      p.textAlign(p.CENTER);
      p.text(wholeStory,0,0,p.windowWidth-50,(p.windowHeight * stretch) - 100);
      p.saveCanvas("myCampfireStory", "png");
      // var results = p.createP(wholeStory);
      // results.parent('results');
      touchToRestart();
      feedbackAlert();
    }

/*-------------------------------------------------------------------------------------------------------*/

    // TESTING AND FEEDBACK

    // This function is used to collect user feedback
    function feedbackAlert () {
      var answer = confirm ("I hope you've enjoyed playing Campfire Tales! I'd love your feedback to make the game better. Please click OK to fill out the form or cancel to play again")
      if (answer) {
        window.location= "https://goo.gl/forms/UBHGG3LGSrdL6YLh2";
        // var win = window.open("https://goo.gl/forms/UBHGG3LGSrdL6YLh2", '_blank');
        // win.focus();
      }
      // else {
      //   location.reload();
      // }
    }

    // Form V1 "https://goo.gl/forms/tgbSIIfrgRSOEBx23";

/*-------------------------------------------------------------------------------------------------------*/

    // DRAWING FUNCTIONS  

    function clearCanvas () {
      p.fill(bg);
      p.rect(0,0, p.windowWidth, p.windowHeight);
    }
    
    // This function scales the image accordingly based on window size and device orientation

    function drawImageToBottomOrFit (imageToDraw, percentage) {
      var isLandscape = p.windowWidth > p.windowHeight;
      var aspect = imageToDraw.height / imageToDraw.width;
      var width = p.windowWidth;
      var height = width * aspect;
      var gap = (p.windowHeight - height) * percentage;      
      p.image(imageToDraw, 0, gap, width, height);
    }

    function drawTitle () {
      p.background(bg); // sets background color to standard
      drawImageToBottomOrFit(campfire_title_landscape, 0.5);
      // touchToContinue();
      //portraitBorder(); // adds a dark border underneath the title image. This doesn't work well
    }

    // For Redrawing the game when the window is resized
    p.windowResized = function () {
      // p.resizeCanvas(p.windowWidth, p.windowHeight);
      // clearCanvas();
      // p.redraw();
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
