/* global $id,id,ipcRenderer,remote */

document.body.addEventListener('load', () => {
  console.log('ONLOAD scrcpy MODAL');

  const OPT_KEYS = ['scrcpyBitrate', 'scrcpyCrop', 'scrcpySize'];
  const CHKBOXES = ['scrcpyWindow', 'scrcpyControl'];

  let options = '';
  for (let i = 1; i <= 10; i++) {
    options += `<option value="${i}">${i} Mbits/s</option>`;
  }
  id('scrcpyBitrate').innerHTML = options;

  for (const key of OPT_KEYS) {
    $id(key)
      .val(remote.getGlobal('currentConfiguration')[key])
      .on('change', (e) => {
        ipcRenderer.send('change_config', { key, val: e.target.value });
      });
  }

  for (const key of CHKBOXES) {
    const el = $id(`${key}`);
    if (remote.getGlobal('currentConfiguration')[key]) {
      el.prop('checked', true);
    }

    el.on('change.bootstrapSwitch', (e) => {
      ipcRenderer.send('change_config', { key, val: e.target.checked });
    });
  }

  document
    .querySelector('crop_quest1')
    .addEventListener('click', () =>
      $id('scrcpyCrop').val('1280:720:1500:350').trigger('change')
    );
  document
    .querySelector('crop_quest2')
    .addEventListener('click', () =>
      $id('scrcpyCrop').val('1600:900:2017:510').trigger('change')
    );

  document.querySelector('scrcpy_start').addEventListener('click', () => {
    ipcRenderer.send('scrcpy_start');
  });
});
