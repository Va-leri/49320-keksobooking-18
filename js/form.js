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
  var imagesInput = adForm.querySelector('.ad-form__input');
  // Блок для превью загруженного фото жилья
  var imagesPreview = adForm.querySelector('.ad-form__photo');
  var getImages = function () {
    return imagesPreview.querySelector('img');
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

  /* Блокируем все fieldset по умолчанию  */
  adFormFieldsets.forEach(function (element) {
    element.setAttribute('disabled', 'disabled');
  });

  var validatePrice = function () {
    var housingType = adFormType.value;
    var minPrice = window.data.typeToMinPrice[window.data.appartmentsTypeToTranslation[housingType]]; adFormPrice.setAttribute('min', minPrice);
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

  var onSubmitBtnPress = function (evt) {
    evt.preventDefault();
    window.upload(window.data.Url.UPLOAD, new FormData(adForm), onSuccessSubmit, onErrorSubmit);
  };

  var deactivate = function () {
    adForm.reset();
    avatarPreview.querySelector('img').src = avatarMockSrc;
    avatarPreview.removeEventListener('change', window.images.onInputChange);
    var appartmentsPhoto = getImages();
    if (appartmentsPhoto) {
      imagesPreview.innerHTML = '';
    }
    imagesPreview.removeEventListener('change', window.images.onInputChange);
    adForm.classList.add('ad-form--disabled');
    adFormFieldsets.forEach(function (element) {
      element.setAttribute('disabled', 'disabled');
    });
    address = window.map.getMainPinAddress(window.map.mainPinDefaultCoords);
    window.form.setAddress(address);

  };

  var onSuccessSubmit = function () {
    window.main.showSuccessMessage();
    window.map.deactivateMap();
    deactivate();

    adForm.removeEventListener('submit', onSubmitBtnPress);
  };

  var onErrorSubmit = function () {
    // Находим шаблон ошибки .error из шаблона #error
    window.main.showError();
  };

  window.form = {
    adForm: adForm,
    avatarPreview: avatarPreview,
    imagesPreview: imagesPreview,

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
      // Добавляем возможность загрузки аватара:
      window.images.loadImg(avatarInput, avatarPreview);
      checkin.addEventListener('change', onTimeChange);
      checkout.addEventListener('change', onTimeChange);
      // Добавляем возможность загрузки фото жилья:
      window.images.loadImg(imagesInput, imagesPreview);
      // Обработчик клика на кнопку отправки
      adFormSubmit.addEventListener('click', function () {
        validateGuests();
        validatePrice();
      });
      // Обработчик клика на кнопку сброса
      adFormReset.addEventListener('click', function (evt) {
        evt.preventDefault();
        window.map.deactivateMap();
        deactivate();
      });
      // Обработчик на событие отправки формы
      adForm.addEventListener('submit', onSubmitBtnPress);
    },
  };

  // Устанавливаем адрес метки в соответсвующее поле
  var address = window.map.getMainPinAddress(window.map.mainPinDefaultCoords);
  window.form.setAddress(address);

})();


