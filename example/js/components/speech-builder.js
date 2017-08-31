AFRAME.registerSystem('speech-builder', {
  schema: {},
  init: function () {
    this.validCommands = ['add', 'move'];
    this.validDirections = ['left', 'right'];
    this.onSpeech = this.onSpeech.bind(this);
    this.onSpeechTriggered = this.onSpeechTriggered.bind(this);
    this.el.setAttribute('speech', '');
    this.el.sceneEl.addEventListener('speechcommand', this.onSpeech);
    this.el.sceneEl.addEventListener('speechtriggered', this.onSpeechTriggered);
    this.feedbackEl = document.querySelector('.user-feedback');
  },

  onSpeechTriggered: function () {
    var feedbackEl = this.feedbackEl;
    feedbackEl.innerHTML = 'Listening';
    feedbackEl.classList.remove('error');
    feedbackEl.classList.remove('success');
    feedbackEl.classList.add('listening');
  },

  onSpeech: function (evt) {
    var commands = evt.detail.commands;
    var primitive;
    var command = this.parseCommands(commands);
    var direction;
    var color;
    if (command === 'add') {
      var primitive = this.parsePrimitives(commands);
      if (!primitive) { return; }
      this.addPrimitive(primitive);
      this.updateFeedback();
      return;
    }
    if (command === 'move') {
      if (!this.primitiveEl) {
        console.log('Cannot move because there is no selected primitive');
      }
      var direction = this.parseDirection(commands);
      if (!direction) { 
        console.log('Uknown direction');
        return;
      }
      this.movePrimitive(direction);
      this.updateFeedback();
      return;
    }
    color = this.parseColor(commands);
    if (!color) {
      this.updateFeedback(true);
      return; 
    }
    this.changePrimitiveColor(color);
    this.updateFeedback();
  },

  updateFeedback: function (error) {
    var feedbackEl = this.feedbackEl;
    var cssClass = error ? 'error' : 'success';
    var message = error ? 'Command Unknown' : 'Command Parsed';
    feedbackEl.classList.remove('listening');
    feedbackEl.classList.add(cssClass);
    feedbackEl.innerHTML = message;
  },

  parseCommands: function (commands) {
    var validCommands = this.validCommands;
    var selectedCommand;
    var filteredCommands = commands.filter(function (commandCandidate) {
      validCommands.forEach(function (command) {
        if (commandCandidate.text.toLowerCase().indexOf(command) === -1) { return; }
        selectedCommand = command;
      });
    });
    return selectedCommand;
  },

  parsePrimitives: function (commands) {
    var primitives = AFRAME.primitives.primitives;
    var foundPrimitive;
    commands.forEach(function (commandCandidate) {
      Object.keys(primitives).forEach(function (primitive) {
        var primitiveName = primitive.split('-')[1];
        if (commandCandidate.text.toLowerCase().indexOf(primitiveName) === -1) { return; }
        foundPrimitive = primitiveName;
      });
    });
    return foundPrimitive;
  },

  parseDirection: function (commands) {
    var validDirections = this.validDirections;
    var foundDirection;
    commands.forEach(function (commandCandidate) {
      validDirections.forEach(function (direction) {
        if (commandCandidate.text.toLowerCase().indexOf(direction) === -1) { return; }
        foundDirection = direction;
      });
    });
    return foundDirection;
  },

  parseColor: function (commands) {
    var foundColor;
    commands.forEach(function (commandCandidate) {
      var command = commandCandidate.text.toLowerCase()
      var color = new THREE.Color(command);
      if (color === 'white') { 
        foundColor = color;
        return; 
      }
      if (color.r === 1 && color.g === 1 && color.b === 1) { return; }
      foundColor = command;
    });
    return foundColor;
  },

  addPrimitive: function (primitive) {
    var primitiveEl = this.primitiveEl = document.createElement('a-' + primitive);
    primitiveEl.setAttribute('position', '-1 1.6 -3');
    primitiveEl.setAttribute('rotation', '0 45 0');
    primitiveEl.setAttribute('color', 'magenta');
    primitiveEl.setAttribute('material', 'flatShading', true);
    this.el.appendChild(primitiveEl);
    console.log("Primitive added " + primitive);
  },

  movePrimitive: function (direction) {
    var primitiveEl = this.primitiveEl;
    var newPosition;
    var xDelta = direction === 'left' ? -0.5 : 0.5;
    if (!primitiveEl) { return; }
    var newPosition = primitiveEl.getAttribute('position');
    newPosition.x = newPosition.x + xDelta;
    primitiveEl.setAttribute('position', newPosition);
  },

  changePrimitiveColor: function (color) {
    var primitiveEl = this.primitiveEl;
    if (!primitiveEl) { return; }
    primitiveEl.setAttribute('color', color);
  }
});