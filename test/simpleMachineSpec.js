describe("SimpleMachine", function() {
    it("exists", function() {
        expect(SimpleMachine).toEqual(jasmine.anything());
    });

    it("should have an accumulator register that returns a number", function() {
        expect(SimpleMachine.accumulator).toBe(jasmine.any(Number));
    });
});
