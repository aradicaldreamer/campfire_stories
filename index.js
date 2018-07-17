// Required Libraries
var Jquery = require('jquery'); // adding jquery as needed by Tracery
var tracery = require('tracery-grammar'); // import Tracery for tacery generative text tests;
var should = require('chai').should(); // adding chai for the node tracery examples
var Improv = require('improv'); // import Improv for Improv generative text examples;
var P5 = require('p5'); // Adding p5.js libraries for Processing;
require('p5/lib/addons/p5.sound');
require('p5/lib/addons/p5.dom');

// Improv Example from Documentation
// var spec = {
//   animal: {
//     groups: [
//       {
//         tags: [['class', 'mammal']],
//         phrases: ['dog', 'cat']
//       },
//       {
//         tags: [['class', 'bird']],
//         phrases: ['parrot']
//       }
//     ]
//   },
//   root: {
//     groups: [
//       {
//         tags: [],
//         phrases: [
//           "[name]: I have a [:animal] who is [#2-7] years old."
//         ]
//       }
//     ]
//   }
// };

// var spec = require('./specs/example.js'); // this is an alternative for bringing this code into the main script

// var improv = new Improv(spec, {
//   filters: [Improv.filters.mismatchFilter()]
// });

// var bob = { name: 'Bob' };
// var alice = { name: 'Alice', tags: [['class', 'mammal']] };
// var carol = { name: 'Carol', tags: [['class', 'bird']] };

// var lines = [
//   improv.gen('root', bob),
//   improv.gen('root', alice),
//   improv.gen('root', carol)
// ];

// Tracery code

var story = {
  "start": "#[hero:#character#]story#",
  "character": ["dragon", "unicorn", "rainbow"],
  "story": "A #adj# #hero# fights the #adj# monster. Go #hero# go!",
  "adj": ["dark", "sleepy", "quiet"]
}

var grammar = tracery.createGrammar(story);


// Processing Code

var input;

function processingCode(p) {
    
    // console.log(p);
    // console.log(p.select);
    // console.log(p.getAudioContext);
    // console.log(lines.join('\n')); // testing to see if we have access to Improv Text in Processing
    // var improvText = lines.join('\n'); // taking Improv text and saving as a variable separated by new lines
    var traceryText = grammar.flatten("#start#");

    p.setup = function () {
      p.createCanvas(640, 480);
      input = p.createInput();
      input.position(50, p.height - 100);
      input.size(p.width - 100);
      input.style("background-color", "#ff0000");
    }
  
    p.draw = function () {
      p.background(0);
      p.fill(255);
      p.textSize(32);
      // p.text(improvText,100,100,400,400);
      p.text(traceryText,100,100,400,400);
    }
  }
  
  new P5(processingCode);
  