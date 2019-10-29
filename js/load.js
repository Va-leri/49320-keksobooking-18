'use strict';

(function () {
  // var URL = 'https://js.dump.academy/keksobooking/data';
  // var appartmentsArray = [];
  // var filteredArray = [];


  window.load = {
    // appartmentsArray: appartmentsArray,

    getData: function (url, onSuccess, onError) {
      var xhr = new XMLHttpRequest();
      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
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

