// Define the audio context
const audioContext = new AudioContext();

// Define the delay effect parameters
const delayTime = 0.5; // in seconds
const feedback = 0.5;
const wetLevel = 0.5;
const dryLevel = 1 - wetLevel;

// Create the delay effect
const delay = audioContext.createDelay();
delay.delayTime.value = delayTime;

// Create the feedback and wet/dry gain nodes
const feedbackGain = audioContext.createGain();
feedbackGain.gain.value = feedback;
const wetGain = audioContext.createGain();
wetGain.gain.value = wetLevel;
const dryGain = audioContext.createGain();
dryGain.gain.value = dryLevel;

// Connect the nodes
delay.connect(feedbackGain);
feedbackGain.connect(delay);
delay.connect(wetGain);
wetGain.connect(audioContext.destination);
dryGain.connect(audioContext.destination);

// Define the play function
function play() {
  // Get the audio file
  const audioFile = document.getElementById("audio-file").files[0];

  // Create a source node for the audio file
  const source = audioContext.createBufferSource();
  const reader = new FileReader();
  reader.readAsArrayBuffer(audioFile);
  reader.onload = function() {
    audioContext.decodeAudioData(reader.result, function(buffer) {
      source.buffer = buffer;
      source.connect(dryGain);
      source.connect(delay);
      source.start(0);
    });
  };
}

// Add event listeners
document.getElementById("play-button").addEventListener("click", play);
