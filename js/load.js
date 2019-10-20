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
      // window.card.openCardByPin(appartmentsArray);

      // Находим пины в разметке
      // var pins = document.querySelectorAll('.map__pin');

      // var onPinClick = function (evt) {
      //   if (document.querySelector('.map__card')) {
      //     window.map.deleteCard();
      //   }
      //   var appartmentsNumber = evt.currentTarget.number;
      //   window.map.insertCard(appartmentsArray[appartmentsNumber]);
      // };


      // pins.forEach(function (element) {
      //   var appartmentsNumber = element.number;
      //   element.addEventListener('click', function () {
      //     // window.map.deleteCard();
      //     window.map.insertCard(appartmentsArray[appartmentsNumber]);
      //   });
      //   element.addEventListener('keydown', function (evt) {
      //     window.util.isEnterEvent(evt, function () {
      //       window.map.insertCard(appartmentsArray[appartmentsNumber]);
      //     });
      //   });
      // });


      // window.map.insertCard(dataArray);
      // Функция фильтрации по типу жилья
      var onHousingTypeChange = function () {
        window.map.deletePins();
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
        window.card.openCardByPin(filteredArray);
      };
      window.map.housingType.addEventListener('change', onHousingTypeChange);
    },

    onErrorLoad: function () {
      // Находим шаблон ошибки .error из шаблона #error
      var errorTemplate = document.querySelector('#error').content.querySelector('.error');
      // Находим блок main в разметке
      var mainBlock = document.querySelector('main');
      var errorBlock = errorTemplate.cloneNode(true);
      // Вставляем блок с ошибкой в разметку (в начало блока main)
      mainBlock.prepend(errorBlock);
    },
  };
})();

