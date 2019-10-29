'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500; // ms

  var lastTimeout;

  window.debounce = function (action) {
    // Проверяем, есть ли ранее установленный таймаут
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }

    // Вызываем action через интервал DEBOUNCE_INTERVAL
    lastTimeout = window.setTimeout(action, DEBOUNCE_INTERVAL);
  };

})();
