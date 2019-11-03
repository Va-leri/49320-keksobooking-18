'use strict';

(function () {
  var FILE_TYPES = ['jpg', 'png', 'gif', 'jpeg'];
  // var inputFile = document.querySelector('.ad-form__input');
  // var previewBlock = document.querySelector('.ad-form__photo');
  // previewBlock.innerHTML = '<img max-width="100%" max-height="100%">';
  // var preview = previewBlock.querySelector('img');

  window.loadImg = function (inputField, previewBlock) {
    var preview = previewBlock.querySelector('img');
    inputField.addEventListener('change', function () {
      var file = inputField.files[0];

      if (file) {
        var fileName = file.name.toLowerCase();
        var matches = FILE_TYPES.some(function (it) {
          return fileName.endsWith(it);
        });

        if (matches) {
          var reader = new FileReader();

          reader.addEventListener('load', function () {
            if (!preview) {
              previewBlock.innerHTML = '<img>';
              preview = previewBlock.querySelector('img');
            }
            preview.src = reader.result;
            if (!preview.width) {
              preview.style['width'] = previewBlock.offsetWidth + 'px';
              preview.style['max-height'] = '100%';
            }
          });
          reader.readAsDataURL(file);
        }
      }
    });
  };
})();
