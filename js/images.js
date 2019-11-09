'use strict';

(function () {
  var FILE_TYPES = ['jpg', 'png', 'gif', 'jpeg'];

  window.images = {
    onInputChange: function (evt) {
      if (evt.target.files[0]) {
        var inputField = evt.target;
        var inputFieldID = inputField.getAttribute('id');
        var outputBlock = window.form[inputFieldID + 'Preview'];
        var files = inputField.files;
        var preview = outputBlock.querySelector('img');

        for (var i = 0; i < files.length; i++) {
          var fileName = files[i].name.toLowerCase();
          var isImage = FILE_TYPES.some(function (it) {
            return fileName.endsWith(it);
          });
          if (isImage) {
            var reader = new FileReader();
            reader.readAsDataURL(files[i]);

            reader.addEventListener('load', function (loadEvt) {
              if (inputField.multiple) {
                preview = document.createElement('img');
                outputBlock.appendChild(preview);
              }
              if (!preview.width) {
                preview.style['width'] = outputBlock.offsetWidth + 'px';
                preview.style['max-height'] = '100%';
              }
              preview.src = loadEvt.target.result;
            });

          }
        }
      }
    },

    loadImg: function (inputField) {
      inputField.addEventListener('change', window.images.onInputChange);
    },
  };
})();
