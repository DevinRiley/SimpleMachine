var SimpleMachine = {
  accumulator: 0,
  addressRegister: 0,
  memoryAddressRegister: 0,
  memoryBufferRegister: 0,
  instructionRegister: 0,
  programCounter: 0,
  counter: 0,
  memory: [],

  OPCODE_MASK:  0b1111000000000000,
  OPERAND_MASK: 0b0000001111111111,


  resetRegisters: function() {
    this.accumulator =  0;
    this.addressRegister = 0;
    this.memoryAddressReigster = 0;
    this.memoryBufferRegister = 0;
    this.instructionRegister = 0;
    this.programCounter = 0;
    this.counter = 0;
  },

  execute: function(instructionAsString) {
    var instruction, functionToExecute;

    instruction = this._parseInstruction(instructionAsString);
    functionToExecute = this._opcodeToFunction(instruction.opcode)
    functionToExecute.apply(this, [instruction.operand]);
  },

  add: function() {
    this.accumulator += this.memoryBufferRegister;
  },

  sub: function() {
    this.accumulator -= this.memoryBufferRegister;
  },

  addc: function() {
    this.accumulator += this.counter;
  },

  mvac: function() {
    this.counter = this.accumulator;
  },

  dec: function() {
    this.counter -= 1;
  },

  load: function(address) {
    this.memoryAddressRegister = address;
    this._get()
    this.accumulator = this.memoryBufferRegister;
  },

  store: function(address) {
    this.memoryAddressRegister = address;
    this._put()
  },

  jeq: function(address) {
    if (this.counter == 0) { this.programCounter = address };
  },

  jlt: function(address) {
    if (this.counter < 0) { this.programCounter = address };
  },

  la: function(address) {
    this.accumulator = address;
  },

  lia: function(address) {
    this.accumulator = this._fetchValueFromMemory(this.addressRegister);
  },

  sia: function() {
    this.memory[this.addressRegister] = this._valueToWord(this.accumulator);
  },

  mvaa: function() {
    this.addressRegister = this.accumulator;
  },

  _get: function() {
    this.memoryBufferRegister = this._fetchValueFromMemory(this.memoryAddressRegister);
  },

  _put: function() {
    this.memory[this.memoryAddressRegister] = this._valueToWord(this.memoryBufferRegister);
  },

  _fetchValueFromMemory: function(address) {
    return parseInt(this.memory[address]);
  },

  _valueToWord: function(value) {
    var hex = value.toString(16).toUpperCase();
    while (hex.length < 4) { hex = "0" + hex; }
    return "0x" + hex
  },

  _parseInstruction: function(instructionAsString) {
    instruction = parseInt(instructionAsString);
    if (instruction == NaN) throw "Invalid instruction (must be hex string e.g. 0x8001)";
    return {
      opcode:  (instruction & this.OPCODE_MASK) >>> 12,
      operand: instruction & this.OPERAND_MASK,
    }
  },

  _opcodeToFunction: function(opcode) {
    var cpu = this;
    var opcodeMap = {
      0:  cpu.halt,
      1:  cpu.load,
      2:  cpu.store,
      3:  cpu.addc,
      4:  cpu.mvac,
      5:  cpu.jeq,
      6:  cpu.jlt,
      7:  cpu.jmp,
      8:  cpu.add,
      9:  cpu.sub,
      10: cpu.dec,
      11: cpu.la,
      12: cpu.lia,
      13: cpu.sia,
      14: cpu.mvaa,
    }

    return opcodeMap[opcode];
  },
};
// memory should be loaded with program contents (strip out comments and blank lines first)
// there should be something resembling the fetch/decode/execute cycle
// should have datapaths implicit in how methods work
