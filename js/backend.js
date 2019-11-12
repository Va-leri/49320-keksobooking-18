'use strict';

(function () {
  var setup = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === window.util.XhrStatus.DONE) {
        onSuccess(xhr.response);
      } else {
        onError();
      }
    });
    xhr.addEventListener('error', function () {
      onError();
    });
    xhr.addEventListener('timeout', function () {
      onError();
    });

    xhr.timeout = window.util.SERVER_TIME;

    return xhr;
  };

  window.backend = {
    load: function (onSuccess, onError) {
      var xhr = setup(onSuccess, onError);
      xhr.open('GET', window.data.SERVER_URL + '/data');
      xhr.send();
    },


    upload: function (data, onSuccess, onError) {
      var xhr = setup(onSuccess, onError);
      xhr.open('POST', window.data.SERVER_URL);
      xhr.send(data);
    },
  };
})();
