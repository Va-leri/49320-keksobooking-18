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
  // Определяем координаты главной метки при заблокированной карте
  var mapPinMainX = parseInt(mapPinMain.style.left, 10);
  var mapPinMainY = parseInt(mapPinMain.style.top, 10);

  // Определяем координаты метки на заблокированной карте:
  var currentAddressX = mapPinMainX + Math.ceil(mapPinMainWidth / 2);
  var currentAddressY = mapPinMainY + Math.ceil(mapPinMainHeight / 2);

  // Размер "хвостика" активной метки
  var ACTIVE_PIN_TAIL = 16;

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

  var mapCard;

  window.map = {
    mapCard: mapCard,
    mapPins: mapPins,
    mapPinMainWidth: mapPinMainWidth,
    mapPinMainHeight: mapPinMainHeight,
    mapPinMainX: mapPinMainX,
    mapPinMainY: mapPinMainY,
    currentAddressX: currentAddressX,
    currentAddressY: currentAddressY,
    MAX_PIN_QUANTITY: MAX_PIN_QUANTITY,
    housingType: housingType,

    // Функция пересчета адреса при активации карты
    reloadCoordinateY: function () {
      mapPinMainHeight += ACTIVE_PIN_TAIL;
      this.currentAddressY = mapPinMainY + mapPinMainHeight;
    },


    // Функция вставки пинов
    insertPins: function (dataArray, quantity) {
      var visibleArray = dataArray.slice(0, quantity);
      mapPins.appendChild(window.pin.renderPins(visibleArray));
    },

    deletePins: function () {
      mapPins.innerHTML = '';
    },

    // Функция удаления карточки объявления
    deleteCard: function (card) {
      card.remove();
    },
    // Функция вставки карточки объявления
    insertCard: function (arrayElement) {
      mapCard = document.querySelector('.map__card');
      if (mapCard) {
        window.map.deleteCard(mapCard);
      }
      // window.map.deleteCard();
      map.insertBefore(window.card.renderCard(arrayElement), filtersContainer);
      mapCard = document.querySelector('.map__card');
      document.addEventListener('keydown', function (evt) {
        // console.log('keydown');
        // console.log(evt.keyCode === window.util.ESC_KEYCODE);
        window.util.isEscEvent(evt, window.map.deleteCard(mapCard));

      });
      var closeBtn = mapCard.querySelector('.popup__close');
      closeBtn.addEventListener('click', function () {
        window.map.deleteCard(mapCard);
      });
    },

    // Функция активации карты
    activateMap: function () {
      map.classList.remove('map--faded');
      mapFilters.classList.remove('map__filters--disabled');
      mapFiltersElements.forEach(function (element) {
        element.removeAttribute('disabled');
      });
      window.load.getData(window.load.onSuccessLoad, window.load.onErrorLoad);
      // В блок mapPins вставляем фрагмент с отрисованными метками
      // mapPins.appendChild(window.pin.renderPins(window.data.getAppartmentsArray(window.data.APPARTMENTS_ARRAY_LENGTH, mapWidth)));
      // map.insertBefore(window.card.renderCard(window.data.cardsArray[0]), filtersContainer);
    },

    // Функция активации страницы
    activatePage: function () {
      this.activateMap();
      this.reloadCoordinateY();
      window.form.activateAdForm();
    },

  };

  // Добавляем обработчики на метку
  // По клику
  mapPinMain.addEventListener('mousedown', function () {
    window.map.activatePage();
  });
  // По Enter
  mapPinMain.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, window.map.activatePage());
  });
})();

/* Неактивное состояние. При первом открытии, страница находится в неактивном состоянии: блок с картой находится в неактивном состоянии, форма подачи заявления заблокирована:
Блок с картой.map содержит класс map--faded;
*/


/*
5 Единственное доступное действие в неактивном состоянии — перемещение метки.map__pin--main, являющейся контролом указания адреса объявления.Первое взаимодействие с меткой(mousedown) переводит страницу в активное состояние. */

