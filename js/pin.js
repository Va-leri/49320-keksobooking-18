'use strict';

(function () {
  // Находим в разметке блок для отрисовки меток
  var pinsBlock = window.map.block.querySelector('.map__pins');

  // Задаем размеры метки
  var PinSize = {
    WIDTH: 50,
    HEIGHT: 70,
  };

  // Находим шаблон метки .map__pin из шаблона #pin
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');


  // Находим активную метку
  var activePin = window.map.block.querySelector('.map__pin--active');

  window.pin = {
    active: activePin,

    // Функция отрисовки меток во фрагмент
    render: function (appartmentsArray) {
      // Создаем фрагмент для временного хранения отрисованных меток
      var fragment = document.createDocumentFragment();

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

    insert: function (dataArray, quantity) {
      var visibleArray = dataArray.slice(0, quantity);
      var fragment = window.pin.render(visibleArray);
      var pins = fragment.querySelectorAll('.map__pin');
      pinsBlock.appendChild(fragment);
      pins.forEach(function (element) {
        var appartmentsNumber = element.number;
        element.addEventListener('click', function (evt) {
          window.card.insert(visibleArray[appartmentsNumber]);
          if (window.pin.active) {
            window.pin.active.classList.remove('map__pin--active');
          }
          window.pin.active = evt.currentTarget;
          window.pin.active.classList.add('map__pin--active');
        });
        element.addEventListener('keydown', function (evt) {
          window.util.isEnterEvent(evt, function () {
            window.card.insert(visibleArray[appartmentsNumber]);
          });
        });
      });
    },

    delete: function () {
      var pins = window.map.block.querySelectorAll('.map__pin:not(.map__pin--main)');
      pins.forEach(function (element) {
        element.remove();
      });
    },
  };
})();


