// Required Libraries
var Tracery = require('tracery'); // import Tracery from 'tracery';

var Improv = require('improv'); // import Improv from 'improv';
var P5 = require('p5'); // import p5 from 'p5.js';
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

// Processing Code

function processingEnvironment(p) {
    
    // console.log(p);
    // console.log(p.select);
    // console.log(p.getAudioContext);
    // console.log(lines.join('\n')); // testing to see if we have access to Improv Text in Processing
    // var improvText = lines.join('\n'); // taking Improv text and saving as a variable separated by new lines
  


    p.setup = function () {
      p.createCanvas(900, 900);
    }
  
    p.draw = function () {
      p.background(0);
      p.fill(255);
      p.text(text,16,16);
    }
  }
  
  new P5(processingEnvironment);
  