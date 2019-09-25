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
  return shuffleArray(array).slice(0, getRandomInteger(1, array.length - 1));
};

// Исходные данные
var appartmentsType = ['palace', 'flat', 'house', 'bungalo'];
var checkinTime = ['12:00', '13:00', '14:00'];
var checkoutTime = ['12:00', '13:00', '14:00'];
var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

// Функция генерации карточки объявления
var getCard = function (number) {
  var card = {};
  card.author = {
    'avatar': 'img / avatars / user0' + (number + 1) + '.png',
  };
  card.offer = {
    'title': 'Заголовок предложения',
    'address': '600, 350',
    'price': 1,
    'type': getRandom(appartmentsType),
    'rooms': 1,
    'guests': 1,
    'checkin': getRandom(checkinTime),
    'checkout': getRandom(checkoutTime),
    'features': getRandomArray(features),
    'description': 'Строка с описанием',
    'photos': getRandomArray(photos),
  };
  card.location = {
    'x': getRandomInteger(0, mapPins.offsetWidth),
    'y': getRandomInteger(130, 630),
  };
  return card;
};

// Количество объявлений
var APPARTMENTS_ARRAY_LENGTH = 8;

// Функция генерации массива заданной длины из карточек объявлений
var getAppartmentsArray = function (arrayLength) {
  var appartmentsArray = [];
  for (var i = 0; i < arrayLength; i++) {
    appartmentsArray[i] = getCard(i);
  }
  return appartmentsArray;
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
    pin.src = appartmentsArray[i].author.avatar;
    pin.alt = appartmentsArray[i].offer.title;
    fragment.appendChild(pin);
  }
  return fragment;
};

// В блок mapPins вставляем фрагмент с отрисованными метками
mapPins.appendChild(renderPins(getAppartmentsArray(APPARTMENTS_ARRAY_LENGTH)));

// У блока.map уберите класс.map--faded
document.querySelector('.map').classList.remove('map-fadded');
