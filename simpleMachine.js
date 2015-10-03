var SimpleMachine = {
  accumulator: 0,
  addressRegister: 0,
  memoryAddressReigster: 0,
  memoryBufferRegister: 0,
  instructionRegister: 0,
  programCounter: 0,
  counter: 0,
  memory: new Array(10000),
};
// memory should be loaded with program contents (strip out comments and blank lines first)
// there should be something resembling the fetch/decode/execute cycle
// should interpet instructions
// should have datapaths implicit in
