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
  // Инпут типа жилья
  var adFormType = adForm.querySelector('[name="type"]');
  // Инпут цены
  var adFormPrice = adForm.querySelector('[name="price"]');
  // Инпут check-in
  var checkin = adForm.querySelector('[name="timein"]');
  // Инпут check-out
  var checkout = adForm.querySelector('[name="timeout"]');

  var onTimeChange = function (evt) {
    var time = checkin.value;
    var output = checkout;
    switch (evt.currentTarget) {
      case (checkout):
        output = checkin;
        time = checkout.value;
        break;
    }
    output.value = time;
  };

  // adForm.classList.add('ad-form--disabled'); -- по умолчанию
  /*
  3 Все < input > и < select > формы.ad - form заблокированы с помощью атрибута disabled, добавленного на них или на их родительские блоки fieldset;
  */
  adFormFieldsets.forEach(function (element) {
    element.setAttribute('disabled', 'disabled');
  });

  var validatePrice = function () {
    var housingType = adFormType.value;
    var minPrice = window.data.MIN_PRICE_BY_TYPE[window.data.APPARTMENTS_TYPE_RUS[housingType]]; adFormPrice.setAttribute('min', minPrice);
  };

  var validateGuests = function () {
    var rooms = adFormRooms.value;
    var guests = adFormCapacity.value;
    var availableGuests = window.data.ROOM_CAPACITY[rooms];
    var maxGuests = availableGuests[availableGuests.length - 1];
    var minGuests = availableGuests[0];

    switch (true) {
      case (+guests > maxGuests):
        adFormCapacity.setCustomValidity('В выбранном типе апартаментов доступно размещение максимум ' + maxGuests + ' гостей');
        break;
      case (+guests < minGuests):
        adFormCapacity.setCustomValidity('В выбранном типе апартаментов должны быть гости');
        break;
      default:
        adFormCapacity.setCustomValidity('');
    }
  };

  var onSuccessSubmit = function () {
    window.main.showSuccessMessage();
    window.map.deactivateMap();
    window.form.deactivateAdForm();

    adForm.removeEventListener('submit', window.form.onSubmitBtnPress);
  };

  var onErrorSubmit = function () {
    // Находим шаблон ошибки .error из шаблона #error
    window.main.showError();
  };

  window.form = {
    setAddress: function (address) {
      // var address = window.map.getMainPinAddress(window.map.mainPinCoords);
      addressInput.value = address.x + ', ' + address.y;
    },
    activateAdForm: function () {
      adForm.classList.remove('ad-form--disabled');
      adFormFieldsets.forEach(function (element) {
        element.removeAttribute('disabled');
      });
      address = window.map.getMainPinAddress(window.map.mainPinDefaultCoords);
      this.setAddress(address);
      checkin.addEventListener('change', onTimeChange);
      checkout.addEventListener('change', onTimeChange);
      adFormSubmit.addEventListener('click', function () {
        validateGuests();
        validatePrice();
      });
      adForm.addEventListener('submit', window.form.onSubmitBtnPress);
    },

    onSubmitBtnPress: function (evt) {
      evt.preventDefault();
      window.upload(window.data.UPLOAD_URL, new FormData(adForm), onSuccessSubmit, onErrorSubmit);

    },

    deactivateAdForm: function () {
      adForm.reset();
      adForm.classList.add('ad-form--disabled');
      adFormFieldsets.forEach(function (element) {
        element.setAttribute('disabled', 'disabled');
      });
      address = window.map.getMainPinAddress(window.map.mainPinDefaultCoords);
      window.form.setAddress(address);

    }
  };

  // Устанавливаем адрес метки в соответсвующее поле
  var address = window.map.getMainPinAddress(window.map.mainPinDefaultCoords);
  window.form.setAddress(address);

})();


