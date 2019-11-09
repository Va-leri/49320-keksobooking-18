'use strict';

(function () {
  window.load = {
    getData: function (url, onSuccess, onError) {
      var xhr = new XMLHttpRequest();
      xhr.addEventListener('load', function () {
        if (xhr.status === window.util.XhrStatus.DONE) {
          onSuccess(xhr.response);
        } else {
          onError();
        }
      });
      xhr.responseType = 'json';
      xhr.open('GET', url);
      xhr.send();
    },

  };
})();

