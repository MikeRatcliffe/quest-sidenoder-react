/* global $,$id,badgeState,formatBytes,formatEta,getUpdates,id,ipcRenderer,remote */

// DOM
document.body.addEventListener('load', () => {
  ipcRenderer.removeAllListeners('process_data');
  ipcRenderer.removeAllListeners('start_sideload');
  ipcRenderer.removeAllListeners('sideload_process');
});

document.querySelector('sideloadDoneBtn').addEventListener('click', () => {
  remote.getGlobal('win').setProgressBar(0);
  $id('sideloadModal').modal('hide');
});

// Electron
ipcRenderer.on('process_data', (event, data) => {
  console.log('process_data received', data);
  if (!data) {
    id('sideload_transfer_state').innerHTML = '';
    return;
  }

  let line = `${data.cmd}: ${formatBytes(data.bytes)}`;
  if (data.size) {
    line += ` of ${formatBytes(data.size)} (${data.percentage}%)`;
  }

  if (data.speedAvg) {
    line += ` - ${formatBytes(data.speedAvg)}/s (${formatEta(data.eta)})`;
  }

  const name = data.name.split('/').pop();
  id('sideload_transfer_state').innerHTML = `${line}<br/> ${name}`;
});

ipcRenderer.on('start_sideload', (event, arg) => {
  console.log('start_sideload msg arrived:', arg);
  const { success, path } = arg;
  if (!success) {
    return;
  }

  const lastslashindex = path.lastIndexOf('/');
  const file = path.substring(lastslashindex + 1);

  $id('sideloadModal').modal('show');
  id('sideloadText').innerHTML = `pending: <br/><b>${file}</b>`;
});

ipcRenderer.on('sideload_process', (event, arg) => {
  console.log('sideload_process', arg);

  if (arg.device) {
    badgeState($id('deviceBadge'), arg.device);
  }

  if (arg.aapt) {
    badgeState($id('aaptDoneBadge'), arg.aapt);
  }

  if (arg.check) {
    badgeState($id('checkDoneBadge'), arg.check);
  }

  if (arg.backup) {
    badgeState($id('backupDoneBadge'), arg.backup);
  }

  if (arg.uninstall) {
    badgeState($id('uninstallDoneBadge'), arg.uninstall);
  }

  if (arg.restore) {
    badgeState($id('restoreDoneBadge'), arg.restore);
  }

  if (arg.download) {
    badgeState($id('downloadDoneBadge'), arg.download);
  }

  if (arg.apk) {
    badgeState($id('apkDoneBadge'), arg.apk);
  }

  if (arg.remove_obb) {
    badgeState($id('removeObbDoneBadge'), arg.remove_obb);
  }

  if (arg.download_obb) {
    badgeState($id('downloadObbDoneBadge'), arg.download_obb);
  }

  if (arg.push_obb) {
    badgeState($id('copyObbDoneBadge'), arg.push_obb);
  }

  remote
    .getGlobal('win')
    .setProgressBar($('.badge-warning').length / $('.badge').length);

  if (arg.done) {
    badgeState($id('sideloadDoneBadge'), arg.done);

    $id('sideloadDoneBtn')
      .removeClass('disabled')
      .removeClass('btn-primary')
      .addClass('btn-success')
      .html('Done');
    $id('sideloadRefresh')
      .removeClass('fa-refresh')
      .removeClass('fa-spin')
      .addClass('fa-check-circle-o');

    if (!arg.error) {
      const notify = remote.getGlobal('notify');
      notify('Successfully sideloaded', arg.location, 'low');
    }
  }

  if (arg.update) {
    getUpdates();
  }

  if (arg.error) {
    $id('sideloadError').text(arg.error);
    $id('sideloadErrorArea').show();
    remote.getGlobal('notify')('Sideload Failed', arg.location);
  }
});
