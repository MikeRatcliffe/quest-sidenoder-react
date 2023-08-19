/* global $id,checkMount,ipcRenderer,remote */

// DOM
document.body.addEventListener('load', () => {
  console.log('ONLOAD INDEX');

  $id('repo').attr(
    'onclick',
    `shell.openExternal('${remote.getGlobal('repository')}')`
  );

  console.log('ONLOAD');
  console.log('sending check_deps');

  ipcRenderer.send('check_deps', 'adb');
  ipcRenderer.send('check_deps', 'rclone');
  ipcRenderer.send('check_deps', 'zip');
  ipcRenderer.send('check_deps', 'scrcpy');

  ipcRenderer.removeAllListeners('check_deps');
});

document.ondragover = (ev) => {
  ev.preventDefault();
};
document.ondrop = document.ondragover;

document.body.ondrop = (ev) => {
  ev.preventDefault();
  if (!ev.dataTransfer.files || !ev.dataTransfer.files.length) {
    return;
  }

  if (ev.dataTransfer.files[0].path.endsWith('.apk')) {
    ipcRenderer.send(
      'filedrop',
      ev.dataTransfer.files[0].path.replace(/\\/g, '/')
    );
  }
};

// Electron
ipcRenderer.on('check_deps', (event, arg) => {
  console.log('check_deps msg arrived:', arg); // prints "ping"
  const { adb, rclone, zip, scrcpy } = arg;
  if (adb) {
    const el = $id('adbCheckIndicator');
    if (adb.version) {
      el.removeClass('badge-warning').addClass('badge-success')
        .html(`<i class="fa fa-check-circle-o"></i> ADB Instaled (${adb.cmd})
            <br/><pre style="font-size: x-small;">${adb.version}</pre>`);
    } else {
      el.removeClass('badge-warning')
        .addClass('badge-danger')
        .html(
          `<i class="fa fa-times-circle"></i> ADB Failed. Maybe global installation will be fixed this issue`
        );
      if (adb.error) {
        el.append(
          `<br/><pre style="font-size: x-small;">error: \n${adb.error}</pre>`
        );
      }
    }
  }

  if (rclone) {
    const el = $id('rcloneCheckIndicator');
    if (rclone.version) {
      el.removeClass('badge-warning').addClass('badge-success')
        .html(`<i class="fa fa-check-circle-o"></i> RCLONE Installed (${rclone.cmd})
            <br/><pre style="font-size: x-small;">${rclone.version}</pre>`);
      if (remote.getGlobal('currentConfiguration').autoMount) {
        checkMount();
      }
    } else {
      el.removeClass('badge-warning').addClass('badge-danger')
        .html(`<i class="fa fa-times-circle-o"></i>
          Can't find RCLONE - try to manualy download latest <a class="btn btn-sm btn-info" onclick="shell.openExternal('https://downloads.rclone.org/')">RClone</a> and set custom location at settings`);
      if (rclone.error) {
        el.append(
          `<br/><pre style="font-size: x-small;">error: \n${rclone.error}</pre>`
        );
      }
    }
  }

  if (zip) {
    const el = $id('zipCheckIndicator');
    if (zip.version) {
      el.removeClass('badge-warning').addClass('badge-success')
        .html(`<i class="fa fa-check-circle-o"></i> 7zip Archiver installed (${zip.cmd})
            <br/><pre style="font-size: x-small;">${zip.version}</pre>`);
    } else {
      el.removeClass('badge-warning').addClass('badge-danger')
        .html(`<i class="fa fa-times-circle-o"></i>
          Can't find 7zip Archiver - try to manualy download latest <a class="btn btn-sm btn-info" onclick="shell.openExternal('https://www.7-zip.org/download.html')">7ZIP</a> and set custom location at settings`);
      if (zip.error) {
        el.append(
          `<br/><pre style="font-size: x-small;">error: \n${zip.error}</pre>`
        );
      }
    }
  }

  if (scrcpy) {
    const el = $id('scrcpyCheckIndicator');

    if (scrcpy.version) {
      el.removeClass('badge-warning')
        .addClass('badge-success')
        .html(
          `<i class="fa fa-check-circle-o"></i> SCRCPY Installed (${scrcpy.cmd})<br/><pre style="font-size: x-small;">${scrcpy.version}</pre>`
        );
    } else {
      const tag = remote
        .getGlobal('platform')
        .replace('win', 'windows')
        .replace('mac', 'macos');
      el.removeClass('badge-warning').addClass('badge-danger')
        .html(`<i class="fa fa-times-circle-o"></i>
          SCRCPY global installation not found, please read the <a class="btn btn-sm btn-info" onclick="shell.openExternal('https://github.com/Genymobile/scrcpy#${tag}')">MANUAL</a>`);
      if (scrcpy.error) {
        el.append(
          `<br/><pre style="font-size: x-small;">error: \n${scrcpy.error}</pre>`
        );
      }
    }
  }
});
