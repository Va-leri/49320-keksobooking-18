'use strict';

// Напишите функцию для создания массива из 8 сгенерированных JS объектов.Каждый объект массива ‐ описание похожего объявления неподалёку.Структура объектов должна быть следующей:

// Функция генерации случайного целого числа в диапазоне:
var getRandomInteger = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

// Функция выбора рандомного элемента массива
var getRandom = function (array) {
  return array[Math.round(Math.random() * (array.length - 1))];
};

// Функция перемешивания массива
var shuffleArray = function (array) {
  var tempArray = array.slice();
  for (var i = tempArray.length - 1; i > 0; i--) {
    var j = getRandomInteger(0, i);
    var temp = tempArray[i];
    tempArray[i] = tempArray[j];
    tempArray[j] = temp;
  }
  return tempArray;
};

// Функция генерации массива случайной длины из перемешанного массива
var getRandomArray = function (array) {
  return shuffleArray(array).slice(0, getRandomInteger(1, array.length));
};

// Исходные данные
var appartmentsType = ['palace', 'flat', 'house', 'bungalo'];
var appartmentsTypeRus = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало',
};
var checkinTime = ['12:00', '13:00', '14:00'];
var checkoutTime = ['12:00', '13:00', '14:00'];
var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var ROOMS_MAX = 3;
var GUESTS_MAX = 5;
var PRICE_MAX = 100000;

// Границы y-координат
var Y_MIN = 130;
var Y_MAX = 630;

// Функция генерации карточки объявления
var getCard = function (number) {
  var coordinateX = getRandomInteger(0, mapPins.offsetWidth);
  var coordinateY = getRandomInteger(Y_MIN, Y_MAX);
  var card = {
    'author': {
      'avatar': 'img/avatars/user0' + (number + 1) + '.png',
    },
    'offer': {
      'title': 'Заголовок предложения',
      'address': coordinateX + ', ' + coordinateY,
      'price': getRandomInteger(0, PRICE_MAX),
      'type': getRandom(appartmentsType),
      'rooms': getRandomInteger(1, ROOMS_MAX),
      'guests': getRandomInteger(1, GUESTS_MAX),
      'checkin': getRandom(checkinTime),
      'checkout': getRandom(checkoutTime),
      'features': getRandomArray(features),
      'description': 'Строка с описанием',
      'photos': getRandomArray(photos),
    },
    'location': {
      'x': coordinateX,
      'y': coordinateY,
    },
  };
  return card;
};

// Количество объявлений
var APPARTMENTS_ARRAY_LENGTH = 8;

// Функция генерации массива заданной длины из карточек объявлений
var cardsArray = [];
var getAppartmentsArray = function (arrayLength) {
  for (var i = 0; i < arrayLength; i++) {
    cardsArray[i] = getCard(i);
  }
  return cardsArray;
};

// Находим в разметке блок для отрисовки меток
var mapPins = document.querySelector('.map__pins');

// Задаем размеры метки
var pinSize = {
  width: 50,
  height: 70,
};


// Находим шаблон метки .map__pin из шаблона #pin
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

// Создаем фрагмент для временного хранения отрисованных меток
var fragment = document.createDocumentFragment();

// Функция отрисовки меток во фрагмент
var renderPins = function (appartmentsArray) {
  for (var i = 0; i < appartmentsArray.length; i++) {
    var pin = mapPinTemplate.cloneNode(true);
    pin.style = 'left: ' + (appartmentsArray[i].location.x - pinSize.width / 2) + 'px; top:' + (appartmentsArray[i].location.y - pinSize.height) + 'px;';
    pin.querySelector('img').src = appartmentsArray[i].author.avatar;
    pin.querySelector('img').alt = appartmentsArray[i].offer.title;
    fragment.appendChild(pin);
  }
  return fragment;
};

// В блок mapPins вставляем фрагмент с отрисованными метками
mapPins.appendChild(renderPins(getAppartmentsArray(APPARTMENTS_ARRAY_LENGTH)));


var map = document.querySelector('.map');


var cardTemplate = document.querySelector('#card').content;

var renderCard = function (cardsArrayElement) {
  var card = cardTemplate.cloneNode(true);

  // Функция создания фрагмента фич
  // var getFeaturesFragment = function () {
  //   var featuresFragment = document.createDocumentFragment();
  //   for (var i = 0; i < cardsArray[cardNumber].offer.features.length; i++) {
  //     var feature = card.querySelector('.popup__feature--' + cardsArray[cardNumber].offer.features[i]);
  //     console.log(feature);
  //     feature = feature.cloneNode();
  //     featuresFragment.appendChild(feature);
  //   }
  //   return featuresFragment;
  // };
  // console.log(getFeaturesFragment());

  // var photoFragment = document.createDocumentFragment();
  // var getPhotosArray = function () {
  //   for (var j = 0; j < cardsArray[cardNumber].offer.photos.length; j++) {
  //     var photo = card.querySelector('.popup__photo').cloneNode();
  //     photo.src = cardsArray[j].offer.photos[j];
  //     photoFragment.appendChild(photo);
  //   }
  //   card.querySelector('.popup__photos').innerHTML = photoFragment.content;
  // };
  card.querySelector('.popup__title').textContent = cardsArrayElement.offer.title;
  card.querySelector('.popup__text--address').textContent = cardsArrayElement.offer.address;
  card.querySelector('.popup__text--price').textContent = cardsArrayElement.offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = appartmentsTypeRus[cardsArrayElement.offer.type];
  card.querySelector('.popup__text--capacity').textContent = cardsArrayElement.offer.rooms + ' комнаты для ' + cardsArrayElement.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + cardsArrayElement.offer.checkin + ', выезд до ' + cardsArrayElement.offer.checkout;

  var featuresFragment = document.createDocumentFragment();
  for (var i = 0; i < cardsArrayElement.offer.features.length; i++) {
    var feature = card.querySelector('.popup__feature--' + cardsArrayElement.offer.features[i]).cloneNode();
    featuresFragment.appendChild(feature);
  }
  card.querySelector('.popup__features').innerHTML = '';
  card.querySelector('.popup__features').appendChild(featuresFragment);

  card.querySelector('.popup__description').textContent = cardsArrayElement.offer.description;

  var popupPhotos = card.querySelector('.popup__photos');
  var photoFragment = document.createDocumentFragment();
  for (var j = 0; j < cardsArrayElement.offer.photos.length; j++) {
    var photo = card.querySelector('.popup__photo').cloneNode();
    photo.src = cardsArrayElement.offer.photos[j];
    photoFragment.appendChild(photo);
  }
  popupPhotos.innerHTML = '';
  popupPhotos.appendChild(photoFragment);

  card.querySelector('.popup__avatar').src = cardsArrayElement.author.avatar;

  return card;
};

var filtersContainer = map.querySelector('.map__filters-container');
// map.insertBefore(renderCard(cardsArray[0]), filtersContainer);


/* Неактивное состояние. При первом открытии, страница находится в неактивном состоянии: блок с картой находится в неактивном состоянии, форма подачи заявления заблокирована.
 1 Блок с картой.map содержит класс map--faded;
2 Форма заполнения информации об объявлении.ad - form содержит класс ad - form--disabled;
*/
var adForm = document.querySelector('.ad-form');
// adForm.classList.add('ad-form--disabled'); -- по умолчанию

/*
3 Все < input > и < select > формы.ad - form заблокированы с помощью атрибута disabled, добавленного на них или на их родительские блоки fieldset;
*/
var adFormFieldsets = adForm.querySelectorAll('fieldset');
adFormFieldsets.forEach(function (element) {
  element.setAttribute('disabled', 'disabled');
});

/*
4 Форма с фильтрами.map__filters заблокирована так же, как и форма.ad - form;*/
var mapFilters = map.querySelector('.map__filters');
mapFilters.classList.add('map__filters--disabled');

var mapFiltersElements = mapFilters.querySelectorAll('select');
mapFiltersElements.forEach(function (element) {
  element.setAttribute('disabled', 'disabled');
});

/*
5 Единственное доступное действие в неактивном состоянии — перемещение метки.map__pin--main, являющейся контролом указания адреса объявления.Первое взаимодействие с меткой(mousedown) переводит страницу в активное состояние. */
var activatePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  adFormFieldsets.forEach(function (element) {
    element.removeAttribute('disabled');
  });
  mapFilters.classList.remove('map__filters--disabled');
  mapFiltersElements.forEach(function (element) {
    element.removeAttribute('disabled');
  });
  reloadCurrentAddress();
};

var mapPinMain = map.querySelector('.map__pin--main');

mapPinMain.addEventListener('mousedown', function () {
  activatePage();
});

var ENTER_KEYCODE = 13;

mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    activatePage();
  }
});


// Вычисление координат круглой метки
// var getMapPinMainWidth = function () {
//   return mapPinMain.offsetWidth;
// };
// var getMapPinMainHeight = function () {
//   return mapPinMain.offsetHeight;
// };
var mapPinMainWidth = mapPinMain.offsetWidth;
var mapPinMainHeight = mapPinMain.offsetHeight;
var mapPinMainX = parseInt(mapPinMain.style.left, 10);
var mapPinMainY = parseInt(mapPinMain.style.top, 10);

var currentAddressX = mapPinMainX + Math.ceil(mapPinMainWidth / 2);
var currentAddressY = mapPinMainY + Math.ceil(mapPinMainHeight / 2);

var addressInput = adForm.querySelector('[name="address"]');
addressInput.setAttribute('value', currentAddressX + ', ' + currentAddressY);

var reloadCurrentAddress = function () {
  mapPinMainHeight += 16;
  currentAddressY = mapPinMainY + mapPinMainHeight;
  addressInput.setAttribute('value', currentAddressX + ', ' + currentAddressY);
};

var MAX_CAPACITY = {
  1: 1,
  2: 2,
  3: 3,
  100: 0,
};

// Форма - adForm
// Находим инпуты комнат и гостей
var adFormRooms = adForm.querySelector('[name="rooms"]');
var adFormCapacity = adForm.querySelector('[name="capacity"]');
var adFormSubmit = adForm.querySelector('.ad-form__submit');

adForm.addEventListener('submit', function (evt) {
  console.log('submit evt');

  var rooms = adFormRooms.value;
  console.log('rooms=' + rooms);

  var guests = adFormCapacity.value;
  console.log('guests=' + guests);

  var availableGuests = MAX_CAPACITY[rooms];
  console.log('available guests = ' + availableGuests);

  if (availableGuests < +guests) {
    // adFormCapacity.valid = false;
    console.log('вход в условие');
    evt.preventDefault();
    adFormCapacity.setCustomValidity('В выбранном типе апартаментов доступно размещение максимум ' + ' гостей');
    console.log('установка сообщения об ошибке');
  } else {
    // adFormCapacity.valid = true;
    adFormCapacity.setCustomValidity('');
    console.log('условие выполнено, удаление сообщения об ошибке');
  }
});

// adFormCapacity.addEventListener('invalid', function () {
//   console.log('invalid');
//   adFormCapacity.setCustomValidity('В выбранном типе апартаментов доступно размещение максимум ' + ' гостей');
// });
// } else {
// adFormCapacity.setCustomValidity('');
