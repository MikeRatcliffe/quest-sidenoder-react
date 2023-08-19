/* global $id,dialog,ipcRenderer,shell */

// Electron
ipcRenderer.on('log', (event, arg) => {
  console.log('log arrived');
  console.log(arg);
});

ipcRenderer.on('notify_update', async (event, arg) => {
  console.log('notify_update msg arrived');
  const { response } = dialog.showMessageBox(null, {
    type: 'info',
    buttons: ['Cancel', 'Download'],
    title: `Update available ${arg.current} to ${arg.remote}`,
    message: `sidenoder-${arg.remote} is now available on github.`,
    detail: arg.description,
  });

  if (response === 1) {
    shell.openExternal(arg.url);
  }
});

let lastAlertMsg;
ipcRenderer.on('alert', (event, arg) => {
  if (arg === lastAlertMsg) {
    return;
  }

  lastAlertMsg = arg;
  setTimeout(() => {
    lastAlertMsg = false;
  }, 500);

  alert(arg);
});

ipcRenderer.on('cmd_sent', (event, arg) => {
  alert(`Command sent: \n ${arg.success}`);
});

ipcRenderer.on('ask_device', () => {
  console.log('ask_device msg arrived');
  $id('processingModal').modal('hide');
  dialog.showMessageBox(null, {
    type: 'info',
    buttons: ['Understood'],
    title: 'Missing device',
    message: `This action cannot be performed without a device attached.`,
  });
});

// DOM
window.addEventListener('scroll', () => {
  // console.log(document.body.scrollTop, document.documentElement.scrollTop);
  const scroll = document.documentElement.scrollTop;
  if (scroll > 100) {
    $id('backToTop').fadeIn();
  } else {
    $id('backToTop').fadeOut();
  }
});
