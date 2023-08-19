/* global $,dialog,ipcRenderer */
/* eslint-disable @typescript-eslint/no-unused-vars */

async function setCustomPath(key, title, message, filters, type = 'openFile') {
  filters = filters || [
    {
      name: 'All',
      extensions: ['*'],
    },
  ];
  const res = await dialog.showOpenDialog(null, {
    properties: [type],
    title,
    message,
    filters,
  });
  if (res.canceled) {
    return;
  }

  const val = res.filePaths[0];
  $(`#${key}`).val(val);
  ipcRenderer.send('change_config', { key, val });
  return val;
}
