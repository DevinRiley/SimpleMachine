window.eventEmitter = window.eventEmitter || new EventEmitter();

var SimpleMachineObserver = function(simpleMachine) {
  if (simpleMachine == null) { throw "must provide a simpleMachine" };

  this.registerList = ["accumulator", "addressRegister", "memoryAddressRegister", "memoryBufferRegister", "instructionRegister", "programCounter", "counter", "memory"]
  this.simpleMachine = simpleMachine;
  this.events  = window.eventEmitter;
  this.cloneObject = function(object) { return JSON.parse(JSON.stringify(object)) };
  this.intervalId = null;
  var observer = this;

  this.events.addListener('start', function() {
    this.runSimpleMachine();
  }.bind(this));

  this.events.addListener('stop', function() {
    clearInterval(this.intervalId);
  }.bind(this));

  this.events.addListener('reset', function() {
    SimpleMachine.reset();
    this.emitEventsForRegisters(this.registerList);
  }.bind(this));

  this.events.addListener('loadMemory', function(instructions) {
    SimpleMachine.memory = instructions;
    this.emitEventsForRegisters(['memory']);
  }.bind(this));

  this.getUpdatedRegisters = function(first, second) {
    var diff = [];

    this.registerList.forEach(function(key) {
      if (Array.isArray(first[key])) {
        first[key].forEach(function(val, index) {
          try {
            var newVal = second[key][index];
            if (val != newVal) { diff.push(key) }
          } catch(e) {
            diff.push(key);
          }
        });
      } else if (first[key] != second[key]) { 
        diff.push(key);
      }
    });

    return diff;
  };

  this.emitEventsForRegisters = function(updatedRegisters) {
    var observer = this;
    updatedRegisters.forEach(function(register) {
      observer.events.emitEvent(register, [observer.simpleMachine[register]]);
    });
  };

  this.runSimpleMachine = function() {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.observeStageWithExceptionHandling.bind(this), 500);
  };

  this.observeStageWithExceptionHandling = function(intervalId) {
    var cpu = simpleMachine;
    try {
      this.observeNextStage();
      if (cpu.programCounter > cpu.memory.length) {
        clearInterval(this.intervalId);
      }
    } catch(e) {
      if (e == "Halt") { 
        this.events.emitEvent('halt'); 
        clearInterval(this.intervalId);
      } else { throw(e); }
    }
  }

  this.observeNextStage = function() {
    var oldState, updatedRegisters;
    oldState = this.cloneObject(simpleMachine);
    //fn = simpleMachine.nextStage || simpleMachine.fetch
    //fn.call(simpleMachine);
    simpleMachine.cycle();
    updatedRegisters = this.getUpdatedRegisters(oldState, simpleMachine);
    this.emitEventsForRegisters(updatedRegisters);
  }
}
