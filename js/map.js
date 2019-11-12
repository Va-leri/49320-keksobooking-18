'use strict';

(function () {
  // Задаем максимальное количество отображаемых меток
  var MAX_PIN_QUANTITY = 5;

  // Размер "хвостика" активной метки
  var ACTIVE_PIN_TAIL = 16;

  // Лимиты адреса
  var AddressLimit = {
    X_MIN: 0,
    Y_MIN: 130,
    Y_MAX: 630,
  };

  // Блок карты
  var mapBlock = document.querySelector('.map');

  // Определяем максимальную координату X для меток
  var addresLimitXMax = mapBlock.offsetWidth;

  /*
  4 Форма с фильтрами на карте.map__filters*/
  var filters = mapBlock.querySelector('.map__filters');
  // Элементы формы на карте:
  var filtersElements = filters.querySelectorAll('select, input');


  // Находим в разметке главную метку
  var mainPin = mapBlock.querySelector('.map__pin--main');
  // Определяем размеры главной метки при заблокированной карте
  var mainPinWidth = mainPin.offsetWidth;
  var mainPinHeight = mainPin.offsetHeight;
  // Определяем координаты метки на заблокированной карте:
  var mainPinDefaultCoords = {
    x: mainPin.offsetLeft,
    y: mainPin.offsetTop,
  };
  var mainPinCoords = {
    x: mainPinDefaultCoords.x,
    y: mainPinDefaultCoords.y,
  };

  // Лимиты карты для перемещения метки
  var getMapLimits = function () {
    var limits = {
      xMin: Math.floor(AddressLimit.X_MIN - mainPinWidth / 2),
      xMax: Math.floor(addresLimitXMax - mainPinWidth + mainPinWidth / 2),
      yMin: AddressLimit.Y_MIN - mainPinHeight,
      yMax: AddressLimit.Y_MAX - mainPinHeight,
    };
    return limits;
  };

  // Блокируем форму с фильтрами и ее элементы по умолчанию
  filters.classList.add('map__filters--disabled');
  filtersElements.forEach(function (element) {
    element.setAttribute('disabled', 'disabled');
  });

  // Добавляем обработчики загрузки данных с сервера
  var onSuccessLoad = function (dataArray) {

    // Сохраняем в массив только элементы с существующим offer:
    window.data.appartmentsArray = dataArray.filter(function (element) {
      return element.offer;
    });
    window.pin.insert(window.data.appartmentsArray, MAX_PIN_QUANTITY);

    // Добавляем обработчики смены фильтров
    filtersElements.forEach(function (element) {
      element.addEventListener('change', window.filter.onChange);
    });
  };

  // Обработчик ошибки загрузки данных с сервера
  var onErrorLoad = function () {
    window.main.showError();
  };

  // Функция активации карты
  var activateMap = function () {
    mapBlock.classList.remove('map--faded');
    filters.classList.remove('map__filters--disabled');
    filtersElements.forEach(function (element) {
      element.removeAttribute('disabled');
    });
    mainPinCoords.x = mainPin.offsetLeft;
    mainPinCoords.y = mainPin.offsetTop;

    window.backend.load(onSuccessLoad, onErrorLoad);
    mainPinHeight += ACTIVE_PIN_TAIL;
  };


  window.map = {
    MAX_PIN_QUANTITY: MAX_PIN_QUANTITY,
    block: mapBlock,
    filters: filters,
    mainPin: mainPin,
    mainPinDefaultCoords: mainPinDefaultCoords,
    mainPinCoords: mainPinCoords,
    activate: activateMap,

    // Функция определения координат метки
    getMainPinAddress: function (coords) {
      var address = {};
      if (!mapBlock.classList.contains('map--faded')) {
        address.y = coords.y + mainPinHeight;
      } else {
        address.y = coords.y + Math.ceil(mainPinHeight / 2);
      }
      address.x = coords.x + Math.ceil(mainPinWidth / 2);
      return address;
    },

    deactivateMap: function () {
      mapBlock.classList.add('map--faded');
      filters.reset();
      filters.classList.add('map__filters--disabled');
      filtersElements.forEach(function (element) {
        element.setAttribute('disabled', 'disabled');
        element.removeEventListener('change', window.filter.onChange);
      });
      mainPinHeight -= ACTIVE_PIN_TAIL;
      if (window.card.block) {
        window.card.delete();
      }
      window.pin.delete();
      window.map.mainPin.style.left = mainPinDefaultCoords.x + 'px';
      window.map.mainPin.style.top = mainPinDefaultCoords.y + 'px';
    }
  };

  // Добавляем обработчики на главную метку
  // По клику
  mainPin.addEventListener('mousedown', function (evt) {
    if (mapBlock.classList.contains('map--faded')) {
      window.main.activatePage();
    }

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY,
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY,
      };

      startCoords.x = moveEvt.clientX;
      startCoords.y = moveEvt.clientY;

      mainPinCoords.x -= shift.x;
      mainPinCoords.y -= shift.y;

      var checkLimits = function (axis) {
        if (mainPinCoords[axis] < mapLimits[axis + 'Min']) {
          mainPinCoords[axis] = mapLimits[axis + 'Min'];
        } else if (mainPinCoords[axis] > mapLimits[axis + 'Max']) {
          mainPinCoords[axis] = mapLimits[axis + 'Max'];
        }
      };

      var mapLimits = getMapLimits();

      checkLimits('x');
      checkLimits('y');

      mainPin.style.top = mainPinCoords.y + 'px';
      mainPin.style.left = mainPinCoords.x + 'px';

      var address = window.map.getMainPinAddress(mainPinCoords);
      window.form.setAddress(address);
    };

    var onMouseUp = function () {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

  });
  // По Enter
  mainPin.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, function () {
      window.main.activatePage();
    });
  });

})();
