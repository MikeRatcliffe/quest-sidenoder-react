/* global ipcRenderer,formatBytes,formatEta,startApp,uninstall,shell,path,remote,setAppBackupPath */

// DOM
document.body.addEventListener('load', () => {
  console.log('ONLOAD APPTOOL MODAL');
  ipcRenderer.removeAllListeners('process_data');
  ipcRenderer.removeAllListeners('app_backup');
  ipcRenderer.removeAllListeners('data_backup');
  ipcRenderer.removeAllListeners('data_restore');
  ipcRenderer.removeAllListeners('app_config_set');
  ipcRenderer.removeAllListeners('app_tools');
});

// Electron
ipcRenderer.on('process_data', (event, data) => {
  console.log('process_data received', data);

  const transferState = document.querySelector('#tools_transfer_state');

  if (!data) {
    transferState.innerHTML = '';
    return false;
  }

  let line = `${data.cmd}: ${formatBytes(data.bytes)}`;
  if (data.size) {
    line += ` of ${formatBytes(data.size)} (${data.percentage}%)`;
  }

  if (data.speedAvg) {
    line += ` - ${formatBytes(data.speedAvg)}/s (${formatEta(data.eta)})`;
  }

  const name = data.name.split('/').pop();
  transferState.innerHTML = `${line}<br/> ${name}`;
});

ipcRenderer.on('app_backup', (event, arg) => {
  const transferState = document.querySelector('#tools_transfer_state');
  const backupAppBtn = document.querySelector('#backupAppBtn');

  backupAppBtn.classList.remove('disabled');

  if (arg.error) {
    transferState.innerHTML = `<b class="text-danger">Backup Error: ${arg.error}</b>`;
  } else {
    transferState.innerHTML = `<b class="text-success">Backup finished</b>`;
  }
});

ipcRenderer.on('data_backup', (event, arg) => {
  const transferState = document.querySelector('#tools_transfer_state');
  const backupDataBtn = document.querySelector('#backupDataBtn');
  const restoreDataBtn = document.querySelector('#restoreDataBtn');
  const backupAppPath = document.querySelector('#backupAppPath');

  backupDataBtn.classList.remove('disabled');
  restoreDataBtn.classList.remove('disabled');
  backupAppPath.classList.remove('disabled');

  if (arg.error) {
    transferState.innerHTML = `<b class="text-danger">Backup Error: ${arg.error}</b>`;
  } else {
    transferState.innerHTML = `<b class="text-success">Backup finished</b>`;
  }
});

ipcRenderer.on('data_restore', (event, arg) => {
  const transferState = document.querySelector('#tools_transfer_state');
  const restoreDataBtn = document.querySelector('#restoreDataBtn');

  restoreDataBtn.classList.remove('disabled');

  if (arg.error) {
    transferState.innerHTML = `<b class="text-danger">Restore Error: ${arg.error}</b>`;
  } else {
    transferState.innerHTML = `<b class="text-success">Restore finished</b>`;
  }
});

ipcRenderer.on('app_config_set', (event, { success, key, val }) => {
  const appKey = document.querySelector(`#app_${key}`);

  appKey.value = val;
  appKey.classList.add(success ? 'is-valid' : 'is-invalid');
});

ipcRenderer.on('app_tools', (event, arg) => {
  console.log('app_tools msg arrived:', arg);

  const processingModal = document.querySelector('#processingModal');
  const packageName = document.querySelector('#packageName');
  const startAppBtn = document.querySelector('#startAppBtn');
  const uninstallAppBtn = document.querySelector('#uninstallAppBtn');
  const backupAppBtn = document.querySelector('#backupAppBtn');
  const backupDataBtn = document.querySelector('#backupDataBtn');
  const restoreDataBtn = document.querySelector('#restoreDataBtn');
  const backupAppPath = document.querySelector('#backupAppPath');

  const { pkg, availableRestore, availableConfig } = arg;

  processingModal.modal.hidden = true;
  packageName.textContent = pkg;

  startAppBtn.addEventListener('click', () => {
    startApp(pkg);

    return true;
  });
  uninstallAppBtn.addEventListener('click', ({ target }) => {
    uninstall(target, pkg);

    return true;
  });
  backupAppBtn.addEventListener('click', ({ target }) => {
    target.classList.add('disabled');
    setAppBackupPath(pkg);

    return true;
  });
  backupDataBtn.addEventListener('click', ({ target }) => {
    target.classList.add('disabled');
    ipcRenderer.send('data_backup', pkg);

    return true;
  });
  restoreDataBtn.addEventListener('click', ({ target }) => {
    target.classList.add('disabled');
    ipcRenderer.send('data_restore', pkg);

    return true;
  });
  backupAppPath.addEventListener('click', () => {
    shell.openPath(
      path.join(remote.getGlobal('sidenoderHome'), 'backup_data', pkg)
    );

    return true;
  });

  if (availableRestore) {
    const date = new Date(+availableRestore).toLocaleString();

    backupAppPath.classList.remove('disabled');
    restoreDataBtn.classList.remove('disabled');
    restoreDataBtn.textContent += `(${date})`;
  }

  if (availableConfig) {
    const configsCard = document.querySelector('#configsCard');
    const appUsername = document.querySelector('#app_username');

    configsCard.hidden = false;
    appUsername.value = availableConfig.username;
    appUsername.addEventListener('change', ({ target }) => {
      target.classList.remove('is-valid');

      ipcRenderer.send('app_config_set', {
        pkg,
        key: 'username',
        val: target.value,
      });

      return true;
    });
  }

  document.querySelector('#appToolModal').modal('show');
});
