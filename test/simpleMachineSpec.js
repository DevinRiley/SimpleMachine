describe("SimpleMachine", function() {
    it("exists", function() {
        expect(SimpleMachine).toEqual(jasmine.anything());
    });

    it("should have the PC, accumulator, counter and all the registers initiliazed to zero", function() {
        expect(SimpleMachine.accumulator).toBe(0);
        expect(SimpleMachine.addressRegister).toBe(0);
        expect(SimpleMachine.memoryAddressRegister).toBe(0);
        expect(SimpleMachine.memoryBufferRegister).toBe(0);
        expect(SimpleMachine.instructionRegister).toBe(0);
        expect(SimpleMachine.programCounter).toBe(0);
        expect(SimpleMachine.counter).toBe(0);
    });

    it("initializes memory to an empty array", function() {
      expect(SimpleMachine.memory).toEqual([]);
    });

    describe(".reset()", function() {
      it("sets all values to 0", function() {
        SimpleMachine.accumulator = 1;
        SimpleMachine.addressRegister = 1;
        SimpleMachine.memoryBufferRegister = 1;
        SimpleMachine.instructionRegister = 1;
        SimpleMachine.programCounter = 1;
        SimpleMachine.counter = 1;

        SimpleMachine.resetRegisters();
        expect(SimpleMachine.accumulator).toBe(0);
        expect(SimpleMachine.addressRegister).toBe(0);
        expect(SimpleMachine.memoryAddressRegister).toBe(0);
        expect(SimpleMachine.memoryBufferRegister).toBe(0);
        expect(SimpleMachine.instructionRegister).toBe(0);
        expect(SimpleMachine.programCounter).toBe(0);
        expect(SimpleMachine.counter).toBe(0);
      });
    });

    describe("._get()", function() {
      it("sets the memoryBufferRegister to the contents of memory from memory address register", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.memory = ['0x1234'];

        SimpleMachine._get();
        expect(SimpleMachine.memoryBufferRegister).toBe(parseInt('0x1234'));
      });
    });

    describe("LOAD instruction", function() {
      it("loads accumulator from memory", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.memory = ['0x0007'];

        SimpleMachine.execute("0x1000");
        expect(SimpleMachine.accumulator).toBe(7);
      });
    });

    describe("STORE instruction", function() {
      it("stores accumulator to memory", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.memoryBufferRegister = 64;

        SimpleMachine.execute("0x2000");
        expect(SimpleMachine.memory[0]).toBe('0x0040');
      });
    });

    describe("ADD instruction", function() {
      it("adds memory buffer register to accumulator", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.memoryBufferRegister = 1;

        SimpleMachine.execute("0x8000");
        expect(SimpleMachine.accumulator).toBe(1);
      });
    });

    describe("SUB instruction", function() {
      it("subtracts memory buffer register from accumulator", function() {
        SimpleMachine.resetRegisters();

        SimpleMachine.memoryBufferRegister = 1;
        SimpleMachine.execute("0x9000");
        expect(SimpleMachine.accumulator).toBe(-1);
      });
    });

    describe("ADDC instruction", function() {
      it("adds the counter to the accumulator", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.counter = 1;
        SimpleMachine.accumulator = 1;

        SimpleMachine.execute("0x3000");
        expect(SimpleMachine.accumulator).toBe(2);
      });
    });

    describe("MVAC instruction", function() {
      it("moves the accumulator to the counter", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.accumulator = 7;

        SimpleMachine.execute("0x4000");
        expect(SimpleMachine.counter).toBe(7);
      });
    });

    describe("DEC instruction", function() {
      it("decrements the counter", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.counter = 7;

        SimpleMachine.execute("0xA000");
        expect(SimpleMachine.counter).toBe(6);
      });
    });

    describe("JEQ instruction", function() {
      it("changes the PC value if counter is zero", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.counter = 0;

        SimpleMachine.execute("0x500A");
        expect(SimpleMachine.programCounter).toBe(10);
      });

      it("doesn't change the PC value if counter is not zero", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.counter = 1;

        SimpleMachine.execute("0x500A");
        expect(SimpleMachine.programCounter).toBe(0);
      });
    });

    describe("JLT instruction", function() {
      it("changes the PC value if counter is less than zero", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.counter = -1;

        SimpleMachine.execute("0x600A");
        expect(SimpleMachine.programCounter).toBe(10);
      });

      it("doesn't change the PC value if counter >= zero", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.counter = 0;

        SimpleMachine.execute("0x600A");
        expect(SimpleMachine.programCounter).toBe(0);
      });
    });

    describe("JMP instruction", function() {
      it("changes the PC value to the value of the operand", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.counter = -1;

        SimpleMachine.execute("0x600A");
        expect(SimpleMachine.programCounter).toBe(10);
      });
    });

    describe("LA instruction", function() {
      it("changes the accumulator value to the value of the operand", function() {
        SimpleMachine.resetRegisters();

        SimpleMachine.execute("0xBFFF");
        expect(SimpleMachine.accumulator).toBe(1023);
      });
    });

    describe("LIA instruction", function() {
      it("loads accumulator with value from address in the areg", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.memory = ["0x0000", "0x000A"];
        SimpleMachine.addressRegister = 1;

        SimpleMachine.execute("0xC000");
        expect(SimpleMachine.accumulator).toBe(10);
      });
    });

    describe("SIA instruction", function() {
      it("stores the accumulator value at address in areg", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.accumulator = 17;
        SimpleMachine.addressRegister = 0;
        SimpleMachine.memory = ["0x0000", "0x000A"];

        SimpleMachine.execute("0xD000");
        expect(SimpleMachine.memory[0]).toBe("0x0011");
      });
    });

    describe("MVAA instruction", function() {
      it("moves the value in the accumulator to the areg", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.accumulator = 17;

        SimpleMachine.execute("0xE000");
        expect(SimpleMachine.addressRegister).toBe(17);
      });
    });
});
