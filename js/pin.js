'use strict';

(function () {
  // Задаем размеры метки
  var PIN_SIZE = {
    width: 50,
    height: 70,
  };

  // Находим шаблон метки .map__pin из шаблона #pin
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  // Создаем фрагмент для временного хранения отрисованных меток
  var fragment = document.createDocumentFragment();

  window.pin = {
    // PIN_SIZE: PIN_SIZE,
    // mapPinTemplate: mapPinTemplate,

    // Функция отрисовки меток во фрагмент
    renderPins: function (appartmentsArray) {
      for (var i = 0; i < appartmentsArray.length; i++) {
        var pin = mapPinTemplate.cloneNode(true);
        pin.number = i;
        pin.style = 'left: ' + (appartmentsArray[i].location.x - PIN_SIZE.width / 2) + 'px; top:' + (appartmentsArray[i].location.y - PIN_SIZE.height) + 'px;';
        pin.querySelector('img').src = appartmentsArray[i].author.avatar;
        pin.querySelector('img').alt = appartmentsArray[i].offer.title;
        fragment.appendChild(pin);
      }
      return fragment;
    },
  };
})();


