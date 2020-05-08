// To Do:https://jsfiddle.net/e8n4xd4z/1549/

window.onload = function what() {
  document.getElementById('hello').innerHTML = 'hi';
};

document.addEventListener("DOMContentLoaded", function (event) {
  // Audio Context
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // Default Nodes
  const gain = audioCtx.createGain();
  var analyser = audioCtx.createAnalyser();

  // Default Waveform
  let waveform = 'sine'

  //Filter variables
  let filterType;
  let filterFrequency;
  let filterTypeControl = 'lowpass';

  // Active Oscillator, ADSR and Filter Storage
  const activeOscillators = {};
  const adsr = {};
  const activeFilters = {};

  // Frequency Chart
  const keyboardFrequencyMap = {
    // Octave 0
    'A0': 27.50,  
    'A-sharp0': 29.14, 
    'B0': 30.87,  

    // Octave 1
    'C1': 32.70, 
    'C-sharp1': 34.65,  
    'D1': 36.71,  
    'D-sharp1': 38.89, 
    'E1': 41.20,  
    'F1': 43.65, 
    'F-sharp1': 46.25,  
    'G1': 49.00, 
    'G-sharp1': 51.91,  
    'A1': 55.00,  
    'A-sharp1': 58.27, 
    'B1': 61.74,  

    // Octave 2
    'C2': 65.41, 
    'C-sharp2': 69.30,  
    'D2': 73.42,  
    'D-sharp2': 77.78, 
    'E2': 82.41,  
    'F2': 87.31, 
    'F-sharp2': 92.50,  
    'G2': 98.00, 
    'G-sharp2': 103.83,  
    'A2': 110.00,  
    'A-sharp2': 116.54, 
    'B2': 123.47,  

    // Octave 3
    'C3': 130.81, 
    'C-sharp3': 138.59,  
    'D3': 146.83,  
    'D-sharp3': 155.56, 
    'E3': 164.81,  
    'F3': 174.61, 
    'F-sharp3': 185.00,  
    'G3': 196.00, 
    'G-sharp3': 207.65,  
    'A3': 220.00,  
    'A-sharp3': 233.08, 
    'B3': 246.940,
    
    // Octave 4
    'C4': 261.63, 
    'C-sharp4': 277.18,  
    'D4': 293.66,  
    'D-sharp4': 311.13, 
    'E4': 329.63,  
    'F4': 349.23, 
    'F-sharp4': 369.99,  
    'G4': 392.00, 
    'G-sharp4': 415.30,  
    'A4': 440.00,  
    'A-sharp4': 466.16, 
    'B4': 493.880,  

    // Octave 5
    'C5': 523.250, 
    'C-sharp5': 554.37,  
    'D5': 587.33,  
    'D-sharp5': 622.25, 
    'E5': 659.25,  
    'F5': 698.46, 
    'F-sharp5': 739.99,  
    'G5': 783.99, 
    'G-sharp5': 830.61,  
    'A5': 880.00,  
    'A-sharp5': 932.33, 
    'B5': 987.770,  

    // Octave 6
    'C6': 523.250, 
    'C-sharp6': 554.37,  
    'D6': 587.33,  
    'D-sharp6': 622.25, 
    'E6': 659.25,  
    'F5': 698.46, 
    'F-sharp6': 739.99,  
    'G6': 783.99, 
    'G-sharp6': 830.61,  
    'A6': 880.00,  
    'A-sharp6': 932.33, 
    'B6': 987.770,  

    // Octave 7
    'C7': 523.250, 
    'C-sharp7': 554.37,  
    'D7': 587.33,  
    'D-sharp7': 622.25, 
    'E7': 659.25,  
    'F7': 698.46, 
    'F-sharp7': 739.99,  
    'G7': 783.99, 
    'G-sharp7': 830.61,  
    'A7': 880.00,  
    'A-sharp7': 932.33, 
    'B7': 987.770,  

    // Octave 8
    'C8': 523.250, 
    'C-sharp8': 554.37,  
    'D8': 587.33,  
    'D-sharp8': 622.25, 
    'E8': 659.25,  
    'F8': 698.46, 
    'F-sharp8': 739.99,  
    'G8': 783.99, 
    'G-sharp8': 830.61,  
    'A8': 880.00,  
    'A-sharp8': 932.33, 
    'B8': 987.770,  
  }

  // Colour Picking Array
  const colourChart = [
    '#EF5350', 
    '#EC407A', 
    '#AB47BC',
    '#7E57C2',
    '#5C6BC0',
    '#42A5F5',
    '#29B6F6',
    '#26C6DA',
    '#26A69A',
    '#66BB6A',
    '#9CCC65',
    '#D4E157',
    '#FFEE58',
    '#FFCA28',
    '#FFA726',
    '#FF7043'
  ]

  let colourPicker = function(){
    let choose = colourChart[Math.floor(Math.random() * colourChart.length)];
    return choose;
  }

  // Default Connections
  gain.connect(analyser);
  analyser.connect(audioCtx.destination);

  //Event Listeners for Interface
  const waveformControl = document.getElementById('waveform');
  const waveformSelector = document.getElementById('whiteBackground');
  waveformControl.addEventListener('change', function (event) {
    waveform = event.target.value;
    console.log(waveform);
    waveformBackground(waveform);
  });

  function waveformBackground(waveName) {
    if(waveName==="sawtooth") {
      waveformSelector.style.left = "123px";
      waveformSelector.style.top= "20px";
    }
    if(waveName==="sine") {
      waveformSelector.style.left = "20px";
      waveformSelector.style.top= "20px";
    }

    if(waveName==="square") {
      waveformSelector.style.left = "20px";
      waveformSelector.style.top= "124px";
    }

    if(waveName==="triangle") {
      waveformSelector.style.left = "123px";
      waveformSelector.style.top= "124px";
    }
  }

  const gainControl = document.getElementById('gain')
  gainControl.addEventListener('change', function (event) {
    gain.gain.setValueAtTime(event.target.value, audioCtx.currentTime)
    console.log(gainControl.value);
  });
  gain.gain.value = gainControl.value;


  if (document.querySelector('input[name="filterType"]')) {
    document.querySelectorAll('input[name="filterType"]').forEach((elem) => {
      elem.addEventListener("change", function filterValueFunction(event) {
        filterTypeControl = event.target.value;
        console.log(filterTypeControl);
      });
    });
  }

  const filterFrequencyControl = document.getElementById('filterFrequency')
  filterFrequencyControl.addEventListener('change', function (event) {
    console.log("Filter Cut Off: " + filterFrequencyControl.value)
  });

  const attackTime = document.getElementById('attack');
  attackTime.addEventListener('change', function (event) {
    console.log("attack: " + attackTime.value);
  });

  const decayTime = document.getElementById('decay');
  decayTime.addEventListener('change', function (event) {
    console.log("decay: " + decayTime.value);
  });

  const sustainTime = document.getElementById('sustain')
  sustainTime.addEventListener('change', function (event) {
    console.log("sustain: " + sustainTime.value);
  });

  const releaseTime = document.getElementById('release')
  releaseTime.addEventListener('change', function (event) {
    console.log("release: " + releaseTime.value);
  });


  /* Note: getElementByClasses retruns an array, below I am repeating myself
    for each element of the array, maybe the .forEach() method will work better? */

  let findNote = document.getElementsByClassName("key");

  for(let i = 0;  i< findNote.length; i++){
    findNote[i].addEventListener("click", function () {
      notePlayed(findNote[i].classList.item(0));
      console.log(findNote[i].classList.item(0))
   });
  }

  // Function For when note is played
  function notePlayed(newNote) {
    console.log(newNote);
      const key= (newNote).toString();
      if (keyboardFrequencyMap[key] && !activeOscillators[key]) {
          playNote(key, 1);
          deco(key);
          
     } else{
        playNote(key, 0)
        
      }
  }

  function deco(keytype) {
    let amni = keytype + "deco";
    var amni2 = document.getElementById(amni);
    amni2.style.webkitTransitionDuration = attackTime.value;
    amni2.style.opacity = 1;
    amni2.style.background = colourPicker();
    amni2.style.display = "block";
  }


  function decoStop(keytype, release) {
    let amni3 = keytype + "deco";
    var amni4 = document.getElementById(amni3);
    amni4.style.opacity = "0";
    amni4.style.transitionDuration = release;
    if (amni4.style.opacity === "0") {
    amni4.style.display = "none";
    }
  }


  /*
  //EVENT LISTENERS FOR MUSICAL KEYBOARD
  var pressed = document.getElementById("key");
  if(pressed){
      pressed.addEventListener('click', keyDown, true);
      const key = pressed.classList.item(2).toString();
      console.log(pressed);
  }

  window.addEventListener('keyup', keyUp, false);
 
  //CALLED ON KEYDOWN EVENT - CALLS PLAYNOTE IF KEY PRESSED IS ON MUSICAL
  //KEYBOARD && THAT KEY IS NOT CURRENTLY ACTIVE
  function keyDown(event) {
    const key = (document.getElementById("key").classList.item(2)).toString();
    console.log(key);
    if (keyboardFrequencyMap[key] && !activeOscillators[key]) {
      playNote(key);
    }
  }
 
  //STOPS & DELETES OSCILLATOR ON KEY RELEASE IF KEY RELEASED IS ON MUSICAL
  //KEYBOARD && THAT KEY IS CURRENTLY ACTIVE
  function keyUp(event) {
    const key = (event.detail || event.which).toString();
    if (keyboardFrequencyMap[key] && activeOscillators[key]) {
      activeOscillators[key].stop();
      delete activeOscillators[key];
    }
  }
  */

  /*
  function playNote(key, ifon) {
    console.log('creating oscilator for ' + key);
    const osc = audioCtx.createOscillator();
    activeOscillators[key] = osc;
    osc.frequency.setValueAtTime(keyboardFrequencyMap[key], audioCtx.currentTime);
    osc.type=waveform;
    const adsrNow=audioCtx.createGain();
    function envelopeGenerator(thisEnvelope){
      console.log('Generating envolope');
      const t0 = audioCtx.currentTime;
      thisEnvelope.gainsetValueAtTime(0, t0);
      const t1 = t0 + attackTime.value;
      thisEnvelope.gain.linearRampToValueAtTime(1, parseFloat(t1));
      const t2= decayTime.value;
      thisEnvelope.gain.setTargetAtTime(parseFloat(sustainTime.value), parseFloat(t1), parseFloat(t2));
    }
    adsr[key] = envelopeGenerator(adsr[key]);
    activeOscillators[key].connect(adsr[key]);
    adsr[key].connect(gain);
    activeOscillators[key].start();
    
  }

  */

 

  function playNote(key, onoff) {
    if (onoff ===1){
    //Create Oscillator
    const osc = audioCtx.createOscillator();
    osc.frequency.setValueAtTime(keyboardFrequencyMap[key], audioCtx.currentTime);
    osc.type = waveform;
    activeOscillators[key] = osc;
    //Create Filter
    const filter = audioCtx.createBiquadFilter();
    activeFilters[key] = filter;
    activeFilters[key].type = filterTypeControl;
    activeFilters[key].frequency.setValueAtTime(parseFloat(filterFrequencyControl.value), parseFloat(audioCtx.currentTime));
    //Create Envelope
    const envelopeGenerator = audioCtx.createGain();
    adsr[key] = envelopeGenerator;
    const t0 = audioCtx.currentTime;
    adsr[key].gain.setValueAtTime(0, parseFloat(audioCtx.currentTime));
    const t1 = t0 + attackTime.value;
    adsr[key].gain.linearRampToValueAtTime(parseFloat(1), parseFloat(t1));
    const t2 = decayTime.value;
    adsr[key].gain.setTargetAtTime(parseFloat(sustainTime.value), parseFloat(t1), parseFloat(t2));

     // Osc-->Filter-->Envelope-->MasterGain
    activeOscillators[key].connect(activeFilters[key]);
    activeFilters[key].connect(adsr[key]);
    adsr[key].connect(gain);
    activeOscillators[key].start();
    }
    function noteOff() {
      const t = audioCtx.currentTime;
      adsr[key].gain.cancelScheduledValues(t);
      adsr[key].gain.setValueAtTime(adsr[key].gain.value, t);
      adsr[key].gain.setTargetAtTime(0, t, releaseTime.value);
      const stopit = setInterval(() => {
        if (adsr[key].gain.value < 0.1 && onoff===0) {
          activeOscillators[key].stop();
          delete activeOscillators[key];
          delete adsr[key];
          
        } 
        decoStop(key, releaseTime.value);
        clearInterval(stopit);
      }, 0.1);
    }

    if(onoff === 0){
      noteOff()
  }
    
  }
  })
  

  

  // Filter Section Knob Control
  window.onload = rotateFilter;
  function rotateFilter() {
    let filterControlOnStart = document.getElementById("circle");
    if (filterControlOnStart) {
      filterControlOnStart.style.transitionDuration = "0.8s";
      filterControlOnStart.style.transform = "rotate(63deg)";
    }
  }

  function filterSelected(filter) {
    if (filter === 1) {
      head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
      head.appendChild(style);
      let highpass = document.getElementById("circle");
      if (highpass) {
        highpass.style.transitionDuration = "0.4s";
        highpass.style.transform = "rotate(-63deg)";
        console.log("High Pass Filter");
        style.innerHTML = ".filterSlider::-webkit-slider-thumb{box-shadow: 100vw 0 0 100vw #4CAF50; width: 20px;}"
      }
    }

    if (filter === 2) {
      let bandpass = document.getElementById("circle");
      head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
      head.appendChild(style);
      style.type = "text/css";
      if (bandpass) {
        bandpass.style.transform = "rotate(0deg)";
        bandpass.style.transitionDuration = "0.4s";
        style.innerHTML = ".filterSlider::-webkit-slider-thumb{box-shadow: 0vw 0 0 0vw #4CAF50; width: 50px;}"
      }
    }

    if (filter === 3) {
      let lowpass = document.getElementById("circle");
      head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
      head.appendChild(style);
      if (lowpass) {
        lowpass.style.transform = "rotate(63deg)";
        lowpass.style.transitionDuration = "0.4s";
        console.log("Low Pass Filter");
        style.innerHTML = ".filterSlider::-webkit-slider-thumb{box-shadow: -100vw 0 0 100vw #4CAF50; width: 20px;}"
      }
    }
  }

/*
const EnvelopeGenerator = Vue.component('envelope-generator', {
  name: 'EnvelopeGenerator',
  template: "#adsr",
  props: {
    width: {
      type: Number,
      default: 640
    },
    height: {
      type: Number,
      default: 480
    },
    attack: {
      type: Number,
      required: true,
      validaor: v => 0 <= v && v <= 1
    },
    decay: {
      type: Number,
      required: true,
      validaor: v => 0 <= v && v <= 1
    },
    sustain: {
      type: Number,
      required: true,
      validaor: v => 0 <= v && v <= 1
    },
    release: {
      type: Number,
      required: true,
      validaor: v => 0 <= v && v <= 1
    }
  },
  data () {
    return {
      path: ''
    }
  },
  mounted() {
    this.draw();
  },
  watch: {
    attack: function () { this.draw(); },
    decay: function () { this.draw(); },
    sustain: function () { this.draw(); },
    release: function () { this.draw(); }
  },
  methods: {
    draw() {
      const wRetio = this.width / 4;
      const hRetio = this.height / 1;

			const paths = [];
      let x, y;
      x = y = 0;

      // attack
      x = this.attack * wRetio;
      y = 0;
      paths.push(`${x} ${y}`);

      // decay
      x += this.decay * wRetio;
      y = this.height - this.sustain * hRetio;
      paths.push(`${x} ${y}`);

      // sustain
      x += 1 * wRetio;
      paths.push(`${x} ${y}`);

      // release
      x += this.release * wRetio;
      y = this.height;
      paths.push(`${x} ${y}`);

      this.path = `M0 ${this.height},` + paths.join(',');
    }
  }
});


new Vue({
  el: '#app',
  components: { EnvelopeGenerator },
  data() {
    return {
      form: {
        attackTime: 0.5,
        decayTime: 0.3,
        sustainLevel: 0.5,
        releaseTime: 1.0
      },
      ctx: new AudioContext(),
      osc: null,
      adsr: null
    }
  },
});

  methods: {
    start() {
      this.osc = this.ctx.createOscillator();
      this.adsr = this.ctx.createGain();

      // osc -> gain -> output
      this.osc.connect(this.adsr);
      this.adsr.connect(this.ctx.destination);

      const t0 = this.ctx.currentTime;
      this.osc.start(t0);
      // vol:0
      this.adsr.gain.setValueAtTime(0, t0);
      // attack
      const t1 = t0 + this.form.attackTime;
      this.adsr.gain.linearRampToValueAtTime(1, t1);
      // decay
      const t2 = this.form.decayTime;
      this.adsr.gain.setTargetAtTime(this.form.sustainLevel, t1, t2);
    },
    stop() {
      const t = this.ctx.currentTime;
      this.adsr.gain.cancelScheduledValues(t);
      this.adsr.gain.setValueAtTime(this.adsr.gain.value, t);
      this.adsr.gain.setTargetAtTime(0, t, this.form.releaseTime);

      const stop = setInterval(() => {
        // 完全に0になるまでには時間がかかるため
        if (this.adsr.gain.value < 0.01) {
          this.osc.stop();
          clearInterval(stop);
        }
      }, 10);
    },
  }
  */

 analyser.fftSize = 2048;
 var bufferLength = analyser.frequencyBinCount;
 var dataArray = new Uint8Array(bufferLength);
 canvasCtx.clearRect(0, 0, 100, 50);
 function draw() {
  var drawVisual = requestAnimationFrame(draw);
  analyser.getByteTimeDomainData(dataArray);
  canvasCtx.fillStyle = 'rgb(200, 200, 200)';
canvasCtx.fillRect(0, 0, 100, 50);
canvasCtx.lineWidth = 2;
canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
canvasCtx.beginPath();
var sliceWidth = 100 * 1.0 / bufferLength;
var x = 0;
for(var i = 0; i < bufferLength; i++) {
   
  var v = dataArray[i] / 128.0;
  var y = v * 50/2;

  if(i === 0) {
    canvasCtx.moveTo(x, y);
  } else {
    canvasCtx.lineTo(x, y);
  }

  x += sliceWidth;
}
canvasCtx.lineTo(canvas.width, canvas.height/2);
canvasCtx.stroke();
};
draw();