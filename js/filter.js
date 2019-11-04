'use strict';

(function () {
  var filteredArray = [];

  var simpleFilters = [
    'type',
    'rooms',
    'guests',
  ];

  var simpleFilter = function (filterName) {
    var filter = window.map.filters.querySelector('#housing-' + filterName);
    // var filter = filterNamesToNodes[filterName];
    switch (filter.value) {
      case 'any':
        // filteredArray = filteredArray;
        break;
      default:
        filteredArray = filteredArray.filter(function (element) {
          return String(element.offer[filterName]) === filter.value;
        });
    }
  };

  window.filter = function () {
    filteredArray = window.data.appartmentsArray;
    // Фильтруем по типу жилья,
    // по количеству комнат,
    // по количеству гостей
    simpleFilters.forEach(function (element) {
      simpleFilter(element);
    });

    // Фильтруем по цене
    switch (window.map.housingPrice.value) {
      case 'any':
        break;
      case 'low':
        filteredArray = filteredArray.filter(function (element) {
          return element.offer.price <= window.data.priceLevelToMaxPrice.low;
        });
        break;
      case 'middle':
        filteredArray = filteredArray.filter(function (element) {
          return element.offer.price <= window.data.priceLevelToMaxPrice.middle && element.offer.price >= window.data.priceLevelToMinPrice.middle;
        });
        break;
      case 'high':
        filteredArray = filteredArray.filter(function (element) {
          return element.offer.price >= window.data.priceLevelToMinPrice.high;
        });
        break;
    }

    // Фильтруем по удобствам
    var features = window.map.housingFeaturesBlock.querySelectorAll(':checked');
    features.forEach(function (feature) {
      filteredArray = filteredArray.filter(function (element) {
        return element.offer.features.includes(feature.value);
      });
    });

    return filteredArray;
  };
})();
