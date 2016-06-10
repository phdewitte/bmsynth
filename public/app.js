// Keyboard Settings
    settings = {
        id: 'keyboard',
        width: 600,
        height: 300,
        startNote: 'A2',
        whiteNotesColour: '#fff',
        blackNotesColour: '#000',
        borderColour: '#000',
        activeColour: 'purple',
        octaves: 2
    },
    keyboard = new QwertyHancock(settings);

var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext(),

// Master Output and Polyphony
masterGain = context.createGain();
masterGain.gain.value = 0.3;
masterGain.connect(context.destination);
nodes = [];

// User Defined Controls
var waveType = document.getElementById("waves")
var lfoRate = document.getElementById("lfo-rate").value
console.log(lfoRate)

// Synthesis
keyboard.keyDown = function (note, frequency) {
    var oscillator = context.createOscillator();
    oscillator.type = waveType.value;
    oscillator.frequency.value = frequency;
    oscillator.connect(lfoGain)
    oscillator.connect(masterGain);
    oscillator.start(0);

    nodes.push(oscillator);
};

keyboard.keyUp = function (note, frequency) {
    var new_nodes = [];

    for (var i = 0; i < nodes.length; i++) {
        if (Math.round(nodes[i].frequency.value) === Math.round(frequency)) {
            nodes[i].stop(0);
            nodes[i].disconnect();
        } else {
            new_nodes.push(nodes[i]);
        }
    }

    nodes = new_nodes;
};

// LFO


var lfo = context.createOscillator();
lfo.frequency.value = 2.0;
var lfoGain = context.createGain();
lfoGain.value = 0.4
lfo.connect(lfoGain.gain);
lfoGain.connect(context.destination);
lfo.start();

