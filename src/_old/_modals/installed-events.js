/* global $id,drawInstalledApps,ipcRenderer,loadInclude,remote */

// DOM
document.body.addEventListener('load', () => {
  console.log('ONLOAD installed');

  $id('processingModal').modal('show');
  ipcRenderer.send('get_installed', '');

  if (remote.getGlobal('adbDevice') && remote.getGlobal('mounted')) {
    document.querySelector('updateBadge').classList.remove('disabled');
  }
});

// Elecron
ipcRenderer.on('get_installed', (event, arg) => {
  console.log('get_installed msg received:', arg.success);
  if (arg.success) {
    drawInstalledApps(arg.apps);
    $id('updateBadge').show();
  }

  $id('processingModal').modal('hide');
  $id('installedModal').modal('show');
});

ipcRenderer.on('get_installed_with_updates', (event, arg) => {
  console.log('get_installed msg arrived:', arg.success);
  if (arg.success) {
    drawInstalledApps(arg.apps, true);
    $id('updateBadge').hide();
  }

  $id('processingModal').modal('hide');
});

ipcRenderer.on('uninstall', () => {
  console.log('uninstall msg arrived');
  $id('installedModal').modal('hide');
  $id('appToolModal').modal('hide');
  loadInclude('modals/installed.twig', 'installedmodaldiv');
});
