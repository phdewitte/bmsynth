window.AudioContext = window.AudioContext || window.webkitAudioContext;

var context = new AudioContext(),
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

masterGain = context.createGain();
nodes = [];

masterGain.gain.value = 0.3;
masterGain.connect(context.destination);

var waveType = document.getElementById("waves")

keyboard.keyDown = function (note, frequency) {
    var oscillator = context.createOscillator();
    oscillator.type = waveType.value;
    console.log(oscillator.type)
    oscillator.frequency.value = frequency;
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