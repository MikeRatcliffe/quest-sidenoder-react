/* global $,$id,badgeState,formatBytes,formatEta,getUpdates,hash,id,ipcRenderer,remote,sideloadAddQueue */

// DOM
document.body.addEventListener('load', () => {
  $id('showQueue').show(100);

  ipcRenderer.removeAllListeners('sideload_add_queue');
  ipcRenderer.removeAllListeners('process_data');
  ipcRenderer.removeAllListeners('start_sideload');
  ipcRenderer.removeAllListeners('sideload_process');
});

document.querySelector('sideloadDoneBtn').addEventListener('click', () => {
  remote.getGlobal('win').setProgressBar(0);
  $id('sideloadModal').modal('hide');
});

// Electron
ipcRenderer.on('sideload_add_queue', (event, data) => {
  console.log('sideload_add_queue received', data);
  for (const item of data) {
    sideloadAddQueue(item);
  }

  if (data.length) {
    const sideloadQueue = $('#sideloadQueue tr').length;
    document.querySelector('showQueue').textContent = sideloadQueue;
    $id('showQueue').show();
  }
});

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
  const job = $id(`queue${hash(arg.path)}`);

  if (arg.device) {
    badgeState(job.find('.deviceBadge'), arg.device);
  }

  if (arg.aapt) {
    badgeState(job.find('.aaptDoneBadge'), arg.aapt);
  }

  if (arg.check) {
    badgeState(job.find('.checkDoneBadge'), arg.check);
  }

  if (arg.backup) {
    badgeState(job.find('.backupDoneBadge'), arg.backup);
  }

  if (arg.uninstall) {
    badgeState(job.find('.uninstallDoneBadge'), arg.uninstall);
  }

  if (arg.restore) {
    badgeState(job.find('.restoreDoneBadge'), arg.restore);
  }

  if (arg.download) {
    badgeState(job.find('.downloadDoneBadge'), arg.download);
  }

  if (arg.apk) {
    badgeState(job.find('.apkDoneBadge'), arg.apk);
  }

  if (arg.remove_obb) {
    badgeState(job.find('.removeObbDoneBadge'), arg.remove_obb);
  }

  if (arg.download_obb) {
    badgeState(job.find('.downloadObbDoneBadge'), arg.download_obb);
  }

  if (arg.push_obb) {
    badgeState(job.find('.copyObbDoneBadge'), arg.push_obb);
  }

  remote
    .getGlobal('win')
    .setProgressBar($('.badge-warning').length / $('.badge').length);

  if (arg.done) {
    badgeState(job.find('.sideloadDoneBadge'), arg.done);

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
