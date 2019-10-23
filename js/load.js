'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking/data';
  var appartmentsArray = [];
  var filteredArray = [];


  window.load = {
    appartmentsArray: appartmentsArray,

    getData: function (onSuccess, onError) {
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
    },
    // Добавляем обработчики загрузки данных с сервера
    onSuccessLoad: function (dataArray) {
      appartmentsArray = dataArray;
      window.map.insertPins(appartmentsArray, window.map.MAX_PIN_QUANTITY);

      // window.map.insertCard(dataArray);
      // Функция фильтрации по типу жилья
      var onHousingTypeChange = function () {
        window.map.deletePins();
        window.map.deleteCard();
        switch (window.map.housingType.value) {
          case 'any':
            filteredArray = dataArray;
            break;
          default:
            filteredArray = dataArray.filter(function (element) {
              return element.offer.type === window.map.housingType.value;
            });
        }
        window.map.insertPins(filteredArray, window.map.MAX_PIN_QUANTITY);
        // window.card.openCardByPin(filteredArray);
      };
      window.map.housingType.addEventListener('change', onHousingTypeChange);
    },

    onErrorLoad: function () {
      window.main.showError();
    },
  };
})();

