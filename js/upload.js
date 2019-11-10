'use strict';

(function () {
  window.upload = function (url, data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === window.util.XhrStatus.DONE) {
        onSuccess(xhr.response);
      } else {
        onError();
      }
    });

    xhr.open('POST', url);
    xhr.send(data);
  };
})();
