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
    // Функция отрисовки меток во фрагмент
    renderPins: function (appartmentsArray) {

      appartmentsArray.forEach(function (element, index) {
        var pin = mapPinTemplate.cloneNode(true);
        pin.number = index;
        pin.style = 'left: ' + (element.location.x - PIN_SIZE.width / 2) + 'px; top:' + (element.location.y - PIN_SIZE.height) + 'px;';
        pin.querySelector('img').src = element.author.avatar;
        pin.querySelector('img').alt = element.offer.title;
        fragment.appendChild(pin);
      });
      return fragment;
    },
  };
})();


