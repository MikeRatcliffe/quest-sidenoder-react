/* global $id,id */
/* eslint-disable @typescript-eslint/no-unused-vars */

async function promptDialog(title, message, inputValue, dir = false) {
  id('promptModalLabel').innerHTML = title;
  id('promptModalMessage').innerHTML = message;
  const input = id('promptModalInput');
  input.value = inputValue;

  const browse = $id('promptModalBrowse');
  if (dir) {
    browse.show();
  } else {
    browse.hide();
  }

  const modal = $id('promptModal');
  modal.modal('show');

  return new Promise((resolve) => {
    id('promptModalButton').onclick = () => {
      resolve(input.value);
      modal.modal('hide');
    };
    modal.on('hide.bs.modal', () => {
      return resolve(null);
    });
  });
}
