'use strict';

(function () {
  window.main = {
    showError: function () {
      var errorTemplate = document.querySelector('#error').content.querySelector('.error');
      // Находим блок main в разметке
      var mainBlock = document.querySelector('main');
      var errorBlock = errorTemplate.cloneNode(true);
      // Вставляем блок с ошибкой в разметку (в начало блока main)
      mainBlock.prepend(errorBlock);
      var errorBtn = errorBlock.querySelector('.error__button');
      errorBtn.focus();
      errorBtn.addEventListener('click', function () {
        errorBlock.remove();
      });
      document.addEventListener('keydown', function (evt) {
        window.util.isEscEvent(evt, function () {
          errorBlock.remove();
        });
      });
      document.addEventListener('click', function () {
        errorBlock.remove();
      });
    },

    showSuccessMessage: function () {
      // Находим шаблон об успешной отправке в разметке
      var successTemplate = document.querySelector('#success ').content.querySelector('.success');
      // Находим блок main в разметке
      var mainBlock = document.querySelector('main');
      var successBlock = successTemplate.cloneNode(true);
      // Вставляем блок с ошибкой в разметку (в начало блока main)
      mainBlock.prepend(successBlock);

      document.addEventListener('keydown', function (evt) {
        window.util.isEscEvent(evt, function () {
          successBlock.remove();
        });
      });
      successBlock.addEventListener('click', function () {
        successBlock.remove();
      });
    }
  };
})();

// (function () {
//   window.main = {
//     showError: function () {
//       // Находим шаблон ошибки .error из шаблона #error
//       var errorTemplate = document.querySelector('#error').content.querySelector('.error');

//       // Находим блок main в разметке
//       var mainBlock = document.querySelector('main');

//       var errorBlock = errorTemplate.cloneNode(true);

//       // Вставляем блок с ошибкой в разметку (в начало блока main)
//       mainBlock.prepend(errorBlock);
//     }
//   };
// })();
// var showError = function () {
//   // Находим шаблон ошибки .error из шаблона #error
//   var errorTemplate = document.querySelector('#error').content.querySelector('.error');

//   // Находим блок main в разметке
//   var mainBlock = document.querySelector('main');

//   var errorBlock = errorTemplate.cloneNode(true);

//   // Вставляем блок с ошибкой в разметку (в начало блока main)
//   mainBlock.prepend(errorBlock);
// };
