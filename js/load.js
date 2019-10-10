'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking/data';
  window.load = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError();
      }
    });
    xhr.responseType = 'json';
    xhr.open('GET', URL);
    xhr.send();
  };
})();

