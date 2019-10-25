'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;


  window.util = {
    ENTER_KEYCODE: ENTER_KEYCODE,
    ESC_KEYCODE: ESC_KEYCODE,

    isEnterEvent: function (evt, action) {
      // console.log('enter evt');
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    },

    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },

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

    removeNode: function (element) {
      element.remove();
    },
  };
})();
