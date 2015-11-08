window.eventEmitter = window.eventEmitter || new EventEmitter();

var SimpleMachineObserver = function(simpleMachine) {
  if (simpleMachine == null) { 
    throw "must provide a simpleMachine"
  };

  this.registerList = ["accumulator", "addressRegister", "memoryAddressRegister", "memoryBufferRegister", "instructionRegister", "programCounter", "counter",]
  this.simpleMachine = simpleMachine;
  this.events  = window.eventEmitter;
  this.cloneObject = function(object) { return JSON.parse(JSON.stringify(object)) };

  this.compareObjects = function(first, second) {
    var diff = [];

    this.registerList.forEach(function(key) {
      if (first[key] != second[key]) { diff.push(key); }
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
    this.intervalId = setInterval(
        this.observeCycleWithExceptionHandling.bind(this),
        300);
  };

  this.observeCycleWithExceptionHandling = function(intervalId) {
    var cpu = this.simpleMachine;
    try {
      this.observeCycle();
      if (cpu.programCounter >= cpu.memory.length) {
        clearInterval(this.intervalId);
      }
    } catch (e) {
      if (e == "Halt") { 
        this.events.emitEvent('halt'); 
        clearInterval(this.intervalId);
      } else { throw(e); }
    }
  }

  this.observeCycle = function() {
    var oldState, newState, updatedRegisters;
    oldState = this.cloneObject(simpleMachine);
    simpleMachine.cycle();
    newState = this.cloneObject(simpleMachine);
    updatedRegisters = this.compareObjects(oldState, newState);
    this.emitEventsForRegisters(updatedRegisters);
  };
}
