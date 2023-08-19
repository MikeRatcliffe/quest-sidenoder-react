/* global $id,dialog */
/* eslint-disable @typescript-eslint/no-unused-vars */

async function updateFwPath() {
  $id('updateFwPath').removeClass('is-valid');
  const file = await dialog.showOpenDialog(null, {
    properties: ['openFile'],
    title: 'Update.zip path',
    message: 'Browse to update.zip',
    filters: [
      {
        name: 'Zip',
        extensions: ['zip'],
      },
    ],
  });
  if (file.canceled) {
    return;
  }

  const val = file.filePaths[0];
  $id('updateFwPath').val(val).addClass('is-valid');
  return val;
}
