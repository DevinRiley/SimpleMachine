window.eventEmitter = window.eventEmitter || new EventEmitter();

(function() {
  var SimpleMachineView = function() {}
  var proto = SimpleMachineView.prototype;

  proto.events = window.eventEmitter;

  proto.initialize = function() {
    this.initElements();
    this.initListeners();
  }
  proto.initListeners = function() {
    var registerList = ["accumulator", "addressRegister", "memoryAddressRegister", "memoryBufferRegister", "instructionRegister", "programCounter", "counter", "memory"];
    var view = this;

    this.loadEl.onclick = this.loadProgramIntoSimpleMachine.bind(this);
    this.playEl.onclick = this.startSimpleMachine.bind(this);
    this.stopEl.onclick = this.stopSimpleMachine.bind(this);
    this.addMemoryListener();
    registerList.forEach(function(register) {
      if (register === 'memory') { view.newMemoryListener(); }
      else { view.newRegisterListener(register); }
    });
  }

  proto.newMemoryListener = function() {
    this.events.addListener('memory', function() {
      view.buildMemoryElements();
    });
  }

  proto.addMemoryListener = function() {
    this.events.addListener('programCounter', function(newValue) {
      var cell = document.getElementById("memoryCell" + newValue);
      if (cell) {
        var existingCells = document.getElementsByClassName("cell");
        for(i = 0; i < existingCells.length; i++) {
          existingCells[i].bgColor = "white";
        }
        cell.bgColor = "lime";
      }
    });
  }

  proto.stopSimpleMachine = function() {
    this.events.emitEvent('stop');
  }

  proto.startSimpleMachine = function() {
    this.events.emitEvent('start');
  }

  proto.resetSimpleMachine = function() {
    this.events.emitEvent('reset');
  }

  proto.loadSimpleMachineMemory = function(instructions) {
    this.events.emitEvent('loadMemory', [instructions]);
  }

  proto.buildMemoryElements = function() {
    var observer = this
    this.memoryEl.innerHTML = '';
    SimpleMachine.memory.forEach(function(word, index) {
      var memoryRow     = document.createElement("tr")
      var memoryCell = document.createElement("td")
      memoryCell.className = "cell";
      memoryCell.id = "memoryCell" + index;
      memoryCell.innerHTML = word;
      observer.memoryEl.appendChild(memoryRow);
      memoryRow.appendChild(memoryCell);
    });
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
  }

  proto.initElements = function() {
    this.textEl = document.getElementsByTagName('textarea')[0];
    this.loadEl = document.getElementById('load');
    this.playEl = document.getElementById('play');
    this.stopEl = document.getElementById('stop');
    this.memoryEl = document.getElementById('memory');
    this.buildMemoryElements();
  }

  proto.fadeElement = function(el) {
   el.style.backgroundColor = 'lime';
   var timeoutId = window.setTimeout(function() { 
     el.style.transition = 'background 0.5s ease'; 
     el.style.backgroundColor = 'white'
     window.clearTimeout(timeoutId);
   }, 50);
   el.style.transition = '';
  }

  proto.newRegisterListener = function(name) {
    var view = this;
    this.events.addListener(name, function(newValue) {
      var el, valueEl;
      el = document.getElementById(name)
      valueEl = el.querySelectorAll('.value')[0];
      valueEl.innerText = newValue;
      view.fadeElement(valueEl);
    });
  }


  this.SimpleMachineView = SimpleMachineView;
}).call(this)
