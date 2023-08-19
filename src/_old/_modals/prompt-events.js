/* global id,dialog */

id('promptModalBrowse').onclick = async () => {
  const input = id('promptModalInput');
  const res = await dialog.showOpenDialog(null, {
    properties: ['openDirectory'],
    title: 'Browse directory',
    // message: 'Browse directory',
    defaultPath: input.value,
  });
  console.log(res);
  if (res.canceled) {
    return;
  }

  input.value = res.filePaths[0];
};
