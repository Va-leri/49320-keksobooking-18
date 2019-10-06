'use strict';

(function () {
  var ENTER_KEYCODE = 13;


  window.util = {
    ENTER_KEYCODE: ENTER_KEYCODE,

    // Функция генерации случайного целого числа в диапазоне:
    getRandomInteger: function (min, max) {
      return Math.round(Math.random() * (max - min) + min);
    },


    // Функция выбора рандомного элемента массива
    getRandomElement: function (array) {
      return array[Math.round(Math.random() * (array.length - 1))];
    },


    // Функция перемешивания массива
    shuffleArray: function (array) {
      var tempArray = array.slice();
      for (var i = tempArray.length - 1; i > 0; i--) {
        var j = this.getRandomInteger(0, i);
        var temp = tempArray[i];
        tempArray[i] = tempArray[j];
        tempArray[j] = temp;
      }
      return tempArray;
    },


    // Функция генерации массива случайной длины из перемешанного массива
    getRandomArray: function (array) {
      return this.shuffleArray(array).slice(0, this.getRandomInteger(1, array.length));
    },
  };
})();
