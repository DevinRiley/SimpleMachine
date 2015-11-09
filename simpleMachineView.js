window.eventEmitter = window.eventEmitter || new EventEmitter();

(function() {
  var SimpleMachineView = function() {}
  var proto = SimpleMachineView.prototype;

  // regex of joy: 0x[^\s#]+
  proto.rootEl = document.getElementById('root');
  proto.events = window.eventEmitter;

  proto.fadeElement = function(el) {
   el.style.backgroundColor = 'rgb(0,220,0)';
   var timeoutId = window.setTimeout(function() { 
     el.style.transition = 'background 0.5s ease-in'; 
     el.style.backgroundColor = 'white'
     window.clearTimeout(timeoutId);
   }, 50);
   el.style.transition = ''; 
  }

  proto.newListener = function(name) {
    var view = this;
    this.events.addListener(name, function(newValue) {
      var el, valueEl;
      el = document.getElementById(name)
      valueEl = el.querySelectorAll('.value')[0];
      valueEl.innerText = newValue;
      view.fadeElement(valueEl);
    });
  }

  proto.initListeners = function() {
    var registerList = ["accumulator", "addressRegister", "memoryAddressRegister", "memoryBufferRegister", "instructionRegister", "programCounter", "counter"];
    var view = this;

    registerList.forEach(function(register) {
      view.newListener(register);
    });
  }

  this.SimpleMachineView = SimpleMachineView;
}).call(this)
