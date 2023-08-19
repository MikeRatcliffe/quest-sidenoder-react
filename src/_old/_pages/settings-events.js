/* global $,$id,checkMount,id,ipcRenderer,loadInclude,OPT_KEYS,remote,setCustomPath */

// Electron
ipcRenderer.on('change_config', (event, { key, val }) => {
  if (!OPT_KEYS.includes(key)) {
    return;
  }
  if (['cfgSection', 'rcloneConf', 'mountCmd'].includes(key)) {
    if (remote.getGlobal('mounted')) {
      checkMount();
    }

    loadInclude('settings_include.twig');
  }

  $(`#${key}`).val(val).addClass('is-valid');
});

// DOM
document.body.addEventListener('load', () => {
  console.log('ONLOAD settings');
  const OPT_KEYS = [
    'cfgSection',
    'adbPath',
    'rclonePath',
    'rcloneConf',
    'mountCmd',
    'scrcpyPath',
    'tmpdir',
    'proxyUrl',
  ];
  const CHKBOXES = [
    'autoMount',
    'allowOtherDevices',
    'cacheOculusGames',
    'userHide',
    'proxyOculus',
    'proxySteam',
    'proxySQ',
  ];

  let options = '';
  for (const section of remote.getGlobal('rcloneSections')) {
    options += `<option value="${section}">${section}</option>`;
  }
  id('cfgSection').innerHTML = options;

  for (const key of OPT_KEYS) {
    $id(key)
      .val(remote.getGlobal('currentConfiguration')[key])
      .on('change', ({ target }) => {
        $(target).removeClass('is-valid');
        ipcRenderer.send('change_config', { key, val: target.value });
      });
  }

  for (const key of CHKBOXES) {
    const el = $id(`${key}`);
    if (remote.getGlobal('currentConfiguration')[key]) {
      el.prop('checked', true);
    }

    el.on('change.bootstrapSwitch', ({ target }) => {
      ipcRenderer.send('change_config', { key, val: target.checked });
    });
  }

  ipcRenderer.removeAllListeners('change_config');
});

document.querySelector('debugTool').addEventListener('click', () => {
  remote.getGlobal('win').webContents.openDevTools();
});

document
  .querySelector('adbPathBtn')
  .addEventListener('click', () =>
    setCustomPath(
      'adbPath',
      'Android Debug Bridge custom path',
      'Browse to adb binary location'
    )
  );
document
  .querySelector('rclonePathBtn')
  .addEventListener('click', () =>
    setCustomPath(
      'rclonePath',
      'RClone custom path',
      'Browse to rclone binary location'
    )
  );
document
  .querySelector('scrcpyPathBtn')
  .addEventListener('click', () =>
    setCustomPath(
      'scrcpyPath',
      'SCRCPY custom path',
      'Browse to scrcpy binary location'
    )
  );
document.querySelector('rcloneConfBtn').addEventListener('click', () =>
  setCustomPath(
    'rcloneConf',
    'RClone config location',
    'Browse to rclone config location',
    [
      {
        name: 'Config',
        extensions: ['conf', 'cfg', 'config', 'ini'],
      },
    ]
  )
);
document
  .querySelector('tmpdirBtn')
  .addEventListener('click', () =>
    setCustomPath(
      'tmpdir',
      'Temp directory custom path',
      'Browse to new temp directory location',
      undefined,
      'openDirectory'
    )
  );
