window.eventEmitter = window.eventEmitter || new EventEmitter();

var SimpleMachineObserver = function(simpleMachine) {
  if (simpleMachine == null) { throw "must provide a simpleMachine" };

  this.registerList = ["accumulator", "addressRegister", "memoryAddressRegister", "memoryBufferRegister", "instructionRegister", "programCounter", "counter"]
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

  this.events.addListener('cycle', function() {
    this.observeCycleWithExceptionHandling();
  }.bind(this));

  this.events.addListener('loadMemory', function(instructions) {
    SimpleMachine.memory = instructions;
  }.bind(this));

  this.getUpdatedRegisters = function(oldState, newState) {
    var diff = [];

    this.registerList.forEach(function(key) {
      if (oldState[key] != newState[key]) { diff.push(key); }
    });

    return diff;
  };

  this.emitEventsForRegisters = function(updatedRegisters) {
    var observer = this;
    updatedRegisters.forEach(function(register) {
      observer.events.emitEvent(register, [observer.simpleMachine[register]]);
    });
  };

  this.emitEventsForMemory = function(oldMemory, newMemory) {
    var newVal;
    var observer = this;

    oldMemory.forEach(function(oldVal, index) {
      newVal = newMemory[index];
      if (newVal !== oldVal) {
        observer.events.emitEvent('memoryUpdate', [index, newVal]);
      }
    });
    
  };

  this.runSimpleMachine = function() {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.observeCycleWithExceptionHandling.bind(this), 300);
  };

  this.observeCycleWithExceptionHandling = function(intervalId) {
    var cpu = simpleMachine;
    try {
      this.observeNextCycle();
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

  this.observeNextCycle = function() {
    var oldState, updatedRegisters;
    oldState = this.cloneObject(simpleMachine);
    simpleMachine.cycle();
    updatedRegisters = this.getUpdatedRegisters(oldState, simpleMachine);
    this.emitEventsForRegisters(updatedRegisters);
    this.emitEventsForMemory(oldState.memory, simpleMachine.memory);
  }
}
