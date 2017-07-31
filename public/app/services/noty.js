function noty(type, message) {
  new Noty({
    type: type,
    layout: 'topRight',
    theme: 'metroui',
    text: message,
    timeout: 1000,
    progressBar: true,
    closeWith: ['click'],
    animation: {
      open: function(promise) {
        var n = this;
        new Bounce()
          .translate({
            from: { x: 450, y: 0 },
            to: { x: 0, y: 0 },
            easing: "bounce",
            duration: 1000,
            bounces: 4,
            stiffness: 3
          })
          .scale({
            from: { x: 1.2, y: 1 },
            to: { x: 1, y: 1 },
            easing: "bounce",
            duration: 1000,
            delay: 100,
            bounces: 4,
            stiffness: 1
          })
          .scale({
            from: { x: 1, y: 1.2 },
            to: { x: 1, y: 1 },
            easing: "bounce",
            duration: 1000,
            delay: 100,
            bounces: 6,
            stiffness: 1
          })
          .applyTo(n.barDom, {
            onComplete: function() {
              promise(function(resolve) {
                resolve();
              })
            }
          });
      },
      close: function(promise) {
        var n = this;
        new Bounce()
          .translate({
            from: { x: 0, y: 0 },
            to: { x: 450, y: 0 },
            easing: "bounce",
            duration: 500,
            bounces: 4,
            stiffness: 1
          })
          .applyTo(n.barDom, {
            onComplete: function() {
              promise(function(resolve) {
                resolve();
              })
            }
          });
      }
    },
    id: false,
    force: false,
    killer: false,
    queue: 'global',
    container: false,
    buttons: [],
    sounds: {
      sources: [],
      volume: 1,
      conditions: []
    },
    titleCount: {
      conditions: []
    },
    modal: false
  }).show()
}