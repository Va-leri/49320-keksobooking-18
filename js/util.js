'use strict';

(function () {
  var Keycode = {
    ENTER: 13,
    ESC: 27,
  };

  var XhrStatus = {
    DONE: 200,
  };

  var SERVER_TIME = 10000; // ms

  window.util = {
    SERVER_TIME: SERVER_TIME,
    XhrStatus: XhrStatus,

    isEnterEvent: function (evt, action) {
      // console.log('enter evt');
      if (evt.keyCode === Keycode.ENTER) {
        action();
      }
    },

    isEscEvent: function (evt, action) {
      if (evt.keyCode === Keycode.ESC) {
        action();
      }
    },
  };
})();
