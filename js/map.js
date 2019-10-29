'use strict';

(function () {
  // Блок карты
  var map = document.querySelector('.map');
  // Находим в разметке блок для отрисовки меток
  var mapPins = map.querySelector('.map__pins');
  // Определяем максимальную координату X для меток
  // var mapWidth = mapPins.offsetWidth;

  /*
  4 Форма с фильтрами на карте.map__filters*/
  var mapFilters = map.querySelector('.map__filters');
  // Элементы формы на карте:
  var mapFiltersElements = mapFilters.querySelectorAll('select');

  // Находим в разметке главную метку
  var mapPinMain = map.querySelector('.map__pin--main');
  // Определяем размеры главной метки при заблокированной карте
  var mapPinMainWidth = mapPinMain.offsetWidth;
  var mapPinMainHeight = mapPinMain.offsetHeight;
  // Определяем координаты метки на заблокированной карте:
  var mainPinDefaultCoords = {
    x: mapPinMain.offsetLeft,
    y: mapPinMain.offsetTop,
  };
  var mainPinCoords = {};
  mainPinCoords.x = mainPinDefaultCoords.x;
  mainPinCoords.y = mainPinDefaultCoords.y;

  // Размер "хвостика" активной метки
  var ACTIVE_PIN_TAIL = 16;

  // Лимиты карты для перемещения метки
  var mapLimits = {
    xMin: 0 - mapPinMainWidth / 2,
    xMax: map.offsetWidth - mapPinMainWidth + mapPinMainWidth / 2,
    yMin: 130,
    yMax: 630,
  };

  // Находим блок фильтров, перед которым будем вставлять карточки
  var filtersContainer = map.querySelector('.map__filters-container');

  // Блокируем форму с фильтрами и ее элементы по умолчанию
  mapFilters.classList.add('map__filters--disabled');
  mapFiltersElements.forEach(function (element) {
    element.setAttribute('disabled', 'disabled');
  });

  // Задаем максимальное количество отображаемых меток
  var MAX_PIN_QUANTITY = 5;

  // Находим фильтр по типу жилья
  var housingType = mapFilters.querySelector('[name="housing-type"]');

  // Находим фильтр по цене
  var housingPrice = mapFilters.querySelector('[name="housing-price"]');

  // Находим фильтр по числу комнат
  var housingRooms = mapFilters.querySelector('[name="housing-rooms"]');

  // Находим фильтр по числу гостей
  var housingGuests = mapFilters.querySelector('[name="housing-guests"]');

  // Находим фильтры по удобствам
  var housingFeaturesBlock = mapFilters.querySelector('#housing-features');
  var housingFeatures = housingFeaturesBlock.querySelectorAll('input');

  var mapCard;

  // var appartmentsArray = [];
  // var filtersValue = {};

  // Добавляем обработчики загрузки данных с сервера
  var onSuccessLoad = function (dataArray) {
    window.data.appartmentsArray = dataArray;
    window.map.insertPins(window.data.appartmentsArray, window.map.MAX_PIN_QUANTITY);

    // Добавляем обработчики смены фильтров
    window.map.mapFiltersElements.forEach(function (element) {
      element.addEventListener('change', onFilterChage);
    });
    housingFeatures.forEach(function (element) {
      element.addEventListener('change', onFilterChage);
    });
  };

  var onErrorLoad = function () {
    window.main.showError();
  };

  // Обработчик смены фильтра
  var onFilterChage = function () {
    window.debounce(function () {
      window.map.deletePins();
      if (window.map.mapCard) {
        window.map.deleteCard();
      }

      var filteredArray = window.filter();
      window.map.insertPins(filteredArray, window.map.MAX_PIN_QUANTITY);
    });

  };

  window.map = {
    mapCard: mapCard,
    mapPins: mapPins,
    mapFilters: mapFilters,
    mapFiltersElements: mapFiltersElements,
    mapPinMain: mapPinMain,
    mainPinDefaultCoords: mainPinDefaultCoords,
    mapPinMainWidth: mapPinMainWidth,
    mapPinMainHeight: mapPinMainHeight,
    MAX_PIN_QUANTITY: MAX_PIN_QUANTITY,
    housingType: housingType,
    housingPrice: housingPrice,
    housingRooms: housingRooms,
    housingGuests: housingGuests,
    housingFeaturesBlock: housingFeaturesBlock,
    housingFeatures: housingFeatures,
    mainPinCoords: mainPinCoords,

    // Функция определения координат метки
    getMainPinAddress: function (coords) {
      var address = {};
      if (!map.classList.contains('map--faded')) {
        address.y = coords.y + mapPinMainHeight;
      } else {
        address.y = coords.y + Math.ceil(mapPinMainHeight / 2);
      }
      address.x = coords.x + Math.ceil(mapPinMainWidth / 2);
      return address;
    },

    // Функция вставки пинов
    insertPins: function (dataArray, quantity) {
      var visibleArray = dataArray.slice(0, quantity);
      var fragment = window.pin.renderPins(visibleArray);
      var pins = fragment.querySelectorAll('.map__pin');
      mapPins.appendChild(fragment);
      pins.forEach(function (element) {
        var appartmentsNumber = element.number;
        element.addEventListener('click', function () {
          window.map.insertCard(dataArray[appartmentsNumber]);
        });
        element.addEventListener('keydown', function (evt) {
          window.util.isEnterEvent(evt, function () {
            window.map.insertCard(dataArray[appartmentsNumber]);
          });
        });
      });
    },

    deletePins: function () {
      var pins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
      pins.forEach(function (element) {
        element.remove();
      });
    },

    // Функция удаления карточки объявления
    deleteCard: function () {
      window.map.mapCard.remove();
    },
    // Функция вставки карточки объявления
    insertCard: function (arrayElement) {
      // mapCard = document.querySelector('.map__card');
      if (window.map.mapCard) {
        window.map.deleteCard();
      }
      map.insertBefore(window.card.renderCard(arrayElement), filtersContainer);
      window.map.mapCard = document.querySelector('.map__card');

      // Обработчик Esc
      var onCardEscPress = function (evt) {
        window.util.isEscEvent(evt, function () {
          window.map.deleteCard();
        });
        document.removeEventListener('keydown', onCardEscPress);
      };

      document.addEventListener('keydown', onCardEscPress);
      var closeBtn = window.map.mapCard.querySelector('.popup__close');
      closeBtn.addEventListener('click', function () {
        window.map.deleteCard();
      });
    },

    // Функция активации карты
    activateMap: function () {
      map.classList.remove('map--faded');
      mapFilters.classList.remove('map__filters--disabled');
      mapFiltersElements.forEach(function (element) {
        element.removeAttribute('disabled');
        // element.addEventListener('change', window.load.onFilterChage);
      });
      mainPinCoords.x = mapPinMain.offsetLeft;
      mainPinCoords.y = mapPinMain.offsetTop;

      window.load.getData(window.data.Url.LOAD, onSuccessLoad, onErrorLoad);
      mapPinMainHeight += ACTIVE_PIN_TAIL;
    },

    // Функция активации страницы
    activatePage: function () {
      this.activateMap();
      window.form.activateAdForm();
    },

    deactivateMap: function () {
      map.classList.add('map--faded');
      mapFilters.reset();
      mapFilters.classList.add('map__filters--disabled');
      mapFiltersElements.forEach(function (element) {
        element.setAttribute('disabled', 'disabled');
        element.addEventListener('change', window.load.onFilterChage);
      });
      mapPinMainHeight -= ACTIVE_PIN_TAIL;
      if (window.map.mapCard) {
        window.map.deleteCard();
      }
      window.map.deletePins();
      window.map.mapPinMain.style.left = mainPinDefaultCoords.x + 'px';
      window.map.mapPinMain.style.top = mainPinDefaultCoords.y + 'px';
    }
  };

  // Добавляем обработчики на главную метку
  // По клику
  mapPinMain.addEventListener('mousedown', function (evt) {
    if (map.classList.contains('map--faded')) {
      window.map.activatePage();
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
        switch (true) {
          case (mainPinCoords[axis] < mapLimits[axis + 'Min']):
            mainPinCoords[axis] = mapLimits[axis + 'Min'];
            break;
          case (mainPinCoords[axis] > mapLimits[axis + 'Max']):
            mainPinCoords[axis] = mapLimits[axis + 'Max'];
        }
      };

      checkLimits('x');
      checkLimits('y');

      mapPinMain.style.top = mainPinCoords.y + 'px';
      mapPinMain.style.left = mainPinCoords.x + 'px';

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
  mapPinMain.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, function () {
      window.map.activatePage();
    });
  });

})();
