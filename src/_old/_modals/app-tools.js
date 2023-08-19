/* global dialog,ipcRenderer */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function setAppBackupPath(pkg) {
  const file = await dialog.showOpenDialog(null, {
    title: 'Set backup path',
    message: 'Browse location for new backup',
    properties: ['openDirectory'],
  });

  if (file.canceled) {
    return document.querySelector('backupAppBtn').classList.remove('disabled');
  }

  console.log('setAppBackupPath', pkg, file);
  const location = file.filePaths[0];

  ipcRenderer.send('app_backup', { location, pkg });
  return location;
}
