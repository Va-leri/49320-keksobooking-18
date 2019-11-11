'use strict';

(function () {
  var cardTemplate = document.querySelector('#card').content;
  var card;

  window.card = {
    block: card,

    render: function (cardsArrayElement) {
      this.block = cardTemplate.cloneNode(true);
      // Находим блоки в шаблоне карточки
      // Блок аватара
      var popupAvatar = this.block.querySelector('.popup__avatar');
      // Блок заголовка
      var popupTitle = this.block.querySelector('.popup__title');
      // Блок адреса
      var popupAddress = this.block.querySelector('.popup__text--address');
      // Блок цены
      var popupPrice = this.block.querySelector('.popup__text--price');
      // Блок типа жилья
      var popupType = this.block.querySelector('.popup__type');
      // Блок вместимости
      var popupCapacity = this.block.querySelector('.popup__text--capacity');
      // Блок времени заезда и выезда
      var popupTime = this.block.querySelector('.popup__text--time');
      // Блок удобств
      var popupFeatures = this.block.querySelector('.popup__features');
      // Блок описания
      var popupDescription = this.block.querySelector('.popup__description');
      // Блок фото жилья
      var popupPhotos = this.block.querySelector('.popup__photos');

      var cardBlocksNames = ['avatar', 'title', 'address', 'price', 'type', 'capacity', 'time', 'features', 'description', 'photos'];

      var cardBlocks = {
        avatar: {
          node: popupAvatar,
          requiredData: [cardsArrayElement.author.avatar],
          set: function () {
            this.node.src = cardsArrayElement.author.avatar;
          },
        },
        title: {
          node: popupTitle,
          requiredData: [cardsArrayElement.offer.title],
          set: function () {
            popupTitle.textContent = cardsArrayElement.offer.title;
          },
        },
        address: {
          node: popupAddress,
          requiredData: [cardsArrayElement.offer.address],
          set: function () {
            popupAddress.textContent = cardsArrayElement.offer.address;
          },
        },
        price: {
          node: popupPrice,
          requiredData: [cardsArrayElement.offer.price],
          set: function () {
            popupPrice.textContent = cardsArrayElement.offer.price + '₽/ночь';
          },
        },
        type: {
          node: popupType,
          requiredData: [cardsArrayElement.offer.type],
          set: function () {
            popupType.textContent = window.data.appartmentsTypeToTranslation[cardsArrayElement.offer.type];
          },
        },
        capacity: {
          node: popupCapacity,
          requiredData: [cardsArrayElement.offer.rooms, cardsArrayElement.offer.guests],
          set: function () {
            popupCapacity.textContent = cardsArrayElement.offer.rooms + ' комнаты для ' + cardsArrayElement.offer.guests + ' гостей';
          },
        },
        time: {
          node: popupTime,
          requiredData: [cardsArrayElement.offer.checkin, cardsArrayElement.offer.checkout],
          set: function () {
            popupTime.textContent = 'Заезд после ' + cardsArrayElement.offer.checkin + ', выезд до ' + cardsArrayElement.offer.checkout;
          },
        },
        features: {
          node: popupFeatures,
          requiredData: [cardsArrayElement.offer.features[0]],
          set: function () {
            var featuresFragment = document.createDocumentFragment();
            cardsArrayElement.offer.features.forEach(function (element) {
              var feature = window.card.block.querySelector('.popup__feature--' + element).cloneNode();
              featuresFragment.appendChild(feature);
            });
            popupFeatures.innerHTML = '';
            popupFeatures.appendChild(featuresFragment);
          },
        },
        description: {
          node: popupDescription,
          requiredData: [cardsArrayElement.offer.description],
          set: function () {
            popupDescription.textContent = cardsArrayElement.offer.description;
          },
        },
        photos: {
          node: popupPhotos,
          requiredData: [cardsArrayElement.offer.photos[0]],
          set: function () {
            var photoFragment = document.createDocumentFragment();

            cardsArrayElement.offer.photos.forEach(function (element) {
              var photo = window.card.block.querySelector('.popup__photo').cloneNode();
              photo.src = element;
              photoFragment.appendChild(photo);
            });
            popupPhotos.innerHTML = '';
            popupPhotos.appendChild(photoFragment);
          },
        },
      };

      cardBlocksNames.forEach(function (element) {
        // Проверить на include undefined
        if (cardBlocks[element].requiredData.includes('') || cardBlocks[element].requiredData.includes(undefined)) {
          cardBlocks[element].node.style.display = 'none';
        } else {
          // Запустить функцию обработки, соответствующую определенному блоку
          cardBlocks[element].set();
        }
      });

      return this.block;
    },

    // Функция удаления карточки объявления
    delete: function () {
      window.card.block.remove();
      if (window.pin.active) {
        window.pin.active.classList.remove('map__pin--active');
      }
    },

    // Функция вставки карточки объявления
    insert: function (arrayElement) {
      if (window.card.block) {
        window.card.delete();
      }
      window.map.block.insertBefore(window.card.render(arrayElement), window.filter.block);
      window.card.block = document.querySelector('.map__card');

      // Обработчик Esc
      var onCardEscPress = function (evt) {
        window.util.isEscEvent(evt, function () {
          window.card.delete();
        });
        document.removeEventListener('keydown', onCardEscPress);
      };

      document.addEventListener('keydown', onCardEscPress);
      var closeBtn = window.card.block.querySelector('.popup__close');
      closeBtn.addEventListener('click', function () {
        window.card.delete();
      });
    },
  };

})();

