'use strict';

(function () {
  // Находим форму в разметке:
  var adForm = document.querySelector('.ad-form');
  // Находим элементы формы:
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  // Находим инпут аватарки пользователя:
  var avatarInput = adForm.querySelector('.ad-form-header__input');
  // Находим блок превью аватарки пользователя:
  var avatarPreview = adForm.querySelector('.ad-form-header__preview');
  // Сохраняем src заглушки аватарки
  var avatarMockSrc = avatarPreview.querySelector('img').src;
  // Находим поле адреса метки:
  var addressInput = adForm.querySelector('[name="address"]');
  // Находим инпуты комнат и гостей:
  var adFormRooms = adForm.querySelector('[name="rooms"]');
  var adFormCapacity = adForm.querySelector('[name="capacity"]');
  // Находим кнопку отправки формы
  var adFormSubmit = adForm.querySelector('.ad-form__submit');
  // Находим кнопку очистки формы
  var adFormReset = adForm.querySelector('.ad-form__reset');
  // Инпут типа жилья
  var adFormType = adForm.querySelector('[name="type"]');
  // Инпут цены
  var adFormPrice = adForm.querySelector('[name="price"]');
  // Инпут check-in
  var checkin = adForm.querySelector('[name="timein"]');
  // Инпут check-out
  var checkout = adForm.querySelector('[name="timeout"]');
  // Инпут загрузки фото жилья
  var appartmentsPhotoInput = adForm.querySelector('.ad-form__input');
  // Блок для превью загруженного фото жилья
  var appartmentsPhotoPreview = adForm.querySelector('.ad-form__photo');
  var getAppartmentsPhoto = function () {
    return appartmentsPhotoPreview.querySelector('img');
  };

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
    var minPrice = window.data.typeToMinPrice[window.data.appartmentsTypeToRus[housingType]]; adFormPrice.setAttribute('min', minPrice);
  };

  var validateGuests = function () {
    var rooms = adFormRooms.value;
    var guests = adFormCapacity.value;
    var availableGuests = window.data.roomsToCapacity[rooms];
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
    window.form.deactivate();

    adForm.removeEventListener('submit', window.form.onSubmitBtnPress);
  };

  var onErrorSubmit = function () {
    // Находим шаблон ошибки .error из шаблона #error
    window.main.showError();
  };

  window.form = {
    getAppartmentsPhoto: getAppartmentsPhoto,

    setAddress: function (address) {
      // var address = window.map.getMainPinAddress(window.map.mainPinCoords);
      addressInput.value = address.x + ', ' + address.y;
    },
    activate: function () {
      adForm.classList.remove('ad-form--disabled');
      adFormFieldsets.forEach(function (element) {
        element.removeAttribute('disabled');
      });
      address = window.map.getMainPinAddress(window.map.mainPinDefaultCoords);
      this.setAddress(address);
      // Добавляем возможность загрузки фото жилья:
      window.loadImg(avatarInput, avatarPreview);
      checkin.addEventListener('change', onTimeChange);
      checkout.addEventListener('change', onTimeChange);
      // Добавляем возможность загрузки фото жилья:
      window.loadImg(appartmentsPhotoInput, appartmentsPhotoPreview);
      adFormSubmit.addEventListener('click', function () {
        validateGuests();
        validatePrice();
      });
      adFormReset.addEventListener('click', function (evt) {
        evt.preventDefault();
        window.map.deactivateMap();
        window.form.deactivate();
      });
      adForm.addEventListener('submit', window.form.onSubmitBtnPress);
    },

    onSubmitBtnPress: function (evt) {
      evt.preventDefault();
      window.upload(window.data.Url.UPLOAD, new FormData(adForm), onSuccessSubmit, onErrorSubmit);

    },

    deactivate: function () {
      adForm.reset();
      avatarPreview.querySelector('img').src = avatarMockSrc;
      var appartmentsPhoto = getAppartmentsPhoto();
      if (appartmentsPhoto) {
        appartmentsPhoto.src = '';
      }
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


