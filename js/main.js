'use strict';

(function () {
  window.main = {
    // Функция активации страницы
    activatePage: function () {
      window.map.activate();
      window.form.activate();
    },

    // Функция показа сообщения об ошибке
    showError: function () {
      var errorTemplate = document.querySelector('#error').content.querySelector('.error');
      // Находим блок main в разметке
      var mainBlock = document.querySelector('main');
      var errorBlock = errorTemplate.cloneNode(true);
      // Вставляем блок с ошибкой в разметку (в начало блока main)
      mainBlock.prepend(errorBlock);
      var errorBtn = errorBlock.querySelector('.error__button');
      // Ставим фокус на кнопку
      errorBtn.focus();

      // Обработчик клика по кнопке errorBtn
      var onErrorBtnClick = function () {
        errorBlock.remove();
        document.removeEventListener('keydown', onErrorEscPress);
        document.removeEventListener('click', onErrorClick);
      };

      // Обработчик Esc
      var onErrorEscPress = function (evt) {
        window.util.isEscEvent(evt, function () {
          errorBlock.remove();
          document.removeEventListener('keydown', onErrorEscPress);
          document.removeEventListener('click', onErrorClick);
        });
      };

      // Обработчик клика на любую область документа
      var onErrorClick = function () {
        errorBlock.remove();
        document.removeEventListener('click', onErrorClick);
        document.removeEventListener('keydown', onErrorEscPress);
      };


      errorBtn.addEventListener('click', onErrorBtnClick);
      document.addEventListener('keydown', onErrorEscPress);
      document.addEventListener('click', onErrorClick);
    },

    // Функция показа сообщения об успешной отправке
    showSuccessMessage: function () {
      // Находим шаблон об успешной отправке в разметке
      var successTemplate = document.querySelector('#success ').content.querySelector('.success');
      // Находим блок main в разметке
      var mainBlock = document.querySelector('main');
      var successBlock = successTemplate.cloneNode(true);
      // Вставляем блок с ошибкой в разметку (в начало блока main)
      mainBlock.prepend(successBlock);

      // Исправляем потерю фокуса в Firefox и Edge
      successBlock.setAttribute('tabindex', '0');
      successBlock.focus();


      // Обработчик клика на любую область документа
      var onSuccessMessageClick = function () {
        successBlock.remove();
        document.removeEventListener('click', onSuccessMessageClick);
        document.removeEventListener('keydown', onSuccessMessageEscPress);
      };

      // Обработчик Esc
      var onSuccessMessageEscPress = function (evt) {
        window.util.isEscEvent(evt, function () {
          successBlock.remove();
        });
        document.removeEventListener('keydown', onSuccessMessageEscPress);
        document.removeEventListener('click', onSuccessMessageClick);
      };

      document.addEventListener('keydown', onSuccessMessageEscPress);
      document.addEventListener('click', onSuccessMessageClick);
    }
  };
})();
