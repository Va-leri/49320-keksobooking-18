'use strict';

(function () {
  // Задаем размеры метки
  var PinSize = {
    WIDTH: 50,
    HEIGHT: 70,
  };

  // Находим шаблон метки .map__pin из шаблона #pin
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  // Создаем фрагмент для временного хранения отрисованных меток
  var fragment = document.createDocumentFragment();

  window.pin = {
    // Функция отрисовки меток во фрагмент
    render: function (appartmentsArray) {

      appartmentsArray.forEach(function (element, index) {
        var pin = mapPinTemplate.cloneNode(true);
        pin.number = index;
        pin.style = 'left: ' + (element.location.x - PinSize.WIDTH / 2) + 'px; top:' + (element.location.y - PinSize.HEIGHT) + 'px;';
        pin.querySelector('img').src = element.author.avatar;
        pin.querySelector('img').alt = element.offer.title;
        fragment.appendChild(pin);
      });
      return fragment;
    },
  };
})();


