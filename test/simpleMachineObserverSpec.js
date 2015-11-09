// is given a simple machine object that has memory already loaded:
// makes the object cycle and emits events on:
//  - memory writes
//  - memory reads?

describe("SimpleMachineObserver", function() {
  it("requires a simpleMachine is provided as an argument on instantiation", function() {
    expect(function() { new SimpleMachineObserver() }).toThrow();
  });

  describe(".observeCycle()", function() {
    it("emits an event when the program counter changes", function() {
      SimpleMachine.resetRegisters();
      SimpleMachine.memory = ["0x1000"];

      var observer = new SimpleMachineObserver(SimpleMachine);
      var ee = observer.events
      spyOn(ee, 'emitEvent');
      observer.observeCycle();
      expect(ee.emitEvent).toHaveBeenCalledWith('accumulator', [4096]);
    });
  });

  describe(".observeCycleWithExceptionHandling", function() {
    it("emits a halt event when the program halts", function() {
      SimpleMachine.resetRegisters();
      SimpleMachine.memory = ["0x0000"];
    
      var observer = new SimpleMachineObserver(SimpleMachine);
      var ee = observer.events
      spyOn(ee, 'emitEvent');
      observer.observeCycleWithExceptionHandling();
      expect(ee.emitEvent).toHaveBeenCalledWith('halt');
    });
  });

  describe(".runSimpleMachine()", function() {
    it("runs a simple program", function() {
      SimpleMachine.resetRegisters();
      SimpleMachine.memory = [
        "0x1003", // (address 0) load word to copy from address 3
        "0x2004", // (address 1) store it in new location (address 4)
        "0x0000", // (address 2) halt
        "0x4040", // (address 3) the word to copy
        "0x0000"] // (address 4) the location to copy to

      var observer = new SimpleMachineObserver(SimpleMachine);
      observer.runSimpleMachine();
      expect(SimpleMachine.memory[3]).toBe("0x4040");
    });
  });
});
