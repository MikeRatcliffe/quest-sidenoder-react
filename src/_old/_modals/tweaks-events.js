/* global $,$id,ipcRenderer,remote,updateFwPath */

document.body.addEventListener('load', () => {
  console.log('ONLOAD tweaks');
  const TWEAKS_KEYS = [
    'mp_name',
    'cres',
    'vres',
    'gRR',
    'gCA',
    'gFFR',
    'gSSO',
    'CPU',
    'GPU',
  ];
  const TWEAKS_CHECKBOXES = ['guardian_pause', 'frc'];

  for (const key of TWEAKS_KEYS) {
    ipcRenderer.send('device_tweaks', { cmd: 'get', key });
  }
  for (const key of TWEAKS_CHECKBOXES) {
    ipcRenderer.send('device_tweaks', { cmd: 'get', key });
  }

  ipcRenderer.removeAllListeners('device_tweaks');
  ipcRenderer.on('device_tweaks', (event, arg) => {
    // console.log('device_tweaks:', arg);
    if (arg.cmd === 'get') {
      for (const key of TWEAKS_KEYS) {
        if (typeof arg[key] !== 'undefined') {
          $id(`${key}`).val(arg[key]);
        }
      }

      for (const key of TWEAKS_CHECKBOXES) {
        if (arg[key]) {
          $id(`${key}`).prop('checked', arg[key] === '1');
        }
      }
    }

    if (arg.cmd === 'set') {
      for (const key of TWEAKS_KEYS) {
        if (typeof arg[key] !== 'undefined') {
          $id(`${key}`).addClass('is-valid');
        }
      }
    }
  });

  for (const key of TWEAKS_KEYS) {
    $id(key).on('change', ({ target }) => {
      $(target).removeClass('is-valid');
      ipcRenderer.send('device_tweaks', { cmd: 'set', [key]: target.value });
    });
  }

  for (const key of TWEAKS_CHECKBOXES) {
    $id(key).on('change.bootstrapSwitch', ({ target }) => {
      ipcRenderer.send('device_tweaks', {
        cmd: 'set',
        [key]: target.checked,
      });
    });
  }

  if (remote.getGlobal('currentConfiguration').snapshotsDelete) {
    $id('snapshotsDelete').prop('checked', true);
  }
  $id('snapshotsDelete').on('change.bootstrapSwitch', (e) => {
    ipcRenderer.send('change_config', {
      key: 'snapshotsDelete',
      val: e.target.checked,
    });
  });

  document.querySelector('enableMTP').addEventListener('click', () => {
    ipcRenderer.send('enable_mtp', '');
  });
  document.querySelector('scrcpyCfg').addEventListener('click', () => {
    $id('scrcpyModal').modal('show');
  });
  document.querySelector('rebootDevice').addEventListener('click', () => {
    ipcRenderer.send('reboot_device', '');
  });
  document.querySelector('rebootRecovery').addEventListener('click', () => {
    ipcRenderer.send('reboot_recovery', '');
  });
  document.querySelector('rebootBootloader').addEventListener('click', () => {
    ipcRenderer.send('reboot_bootloader', '');
  });
  document.querySelector('sideloadeFw').addEventListener('click', () => {
    ipcRenderer.send(
      'sideload_update',
      document.querySelector('updateFwPath').value
    );
  });

  document
    .querySelector('updateFwPathBtn')
    .addEventListener('click', updateFwPath);

  $id('tweaksModal').modal('show');
});
