'use strict';

(function () {
  // Находим форму в разметке:
  var adForm = document.querySelector('.ad-form');
  // Находим элементы формы:
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  // Находим поле адреса метки:
  var addressInput = adForm.querySelector('[name="address"]');
  // Находим инпуты комнат и гостей:
  var adFormRooms = adForm.querySelector('[name="rooms"]');
  var adFormCapacity = adForm.querySelector('[name="capacity"]');
  var adFormSubmit = adForm.querySelector('.ad-form__submit');

  // adForm.classList.add('ad-form--disabled'); -- по умолчанию
  /*
  3 Все < input > и < select > формы.ad - form заблокированы с помощью атрибута disabled, добавленного на них или на их родительские блоки fieldset;
  */
  adFormFieldsets.forEach(function (element) {
    element.setAttribute('disabled', 'disabled');
  });

  // Функция заполнения поля адреса
  var setAddress = function () {
    addressInput.setAttribute('value', window.map.currentAddressX + ', ' + window.map.currentAddressY);
  };

  // Устанавливаем адрес метки в соответсвующее поле
  setAddress();

  var validateGuests = function () {
    var rooms = adFormRooms.value;
    var guests = adFormCapacity.value;
    var availableGuests = window.data.ROOM_CAPACITY[rooms];
    var maxGuests = availableGuests[availableGuests.length - 1];
    var minGuests = availableGuests[0];

    if (+guests > maxGuests) {
      adFormCapacity.setCustomValidity('В выбранном типе апартаментов доступно размещение максимум ' + maxGuests + ' гостей');
    } else if (+guests < minGuests) {
      adFormCapacity.setCustomValidity('В выбранном типе апартаментов должны быть гости');
    } else {
      adFormCapacity.setCustomValidity('');
    }
  };


  window.form = {
    activateAdForm: function () {
      adForm.classList.remove('ad-form--disabled');
      adFormFieldsets.forEach(function (element) {
        element.removeAttribute('disabled');
      });
      setAddress();
      adFormSubmit.addEventListener('click', function () {
        validateGuests();
      });
    },
  };
})();


