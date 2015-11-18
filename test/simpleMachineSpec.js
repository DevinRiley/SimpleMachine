describe("SimpleMachine", function() {
    it("exists", function() {
        expect(SimpleMachine).toEqual(jasmine.anything());
    });

    describe(".resetRegisters()", function() {
      it("sets all values to 0", function() {
        SimpleMachine.accumulator = 1;
        SimpleMachine.addressRegister = 1;
        SimpleMachine.memoryAddressRegister = 1;
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
        SimpleMachine.memory = ["0x1234"];

        SimpleMachine._get();
        expect(SimpleMachine.memoryBufferRegister).toBe(parseInt('0x1234'));
      });
    });

    describe("LOAD instruction", function() {
      it("loads accumulator from memory", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.memory = ["0x1001", "0x0007"];

        SimpleMachine.cycle();
        expect(SimpleMachine.accumulator).toBe(7);
      });
    });

    describe("STORE instruction", function() {
      it("stores accumulator to memory", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.accumulator = 64;

        SimpleMachine.memory = ["0x2000"];
        SimpleMachine.cycle();
        expect(SimpleMachine.memory[0]).toBe('0x0040');
      });
    });

    describe("ADD instruction", function() {
      it("adds memory buffer register to accumulator", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.memoryBufferRegister = 1;

        SimpleMachine.memory = ["0x8000"];
        SimpleMachine.cycle();
        expect(SimpleMachine.accumulator).toBe(1);
      });
    });

    describe("SUB instruction", function() {
      it("subtracts memory buffer register from accumulator", function() {
        SimpleMachine.resetRegisters();

        SimpleMachine.memoryBufferRegister = 1;
        SimpleMachine.memory = ["0x9000"];
        SimpleMachine.cycle();
        expect(SimpleMachine.accumulator).toBe(-1);
      });
    });

    describe("ADDC instruction", function() {
      it("adds the counter to the accumulator", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.counter = 1;
        SimpleMachine.accumulator = 1;

        SimpleMachine.memory = ["0x3000"];
        SimpleMachine.cycle();
        expect(SimpleMachine.accumulator).toBe(2);
      });
    });

    describe("MVAC instruction", function() {
      it("moves the accumulator to the counter", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.accumulator = 7;

        SimpleMachine.memory = ["0x4000"];
        SimpleMachine.cycle();
        expect(SimpleMachine.counter).toBe(7);
      });
    });

    describe("DEC instruction", function() {
      it("decrements the counter", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.counter = 7;

        SimpleMachine.memory = ["0xA000"];
        SimpleMachine.cycle();
        expect(SimpleMachine.counter).toBe(6);
      });
    });

    describe("JEQ instruction", function() {
      it("changes the PC value if counter is zero", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.counter = 0;

        SimpleMachine.memory = ["0x500A"];
        SimpleMachine.cycle();
        expect(SimpleMachine.programCounter).toBe(10);
      });

      it("doesn't change the PC value if counter is not zero", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.counter = 1;

        SimpleMachine.memory = ["0x500A"];
        SimpleMachine.cycle();
        expect(SimpleMachine.programCounter).toBe(1);
      });
    });

    describe("JLT instruction", function() {
      it("changes the PC value if counter is less than zero", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.counter = -1;

        SimpleMachine.memory = ["0x600A"];
        SimpleMachine.cycle();
        expect(SimpleMachine.programCounter).toBe(10);
      });

      it("doesn't change the PC value if counter >= zero", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.counter = 0;

        SimpleMachine.memory = ["0x600A"];
        SimpleMachine.cycle();
        expect(SimpleMachine.programCounter).toBe(1);
      });
    });

    describe("JMP instruction", function() {
      it("changes the PC value to the value of the operand", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.counter = -1;

        SimpleMachine.memory = ["0x7001","0x0000"];
        SimpleMachine.cycle();
        expect(SimpleMachine.programCounter).toBe(1);
      });
    });

    describe("LA instruction", function() {
      it("changes the accumulator value to the value of the operand", function() {
        SimpleMachine.resetRegisters();

        SimpleMachine.memory = ["0xBFFF"];
        SimpleMachine.cycle();
        expect(SimpleMachine.accumulator).toBe(1023);
      });
    });

    describe("LIA instruction", function() {
      it("loads accumulator with value from address in the areg", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.memory = ["0xC000", "0x000A"];
        SimpleMachine.addressRegister = 1;

        SimpleMachine.cycle();
        expect(SimpleMachine.accumulator).toBe(10);
      });
    });

    describe("SIA instruction", function() {
      it("stores the accumulator value at address in areg", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.accumulator = 17;
        SimpleMachine.addressRegister = 0;
        SimpleMachine.memory = ["0xD000", "0x000A"];

        SimpleMachine.cycle();
        expect(SimpleMachine.memory[0]).toBe("0x0011");
      });
    });

    describe("MVAA instruction", function() {
      it("moves the value in the accumulator to the areg", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.accumulator = 17;

        SimpleMachine.memory = ["0xE000"];
        SimpleMachine.cycle();
        expect(SimpleMachine.addressRegister).toBe(17);
      });
    });

    describe("HALT instruction", function() {
      it("throws a Halt exception", function() {
        SimpleMachine.resetRegisters();

        SimpleMachine.memory = ["0x0000"];
        SimpleMachine.fetch()
        SimpleMachine.decode();
        expect(function() { SimpleMachine.execute(); }).toThrow("Halt");
      });
    });

  describe(".fetch()", function() {
    it("places the instruction at the address of the PC into the instruction register", function() {
      SimpleMachine.resetRegisters();
      SimpleMachine.memory = ["0x1000"];
      
      SimpleMachine.fetch();
      expect(SimpleMachine.instructionRegister).toBe("0x1000");
    });
  });

  describe(".decode()", function() {
    it("parses the instruction in the instructionRegister into an opcode and operand", function() {
      SimpleMachine.resetRegisters();
      SimpleMachine.instructionRegister = "0x1000";
      
      SimpleMachine.decode();
      expect(SimpleMachine.decodedInstruction.opcode).toBe(1);
      expect(SimpleMachine.decodedInstruction.operand).toBe(0);
    });
  });

  describe(".execute()", function() {
    it("executes the decoded instruction", function() {
      SimpleMachine.resetRegisters();
      SimpleMachine.decodedInstruction = {
        opcode: 1,
        operand: 7,
      }
      spyOn(SimpleMachine, 'load');
      
      SimpleMachine.execute();
      expect(SimpleMachine.load).toHaveBeenCalledWith(7);
    });
  });

  describe(".run()", function() {
    it("executes instructions until running out", function() {
      SimpleMachine.resetRegisters();
      SimpleMachine.memory = ["0xA000", "0xA000", "0xA000"]

      SimpleMachine.run();
      expect(SimpleMachine.counter).toBe(-3);
    });

    it("stops executing if it hits a halt instruction", function() {
      SimpleMachine.resetRegisters();
      SimpleMachine.memory = ["0xA000", "0x0000", "0xA000"]

      SimpleMachine.run();
      expect(SimpleMachine.counter).toBe(-1);
      expect(SimpleMachine.programCounter).toBe(2);
    });

    it("correctly runs a simple program", function() {
      SimpleMachine.resetRegisters();
      SimpleMachine.memory = [
        "0x1003", // (address 0) load word to copy from address 3
        "0x2005", // (address 1) store it in new location (address 4)
        "0x0000", // (address 2) halt
        "0x4040", // (address 3) the word to copy
        "0x0000", // (address 4) the location to copy to
        "0x0000"] // (address 4) the location to copy to

      SimpleMachine.run();
      expect(SimpleMachine.memory[5]).toBe("0x4040");
    });
  });

  describe(".cycle()", function() {
    it("runs a single fetch/decode/execute cycle and updates program counter", function() {
        SimpleMachine.resetRegisters();
        SimpleMachine.memory = ["0x1000"];

        SimpleMachine.cycle();
        expect(SimpleMachine.accumulator).toBe(4096);
        expect(SimpleMachine.programCounter).toBe(1);
    });
  });

  describe(".reset()", function() {
    it("resets registers, and decodedInstruction attributes", function() {
      SimpleMachine.resetRegisters();
      SimpleMachine.memory = [ "0xB001"]
      SimpleMachine.cycle();
      expect(SimpleMachine.programCounter).toBe(1);
      expect(SimpleMachine.decodedInstruction.opcode).not.toBe(null);

      SimpleMachine.reset();
      expect(SimpleMachine.programCounter).toBe(0);
      expect(SimpleMachine.decodedInstruction.opcode).toBe(null);
    });
  });

});
