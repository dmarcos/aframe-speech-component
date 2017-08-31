AFRAME.registerSystem('speech', {
  schema: {},
  init: function () {
    var el = this.el;
    this.onKeyDown = this.onKeyDown.bind(this);
    this.listener = this.listener.bind(this);
    var stm = this.stm = SpeakToMe({listener: this.listener});
    window.addEventListener('keydown', this.onKeyDown);
  },

  listener: function (evt) {
    console.log('listener', evt);
    if (evt.state == 'result') {
     results = evt.data.sort(function(a, b) { a.confidence - b.confidence; });
     this.el.emit('speechcommand', {commands: results});
    } else if (evt.state == 'ready') {
     
    }
  },

  onKeyDown: function (evt) {
    var el = this.el;
    var shortcutPressed = evt.keyCode === 84 && evt.ctrlKey && evt.altKey;
    if (!shortcutPressed) { return; }
    el.emit('speechtriggered');
    el.systems.speech.stm.listen();
  }
});

