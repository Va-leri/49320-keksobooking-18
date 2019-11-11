'use strict';

(function () {
  // Находим блок фильтров
  var filtersBlock = window.map.block.querySelector('.map__filters-container');

  // Задаем имена имеющихся фильтров
  var FILTER_NAMES = [
    'type',
    'price',
    'rooms',
    'guests',
    'features',
  ];

  // Имена фильтров с простой фильтрацией
  var SIMPLE_FILTERS = [
    'type',
    'rooms',
    'guests',
  ];


  // Создаем массив фильтров
  var filters = [];

  // Наполняем массив объектами с данными фильтров
  FILTER_NAMES.forEach(function (element, index) {
    var filter = {
      name: element,

      // Метод поиска Dom-элемента фильтра
      findFilterNode: function () {
        var filterNode = window.map.filters.querySelector('#housing-' + this.name);
        return filterNode;
      },

      // Метод определения значения фильтра
      getFilterValue: function () {
        var FEATURES_PREFIX = 'filter-';
        if (this.name !== 'features') {
          var filterValue = this.node.value;
        } else {
          var checkedElements = this.node.querySelectorAll(':checked');
          filterValue = [];
          checkedElements.forEach(function (el, i) {
            filterValue[i] = el.id.slice(FEATURES_PREFIX.length);
          });
        }
        return filterValue;
      },
    };


    filter.node = filter.findFilterNode();
    filter.value = filter.getFilterValue();

    filters[index] = filter;
  });


  // var filteredArray = [];

  // Функция простой фильтрации для простых фильтров
  var simpleFilter = function (arrayField, filterValue) {
    return (filterValue === 'any' || filterValue === String(arrayField)) ? true : false;
  };

  // Функция фильтрации по цене
  var priceFilter = function (arrayField, filterValue) {
    switch (filterValue) {
      case 'any':
        return true;
      case window.data.PriceLevel.LOW:
        return arrayField <= window.data.priceLevelToMaxPrice.low;
      case window.data.PriceLevel.MIDDLE:
        return arrayField <= window.data.priceLevelToMaxPrice.middle && arrayField >= window.data.priceLevelToMinPrice.middle;
      case window.data.PriceLevel.HIGH:
        return arrayField >= window.data.priceLevelToMinPrice.high;
      default:
        return false;
    }
  };
  // Функция фильтрации по удобствам
  var featuresFilter = function (arrayField, filterValue) {
    return filterValue.every(function (element) {
      return arrayField.includes(element);
    });
  };


  // Функция, которая срабатывает при изменении какого-либо фильтра
  window.filter = {
    block: filtersBlock,

    getArray: function () {
      var filteredArray = window.data.appartmentsArray;
      // Обновляем значения фильтров в соответсвии с введенными пользователем
      filters.forEach(function (element) {
        element.value = element.getFilterValue();
      });


      filteredArray = filteredArray.filter(function (element) {
        var answers = [];
        filters.forEach(function (el, index) {
          var filterName = el.name;
          var filterValue = el.value;
          var arrayField = element.offer[filterName];
          if (SIMPLE_FILTERS.includes(filterName)) {
            answers[index] = simpleFilter(arrayField, filterValue);
          } else if (filterName === 'price') {
            answers.push(priceFilter(arrayField, filterValue));
          } else if (filterName === 'features') {
            answers.push(featuresFilter(arrayField, filterValue));
          }
        });
        return !answers.includes(false);
      });

      return filteredArray;
    },

    // Обработчик смены фильтра
    onChange: function () {
      window.debounce(function () {
        window.pin.delete();
        if (window.card.block) {
          window.card.delete();
        }

        var filteredArray = window.filter.getArray();
        window.pin.insert(filteredArray, window.map.MAX_PIN_QUANTITY);
      });

    },
  };
})();
