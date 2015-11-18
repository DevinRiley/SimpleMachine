window.eventEmitter = window.eventEmitter || new EventEmitter();

(function() {
  var SimpleMachineView = function() {}
  var proto = SimpleMachineView.prototype;

  proto.events = window.eventEmitter;

  proto.initialize = function() {
    this.isSimpleMachineRunning = false;
    this.initElements();
    this.initListeners();
  }

  proto.initListeners = function() {
    var registerList = ["accumulator", "addressRegister", "memoryAddressRegister", "memoryBufferRegister", "instructionRegister", "programCounter", "counter", "memory"];
    var view = this;

    this.loadEl.onclick = this.loadProgramIntoSimpleMachine.bind(this);
    this.editEl.onclick = this.showCodeEditor.bind(this);
    this.playEl.onclick = this.toggleSimpleMachine.bind(this);
    this.stepEl.onclick = this.cycleSimpleMachine.bind(this);
    this.resetEl.onclick = this.resetSimpleMachine.bind(this);
    this.addMemoryListener();
    this.addButtonsListener();
    registerList.forEach(function(register) {
      view.newRegisterListener(register);
    });
  }

  proto.addMemoryListener = function() {
    var view = this;
    this.events.addListener('programCounter', function(newValue) {
      var cell = document.getElementById("memoryCell" + newValue);
      if (cell) {
        cell.bgColor = "Yellow";
        view.lastMemoryEl = view.lastMemoryEl || document.getElementById("memoryCell0");
        view.lastMemoryEl.bgColor = "lawngreen";
        view.lastMemoryEl = cell;
      }
    });
    
    this.events.addListener('memoryUpdate', function(index, newVal) {
      el = document.getElementById("memoryCell" + index);
      if (el) { 
        el.innerHTML = newVal;
        view.fadeElement(el, "steelblue", "Aquamarine");
      }
    });
  }

  proto.addButtonsListener = function() {
    var view = this;
    var enablePlayButton = function() {
      view.isSimpleMachineRunning = false;
      view.playEl.innerHTML = "Play";
      view.stepEl.disabled = false;
    }

    this.events.addListener('stop', function() {
      enablePlayButton();
    });

    this.events.addListener('halt', function() {
      view.isSimpleMachineRunning = false;
      view.playEl.disabled = true;
      view.stepEl.disabled = true;
    });

    this.events.addListener('start', function() {
      view.isSimpleMachineRunning = true;
      view.playEl.innerHTML = "Stop";
      view.stepEl.disabled = true;
    });
  }

  proto.stopSimpleMachine = function() {
    this.events.emitEvent('stop');
  }

  proto.startSimpleMachine = function() {
    this.events.emitEvent('start');
  }

  proto.cycleSimpleMachine = function() {
    this.events.emitEvent('cycle');
  }

  proto.toggleSimpleMachine = function() {
    if (this.isSimpleMachineRunning) {
      this.stopSimpleMachine();
    } else {
      this.startSimpleMachine();
    }
  }

  proto.resetSimpleMachine = function() {
    this.events.emitEvent('stop');
    this.events.emitEvent('reset');
    this.wipeMemoryCellColors();
    this.resetButtonStates();
  }

  proto.loadSimpleMachineMemory = function(instructions) {
    this.events.emitEvent('loadMemory', [instructions]);
    this.wipeMemoryCellColors();
  }

  proto.wipeMemoryCellColors = function() {
    view.buildMemoryElements();
    view.lastMemoryEl = document.getElementById("memoryCell0");
  }

  proto.buildMemoryElements = function() {
    var view = this
    this.memoryEl.innerHTML = '';
    SimpleMachine.memory.forEach(function(word, index) {
      if (index === 0 || index % 8 === 0) {
        var memoryRow = document.createElement("tr")
        memoryRow.className = "row";
        view.memoryEl.appendChild(memoryRow);
      } else {
        var memoryRows = document.getElementsByClassName("row");
        var memoryRow = memoryRows[memoryRows.length - 1];
      }
      
      var memoryCell = document.createElement("td")
      memoryCell.className = "cell";
      memoryCell.id = "memoryCell" + index;
      memoryCell.innerHTML = word;
      memoryRow.appendChild(memoryCell);
    });
  }

  proto.populateTextArea = function() {
    this.textEl.value = SimpleMachine.memory.join("\n");
  }

  proto.loadProgramIntoSimpleMachine = function(event) {
    var lines, instruction;
    var instructions = [];

    this.textEl.value.split("\n").forEach(function(line) {
     instruction = line.match(/0x[^\s#]+/g);
     if (instruction) { instructions.push(instruction[0]); }
    });

    this.stopSimpleMachine();
    this.resetSimpleMachine();
    this.loadSimpleMachineMemory(instructions);
    this.hideCodeEditor();
  }

  proto.initElements = function() {
    this.textEl = document.getElementsByTagName('textarea')[0];
    this.loadEl = document.getElementById('load');
    this.editEl = document.getElementById('edit');
    this.playEl = document.getElementById('play');
    this.stepEl = document.getElementById('step');
    this.memoryEl = document.getElementById('memory');
    this.resetEl = document.getElementById('reset');
    this.buildMemoryElements();
    this.populateTextArea();
  }

  proto.fadeElement = function(el, newColor, fadeToColor) {
   el.style.backgroundColor = newColor;
   var timeoutId = window.setTimeout(function() { 
     el.style.transition = 'background 0.5s ease'; 
     el.style.backgroundColor = fadeToColor;
     window.clearTimeout(timeoutId);
   }, 50);
   el.style.transition = '';
  }

  proto.showCodeEditor = function() {
    this.events.emitEvent("stop");
    this.textEl.style.display = "block";
    this.editEl.style.display = "none";
    this.loadEl.style.display = "block";
    this.memoryEl.style.display = "none";
    this.playEl.disabled = true;
    this.stepEl.disabled = true;
    this.resetEl.disabled = true;
  }

  proto.hideCodeEditor = function() {
    this.textEl.style.display = "none";
    this.editEl.style.display = "block";
    this.loadEl.style.display = "none";
    this.memoryEl.style.display = "block";
    this.playEl.disabled = false;
    this.stepEl.disabled = false;
    this.resetEl.disabled = false;
  }

  proto.newRegisterListener = function(name) {
    var view = this;
    this.events.addListener(name, function(newValue) {
      var el, valueEl;
      el = document.getElementById(name)
      valueEl = el.querySelectorAll('.value')[0];
      valueEl.innerText = newValue;
      view.fadeElement(valueEl, "lawngreen", "white");
    });
  }

  proto.resetButtonStates = function() {
    this.playEl.innerHTML = 'Play';
    this.playEl.disabled = false;
    this.stepEl.disabled = false;
  }


  this.SimpleMachineView = SimpleMachineView;
}).call(this)
