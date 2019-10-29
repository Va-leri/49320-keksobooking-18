'use strict';

(function () {

  window.card = {
    renderCard: function (cardsArrayElement) {
      var cardTemplate = document.querySelector('#card').content;
      var card = cardTemplate.cloneNode(true);
      var featuresFragment = document.createDocumentFragment();
      var popupPhotos = card.querySelector('.popup__photos');
      var photoFragment = document.createDocumentFragment();
      for (var i = 0; i < cardsArrayElement.offer.features.length; i++) {
        var feature = card.querySelector('.popup__feature--' + cardsArrayElement.offer.features[i]).cloneNode();
        featuresFragment.appendChild(feature);
      }
      for (var j = 0; j < cardsArrayElement.offer.photos.length; j++) {
        var photo = card.querySelector('.popup__photo').cloneNode();
        photo.src = cardsArrayElement.offer.photos[j];
        photoFragment.appendChild(photo);
      }

      card.querySelector('.popup__title').textContent = cardsArrayElement.offer.title;
      card.querySelector('.popup__text--address').textContent = cardsArrayElement.offer.address;
      card.querySelector('.popup__text--price').textContent = cardsArrayElement.offer.price + '₽/ночь';
      card.querySelector('.popup__type').textContent = window.data.appartmentsTypeToRus[cardsArrayElement.offer.type];
      card.querySelector('.popup__text--capacity').textContent = cardsArrayElement.offer.rooms + ' комнаты для ' + cardsArrayElement.offer.guests + ' гостей';
      card.querySelector('.popup__text--time').textContent = 'Заезд после ' + cardsArrayElement.offer.checkin + ', выезд до ' + cardsArrayElement.offer.checkout;
      card.querySelector('.popup__features').innerHTML = '';
      card.querySelector('.popup__features').appendChild(featuresFragment);
      card.querySelector('.popup__description').textContent = cardsArrayElement.offer.description;
      popupPhotos.innerHTML = '';
      popupPhotos.appendChild(photoFragment);
      card.querySelector('.popup__avatar').src = cardsArrayElement.author.avatar;

      return card;
    },
  };

})();

