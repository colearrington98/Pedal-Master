// Define the audio context
const audioContext = new AudioContext(); // Create the audio context

// Define the distortion effect parameters
const distortionAmount = 100; // in percent

// Create the distortion effect
const distortion = audioContext.createWaveShaper();
distortion.curve = makeDistortionCurve(distortionAmount);

// Create the gain node
const gain = audioContext.createGain();
gain.gain.value = 0.5;

// Connect the nodes
distortion.connect(gain);
gain.connect(audioContext.destination);

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
      source.connect(distortion);
      source.start(0);
    });
  };
}

// Add event listeners
document.getElementById("play-button").addEventListener("click", play);

// Function to create the distortion curve
function makeDistortionCurve(amount) {
  const k = amount;
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const deg = Math.PI / 180;
  let x;

  for (let i = 0; i < n_samples; i++) {
    x = (i * 2) / n_samples - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }

  return curve;
}
