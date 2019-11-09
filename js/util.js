'use strict';

(function () {
  var Keycode = {
    ENTER: 13,
    ESC: 27,
  };

  var XhrStatus = {
    DONE: 200,
  };

  window.util = {
    XhrStatus: XhrStatus,

    isEnterEvent: function (evt, action) {
      // console.log('enter evt');
      if (evt.keyCode === Keycode.ENTER) {
        action();
      }
    },

    isEscEvent: function (evt, action) {
      if (evt.keyCode === Keycode.ESC) {
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
