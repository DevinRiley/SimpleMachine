describe("SimpleMachine", function() {
    it("exists", function() {
        expect(SimpleMachine).toEqual(jasmine.anything());
    });

    it("should have the PC, accumulator, counter and all the registers initiliazed to zero", function() {
        expect(SimpleMachine.accumulator).toBe(0);
        expect(SimpleMachine.addressRegister).toBe(0);
        expect(SimpleMachine.memoryAddressReigster).toBe(0);
        expect(SimpleMachine.memoryBufferRegister).toBe(0);
        expect(SimpleMachine.instructionRegister).toBe(0);
        expect(SimpleMachine.programCounter).toBe(0);
        expect(SimpleMachine.counter).toBe(0);
    });

   it("has 10,000 units of memory", function() {
     expect(SimpleMachine.memory.length).toBe(10000);
   });

});
