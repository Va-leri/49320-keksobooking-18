'use strict';

(function () {
  // Задаем максимальное количество отображаемых меток
  var MAX_PIN_QUANTITY = 5;

  // Размер "хвостика" активной метки
  var ACTIVE_PIN_TAIL = 16;


  // Блок карты
  var map = document.querySelector('.map');
  // Находим в разметке блок для отрисовки меток
  var pinsBlock = map.querySelector('.map__pins');
  // Определяем максимальную координату X для меток
  // var mapWidth = mapPins.offsetWidth;

  /*
  4 Форма с фильтрами на карте.map__filters*/
  var filters = map.querySelector('.map__filters');
  // Элементы формы на карте:
  var filtersElements = filters.querySelectorAll('select');

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
      xMin: Math.floor(0 - mainPinWidth / 2),
      xMax: Math.floor(map.offsetWidth - mainPinWidth + mainPinWidth / 2),
      yMin: 130 - mainPinHeight,
      yMax: 630 - mainPinHeight,
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

  // Находим фильтр по типу жилья
  var housingType = filters.querySelector('[name="housing-type"]');

  // Находим фильтр по цене
  var housingPrice = filters.querySelector('[name="housing-price"]');

  // Находим фильтр по числу комнат
  var housingRooms = filters.querySelector('[name="housing-rooms"]');

  // Находим фильтр по числу гостей
  var housingGuests = filters.querySelector('[name="housing-guests"]');

  // Находим фильтры по удобствам
  var housingFeaturesBlock = filters.querySelector('#housing-features');
  var housingFeatures = housingFeaturesBlock.querySelectorAll('input');

  // Находим активную метку
  var activePin = map.querySelector('.map__pin--active');

  var card;

  // Добавляем обработчики загрузки данных с сервера
  var onSuccessLoad = function (dataArray) {

    // Для теста
    /* var data = '[{ "author": { "avatar": "img/avatars/user01.png" }, "offer": { "title": "Уютное гнездышко для молодоженов", "address": "102-0082 Tōkyō-to, Chiyoda-ku, Ichibanchō, 14−3", "price": 42000, "type": "house", "rooms": 3, "guests": 6, "checkin": "14:00", "checkout": "10:00", "features": ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"], "description": "Великолепный таун-хауз в центре Токио. Подходит как туристам, так и бизнесменам. Дом полностью укомплектован и имеет свежий ремонт.", "photos": ["https://cdn.ostrovok.ru/t/x500/mec/hotels/11000000/10360000/10357700/10357605/10357605_25_b.jpg", "https://cdn.ostrovok.ru/t/x500/mec/hotels/11000000/10360000/10357700/10357605/10357605_27_b.jpg", "https://cdn.ostrovok.ru/t/x500/mec/hotels/11000000/10360000/10357700/10357605/10357605_17_b.jpg", "https://cdn.ostrovok.ru/t/x500/mec/hotels/11000000/10360000/10357700/10357605/10357605_30_b.jpg", "https://cdn.ostrovok.ru/t/x500/mec/hotels/10000000/9160000/9151200/9151174/9151174_1_b.jpg", "https://cdn.ostrovok.ru/t/x500/mec/hotels/10000000/9160000/9151200/9151174/9151174_12_b.jpg", "https://cdn.ostrovok.ru/t/x500/mec/hotels/10000000/9160000/9151200/9151174/9151174_5_b.jpg"] }, "location": { "x": 428, "y": 493 } }, { "author": { "avatar": "img/avatars/user02.png" }, "offer": { "title": "Маленькая квартирка рядом с парком", "address": "102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō", "price": 30000, "type": "flat", "rooms": 1, "guests": 1, "checkin": "9:00", "checkout": "7:00", "features": ["elevator", "conditioner"], "description": "Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.", "photos": ["https://cdn.ostrovok.ru/t/x500/carsolize/images/hotels/01488611-c1f9-4854-ad67-9f0ad3e857e6.jpeg", "https://cdn.ostrovok.ru/t/x500/carsolize/images/hotels/d976dd4b-2a7e-415a-a2a2-afc51caf8006.jpeg"] }, "location": { "x": 471, "y": 545 } }, { "author": { "avatar": "img/avatars/user03.png" }, "offer": { "title": "Небольшая лавочка в парке", "address": "", "price": 100, "type": "bungalo", "rooms": "", "guests": 0, "checkin": "0:00", "checkout": "", "features": [], "description": "Великолепная лавочка прямо в центре парка. Подходит для всех кто любит спать на свежем воздухе.", "photos": [] }, "location": { "x": 744, "y": 534 } }, { "author": { "avatar": "img/avatars/user04.png" }, "offer": { "title": "Императорский дворец в центре Токио", "address": "1-1 Chiyoda, Chiyoda-ku, Tōkyō-to 100-8111", "price": 6000000, "type": "house", "rooms": 35, "guests": 93, "checkin": "21:00", "checkout": "20:00", "features": ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"], "description": "Замечательный дворец в старинном центре города. Только для тех кто может себе позволить дворец. Лакеев и прочих жокеев просим не беспокоить.", "photos": ["https://cdn.ostrovok.ru/t/x500/carsolize/images/hotels/5a29d708-9396-40bf-b002-92c5fdeb5c90.jpeg", "https://cdn.ostrovok.ru/t/x500/carsolize/images/hotels/23e332cb-1379-4582-85ac-901d6c441635.jpeg", "https://cdn.ostrovok.ru/t/x500/carsolize/images/hotels/1c859bbf-61d6-4295-b463-c1d0cbf62592.jpeg", "https://cdn.ostrovok.ru/t/x500/carsolize/images/hotels/f5e66549-1940-4659-b27a-652f5c809231.jpeg", "https://cdn.ostrovok.ru/t/x500/mec/hotels/11000000/10360000/10357700/10357605/10357605_30_b.jpg", "https://cdn.ostrovok.ru/t/x500/laterooms/hotelphotos/laterooms/274510/gallery/economy-apartment-shinjuku-tokyo-tokyo_040220130219545024.jpg", "https://cdn.ostrovok.ru/t/x500/laterooms/hotelphotos/laterooms/274510/gallery/economy-apartment-shinjuku-tokyo-tokyo_040220130215449816.jpg", "https://cdn.ostrovok.ru/t/x500/laterooms/hotelphotos/laterooms/274510/gallery/economy-apartment-shinjuku-tokyo-tokyo_040220130206399539.jpg", "https://cdn.ostrovok.ru/t/x500/carsolize/images/hotels/69d53ff8-cd47-479d-8c9a-5170352aa169.jpeg", "https://cdn.ostrovok.ru/t/x500/carsolize/images/hotels/19614107-a1da-4a0b-8a93-95107704a598.jpeg", "https://cdn.ostrovok.ru/t/x500/carsolize/images/hotels/a97c72b9-e311-4a5a-863d-ea1e31ae9924.jpeg", "https://cdn.ostrovok.ru/t/x500/carsolize/images/hotels/d2a52c68-e877-4902-be6d-c7f3cb198437.jpeg"] }, "location": { "x": 526, "y": 597 } }, { "author": { "avatar": "img/avatars/user05.png" }, "offer": { "title": "Милейший чердачок", "address": "102-0094 Tōkyō-to, Chiyoda-ku, Kioichō, 3", "price": 10000, "type": "bungalo", "rooms": 1, "guests": 2, "checkin": "11:00", "checkout": "10:00", "features": ["wifi", "washer", "elevator"], "description": "Маленькая квартирка на чердаке. Для самых не требовательных.", "photos": ["https://cdn.ostrovok.ru/t/x500/mec/hotels/5000000/4500000/4493700/4493658/4493658_17_b.jpg", "https://cdn.ostrovok.ru/t/x500/mec/b4/c6/b4c674087f12b74bc71fe073923ec744dfe1ed8f.jpeg", "https://cdn.ostrovok.ru/t/x500/mec/1e/e8/1ee854db105a1f6bcd19ea62e1aa294724af7885.jpeg", "https://cdn.ostrovok.ru/t/x500/mec/ca/9a/ca9ad256650553cdce9d8ff8baad93d4f17b9484.jpeg"] }, "location": { "x": 361, "y": 517 } }, { "author": { "avatar": "img/avatars/default.png" }, "offer": { "title": "Наркоманский притон", "address": "102-0094 Tōkyō-to, Chiyoda-ku, Kioichō, 3", "price": 5000, "type": "bungalo", "rooms": 3, "guests": 6, "checkin": "11:00", "checkout": "10:00", "features": ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"], "description": "У нас есть всё! Шприцы, интернет, кофе. Для всех кто знает толк в отдыхе. Полицию просим не беспокоить.", "photos": ["https://cdn.ostrovok.ru/t/x500/carsolize/images/hotels/42624d02-3198-4979-b521-194024454eb7.jpeg"] }, "location": { "x": 1165, "y": 423 } }, { "author": { "avatar": "img/avatars/user06.png" }, "offer": { "title": "Чёткая хата", "address": "102-0081 Tōkyō-to, Chiyoda-ku, Yonbanchō, 5−6", "price": 9000, "type": "flat", "rooms": 2, "guests": 3, "checkin": "17:00", "checkout": "16:00", "features": ["dishwasher", "parking", "washer", "elevator", "conditioner"], "description": "У нас тут все ништяк. Ларек за углом. Шава 24 часа. Приезжайте! Интернетов нет!", "photos": ["https://cdn.ostrovok.ru/t/x500/mec/a4/bb/a4bbfa3d98c0ddf60e95e610509dbede8160e40e.jpeg", "https://cdn.ostrovok.ru/t/x500/mec/hotels/1000000/480000/470500/470466/470466_12_b.jpg", "https://cdn.ostrovok.ru/t/x500/mec/hotels/1000000/480000/470500/470466/470466_17_b.jpg", "https://cdn.ostrovok.ru/t/x500/carsolize/images/hotels/aa9f9334-acd2-46f7-ae6e-4ae039376ec6.jpeg"] }, "location": { "x": 594, "y": 464 } }, { "author": { "avatar": "img/avatars/user07.png" }, "offer": { "title": "Стандартная квартира в центре", "address": "Chiyoda-ku, Tōkyō-to 102-0082", "price": 60000, "type": "flat", "rooms": 3, "guests": 5, "checkin": "17:00", "checkout": "16:00", "features": ["wifi", "dishwasher", "washer", "conditioner"], "description": "Тут красиво, светло и уютно. Есть где разместиться компании из 5 человек. Кофе и печеньки бесплатно.", "photos": ["https://cdn.ostrovok.ru/t/x500/carsolize/images/hotels/987935fb-633a-46b8-9b76-76af9f35c5e3.jpeg", "https://cdn.ostrovok.ru/t/x500/carsolize/images/hotels/434b2eda-5af9-4b93-b97d-4e7514621ff1.jpeg", "https://cdn.ostrovok.ru/t/x500/carsolize/images/hotels/fa9c3bba-a64a-4019-ab50-102bf6e5d691.jpeg", "https://cdn.ostrovok.ru/t/x500/carsolize/images/hotels/f779d886-18a6-4ffb-b7c2-f5d4d0c8952a.jpeg"] }, "location": { "x": 452, "y": 382 } }, { "author": { "avatar": "img/avatars/user08.png" }, "offer": { "title": "Тихая квартирка недалеко от метро", "address": "102-0082 Tōkyō-to, Chiyoda-ku, Ichibanchō, 17−4", "price": 50000, "type": "flat", "rooms": 1, "guests": 3, "checkin": "23:00", "checkout": "5:00", "features": ["wifi", "dishwasher", "washer"], "description": "Квартира на первом этаже. Соседи тихие. Для всех, кто терпеть не может шума и суеты.", "photos": ["https://cdn.ostrovok.ru/t/x500/mec/9b/6c/9b6cacd832ce9f3db3f17b3a2f368958710ce518.jpeg", "https://cdn.ostrovok.ru/t/x500/mec/9c/5d/9c5dc5a6daf5353bb44b5696df1c1186c55173b9.jpeg", "https://cdn.ostrovok.ru/t/x500/mec/cd/c6/cdc6e4a1df6259cb54c75edb6ac351180b49b5ec.jpeg", "https://cdn.ostrovok.ru/t/x500/carsolize/images/hotels/abcedd44-bfbd-411d-9919-fa2ac82ef6b0.jpeg"] }, "location": { "x": 976, "y": 505 } }, { "author": { "avatar": "img/avatars/default.png" }, "offer": { "title": "Милое гнездышко для фанатов Анимэ", "address": "105-0003 Tōkyō-to, Minato-ku, Nishishinbashi, 2 Chome−3", "price": 90000, "type": "house", "rooms": 1, "guests": 2, "checkin": "23:00", "checkout": "5:00", "features": ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"], "description": "Азиатов просьба не беспокоить.", "photos": ["https://cdn.ostrovok.ru/t/x500/second2/1389653673/9237e4e2ff53d3d1beb69e49412df972.jpg", "https://cdn.ostrovok.ru/t/x500/second/1389604422/ff530e241de007ce3af7bdd23719ae0a.jpg", "https://cdn.ostrovok.ru/t/x500/mec/hotels/2000000/1480000/1479400/1479346/1479346_34_b.jpg", "https://cdn.ostrovok.ru/t/x500/mec/hotels/2000000/1480000/1479400/1479346/1479346_40_b.jpg"] }, "location": { "x": 535, "y": 418 } }]'; */
    // var dataArray = JSON.parse(data);

    // Сохраняем в массив только элементы с существующим offer:
    window.data.appartmentsArray = dataArray.filter(function (element) {
      return element.offer;
    });
    window.map.insertPins(window.data.appartmentsArray, window.map.MAX_PIN_QUANTITY);

    // Добавляем обработчики смены фильтров
    window.map.filtersElements.forEach(function (element) {
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
      if (window.map.card) {
        window.map.deleteCard();
      }

      var filteredArray = window.filter();
      window.map.insertPins(filteredArray, window.map.MAX_PIN_QUANTITY);
    });

  };

  window.map = {
    card: card,
    pinsBlock: pinsBlock,
    filters: filters,
    filtersElements: filtersElements,
    mainPin: mainPin,
    mainPinDefaultCoords: mainPinDefaultCoords,
    mainPinWidth: mainPinWidth,
    mainPinHeight: mainPinHeight,
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
        address.y = coords.y + mainPinHeight;
      } else {
        address.y = coords.y + Math.ceil(mainPinHeight / 2);
      }
      address.x = coords.x + Math.ceil(mainPinWidth / 2);
      return address;
    },

    // Функция вставки пинов
    insertPins: function (dataArray, quantity) {
      var visibleArray = dataArray.slice(0, quantity);
      var fragment = window.pin.renderPins(visibleArray);
      var pins = fragment.querySelectorAll('.map__pin');
      pinsBlock.appendChild(fragment);
      pins.forEach(function (element) {
        var appartmentsNumber = element.number;
        element.addEventListener('click', function (evt) {
          window.map.insertCard(visibleArray[appartmentsNumber]);
          if (activePin) {
            activePin.classList.remove('map__pin--active');
          }
          activePin = evt.currentTarget;
          activePin.classList.add('map__pin--active');
        });
        element.addEventListener('keydown', function (evt) {
          window.util.isEnterEvent(evt, function () {
            window.map.insertCard(visibleArray[appartmentsNumber]);
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
      window.map.card.remove();
      if (activePin) {
        activePin.classList.remove('map__pin--active');
      }
    },
    // Функция вставки карточки объявления
    insertCard: function (arrayElement) {
      // mapCard = document.querySelector('.map__card');
      if (window.map.card) {
        window.map.deleteCard();
      }
      map.insertBefore(window.card.render(arrayElement), filtersContainer);
      window.map.card = document.querySelector('.map__card');

      // Обработчик Esc
      var onCardEscPress = function (evt) {
        window.util.isEscEvent(evt, function () {
          window.map.deleteCard();
        });
        document.removeEventListener('keydown', onCardEscPress);
      };

      document.addEventListener('keydown', onCardEscPress);
      var closeBtn = window.map.card.querySelector('.popup__close');
      closeBtn.addEventListener('click', function () {
        window.map.deleteCard();
      });
    },

    // Функция активации карты
    activateMap: function () {
      map.classList.remove('map--faded');
      filters.classList.remove('map__filters--disabled');
      filtersElements.forEach(function (element) {
        element.removeAttribute('disabled');
        // element.addEventListener('change', window.load.onFilterChage);
      });
      mainPinCoords.x = mainPin.offsetLeft;
      mainPinCoords.y = mainPin.offsetTop;

      window.load.getData(window.data.Url.LOAD, onSuccessLoad, onErrorLoad);
      mainPinHeight += ACTIVE_PIN_TAIL;
    },

    // Функция активации страницы
    activatePage: function () {
      this.activateMap();
      window.form.activate();
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
        window.map.deleteCard();
      }
      window.map.deletePins();
      window.map.mainPin.style.left = mainPinDefaultCoords.x + 'px';
      window.map.mainPin.style.top = mainPinDefaultCoords.y + 'px';
    }
  };

  // Добавляем обработчики на главную метку
  // По клику
  mainPin.addEventListener('mousedown', function (evt) {
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
      window.map.activatePage();
    });
  });

})();
