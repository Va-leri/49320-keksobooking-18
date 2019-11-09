'use strict';

(function () {
  var UPLOAD_URL = 'https://js.dump.academy/keksobooking';
  var LOAD_URL = 'https://js.dump.academy/keksobooking/data';

  // Исходные данные

  var appartmentsTypeToTranslation = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало',
  };

  var roomsToCapacity = {
    '1': [1],
    '2': [1, 2],
    '3': [1, 2, 3],
    '100': [0],
  };

  var typeToMinPrice = {
    'Бунгало': 0,
    'Квартира': 1000,
    'Дом': 5000,
    'Дворец': 10000,
  };

  var priceLevelToMinPrice = {
    'middle': 10000,
    'high': 50000,
  };

  var priceLevelToMaxPrice = {
    'low': 10000,
    'middle': 50000,
  };

  var appartmentsArray = [];


  window.data = {
    appartmentsArray: appartmentsArray,
    appartmentsTypeToTranslation: appartmentsTypeToTranslation,
    roomsToCapacity: roomsToCapacity,
    typeToMinPrice: typeToMinPrice,
    priceLevelToMinPrice: priceLevelToMinPrice,
    priceLevelToMaxPrice: priceLevelToMaxPrice,

    Url: {
      UPLOAD: UPLOAD_URL,
      LOAD: LOAD_URL,
    },

  };
})();

