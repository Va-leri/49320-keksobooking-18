'use strict';

(function () {
  // Исходные данные
  var APPARTMENTS_TYPE = ['palace', 'flat', 'house', 'bungalo'];

  var APPARTMENTS_TYPE_RUS = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало',
  };

  var CHECKIN_TIME = ['12:00', '13:00', '14:00'];
  var CHECKOUT_TIME = ['12:00', '13:00', '14:00'];

  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  var ROOMS_MAX = 3;
  var GUESTS_MAX = 5;
  var PRICE_MAX = 100000;

  var ROOM_CAPACITY = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0],
  };

  // Границы y-координат
  var Y_MIN = 130;
  var Y_MAX = 630;

  // Количество объявлений
  var APPARTMENTS_ARRAY_LENGTH = 8;

  var cardsArray = [];


  window.data = {
    APPARTMENTS_TYPE: APPARTMENTS_TYPE,
    APPARTMENTS_TYPE_RUS: APPARTMENTS_TYPE_RUS,
    CHECKIN_TIME: CHECKIN_TIME,
    CHECKOUT_TIME: CHECKOUT_TIME,
    FEATURES: FEATURES,
    PHOTOS: PHOTOS,
    ROOMS_MAX: ROOMS_MAX,
    GUESTS_MAX: GUESTS_MAX,
    PRICE_MAX: PRICE_MAX,
    Y_MIN: Y_MIN,
    Y_MAX: Y_MAX,
    APPARTMENTS_ARRAY_LENGTH: APPARTMENTS_ARRAY_LENGTH,
    ROOM_CAPACITY: ROOM_CAPACITY,
    cardsArray: cardsArray,

    // Функция генерации карточки объявления
    getCard: function (number, maxX) {
      var coordinateX = window.util.getRandomInteger(0, maxX);
      var coordinateY = window.util.getRandomInteger(window.data.Y_MIN, window.data.Y_MAX);
      var card = {
        'author': {
          'avatar': 'img/avatars/user0' + (number + 1) + '.png',
        },
        'offer': {
          'title': 'Заголовок предложения',
          'address': coordinateX + ', ' + coordinateY,
          'price': window.util.getRandomInteger(0, window.data.PRICE_MAX),
          'type': window.util.getRandomElement(window.data.APPARTMENTS_TYPE),
          'rooms': window.util.getRandomInteger(1, window.data.ROOMS_MAX),
          'guests': window.util.getRandomInteger(1, window.data.GUESTS_MAX),
          'checkin': window.util.getRandomElement(window.data.CHECKIN_TIME),
          'checkout': window.util.getRandomElement(window.data.CHECKOUT_TIME),
          'features': window.util.getRandomArray(window.data.FEATURES),
          'description': 'Строка с описанием',
          'photos': window.util.getRandomArray(window.data.PHOTOS),
        },
        'location': {
          'x': coordinateX,
          'y': coordinateY,
        },
      };
      return card;
    },

    // Функция генерации массива заданной длины из карточек объявлений
    getAppartmentsArray: function (arrayLength, maxX) {
      for (var i = 0; i < arrayLength; i++) {
        cardsArray[i] = this.getCard(i, maxX);
      }
      return cardsArray;
    },
  };
})();

