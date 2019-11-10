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
  var map = document.querySelector('.map');
  // Находим в разметке блок для отрисовки меток
  var pinsBlock = map.querySelector('.map__pins');
  // Определяем максимальную координату X для меток
  var addresLimitXMax = map.offsetWidth;

  /*
  4 Форма с фильтрами на карте.map__filters*/
  var filters = map.querySelector('.map__filters');
  // Элементы формы на карте:
  var filtersElements = filters.querySelectorAll('select, input');


  // Находим в разметке главную метку
  var mainPin = map.querySelector('.map__pin--main');
  // Определяем размеры главной метки при заблокированной карте
  var mainPinWidth = mainPin.offsetWidth;
  var mainPinHeight = mainPin.offsetHeight;
  // Определяем координаты метки на заблокированной карте:
  var mainPinDefaultCoords = {
    x: mainPin.offsetLeft,
    y: mainPin.offsetTop,
  };
  var mainPinCoords = {};
  mainPinCoords.x = mainPinDefaultCoords.x;
  mainPinCoords.y = mainPinDefaultCoords.y;


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

  // Находим блок фильтров, перед которым будем вставлять карточки
  var filtersContainer = map.querySelector('.map__filters-container');

  // Блокируем форму с фильтрами и ее элементы по умолчанию
  filters.classList.add('map__filters--disabled');
  filtersElements.forEach(function (element) {
    element.setAttribute('disabled', 'disabled');
  });

  // Находим фильтры по удобствам
  var housingFeaturesBlock = filters.querySelector('#housing-features');
  var housingFeatures = housingFeaturesBlock.querySelectorAll('input');

  // Находим активную метку
  var activePin = map.querySelector('.map__pin--active');

  var card;

  // Добавляем обработчики загрузки данных с сервера
  var onSuccessLoad = function (dataArray) {

    // Сохраняем в массив только элементы с существующим offer:
    window.data.appartmentsArray = dataArray.filter(function (element) {
      return element.offer;
    });
    insertPins(window.data.appartmentsArray, MAX_PIN_QUANTITY);

    // Добавляем обработчики смены фильтров
    window.map.filtersElements.forEach(function (element) {
      element.addEventListener('change', onFilterChage);
    });
  };

  var onErrorLoad = function () {
    window.main.showError();
  };

  // Обработчик смены фильтра
  var onFilterChage = function () {
    window.debounce(function () {
      deletePins();
      if (card) {
        deleteCard();
      }

      var filteredArray = window.filter();
      insertPins(filteredArray, MAX_PIN_QUANTITY);
    });

  };

  var insertPins = function (dataArray, quantity) {
    var visibleArray = dataArray.slice(0, quantity);
    var fragment = window.pin.render(visibleArray);
    var pins = fragment.querySelectorAll('.map__pin');
    pinsBlock.appendChild(fragment);
    pins.forEach(function (element) {
      var appartmentsNumber = element.number;
      element.addEventListener('click', function (evt) {
        insertCard(visibleArray[appartmentsNumber]);
        if (activePin) {
          activePin.classList.remove('map__pin--active');
        }
        activePin = evt.currentTarget;
        activePin.classList.add('map__pin--active');
      });
      element.addEventListener('keydown', function (evt) {
        window.util.isEnterEvent(evt, function () {
          insertCard(visibleArray[appartmentsNumber]);
        });
      });
    });
  };

  var deletePins = function () {
    var pins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (element) {
      element.remove();
    });
  };

  // Функция удаления карточки объявления
  var deleteCard = function () {
    card.remove();
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
  };

  // Функция вставки карточки объявления
  var insertCard = function (arrayElement) {
    if (card) {
      deleteCard();
    }
    map.insertBefore(window.card.render(arrayElement), filtersContainer);
    card = document.querySelector('.map__card');

    // Обработчик Esc
    var onCardEscPress = function (evt) {
      window.util.isEscEvent(evt, function () {
        deleteCard();
      });
      document.removeEventListener('keydown', onCardEscPress);
    };

    document.addEventListener('keydown', onCardEscPress);
    var closeBtn = card.querySelector('.popup__close');
    closeBtn.addEventListener('click', function () {
      deleteCard();
    });
  };

  // Функция активации карты
  var activateMap = function () {
    map.classList.remove('map--faded');
    filters.classList.remove('map__filters--disabled');
    filtersElements.forEach(function (element) {
      element.removeAttribute('disabled');
    });
    mainPinCoords.x = mainPin.offsetLeft;
    mainPinCoords.y = mainPin.offsetTop;

    window.load.getData(window.data.Url.LOAD, onSuccessLoad, onErrorLoad);
    mainPinHeight += ACTIVE_PIN_TAIL;
  };

  // Функция активации страницы
  var activatePage = function () {
    activateMap();
    window.form.activate();
  };

  window.map = {
    filters: filters,
    filtersElements: filtersElements,
    mainPin: mainPin,
    mainPinDefaultCoords: mainPinDefaultCoords,
    housingFeatures: housingFeatures,
    mainPinCoords: mainPinCoords,

    // Функция определения координат метки
    getMainPinAddress: function (coords) {
      var address = {};
      if (!map.classList.contains('map--faded')) {
        address.y = coords.y + mainPinHeight;
      } else {
        address.y = coords.y + Math.ceil(mainPinHeight / 2);
      }
      address.x = coords.x + Math.ceil(mainPinWidth / 2);
      return address;
    },

    deactivateMap: function () {
      map.classList.add('map--faded');
      filters.reset();
      filters.classList.add('map__filters--disabled');
      filtersElements.forEach(function (element) {
        element.setAttribute('disabled', 'disabled');
        element.addEventListener('change', window.load.onFilterChage);
      });
      mainPinHeight -= ACTIVE_PIN_TAIL;
      if (window.map.mapCard) {
        deleteCard();
      }
      deletePins();
      window.map.mainPin.style.left = mainPinDefaultCoords.x + 'px';
      window.map.mainPin.style.top = mainPinDefaultCoords.y + 'px';
    }
  };

  // Добавляем обработчики на главную метку
  // По клику
  mainPin.addEventListener('mousedown', function (evt) {
    if (map.classList.contains('map--faded')) {
      activatePage();
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
      activatePage();
    });
  });

})();
